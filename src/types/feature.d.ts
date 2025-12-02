export type Feature = {
  id: string;
  name: string;
  slug: string;
  img: string | null;
  isActive: boolean;
  preview?: boolean;
  createdAt: string;
  updatedAt: string;
  featureDetails: FeatureTranslation[];
  _count?: {
    products: number;
  };
};

export type FeatureTranslation = {
  locale: string;
  name: string;
  desc: string;
  isActive: boolean;
};