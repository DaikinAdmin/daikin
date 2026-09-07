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

// PATCH update a realization photo (Admin only)
export const PATCH = async (req: Request, { params }: { params: Params }) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  return withPrisma(async () => {
    try {
      const { id } = await params;
      const { img, alt, sortOrder, isActive } = await req.json();

      const photo = await prisma.realizationPhoto.update({
        where: { id },
        data: {
          ...(img !== undefined && { img }),
          ...(alt !== undefined && { alt: alt || null }),
          ...(sortOrder !== undefined && { sortOrder }),
          ...(isActive !== undefined && { isActive }),
        },
      });

      return NextResponse.json(photo);
    } catch (error) {
      console.error("Error updating realization photo:", error);
      return NextResponse.json(
        { error: "Failed to update realization photo" },
        { status: 500 }
      );
    }
  });
};

// DELETE a realization photo (Admin only)
export const DELETE = async (req: Request, { params }: { params: Params }) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  return withPrisma(async () => {
    try {
      const { id } = await params;

      await prisma.realizationPhoto.delete({ where: { id } });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting realization photo:", error);
      return NextResponse.json(
        { error: "Failed to delete realization photo" },
        { status: 500 }
      );
    }
  });
};
