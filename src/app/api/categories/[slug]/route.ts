import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

// GET single category
export const GET = async (
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) => {
    return withPrisma(async () => {
        try {
            const { slug } = await params;
            const { searchParams } = new URL(req.url);
            const locale = searchParams.get("locale");

            const category = await prisma.category.findUnique({
                where: { slug },
                include: {
                    categoryDetails: locale
                        ? {
                              where: { locale, isActive: true },
                          }
                        : { where: { isActive: true } },
                    products: {
                        where: { isActive: true },
                        include: {
                            productDetails: locale
                                ? {
                                      where: { locale },
                                  }
                                : true,
                        },
                    },
                },
            });

            if (!category) {
                return NextResponse.json(
                    { error: "Category not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(category);
        } catch (error) {
            console.error("Error fetching category:", error);
            return NextResponse.json(
                { error: "Failed to fetch category" },
                { status: 500 }
            );
        }
    });
};

// PUT update category (Admin only)
export const PUT = async (
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) => {
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
            const { slug } = await params;
            const { name, isActive, translations } = await req.json();

            // Check if slug is being changed and if it already exists
            // if (slug) {
            //     const existingCategory = await prisma.category.findFirst({
            //         where: {
            //             id,
            //             NOT: { slug },
            //         },
            //     });

            //     if (existingCategory) {
            //         return NextResponse.json(
            //             { error: "Category with this slug already exists" },
            //             { status: 409 }
            //         );
            //     }
            // }

            // Update category
            const category = await prisma.category.update({
                where: { slug },
                data: {
                    ...(name !== undefined && { name }),
                    ...(slug !== undefined && { slug }),
                    ...(isActive !== undefined && { isActive }),
                },
            });

            // Handle translations if provided
            if (translations && Array.isArray(translations)) {
                // Delete existing translations and create new ones
                await prisma.categoryTranslation.deleteMany({
                    where: { categoryId: slug },
                });

                await prisma.categoryTranslation.createMany({
                    data: translations.map((t: any) => ({
                        categoryId: slug,
                        locale: t.locale,
                        name: t.name,
                        isActive: t.isActive !== undefined ? t.isActive : true,
                    })),
                });
            }

            // Fetch updated category with translations
            const updatedCategory = await prisma.category.findUnique({
                where: { slug },
                include: {
                    categoryDetails: true,
                },
            });

            return NextResponse.json(updatedCategory);
        } catch (error) {
            console.error("Error updating category:", error);
            return NextResponse.json(
                { error: "Failed to update category" },
                { status: 500 }
            );
        }
    });
};

// DELETE category (Admin only)
export const DELETE = async (
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
        return NextResponse.json(
            { error: "Forbidden - Admin only" },
            { status: 403 }
        );
    }

    return withPrisma(async () => {
        try {
            const { slug } = await params;

            const category = await prisma.category.findUnique({
                where: { slug },
                include: {
                    _count: {
                        select: { products: true },
                    },
                },
            });

            if (!category) {
                return NextResponse.json(
                    { error: "Category not found" },
                    { status: 404 }
                );
            }

            // Check if category has products
            if (category._count.products > 0) {
                return NextResponse.json(
                    {
                        error: "Cannot delete category with associated products. Delete products first or reassign them to another category.",
                    },
                    { status: 409 }
                );
            }

            await prisma.category.delete({
                where: { slug },
            });

            return NextResponse.json({
                message: "Category deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting category:", error);
            return NextResponse.json(
                { error: "Failed to delete category" },
                { status: 500 }
            );
        }
    });
};
