import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Wind, Zap, Snowflake, Thermometer } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductTemplatePage from "@/components/product-page";

export default function AirConditioningPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("airConditioning");

  const iconMap = { Wind, Zap, Snowflake, Thermometer };

  // Creating product bject
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
    createProduct("aurora", "Wind"),
    createProduct("emura", "Snowflake"),
    createProduct("stylish", "Thermometer"),
    createProduct("perfera", "Zap"),
  ];

  // Features
  const benefits = [
    {
      id: "efficiency",
      iconName: "Zap",
      title: t("whyChoose.efficiency.title"),
      description: t("whyChoose.efficiency.description"),
    },
    {
      id: "comfort",
      iconName: "Snowflake",
      title: t("whyChoose.comfort.title"),
      description: t("whyChoose.comfort.description"),
    },
    {
      id: "air",
      iconName: "Wind",
      title: t("whyChoose.air.title"),
      description: t("whyChoose.air.description"),
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
        featuresTitle={t("whyChoose.title")}
        products={products}
        benefits={benefits}
        iconMap={iconMap}
      />
      <Footer />
    </>
  );
}
