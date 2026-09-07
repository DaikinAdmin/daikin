import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

type Params = Promise<{ id: string }>;

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

// PATCH update a banner (Admin only)
export const PATCH = async (
  req: Request,
  { params }: { params: Params }
) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  return withPrisma(async () => {
    try {
      const { id } = await params;
      const { img, link, location, locale, isActive, isMobile } =
        await req.json();

      const banner = await prisma.banners.update({
        where: { id },
        data: {
          ...(img !== undefined && { img }),
          ...(link !== undefined && { link: link || null }),
          ...(location !== undefined && { location }),
          ...(locale !== undefined && { locale }),
          ...(isActive !== undefined && { isActive }),
          ...(isMobile !== undefined && { isMobile }),
        },
      });

      return NextResponse.json(banner);
    } catch (error) {
      console.error("Error updating banner:", error);
      return NextResponse.json(
        { error: "Failed to update banner" },
        { status: 500 }
      );
    }
  });
};

// DELETE a banner (Admin only)
export const DELETE = async (
  req: Request,
  { params }: { params: Params }
) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  return withPrisma(async () => {
    try {
      const { id } = await params;

      await prisma.banners.delete({ where: { id } });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting banner:", error);
      return NextResponse.json(
        { error: "Failed to delete banner" },
        { status: 500 }
      );
    }
  });
};
