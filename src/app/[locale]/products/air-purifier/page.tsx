import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { Wind, Shield, Leaf, Sparkles } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductTemplatePage from "@/components/product-page";

export default function AirPurifierPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('airPurifier');

  const iconMap = { Wind, Shield, Leaf, Sparkles };
  
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
      createProduct("mc55w", "Wind"),
      createProduct("mc70l", "Shield"),
      createProduct("mcz70w", "Sparkles"),
    ];
  
    // Features
    const benefits = [
      {
        id: "streamer",
        iconName: "Shield",
        title: t("technology.streamer.title"),
        description: t("technology.streamer.description"),
      },
      {
        id: "hepa",
        iconName: "Leaf",
        title: t("technology.hepa.title"),
        description: t("technology.hepa.description"),
      },
      {
        id: "humidifying",
        iconName: "Sparkles",
        title: t("technology.humidifying.title"),
        description: t("technology.humidifying.description"),
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
          featuresTitle={t("technology.title")}
          products={products}
          benefits={benefits}
          iconMap={iconMap}
        />
        <Footer />
      </>
    );
  }