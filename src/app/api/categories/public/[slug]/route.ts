import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

// GET single active category with locale-specific translations (Public endpoint)
export const GET = async (
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) => {
    return withPrisma(async () => {
        try {
            const { slug } = await params;
            const { searchParams } = new URL(req.url);
            const locale = searchParams.get("locale") || "en";

            const category = await prisma.category.findFirst({
                where: {
                    slug,
                    isActive: true,
                },
                include: {
                    categoryDetails: {
                        where: { locale, isActive: true },
                    },
                    products: {
                        where: { isActive: true },
                        include: {
                            productDetails: {
                                where: { locale },
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
                    },
                },
            });

            if (!category) {
                return NextResponse.json(
                    { error: "Category not found" },
                    { status: 404 }
                );
            }

            // Transform data to simplify locale-specific fields
            const transformedCategory = {
                id: category.id,
                slug: category.slug,
                name: category.categoryDetails[0]?.name || category.name,
                products: category.products.map((product: any) => ({
                    id: product.id,
                    articleId: product.articleId,
                    price: product.price,
                    img: product.img,
                    name: product.productDetails[0]?.name || "",
                    description: product.productDetails[0]?.description || "",
                    features: product.features.map((feature: any) => ({
                        id: feature.id,
                        img: feature.img,
                        name: feature.featureDetails[0]?.name || feature.name,
                    })),
                })),
                createdAt: category.createdAt,
                updatedAt: category.updatedAt,
            };

            return NextResponse.json(transformedCategory);
        } catch (error) {
            console.error("Error fetching public category:", error);
            return NextResponse.json(
                { error: "Failed to fetch category" },
                { status: 500 }
            );
        }
    });
};
