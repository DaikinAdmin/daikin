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
                    img: true, // Relation name is 'img' which maps to ProductImages table
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
                img: product.img?.[0]?.imgs?.[0] || null, // Get first image URL from first ProductImages entry
                images: product.img || [], // Include full images array
                name: product.productDetails[0]?.name || "",
                title: product.productDetails[0]?.title || "",
                subtitle: product.productDetails[0]?.subtitle || "",
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
