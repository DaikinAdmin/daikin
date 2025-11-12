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