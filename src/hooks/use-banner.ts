"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

interface Banner {
  id: string;
  img: string;
  link: string | null;
  location: string;
  locale: string;
  isMobile: boolean;
}

interface UseBannerProps {
  location: string;
  isMobile?: boolean;
}

interface UseBannerReturn {
  banners: Banner[];
  loading: boolean;
  firstBanner: Banner | null;
  firstBannerUrl: string | null;
}

export function useBanner({
  location,
  isMobile = false,
}: UseBannerProps): UseBannerReturn {
  const locale = useLocale();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchWithLocale = async (localeToFetch: string) => {
      const params = new URLSearchParams({
        locale: localeToFetch,
        location,
        isMobile: isMobile.toString(),
      });

      const response = await fetch(`/api/banners/public?${params.toString()}`);
      if (!response.ok) return [];

      return (await response.json()) as Banner[];
    };

    const fetchBanners = async () => {
      setLoading(true);

      try {
        // 1️⃣ Основний запит
        const data = await fetchWithLocale(locale);

        if (!cancelled && data.length > 0) {
          setBanners(data);
          return;
        }

        // 2️⃣ Fallback на pl
        if (locale !== "pl") {
          const fallbackData = await fetchWithLocale("pl");

          if (!cancelled) {
            setBanners(fallbackData);
          }
        } else if (!cancelled) {
          setBanners([]);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching banners:", error);
          setBanners([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBanners();

    return () => {
      cancelled = true;
    };
  }, [locale, location, isMobile]);

  return {
    banners,
    loading,
    firstBanner: banners[0] ?? null,
    firstBannerUrl: banners[0]?.img ?? null,
  };
}
