export interface ProductFeature {
  title: string;
  icon: string;
}

export interface ProductPreview {
  id: string;
  slug?: string;
  categorySlug: string;
  image: string;
  category: string;
  name: string;
  description: string;
  price: string;
  features?: ProductFeature[];
}
interface ProductDetail {
  id: string;
  productSlug: string;
  locale: string;
  name: string;
  title: string;
  subtitle: string;
}

interface FeatureDetail {
  id: string;
  featureId: string;
  locale: string;
  name: string;
  desc: string;
  isActive: boolean;
}

interface Feature {
  id: string;
  name: string;
  slug: string;
  img: string;
  isActive: boolean;
  preview: boolean;
  featureDetails: FeatureDetail[];
}

interface Spec {
  id: string;
  productSlug: string;
  locale: string;
  title: string;
  subtitle: string;
}

interface ProductImage {
  id: string;
  productSlug: string;
  color: string;
  imgs: string[];
}

interface ProductItemDetail {
  id: string;
  productItemId: string;
  locale: string;
  title: string;
  subtitle: string;
  isActive: boolean;
}

interface ProductItem {
  id: string;
  productSlug: string;
  title: string;
  slug: string;
  img: string;
  isActive: boolean;
  productItemDetails: ProductItemDetail[];
}

interface Product {
  images: ProductImage[];
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
  features: Feature[];
  specs: Spec[];
  img: ProductImage[];
  items: ProductItem[];
}

export interface ProductPageProps {
  heroTitle: string;
  heroSubtitle: string;
  productsTitle: string;
  productsSubtitle: string;
  products: ProductPreview[];
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
  items: CardCarouselItem[];
  loop?: boolean;
  duration?: number;
}

export interface WhyChooseProps {
  title: string;
  subtitle: string;
  leftItem: WhyChooseItem;
  rightItems: WhyChooseItem[];
}


