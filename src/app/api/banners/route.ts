import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

const requireAdmin = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
};

// GET all banners (Admin only)
export const GET = async (req: Request) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  return withPrisma(async () => {
    try {
      const { searchParams } = new URL(req.url);
      const location = searchParams.get("location");
      const locale = searchParams.get("locale");

      const banners = await prisma.banners.findMany({
        where: {
          ...(location && { location }),
          ...(locale && { locale }),
        },
        orderBy: [{ location: "asc" }, { locale: "asc" }, { isMobile: "asc" }],
      });

      return NextResponse.json(banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
      return NextResponse.json(
        { error: "Failed to fetch banners" },
        { status: 500 }
      );
    }
  });
};

// POST create a banner (Admin only)
// Image upload: use POST /api/images/upload (folder 'banners') and pass the
// returned URL as `img`.
export const POST = async (req: Request) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  return withPrisma(async () => {
    try {
      const { img, link, location, locale, isActive, isMobile } =
        await req.json();

      if (!img || !location || !locale) {
        return NextResponse.json(
          { error: "Missing required fields: img, location and locale" },
          { status: 400 }
        );
      }

      const banner = await prisma.banners.create({
        data: {
          img,
          link: link || null,
          location,
          locale,
          isActive: isActive !== undefined ? isActive : true,
          isMobile: isMobile !== undefined ? isMobile : false,
        },
      });

      return NextResponse.json(banner, { status: 201 });
    } catch (error) {
      console.error("Error creating banner:", error);
      return NextResponse.json(
        { error: "Failed to create banner" },
        { status: 500 }
      );
    }
  });
};
