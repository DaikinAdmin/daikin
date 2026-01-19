import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

// GET all banners
export const GET = async (req: Request) => {
    return withPrisma(async () => {
        try {
            const { searchParams } = new URL(req.url);
            const locale = searchParams.get("locale");
            const location = searchParams.get("location");
            const isMobile = searchParams.get("isMobile");
            const includeInactive = searchParams.get("includeInactive") === "true";

            const banners = await prisma.banners.findMany({
                where: {
                    ...(locale && { locale }),
                    ...(location && { location }),
                    ...(isMobile !== null && { isMobile: isMobile === "true" }),
                    ...(!includeInactive && { isActive: true }),
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return NextResponse.json(banners, { status: 200 });
        } catch (error) {
            console.error("Error fetching banners:", error);
            return NextResponse.json(
                { error: "Failed to fetch banners" },
                { status: 500 }
            );
        }
    });
};

// POST create new banner (admin only)
export const POST = async (req: Request) => {
    return withPrisma(async () => {
        try {
            const session = await auth.api.getSession({
                headers: await headers(),
            });

            if (!session || session.user.role !== "admin") {
                return NextResponse.json(
                    { error: "Unauthorized" },
                    { status: 401 }
                );
            }

            const body = await req.json();
            const { img, link, location, locale, isMobile, isActive } = body;

            if (!img || !location || !locale) {
                return NextResponse.json(
                    { error: "Missing required fields: img, location, locale" },
                    { status: 400 }
                );
            }

            const banner = await prisma.banners.create({
                data: {
                    img,
                    link: link || null,
                    location,
                    locale,
                    isMobile: isMobile !== undefined ? isMobile : false,
                    isActive: isActive !== undefined ? isActive : true,
                },
            });

            return NextResponse.json(banner, { status: 201 });
        } catch (error) {
            console.error("Error creating banner:", error);
            return NextResponse.json(
                { error: "Failed to create banner" },
                { status: 500 }
            );
        }
    });
};
