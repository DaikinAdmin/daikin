/**
 * Images used by the "Why choose Daikin" section.
 *
 * Kept separate from the translation files on purpose: these images are the
 * same across locales, so they don't belong in src/messages/*.json - only
 * the title/description/subtitle text is translated there.
 */

export type WhyChooseImageSet = {
  left1: string;
  right1: string;
  right2: string;
};

/** Home page section. */
export const HOME_WHY_CHOOSE_IMAGES: WhyChooseImageSet = {
  left1: "/why-choose-section/Nizsze_rachunki.webp",
  right1: "/why-choose-section/pewnosc_na_lata.webp",
  right2: "/why-choose-section/cisza_komfort.webp",
};

/** Product category pages, keyed by categorySlug. */
export const PRODUCT_WHY_CHOOSE_IMAGES: Record<string, WhyChooseImageSet> = {
  "air-conditioning": {
    left1:
      "/why-choose-section/czyste_powietrze-1765210725323.webp",
    right1:
      "/why-choose-section/Doskonaly_komfort-1765210718053.webp",
    right2:
      "/why-choose-section/Doskonala_wydajnosc-1765210707161.webp",
  },
  "heat-pumps": {
    left1:
      "/why-choose-section/dlaczego_pompa_ciepla1-1765266488522.webp",
    right1:
      "/why-choose-section/dlaczego_pompa_ciepla2-1765266506015.webp",
    right2:
      "/why-choose-section/dlaczego_pompa_ciepla3-1765266515323.webp",
  },
  "air-purifiers": {
    left1:
      "/why-choose-section/dlaczego_oczyszczacz _powietrza1-1765269773035.webp",
    right1:
      "/why-choose-section/dlaczego_oczyszczacz_powietrza2-1765269782059.webp",
    right2:
      "/why-choose-section/dlaczego_oczyszczacz_powietrza3-1765269791100.webp",
  },
};

/** Fallback used when a category has no entry above. */
export const FALLBACK_WHY_CHOOSE_IMAGES: WhyChooseImageSet = HOME_WHY_CHOOSE_IMAGES;

export function getProductWhyChooseImages(categorySlug: string): WhyChooseImageSet {
  return PRODUCT_WHY_CHOOSE_IMAGES[categorySlug] ?? FALLBACK_WHY_CHOOSE_IMAGES;
}
