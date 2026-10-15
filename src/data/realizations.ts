// Konfiguracja realizacji – teksty znajdują się w messages (namespace "realizations.groups.<groupId>.items.<itemId>")
export interface RealizationItemConfig {
  id: string;
  mainImage: string;
  thumbnails: string[];
  beforeImage: string;
  afterImage: string;
}

export interface RealizationGroupConfig {
  id: string;
  bannerImage: string;
  items: RealizationItemConfig[];
}

const IMG = "https://daikinkobierzyce.pl/api/images/realization";

export const REALIZATION_GROUPS: RealizationGroupConfig[] = [
  {
    id: "air-conditioning",
    bannerImage: `/banners/image-1765209394490.jpg`,
    items: [
      {
        id: "house-warsaw",
        mainImage: `${IMG}/IMG_2886-1781178758410-1788784661183.webp`,
        thumbnails: [
          `${IMG}/IMG_2922-1781178849941-1788784658154.webp`,
          `${IMG}/IMG_2913-1781178811793-1788784655493.webp`,
          `${IMG}/IMG_2907-1781178787191-1788784651275.webp`,
        ],
        beforeImage: `${IMG}/IMG_2913-1781178811793-1788784655493.webp`,
        afterImage: `${IMG}/IMG_2907-1781178787191-1788784651275.webp`,
      },
      {
        id: "house-wroclaw",
        mainImage: `${IMG}/IMG_2886-1781178758410-1788784661183.webp`,
        thumbnails: [
          `${IMG}/IMG_2922-1781178849941-1788784658154.webp`,
          `${IMG}/IMG_2913-1781178811793-1788784655493.webp`,
          `${IMG}/IMG_2907-1781178787191-1788784651275.webp`,
          `${IMG}/IMG_2907-1781178787191-1788784651275.webp`,
          `${IMG}/IMG_2907-1781178787191-1788784651275.webp`,
        ],
        beforeImage: `${IMG}/IMG_2913-1781178811793-1788784655493.webp`,
        afterImage: `${IMG}/IMG_2907-1781178787191-1788784651275.webp`,
      },
    ],
  },
  {
    id: "heat-pumps",
    bannerImage: `${IMG}/IMG_2922-1781178849941-1788784658154.webp`,
    items: [
      {
        id: "house-kobierzyce",
        mainImage: `${IMG}/IMG_2922-1781178849941-1788784658154.webp`,
        thumbnails: [
          `${IMG}/IMG_2886-1781178758410-1788784661183.webp`,
          `${IMG}/IMG_2913-1781178811793-1788784655493.webp`,
          `${IMG}/IMG_2907-1781178787191-1788784651275.webp`,
        ],
        beforeImage: `${IMG}/IMG_2886-1781178758410-1788784661183.webp`,
        afterImage: `${IMG}/IMG_2922-1781178849941-1788784658154.webp`,
      },
    ],
  },
];

export function getRealizationGroup(id: string) {
  return REALIZATION_GROUPS.find((g) => g.id === id);
}
