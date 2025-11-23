import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";
import { title } from "process";

// GET single product
export const GET = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    return withPrisma(async () => {
        try {
            const { id } = await params;
            const { searchParams } = new URL(req.url);
            const locale = searchParams.get("locale");

            const product = await prisma.product.findUnique({
                where: { id },
                include: {
                    productDetails: locale
                        ? {
                              where: { locale },
                          }
                        : true,
                    category: {
                        include: {
                            categoryDetails: locale
                                ? {
                                      where: { locale, isActive: true },
                                  }
                                : { where: { isActive: true } },
                        },
                    },
                    features: {
                        where: { isActive: true },
                        include: {
                            featureDetails: locale
                                ? {
                                      where: { locale, isActive: true },
                                  }
                                : { where: { isActive: true } },
                        },
                    },
                },
            });

            if (!product) {
                return NextResponse.json(
                    { error: "Product not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(product);
        } catch (error) {
            console.error("Error fetching product:", error);
            return NextResponse.json(
                { error: "Failed to fetch product" },
                { status: 500 }
            );
        }
    });
};

// PUT update product (Admin only)
export const PUT = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
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
            const { id } = await params;
            const {
                articleId,
                price,
                img, // Image URLs from image upload service
                categoryId,
                isActive,
                translations,
                featureIds,
            } = await req.json();

            // Check if articleId is being changed and if it already exists
            if (articleId) {
                const existingProduct = await prisma.product.findFirst({
                    where: {
                        articleId,
                        NOT: { id },
                    },
                });

                if (existingProduct) {
                    return NextResponse.json(
                        { error: "Product with this articleId already exists" },
                        { status: 409 }
                    );
                }
            }

            // Verify category exists if being changed
            if (categoryId) {
                const category = await prisma.category.findUnique({
                    where: { id: categoryId },
                });

                if (!category) {
                    return NextResponse.json(
                        { error: "Category not found" },
                        { status: 404 }
                    );
                }
            }

            // Verify features exist if provided
            if (featureIds && featureIds.length > 0) {
                const features = await prisma.feature.findMany({
                    where: { id: { in: featureIds } },
                });

                if (features.length !== featureIds.length) {
                    return NextResponse.json(
                        { error: "One or more features not found" },
                        { status: 404 }
                    );
                }
            }

            // Update product
            const product = await prisma.product.update({
                where: { id },
                data: {
                    ...(articleId !== undefined && { articleId }),
                    ...(price !== undefined && { price: price ? parseFloat(price) : null }),
                    ...(img !== undefined && { img }),
                    ...(categoryId !== undefined && { categoryId }),
                    ...(isActive !== undefined && { isActive }),
                    ...(featureIds !== undefined && {
                        features: {
                            set: featureIds.map((fId: string) => ({ id: fId })),
                        },
                    }),
                },
            });

            // Handle translations if provided
            if (translations && Array.isArray(translations)) {
                // Delete existing translations and create new ones
                await prisma.productTranslation.deleteMany({
                    where: { productId: id },
                });

                await prisma.productTranslation.createMany({
                    data: translations.map((t: any) => ({
                        productId: id,
                        locale: t.locale,
                        name: t.name,
                        description: t.description,
                        title: t.title,
                        subtitle: t.subtitle,
                    })),
                });
            }

            // Fetch updated product with all relations
            const updatedProduct = await prisma.product.findUnique({
                where: { id },
                include: {
                    productDetails: true,
                    category: {
                        include: {
                            categoryDetails: true,
                        },
                    },
                    features: {
                        include: {
                            featureDetails: true,
                        },
                    },
                },
            });

            return NextResponse.json(updatedProduct);
        } catch (error) {
            console.error("Error updating product:", error);
            return NextResponse.json(
                { error: "Failed to update product" },
                { status: 500 }
            );
        }
    });
};

// DELETE product (Admin only)
export const DELETE = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
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
            const { id } = await params;

            const product = await prisma.product.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: { orderProducts: true },
                    },
                },
            });

            if (!product) {
                return NextResponse.json(
                    { error: "Product not found" },
                    { status: 404 }
                );
            }

            // Check if product has orders
            if (product._count.orderProducts > 0) {
                return NextResponse.json(
                    {
                        error: "Cannot delete product with associated orders. Consider deactivating it instead.",
                    },
                    { status: 409 }
                );
            }

            await prisma.product.delete({
                where: { id },
            });

            return NextResponse.json({
                message: "Product deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting product:", error);
            return NextResponse.json(
                { error: "Failed to delete product" },
                { status: 500 }
            );
        }
    });
};
