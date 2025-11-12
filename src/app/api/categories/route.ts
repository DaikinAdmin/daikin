import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

// GET all categories
export const GET = async (req: Request) => {
    return withPrisma(async () => {
        try {
            const { searchParams } = new URL(req.url);
            const search = searchParams.get("search") || "";
            const locale = searchParams.get("locale");
            const includeInactive = searchParams.get("includeInactive") === "true";

            const categories = await prisma.category.findMany({
                where: {
                    ...(search && {
                        OR: [
                            { name: { contains: search, mode: "insensitive" } },
                            { slug: { contains: search, mode: "insensitive" } },
                        ],
                    }),
                    ...(!includeInactive && { isActive: true }),
                },
                include: {
                    categoryDetails: locale
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

            return NextResponse.json(categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
            return NextResponse.json(
                { error: "Failed to fetch categories" },
                { status: 500 }
            );
        }
    });
};

// POST create new category (Admin only)
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
            const { name, slug, isActive, translations } = await req.json();

            if (!name || !slug) {
                return NextResponse.json(
                    { error: "Missing required fields: name and slug" },
                    { status: 400 }
                );
            }

            // Check if slug already exists
            const existingCategory = await prisma.category.findUnique({
                where: { slug },
            });

            if (existingCategory) {
                return NextResponse.json(
                    { error: "Category with this slug already exists" },
                    { status: 409 }
                );
            }

            const category = await prisma.category.create({
                data: {
                    name,
                    slug,
                    isActive: isActive !== undefined ? isActive : true,
                    categoryDetails: translations
                        ? {
                              create: translations.map((t: any) => ({
                                  locale: t.locale,
                                  name: t.name,
                                  isActive: t.isActive !== undefined ? t.isActive : true,
                              })),
                          }
                        : undefined,
                },
                include: {
                    categoryDetails: true,
                },
            });

            return NextResponse.json(category, { status: 201 });
        } catch (error) {
            console.error("Error creating category:", error);
            return NextResponse.json(
                { error: "Failed to create category" },
                { status: 500 }
            );
        }
    });
};
