import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

// GET all product items lookup
export const GET = async (req: Request) => {
  return withPrisma(async () => {
    try {
      const { searchParams } = new URL(req.url);
      const locale = searchParams.get("locale");
      const includeInactive = searchParams.get("includeInactive") === "true";

      const lookupItems = await prisma.productItemsLookup.findMany({
        where: {
          ...(!includeInactive && { isActive: true }),
        },
        include: {
          lookupItemDetails: locale
            ? {
                where: { locale, isActive: true },
              }
            : { where: { isActive: true } },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json(lookupItems);
    } catch (error) {
      console.error("Error fetching product items lookup:", error);
      return NextResponse.json(
        { error: "Failed to fetch product items lookup" },
        { status: 500 }
      );
    }
  });
};

// POST create new product item lookup (Admin only)
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
      const { title, slug, img, isActive, translations } = await req.json();

      if (!title || !slug) {
        return NextResponse.json(
          { error: "Missing required fields: title and slug" },
          { status: 400 }
        );
      }

      // Check if slug already exists
      const existingItem = await prisma.productItemsLookup.findUnique({
        where: { slug },
      });

      if (existingItem) {
        return NextResponse.json(
          { error: "Product item lookup with this slug already exists" },
          { status: 409 }
        );
      }

      const lookupItem = await prisma.productItemsLookup.create({
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

      return NextResponse.json(lookupItem, { status: 201 });
    } catch (error) {
      console.error("Error creating product item lookup:", error);
      return NextResponse.json(
        { error: "Failed to create product item lookup" },
        { status: 500 }
      );
    }
  });
};
