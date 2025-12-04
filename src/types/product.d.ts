// export interface ProductFeature {
//   title: string;
//   icon: string;
// }

// export interface Product {
//   id: string;
//   image: string;
//   category: string;
//   name: string;
//   description: string;
//   price: string;
//   features?: ProductFeature[];
// }

export interface ProductPageProps {
  heroTitle: string;
  heroSubtitle: string;
  productsTitle: string;
  productsSubtitle: string;
  products: Product[];
  categorySlug: string
  children?: ReactNode;
}

export interface WhyChooseItem {
  id: string;
  image: string;
  title: string;
  description: string;
}

interface CardCarouselItem {
  img: string;
  title: string;
  subtitle: string;
}

interface EmblaCardCarouselProps {
  items: Item[];
  loop?: boolean;
  duration?: number;
}

export interface WhyChooseProps {
  title: string;
  subtitle: string;
  leftItem: WhyChooseItem;
  rightItems: WhyChooseItem[];
}


interface Product {
  id: string;
  price: number;
  articleId: string;
  categorySlug: string;
  slug: string;
  energyClass: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  productDetails: ProductDetail[];
  category: Category;
  features: Feature[];
  specs: Spec[];
  img: Img[];
  items: Item[];
}

interface Item {
  id: string;
  productSlug: string;
  title: string;
  slug: string;
  img: string;
  isActive: boolean;
  lookupItemId: null | null | string;
  productItemDetails: ProductItemDetail[];
  lookupItem: LookupItem | null | null;
}

interface LookupItem {
  id: string;
  title: string;
  slug: string;
  img: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lookupItemDetails: LookupItemDetail[];
}

interface LookupItemDetail {
  id: string;
  lookupItemId: string;
  locale: string;
  title: string;
  subtitle: string;
  isActive: boolean;
}

interface ProductItemDetail {
  id: string;
  productItemId: string;
  locale: string;
  title: string;
  subtitle: null | string;
  isActive: boolean;
}

interface Img {
  id: string;
  productSlug: string;
  color: string;
  imgs: string[];
}

interface Spec {
  id: string;
  productSlug: string;
  locale: string;
  title: string;
  subtitle: string;
}

interface Feature {
  id: string;
  name: string;
  slug: string;
  img: string | null;
  isActive: boolean;
  preview: boolean;
  createdAt: string;
  updatedAt: string;
  featureDetails: FeatureDetail[];
}

interface FeatureDetail {
  id: string;
  featureId: string;
  locale: string;
  name: string;
  desc: null | string;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  categoryDetails: CategoryDetail[];
}

interface CategoryDetail {
  id: string;
  categorySlug: string;
  locale: string;
  name: string;
  isActive: boolean;
}

interface ProductDetail {
  id: string;
  productSlug: string;
  locale: string;
  name: string;
  title: string;
  subtitle: string;
}