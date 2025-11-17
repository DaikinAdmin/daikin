export interface Product {
  id: string;
  iconName: string;
  image: string;
  category: string;
  name: string;
  description: string;
  price: string;
  features?: string[];
}

export interface BenefitItem {
  id: string;
  iconName: string;
  title: string;
  description: string;
}

export interface ProductPageProps {
  heroTitle: string;
  heroSubtitle: string;
  productsTitle: string;
  productsSubtitle: string;
  featuresTitle: string;
  products: Product[];
  benefits: BenefitItem[];
  iconMap: Record<string, LucideIcon>;
  children?: ReactNode;
}

export interface WhyChooseItem {
  id: string;
  image: string;
  title: string;
  description: string;
}

export interface WhyChooseProps {
  title: string;
  subtitle: string;
  leftItem: WhyChooseItem;
  rightItems: WhyChooseItem[];
}
