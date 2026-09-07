"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { EMPTY_BANNERS, type ResolvedBanners } from "@/lib/banners";

/**
 * Load the desktop/mobile banner configured for a page location.
 *
 * The locale fallback (requested locale -> pl -> en -> ua) and the
 * "no mobile banner means use the desktop one" rule are applied server side,
 * see `resolveBanners` in `src/lib/banners.ts`.
 */
export function useBanner(location: string): {
  banners: ResolvedBanners;
  loading: boolean;
} {
  const locale = useLocale();
  const [banners, setBanners] = useState<ResolvedBanners>(EMPTY_BANNERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchBanners = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/banners/public?location=${encodeURIComponent(
            location
          )}&locale=${encodeURIComponent(locale)}`
        );

        if (!cancelled && response.ok) {
          setBanners(await response.json());
        }
      } catch (error) {
        console.error("Error fetching banner:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBanners();

    return () => {
      cancelled = true;
    };
  }, [location, locale]);

  return { banners, loading };
}
