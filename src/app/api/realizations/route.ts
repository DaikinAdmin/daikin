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

// GET realization photos, ordered. Public unless includeInactive is requested.
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const includeInactive = searchParams.get("includeInactive") === "true";

  if (includeInactive) {
    const denied = await requireAdmin();
    if (denied) return denied;
  }

  return withPrisma(async () => {
    try {
      const photos = await prisma.realizationPhoto.findMany({
        where: includeInactive ? {} : { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });

      return NextResponse.json(photos);
    } catch (error) {
      console.error("Error fetching realization photos:", error);
      return NextResponse.json(
        { error: "Failed to fetch realization photos" },
        { status: 500 }
      );
    }
  });
};

// POST create a realization photo (Admin only)
// Image upload: use POST /api/images/upload (folder 'realization') and pass the
// returned URL as `img`.
export const POST = async (req: Request) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  return withPrisma(async () => {
    try {
      const { img, alt, sortOrder, isActive } = await req.json();

      if (!img) {
        return NextResponse.json(
          { error: "Missing required field: img" },
          { status: 400 }
        );
      }

      // Append to the end of the gallery when no explicit position is given
      const resolvedSortOrder =
        sortOrder !== undefined && sortOrder !== null
          ? sortOrder
          : ((
              await prisma.realizationPhoto.aggregate({
                _max: { sortOrder: true },
              })
            )._max.sortOrder ?? -1) + 1;

      const photo = await prisma.realizationPhoto.create({
        data: {
          img,
          alt: alt || null,
          sortOrder: resolvedSortOrder,
          isActive: isActive !== undefined ? isActive : true,
        },
      });

      return NextResponse.json(photo, { status: 201 });
    } catch (error) {
      console.error("Error creating realization photo:", error);
      return NextResponse.json(
        { error: "Failed to create realization photo" },
        { status: 500 }
      );
    }
  });
};
