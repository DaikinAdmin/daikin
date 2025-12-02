import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

// GET single product item lookup
export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  return withPrisma(async () => {
    try {
      const { id } = await params;
      const { searchParams } = new URL(req.url);
      const locale = searchParams.get("locale");

      const lookupItem = await prisma.productItemsLookup.findUnique({
        where: { id },
        include: {
          lookupItemDetails: locale
            ? {
                where: { locale, isActive: true },
              }
            : { where: { isActive: true } },
          productItems: {
            include: {
              product: {
                select: {
                  id: true,
                  slug: true,
                  articleId: true,
                },
              },
            },
          },
        },
      });

      if (!lookupItem) {
        return NextResponse.json(
          { error: "Product item lookup not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(lookupItem);
    } catch (error) {
      console.error("Error fetching product item lookup:", error);
      return NextResponse.json(
        { error: "Failed to fetch product item lookup" },
        { status: 500 }
      );
    }
  });
};

// PUT update product item lookup (Admin only)
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
      const { title, slug, img, isActive, translations } = await req.json();

      // Check if slug is being changed and if it already exists
      if (slug) {
        const existingItem = await prisma.productItemsLookup.findFirst({
          where: {
            slug,
            NOT: { id },
          },
        });

        if (existingItem) {
          return NextResponse.json(
            { error: "Product item lookup with this slug already exists" },
            { status: 409 }
          );
        }
      }

      // Update lookup item
      const lookupItem = await prisma.productItemsLookup.update({
        where: { id },
        data: {
          ...(title !== undefined && { title }),
          ...(slug !== undefined && { slug }),
          ...(img !== undefined && { img }),
          ...(isActive !== undefined && { isActive }),
        },
      });

      // Handle translations if provided
      if (translations && Array.isArray(translations)) {
        // Delete existing translations and create new ones
        await prisma.productItemsLookupTranslation.deleteMany({
          where: { lookupItemId: id },
        });

        await prisma.productItemsLookupTranslation.createMany({
          data: translations.map((t: any) => ({
            lookupItemId: id,
            locale: t.locale,
            title: t.title,
            subtitle: t.subtitle || null,
            isActive: t.isActive !== undefined ? t.isActive : true,
          })),
        });
      }

      // Fetch updated lookup item with all relations
      const updatedLookupItem = await prisma.productItemsLookup.findUnique({
        where: { id },
        include: {
          lookupItemDetails: true,
        },
      });

      return NextResponse.json(updatedLookupItem);
    } catch (error) {
      console.error("Error updating product item lookup:", error);
      return NextResponse.json(
        { error: "Failed to update product item lookup" },
        { status: 500 }
      );
    }
  });
};

// DELETE product item lookup (Admin only)
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

      const lookupItem = await prisma.productItemsLookup.findUnique({
        where: { id },
        include: {
          _count: {
            select: { productItems: true },
          },
        },
      });

      if (!lookupItem) {
        return NextResponse.json(
          { error: "Product item lookup not found" },
          { status: 404 }
        );
      }

      // Check if lookup item is used by any products
      if (lookupItem._count.productItems > 0) {
        return NextResponse.json(
          {
            error: `Cannot delete lookup item that is used by ${lookupItem._count.productItems} product(s). Consider deactivating it instead.`,
          },
          { status: 409 }
        );
      }

      await prisma.productItemsLookup.delete({
        where: { id },
      });

      return NextResponse.json({
        message: "Product item lookup deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting product item lookup:", error);
      return NextResponse.json(
        { error: "Failed to delete product item lookup" },
        { status: 500 }
      );
    }
  });
};
