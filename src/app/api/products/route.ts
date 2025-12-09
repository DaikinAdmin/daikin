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
            const categoryId = searchParams.get("categoryId"); // For backward compatibility
            const categorySlugParam = searchParams.get("categorySlug");
            const includeInactive = searchParams.get("includeInactive") === "true";

            // Determine categorySlug from either categoryId or direct categorySlug parameter
            let categorySlug: string | null = categorySlugParam || null;
            if (categoryId && !categorySlug) {
                const category = await prisma.category.findUnique({
                    where: { id: categoryId },
                    select: { slug: true },
                });
                categorySlug = category?.slug || null;
            }

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
                    ...(categorySlug && { categorySlug }),
                    ...(!includeInactive && { isActive: true }),
                },
                include: {
                    // If includeInactive is true (admin view), always return all translations
                    // Otherwise, filter by locale if provided
                    productDetails: includeInactive 
                        ? true
                        : locale
                        ? {
                              where: { locale },
                          }
                        : true,
                    category: {
                        include: {
                            categoryDetails: locale && !includeInactive
                                ? {
                                      where: { locale, isActive: true },
                                  }
                                : { where: { isActive: true } },
                        },
                    },
                    features: {
                        where: { isActive: true },
                        include: {
                            featureDetails: locale && !includeInactive
                                ? {
                                      where: { locale, isActive: true },
                                  }
                                : { where: { isActive: true } },
                        },
                    },
                    specs: locale && !includeInactive
                        ? {    
                              where: { locale }
                          }
                        : true,
                    img: true,
                    items: {
                        include: {
                            productItemDetails: locale && !includeInactive
                                ? {
                                      where: { locale, isActive: true },
                                  }
                                : { where: { isActive: true } },
                            lookupItem: {
                                include: {
                                    lookupItemDetails: locale && !includeInactive
                                        ? {
                                              where: { locale, isActive: true },
                                          }
                                        : { where: { isActive: true } },
                                },
                            },
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
// Image Upload: Use POST /api/images/upload to upload product images first,
// then include the returned URLs in the images array.
// Folder recommendation: 'products'
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
                categorySlug, // Changed from categoryId to categorySlug
                slug,
                energyClass,
                isActive,
                translations,
                featureSlugs, // Array of feature slugs
                specs,
                images, // Array of image objects: [{ color, imgs: [url1, url2], url: [url1, url2] }]
                items, // Array with translations: [{ title, slug, img, isActive, translations: [{ locale, title, subtitle, isActive }] }]
            } = await req.json();

            if (!articleId || !categorySlug) {
                return NextResponse.json(
                    { error: "Missing required fields: articleId and categorySlug" },
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

            // Verify category exists by slug
            const category = await prisma.category.findUnique({
                where: { slug: categorySlug },
            });

            if (!category) {
                return NextResponse.json(
                    { error: `Category not found for slug: ${categorySlug}` },
                    { status: 404 }
                );
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

            const product = await prisma.product.create({
                data: {
                    articleId,
                    price: price ? parseFloat(price) : null,
                    categorySlug: categorySlug,
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
                    features: featureIds.length > 0
                        ? {
                              connect: featureIds.map((id: string) => ({ id })),
                          }
                        : undefined,
                    specs: specs
                        ? {
                              create: specs.map((s: any) => ({
                                  locale: s.locale,
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
                              })),
                          }
                        : undefined,
                    items: items
                        ? {
                              create: items.map((item: any) => ({
                                  title: item.title,
                                  slug: item.slug,
                                  img: item.img || null,
                                  isActive: item.isActive !== undefined ? item.isActive : true,
                                  lookupItemId: item.lookupItemId || null,
                                  productItemDetails: item.translations
                                      ? {
                                            create: item.translations.map((t: any) => ({
                                                locale: t.locale,
                                                title: t.title,
                                                subtitle: t.subtitle || null,
                                                isActive: t.isActive !== undefined ? t.isActive : true,
                                            })),
                                        }
                                      : undefined,
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
