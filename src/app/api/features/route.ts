import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

// GET all features
export const GET = async (req: Request) => {
    return withPrisma(async () => {
        try {
            const { searchParams } = new URL(req.url);
            const search = searchParams.get("search") || "";
            const locale = searchParams.get("locale");
            const includeInactive = searchParams.get("includeInactive") === "true";
            const previewParam = searchParams.get("preview");
            
            // Filter by preview flag if specified
            const previewFilter = previewParam !== null 
                ? { preview: previewParam === "true" }
                : {};

            const features = await prisma.feature.findMany({
                where: {
                    ...(search && {
                        OR: [
                            { name: { contains: search, mode: "insensitive" } },
                            {
                                featureDetails: {
                                    some: {
                                        name: { contains: search, mode: "insensitive" },
                                    },
                                },
                            },
                        ],
                    }),
                    ...(!includeInactive && { isActive: true }),
                    ...previewFilter,
                },
                include: {
                    featureDetails: locale
                        ? {
                              where: { locale, isActive: true },
                          }
                        : { where: { isActive: true } },
                    _count: {
                        select: { products: true },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return NextResponse.json(features);
        } catch (error) {
            console.error("Error fetching features:", error);
            return NextResponse.json(
                { error: "Failed to fetch features" },
                { status: 500 }
            );
        }
    });
};

// POST create new feature (Admin only)
// Image Upload: Use POST /api/images/upload to upload feature icons first,
// then include the returned URL in the img field.
// Folder recommendation: 'features'
export const POST = async (req: Request) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return withPrisma(async () => {
        try {
            const { name, img, isActive, preview, translations } = await req.json(); // img: string URL from image service

            if (!name) {
                return NextResponse.json(
                    { error: "Missing required field: name" },
                    { status: 400 }
                );
            }

            const feature = await prisma.feature.create({
                data: {
                    name,
                    img: img || null,
                    isActive: isActive !== undefined ? isActive : true,
                    preview: preview !== undefined ? preview : false,
                    featureDetails: translations
                        ? {
                              create: translations.map((t: any) => ({
                                  locale: t.locale,
                                  name: t.name,
                                  desc: t.desc || null,
                                  isActive: t.isActive !== undefined ? t.isActive : true,
                              })),
                          }
                        : undefined,
                },
                include: {
                    featureDetails: true,
                },
            });

            return NextResponse.json(feature, { status: 201 });
        } catch (error) {
            console.error("Error creating feature:", error);
            return NextResponse.json(
                { error: "Failed to create feature" },
                { status: 500 }
            );
        }
    });
};
