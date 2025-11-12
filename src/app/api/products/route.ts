import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

// GET all products
export const GET = async (req: Request) => {
    return withPrisma(async () => {
        try {
            const { searchParams } = new URL(req.url);
            const search = searchParams.get("search") || "";
            const locale = searchParams.get("locale");
            const categoryId = searchParams.get("categoryId");
            const includeInactive = searchParams.get("includeInactive") === "true";

            const products = await prisma.product.findMany({
                where: {
                    ...(search && {
                        OR: [
                            { articleId: { contains: search, mode: "insensitive" } },
                            {
                                productDetails: {
                                    some: {
                                        OR: [
                                            { name: { contains: search, mode: "insensitive" } },
                                            { description: { contains: search, mode: "insensitive" } },
                                        ],
                                    },
                                },
                            },
                        ],
                    }),
                    ...(categoryId && { categoryId }),
                    ...(!includeInactive && { isActive: true }),
                },
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
                orderBy: {
                    createdAt: "desc",
                },
            });

            return NextResponse.json(products);
        } catch (error) {
            console.error("Error fetching products:", error);
            return NextResponse.json(
                { error: "Failed to fetch products" },
                { status: 500 }
            );
        }
    });
};

// POST create new product (Admin only)
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
            const {
                articleId,
                price,
                img,
                categoryId,
                isActive,
                translations,
                featureIds,
            } = await req.json();

            if (!articleId || !categoryId) {
                return NextResponse.json(
                    { error: "Missing required fields: articleId and categoryId" },
                    { status: 400 }
                );
            }

            // Check if articleId already exists
            const existingProduct = await prisma.product.findUnique({
                where: { articleId },
            });

            if (existingProduct) {
                return NextResponse.json(
                    { error: "Product with this articleId already exists" },
                    { status: 409 }
                );
            }

            // Verify category exists
            const category = await prisma.category.findUnique({
                where: { id: categoryId },
            });

            if (!category) {
                return NextResponse.json(
                    { error: "Category not found" },
                    { status: 404 }
                );
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

            const product = await prisma.product.create({
                data: {
                    articleId,
                    price: price ? parseFloat(price) : null,
                    img: img || null,
                    categoryId,
                    isActive: isActive !== undefined ? isActive : true,
                    productDetails: translations
                        ? {
                              create: translations.map((t: any) => ({
                                  locale: t.locale,
                                  name: t.name,
                                  description: t.description,
                              })),
                          }
                        : undefined,
                    features: featureIds
                        ? {
                              connect: featureIds.map((id: string) => ({ id })),
                          }
                        : undefined,
                },
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

            return NextResponse.json(product, { status: 201 });
        } catch (error) {
            console.error("Error creating product:", error);
            return NextResponse.json(
                { error: "Failed to create product" },
                { status: 500 }
            );
        }
    });
};
