export interface ProductItemTranslation {
  locale: string;
  title: string;
  subtitle: string;
  isActive: boolean;
}

export interface ProductItem {
  id?: string;
  title: string;
  slug: string;
  img: string;
  isActive: boolean;
  translations: ProductItemTranslation[];
}
