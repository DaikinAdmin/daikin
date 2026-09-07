import prisma from "@/db";
import { withPrisma } from "@/db/utils";
import {
  EMPTY_BANNERS,
  resolveBanners,
  type ResolvedBanners,
} from "@/lib/banners";

/**
 * Server-side banner lookup for a single location.
 * Never throws - a database problem simply means "no banner".
 */
export async function getBanners(
  location: string,
  locale?: string | null
): Promise<ResolvedBanners> {
  try {
    return await withPrisma(async () => {
      const banners = await prisma.banners.findMany({
        where: { location, isActive: true },
        orderBy: { updatedAt: "desc" },
      });

      return resolveBanners(banners, locale);
    });
  } catch (error) {
    console.error("Error fetching banners:", error);
    return EMPTY_BANNERS;
  }
}
