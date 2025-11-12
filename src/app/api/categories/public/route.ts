import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

// GET all active categories with locale-specific translations (Public endpoint)
export const GET = async (req: Request) => {
    return withPrisma(async () => {
        try {
            const { searchParams } = new URL(req.url);
            const locale = searchParams.get("locale") || "en";

            const categories = await prisma.category.findMany({
                where: {
                    isActive: true,
                },
                include: {
                    categoryDetails: {
                        where: { locale, isActive: true },
                    },
                    _count: {
                        select: { 
                            products: {
                                where: { isActive: true }
                            }
                        },
                    },
                },
                orderBy: {
                    name: "asc",
                },
            });

            // Transform data to simplify locale-specific fields
            const transformedCategories = categories.map((category) => ({
                id: category.id,
                slug: category.slug,
                name: category.categoryDetails[0]?.name || category.name,
                productsCount: category._count.products,
                createdAt: category.createdAt,
                updatedAt: category.updatedAt,
            }));

            return NextResponse.json(transformedCategories);
        } catch (error) {
            console.error("Error fetching public categories:", error);
            return NextResponse.json(
                { error: "Failed to fetch categories" },
                { status: 500 }
            );
        }
    });
};
