import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

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
                where: { slug: id },
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
                    specs: true,
                    img: true,
                    items: {
                        include: {
                            productItemDetails: locale
                                ? {
                                      where: { locale, isActive: true },
                                  }
                                : { where: { isActive: true } },
                            lookupItem: {
                                include: {
                                    lookupItemDetails: locale
                                        ? {
                                              where: { locale, isActive: true },
                                          }
                                        : { where: { isActive: true } },
                                },
                            },
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
                slug,
                img, // Image URLs from image upload service
                categorySlug,
                isActive,
                translations,
                featureSlugs, // Array of feature slugs
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

            // Resolve category slug if being changed
            if (categorySlug) {
                const category = await prisma.category.findUnique({
                    where: { slug: categorySlug },
                });

                if (!category) {
                    return NextResponse.json(
                        { error: `Category not found for slug: ${categorySlug}` },
                        { status: 404 }
                    );
                }
            }

            // Resolve feature IDs from slugs if provided
            let featureIds: string[] = [];
            
            if (featureSlugs && featureSlugs.length > 0) {
                const features = await prisma.feature.findMany({
                    where: { slug: { in: featureSlugs } },
                    select: { id: true, slug: true },
                });

                if (features.length !== featureSlugs.length) {
                    const foundSlugs = features.map((f: { id: string; slug: string }) => f.slug);
                    const missingSlugs = featureSlugs.filter((slug: string) => !foundSlugs.includes(slug));
                    return NextResponse.json(
                        { error: `Features not found for slugs: ${missingSlugs.join(', ')}` },
                        { status: 404 }
                    );
                }
                
                featureIds = features.map((f: { id: string; slug: string }) => f.id);
            }

            // Update product
            const product = await prisma.product.update({
                where: { slug },
                data: {
                    ...(articleId !== undefined && { articleId }),
                    ...(price !== undefined && { price: price ? parseFloat(price) : null }),
                    ...(img !== undefined && { img }),
                    ...(categorySlug !== undefined && { categorySlug }),
                    ...(isActive !== undefined && { isActive }),
                    ...(featureSlugs !== undefined && featureIds.length > 0 && {
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
                    where: { productSlug: slug },
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
                where: { slug },
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
                    specs: true,
                    img: true,
                    items: {
                        include: {
                            productItemDetails: true,
                            lookupItem: {
                                include: {
                                    lookupItemDetails: true,
                                },
                            },
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
