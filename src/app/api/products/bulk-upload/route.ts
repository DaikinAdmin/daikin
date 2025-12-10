import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

type BulkProductInput = {
  articleId: string;
  price?: number | null;
  categorySlug: string;
  slug?: string | null;
  energyClass?: string | null;
  isActive?: boolean;
  featureIds?: string[];
  translations?: {
    locale: string;
    name: string;
    title: string;
    subtitle?: string | null;
  }[];
  specs?: {
    locale: string;
    title: string;
    subtitle?: string | null;
  }[];
  images?: {
    color?: string | null;
    imgs?: string[];
    url?: string[];
  }[];
  items?: {
    locale: string;
    title: string;
    subtitle?: string | null;
    img?: string | null;
    isActive?: boolean;
  }[];
};

type BulkUploadResult = {
  success: boolean;
  created: number;
  updated: number;
  failed: number;
  errors: {
    articleId: string;
    error: string;
  }[];
};

// POST bulk upload products from JSON (Admin only)
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
      const body = await req.json();
      
      // Handle both wrapped {products: [...]} and direct array [...]
      let products = Array.isArray(body) ? body : body.products;
      
      // Also handle double-wrapped {products: {products: [...]}}
      if (products && typeof products === 'object' && !Array.isArray(products) && products.products) {
        products = products.products;
      }

      if (!products || !Array.isArray(products) || products.length === 0) {
        return NextResponse.json(
          { error: "Invalid request body. Expected an array of products." },
          { status: 400 }
        );
      }

      const result: BulkUploadResult = {
        success: true,
        created: 0,
        updated: 0,
        failed: 0,
        errors: [],
      };

      for (const productData of products as BulkProductInput[]) {
        try {
          // Validate required fields
          if (!productData.articleId || !productData.categorySlug) {
            result.failed++;
            result.errors.push({
              articleId: productData.articleId || "unknown",
              error: "Missing required fields: articleId and categorySlug",
            });
            continue;
          }

          // Find category by slug
          const category = await prisma.category.findUnique({
            where: { slug: productData.categorySlug },
          });

          if (!category) {
            result.failed++;
            result.errors.push({
              articleId: productData.articleId,
              error: `Category with slug '${productData.categorySlug}' not found`,
            });
            continue;
          }

          // Verify features exist if provided
          if (productData.featureIds && productData.featureIds.length > 0) {
            const features = await prisma.feature.findMany({
              where: { id: { in: productData.featureIds } },
            });

            if (features.length !== productData.featureIds.length) {
              result.failed++;
              result.errors.push({
                articleId: productData.articleId,
                error: "One or more features not found",
              });
              continue;
            }
          }

          // Check if product exists
          const existingProduct = await prisma.product.findUnique({
            where: { articleId: productData.articleId },
            include: {
              productDetails: true,
              specs: true,
              img: true,
              items: true,
            },
          });

          const slug = productData.slug || productData.articleId.toLowerCase().replace(/[^a-z0-9]+/g, '-');

          // Check if slug is taken by another product
          if (!existingProduct || existingProduct.slug !== slug) {
            const existingSlug = await prisma.product.findUnique({
              where: { slug },
            });

            if (existingSlug && (!existingProduct || existingSlug.id !== existingProduct.id)) {
              result.failed++;
              result.errors.push({
                articleId: productData.articleId,
                error: `Product with slug '${slug}' already exists`,
              });
              continue;
            }
          }

          if (existingProduct) {
            // Update existing product
            await prisma.$transaction(async (tx: any) => {
              // Delete existing related data
              await tx.productTranslation.deleteMany({
                where: { productId: existingProduct.id },
              });
              await tx.productSpecs.deleteMany({
                where: { productId: existingProduct.id },
              });
              await tx.productImages.deleteMany({
                where: { productId: existingProduct.id },
              });
              await tx.productItems.deleteMany({
                where: { productId: existingProduct.id },
              });

              // Update product
              await tx.product.update({
                where: { id: existingProduct.id },
                data: {
                  price: productData.price,
                  categorySlug: category.slug,
                  slug,
                  energyClass: productData.energyClass,
                  isActive: productData.isActive !== undefined ? productData.isActive : true,
                  productDetails: productData.translations
                    ? {
                        create: productData.translations.map((t) => ({
                          locale: t.locale,
                          name: t.name,
                          title: t.title,
                          subtitle: t.subtitle || null,
                        })),
                      }
                    : undefined,
                  features: productData.featureIds
                    ? {
                        set: productData.featureIds.map((id) => ({ id })),
                      }
                    : undefined,
                  specs: productData.specs
                    ? {
                        create: productData.specs.map((s) => ({
                          locale: s.locale,
                          title: s.title,
                          subtitle: s.subtitle || null,
                        })),
                      }
                    : undefined,
                  img: productData.images
                    ? {
                        create: productData.images.map((img) => ({
                          color: img.color || null,
                          imgs: img.imgs || [],
                        })),
                      }
                    : undefined,
                  items: productData.items
                    ? {
                        create: productData.items.map((item: any) => ({
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
              });
            });

            result.updated++;
          } else {
            // Create new product
            await prisma.product.create({
              data: {
                articleId: productData.articleId,
                price: productData.price,
                categorySlug: category.slug,
                slug,
                energyClass: productData.energyClass,
                isActive: productData.isActive !== undefined ? productData.isActive : true,
                productDetails: productData.translations
                  ? {
                      create: productData.translations.map((t) => ({
                        locale: t.locale,
                        name: t.name,
                        title: t.title,
                        subtitle: t.subtitle || null,
                      })),
                    }
                  : undefined,
                features: productData.featureIds
                  ? {
                      connect: productData.featureIds.map((id) => ({ id })),
                    }
                  : undefined,
                specs: productData.specs
                  ? {
                      create: productData.specs.map((s) => ({
                        locale: s.locale,
                        title: s.title,
                        subtitle: s.subtitle || null,
                      })),
                    }
                  : undefined,
                img: productData.images
                  ? {
                      create: productData.images.map((img) => ({
                        color: img.color || null,
                        imgs: img.imgs || [],
                      })),
                    }
                  : undefined,
                items: productData.items
                  ? {
                      create: productData.items.map((item: any) => ({
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
            });

            result.created++;
          }
        } catch (error) {
          console.error(`Error processing product ${productData.articleId}:`, error);
          result.failed++;
          result.errors.push({
            articleId: productData.articleId,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      return NextResponse.json(result, { status: 200 });
    } catch (error) {
      console.error("Error in bulk upload:", error);
      return NextResponse.json(
        { error: "Failed to process bulk upload" },
        { status: 500 }
      );
    }
  });
};
