export interface ProductFeature {
  title: string;
  icon: string;
}

export interface Product {
  id: string;
  image: string;
  category: string;
  name: string;
  description: string;
  price: string;
  features?: ProductFeature[];
}

export interface ProductPageProps {
  heroTitle: string;
  heroSubtitle: string;
  productsTitle: string;
  productsSubtitle: string;
  products: Product[];
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


