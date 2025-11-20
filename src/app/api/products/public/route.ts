import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

// GET all active products with locale-specific translations (Public endpoint)
export const GET = async (req: Request) => {
    return withPrisma(async () => {
        try {
            const { searchParams } = new URL(req.url);
            const locale = searchParams.get("locale") || "en";
            const categoryId = searchParams.get("categoryId");
            const search = searchParams.get("search") || "";

            const products = await prisma.product.findMany({
                where: {
                    isActive: true,
                    ...(categoryId && { categoryId }),
                    ...(search && {
                        OR: [
                            { articleId: { contains: search, mode: "insensitive" } },
                            {
                                productDetails: {
                                    some: {
                                        OR: [
                                            { name: { contains: search, mode: "insensitive" } },
                                            { title: { contains: search, mode: "insensitive" } },
                                            { subtitle: { contains: search, mode: "insensitive" } },
                                        ],
                                    },
                                },
                            },
                        ],
                    }),
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
                    img: true, // Include product images
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            // Transform data to simplify locale-specific fields
            const transformedProducts = products
                .filter((product: any) => product.category?.isActive)
                .map((product: any) => ({
                    id: product.id,
                    articleId: product.articleId,
                    price: product.price,
                    img: product.img?.[0]?.imgs?.[0] || null, // Get first image URL
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
                }));

            return NextResponse.json(transformedProducts);
        } catch (error) {
            console.error("Error fetching public products:", error);
            return NextResponse.json(
                { error: "Failed to fetch products" },
                { status: 500 }
            );
        }
    });
};
