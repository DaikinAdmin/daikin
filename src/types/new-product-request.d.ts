export interface NewProductRequest {
  articleId: string;
  price: number;
  categorySlug: string;
  slug: string;
  energyClass: string;
  isActive: boolean;
  featureSlugs: string[];
  translations: ProductTranslationRequest[];
  specs: SpecRequest[];
  images: ImageRequest[];
  items: ItemRequest[];
}

export interface ItemRequest {
  title: string;
  slug: string;
  img: string;
  isActive: boolean;
  lookupItemId: string;
  translations: Translation2[];
}

export interface ItemTranslationRequest {
  locale: string;
  title: string;
  subtitle: string;
  isActive: boolean;
}

export interface ImageRequest {
  id: string;
  productSlug: string;
  color: string;
  imgs: string[];
}

export interface SpecRequest {
  id: string;
  locale: string;
  title: string;
  subtitle: string;
  productSlug: string;
}

export interface ProductTranslationRequest {
  locale: string;
  name: string;
  title: string;
  subtitle: string;
  productSlug: string;
  id: string;
}