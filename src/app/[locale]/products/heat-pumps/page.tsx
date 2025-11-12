import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { Thermometer, Leaf, TrendingUp, Shield } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductTemplatePage from '@/components/product-page';

export default function HeatPumpsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('heatPumps');

  const iconMap = { Thermometer, Leaf, TrendingUp, Shield };
    
      // Creating product object
      function createProduct(id: string, iconName: string) {
        return {
          id,
          iconName,
          image: `/images/${id}.jpg`,
          category: t(`products.${id}.category`),
          name: t(`products.${id}.name`),
          description: t(`products.${id}.description`),
          price: t(`products.${id}.price`),
          features: Array.isArray(t.raw(`products.${id}.features`))
            ? (t.raw(`products.${id}.features`) as string[])
            : [],
        };
      }
    
      // Products
      const products = [
        createProduct("daikinFit", "Thermometer"),
        createProduct("altherma", "Leaf"),
        createProduct("althermaH", "TrendingUp"),
      ];
    
      // Features
      const benefits = [
        {
          id: "eco",
          iconName: "Leaf",
          title: t("benefits.eco.title"),
          description: t("benefits.eco.description"),
        },
        {
          id: "efficiency",
          iconName: "TrendingUp",
          title: t("benefits.efficiency.title"),
          description: t("benefits.efficiency.description"),
        },
        {
          id: "versatile",
          iconName: "Thermometer",
          title: t("benefits.versatile.title"),
          description: t("benefits.versatile.description"),
        },
        {
          id: "reliable",
          iconName: "Shield",
          title: t("benefits.reliable.title"),
          description: t("benefits.reliable.description"),
        },
      ];
    
      return (
        <>
          <Header />
          <ProductTemplatePage
            heroTitle={t("hero.title")}
            heroSubtitle={t("hero.subtitle")}
            productsTitle={t("products.title")}
            productsSubtitle={t("products.subtitle")}
            featuresTitle={t("benefits.title")}
            products={products}
            benefits={benefits}
            iconMap={iconMap}
          />
          <Footer />
        </>
      );
    }
