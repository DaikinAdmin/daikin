import prisma from "@/db";
import { withPrisma } from "@/db/utils";

export type RealizationPhotoRecord = {
  id: string;
  img: string;
  alt: string | null;
  sortOrder: number;
};

/**
 * Active realization gallery photos in their configured order.
 * Never throws - a database problem simply means an empty gallery.
 */
export async function getRealizationPhotos(): Promise<RealizationPhotoRecord[]> {
  try {
    return await withPrisma(async () =>
      prisma.realizationPhoto.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: { id: true, img: true, alt: true, sortOrder: true },
      })
    );
  } catch (error) {
    console.error("Error fetching realization photos:", error);
    return [];
  }
}
