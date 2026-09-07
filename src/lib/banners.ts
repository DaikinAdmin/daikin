/**
 * Banner helpers.
 *
 * Banners live in the `banners` table and are addressed by `location`
 * (which page/slot the banner belongs to) plus `locale`.
 *
 * Resolution rules:
 *  - the requested locale wins, otherwise we fall back in the order pl -> en -> ua
 *  - every location can hold a desktop and a mobile banner (`isMobile`)
 *  - when there is no mobile banner we show the desktop one
 */

export const BANNER_LOCALE_PRIORITY = ["pl", "en", "ua"] as const;

/** Locations that can hold a banner. Keep in sync with the pages rendering them. */
export const BANNER_LOCATIONS = [
  "home",
  "air-conditioning",
  "heat-pumps",
  "air-purifiers",
] as const;

export type BannerLocation = (typeof BANNER_LOCATIONS)[number];

export type BannerRecord = {
  id: string;
  img: string;
  link: string | null;
  location: string;
  locale: string;
  isActive: boolean;
  isMobile: boolean;
};

export type ResolvedBanner = {
  img: string;
  link: string | null;
  locale: string;
};

export type ResolvedBanners = {
  desktop: ResolvedBanner | null;
  /** Falls back to the desktop banner when no mobile banner exists. */
  mobile: ResolvedBanner | null;
};

/**
 * Build the locale lookup order for a requested locale:
 * the requested locale first, then pl, en, ua.
 */
export function bannerLocaleOrder(locale?: string | null): string[] {
  const order = [...BANNER_LOCALE_PRIORITY] as string[];
  if (locale && !order.includes(locale)) return [locale, ...order];
  if (locale) return [locale, ...order.filter((l) => l !== locale)];
  return order;
}

/**
 * Pick the desktop/mobile banner out of a set of rows for a single location,
 * honouring the locale fallback order.
 */
export function resolveBanners(
  banners: BannerRecord[],
  locale?: string | null
): ResolvedBanners {
  const active = banners.filter((b) => b.isActive);
  const order = bannerLocaleOrder(locale);

  const pick = (isMobile: boolean): ResolvedBanner | null => {
    for (const candidateLocale of order) {
      const match = active.find(
        (b) => b.locale === candidateLocale && b.isMobile === isMobile
      );
      if (match) {
        return { img: match.img, link: match.link, locale: match.locale };
      }
    }
    return null;
  };

  const desktop = pick(false);
  const mobile = pick(true) ?? desktop;

  return { desktop, mobile };
}

export const EMPTY_BANNERS: ResolvedBanners = { desktop: null, mobile: null };
