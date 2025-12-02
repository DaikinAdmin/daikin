import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

// POST bulk upload product items lookup (Admin only)
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
      const { items } = await req.json();

      if (!items || !Array.isArray(items) || items.length === 0) {
        return NextResponse.json(
          { error: "Invalid input: items array is required" },
          { status: 400 }
        );
      }

      const results = {
        created: [] as any[],
        updated: [] as any[],
        errors: [] as any[],
      };

      // Process each item
      for (const itemData of items) {
        try {
          const { title, slug, img, isActive, translations } = itemData;

          if (!title || !slug) {
            results.errors.push({
              slug: slug || "unknown",
              error: "Missing required fields: title and slug",
            });
            continue;
          }

          // Check if item already exists
          const existingItem = await prisma.productItemsLookup.findUnique({
            where: { slug },
          });

          if (existingItem) {
            // Update existing item
            const updated = await prisma.productItemsLookup.update({
              where: { slug },
              data: {
                title,
                img: img || null,
                isActive: isActive !== undefined ? isActive : true,
              },
            });

            // Update translations
            if (translations && Array.isArray(translations)) {
              await prisma.productItemsLookupTranslation.deleteMany({
                where: { lookupItemId: updated.id },
              });

              await prisma.productItemsLookupTranslation.createMany({
                data: translations.map((t: any) => ({
                  lookupItemId: updated.id,
                  locale: t.locale,
                  title: t.title,
                  subtitle: t.subtitle || null,
                  isActive: t.isActive !== undefined ? t.isActive : true,
                })),
              });
            }

            const updatedItem = await prisma.productItemsLookup.findUnique({
              where: { id: updated.id },
              include: {
                lookupItemDetails: true,
              },
            });

            results.updated.push(updatedItem);
          } else {
            // Create new item
            const created = await prisma.productItemsLookup.create({
              data: {
                title,
                slug,
                img: img || null,
                isActive: isActive !== undefined ? isActive : true,
                lookupItemDetails: translations
                  ? {
                      create: translations.map((t: any) => ({
                        locale: t.locale,
                        title: t.title,
                        subtitle: t.subtitle || null,
                        isActive: t.isActive !== undefined ? t.isActive : true,
                      })),
                    }
                  : undefined,
              },
              include: {
                lookupItemDetails: true,
              },
            });

            results.created.push(created);
          }
        } catch (error) {
          console.error(`Error processing item ${itemData.slug}:`, error);
          results.errors.push({
            slug: itemData.slug,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      return NextResponse.json(
        {
          message: `Bulk upload completed: ${results.created.length} created, ${results.updated.length} updated, ${results.errors.length} errors`,
          ...results,
        },
        { status: results.errors.length > 0 ? 207 : 200 }
      );
    } catch (error) {
      console.error("Error in bulk upload:", error);
      return NextResponse.json(
        { error: "Failed to process bulk upload" },
        { status: 500 }
      );
    }
  });
};
