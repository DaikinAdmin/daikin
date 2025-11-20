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
                                            { title: { contains: search, mode: "insensitive" } },
                                            { subtitle: { contains: search, mode: "insensitive" } },
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
                    specs: true,
                    img: true,
                    items: true,
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
                categoryId,
                slug,
                energyClass,
                isActive,
                translations,
                featureIds,
                specs,
                images,
                items,
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

            // Check if slug already exists (if provided)
            if (slug) {
                const existingSlug = await prisma.product.findUnique({
                    where: { slug },
                });

                if (existingSlug) {
                    return NextResponse.json(
                        { error: "Product with this slug already exists" },
                        { status: 409 }
                    );
                }
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
                    categoryId,
                    slug: slug || articleId.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    energyClass: energyClass || null,
                    isActive: isActive !== undefined ? isActive : true,
                    productDetails: translations
                        ? {
                              create: translations.map((t: any) => ({
                                  locale: t.locale,
                                  name: t.name,
                                  title: t.title,
                                  subtitle: t.subtitle || null,
                              })),
                          }
                        : undefined,
                    features: featureIds
                        ? {
                              connect: featureIds.map((id: string) => ({ id })),
                          }
                        : undefined,
                    specs: specs
                        ? {
                              create: specs.map((s: any) => ({
                                  title: s.title,
                                  subtitle: s.subtitle || null,
                              })),
                          }
                        : undefined,
                    img: images
                        ? {
                              create: images.map((img: any) => ({
                                  color: img.color || null,
                                  imgs: img.imgs || [],
                                  url: img.url || [],
                              })),
                          }
                        : undefined,
                    items: items
                        ? {
                              create: items.map((item: any) => ({
                                  locale: item.locale,
                                  title: item.title,
                                  subtitle: item.subtitle || null,
                                  img: item.img || null,
                                  isActive: item.isActive !== undefined ? item.isActive : true,
                              })),
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
                    specs: true,
                    img: true,
                    items: true,
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
