import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { withPrisma } from "@/db/utils";

// PUT reorder realization photos (Admin only)
// Body: { ids: string[] } - the full list of photo ids in the wanted order.
export const PUT = async (req: Request) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return withPrisma(async () => {
    try {
      const { ids } = await req.json();

      if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
        return NextResponse.json(
          { error: "Body must contain an array of photo ids" },
          { status: 400 }
        );
      }

      await prisma.$transaction(
        ids.map((id: string, index: number) =>
          prisma.realizationPhoto.update({
            where: { id },
            data: { sortOrder: index },
          })
        )
      );

      const photos = await prisma.realizationPhoto.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });

      return NextResponse.json(photos);
    } catch (error) {
      console.error("Error reordering realization photos:", error);
      return NextResponse.json(
        { error: "Failed to reorder realization photos" },
        { status: 500 }
      );
    }
  });
};
