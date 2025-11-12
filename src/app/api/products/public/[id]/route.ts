import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

// GET single active product with locale-specific translations (Public endpoint)
export const GET = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    return withPrisma(async () => {
        try {
            const { id } = await params;
            const { searchParams } = new URL(req.url);
            const locale = searchParams.get("locale") || "en";

            const product = await prisma.product.findFirst({
                where: {
                    id,
                    isActive: true,
                },
                include: {
                    productDetails: {
                        where: { locale },
                    },
                    category: {
                        include: {
                            categoryDetails: {
                                where: { locale, isActive: true },
                            },
                        },
                    },
                    features: {
                        where: { isActive: true },
                        include: {
                            featureDetails: {
                                where: { locale, isActive: true },
                            },
                        },
                    },
                },
            });

            if (!product || !product.category?.isActive) {
                return NextResponse.json(
                    { error: "Product not found" },
                    { status: 404 }
                );
            }

            // Transform data to simplify locale-specific fields
            const transformedProduct = {
                id: product.id,
                articleId: product.articleId,
                price: product.price,
                img: product.img,
                name: product.productDetails[0]?.name || "",
                description: product.productDetails[0]?.description || "",
                category: product.category
                    ? {
                          id: product.category.id,
                          slug: product.category.slug,
                          name:
                              product.category.categoryDetails[0]?.name ||
                              product.category.name,
                      }
                    : null,
                features: product.features.map((feature: any) => ({
                    id: feature.id,
                    img: feature.img,
                    name: feature.featureDetails[0]?.name || feature.name,
                })),
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
            };

            return NextResponse.json(transformedProduct);
        } catch (error) {
            console.error("Error fetching public product:", error);
            return NextResponse.json(
                { error: "Failed to fetch product" },
                { status: 500 }
            );
        }
    });
};
