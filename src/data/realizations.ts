// Konfiguracja realizacji – teksty znajdują się w messages (namespace "realizations.groups.<groupId>.items.<itemId>")
export interface RealizationItemConfig {
  id: string;
  mainImage: string;
  thumbnails: string[];
  beforeImage?: string;
  afterImage?: string;
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
        // TODO: podmienić na zdjęcia z realizacji na poddaszu
        id: "attic-perfera",
        mainImage: `/realizations/1/IMG_0240.webp`,
        thumbnails: [
          `/realizations/1/IMG_0241.webp`,
          `/realizations/1/IMG_0242.webp`,
          `/realizations/1/IMG_0243.webp`,
        ],
      },
      {
        // TODO: podmienić na zdjęcia z montażu z podnośnikiem
        id: "perfera-lift",
        mainImage: `/realizations/2/IMG_8388.webp`,
        thumbnails: [
          `/realizations/2/IMG_8335.webp`,
          `/realizations/2/IMG_8395.webp`,
        ],
      },
      {
        // TODO: podmienić na zdjęcia z realizacji Multi Split
        id: "multi-split",
        mainImage: `/realizations/3/IMG_6296.webp`,
        thumbnails: [
          `/realizations/3/IMG_6191.webp`,
          `/realizations/3/IMG_6148.webp`
        ],
      },
    ],
  },
  // {
  //   id: "heat-pumps",
  //   bannerImage: `${IMG}/IMG_2922-1781178849941-1788784658154.webp`,
  //   items: [
  //     {
  //       id: "house-kobierzyce",
  //       mainImage: `${IMG}/IMG_2922-1781178849941-1788784658154.webp`,
  //       thumbnails: [
  //         `${IMG}/IMG_2886-1781178758410-1788784661183.webp`,
  //         `${IMG}/IMG_2913-1781178811793-1788784655493.webp`,
  //         `${IMG}/IMG_2907-1781178787191-1788784651275.webp`,
  //       ],
  //       beforeImage: `${IMG}/IMG_2886-1781178758410-1788784661183.webp`,
  //       afterImage: `${IMG}/IMG_2922-1781178849941-1788784658154.webp`,
  //     },
  //   ],
  // },
];

export function getRealizationGroup(id: string) {
  return REALIZATION_GROUPS.find((g) => g.id === id);
}
