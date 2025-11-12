import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { Zap, Smartphone, Settings, Wind } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductTemplatePage from '@/components/product-page';

export default function OtherProductsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('otherProducts');

  const iconMap = { Zap, Smartphone, Settings, Wind };
      
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
          createProduct("thermostat", "Smartphone"),
          createProduct("vrv", "Wind"),
          createProduct("rebel", "Settings"),
          createProduct("accessories", "Zap"),
        ];
      
        // Features
        const benefits = [
          {
            id: "smart",
            iconName: "Smartphone",
            title: t("solutions.smart.title"),
            description: t("solutions.smart.description"),
          },
          {
            id: "commercial",
            iconName: "Wind",
            title: t("solutions.commercial.title"),
            description: t("solutions.commercial.description"),
          },
          {
            id: "accessories",
            iconName: "Settings",
            title: t("solutions.accessories.title"),
            description: t("solutions.accessories.description"),
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
              featuresTitle={t("solutions.title")}
              products={products}
              benefits={benefits}
              iconMap={iconMap}
            />
            <Footer />
          </>
        );
      }
