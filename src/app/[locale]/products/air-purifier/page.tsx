import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductTemplatePage from "@/components/product-page";
import WhyChooseSection from "@/components/why-choose";

export default function AirConditioningPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("airConditioning");
  const allProductsRaw = t.raw("products") as Record<string, any>;

  const products = Object.keys(allProductsRaw)
  .filter((key) => typeof allProductsRaw[key] === "object" && allProductsRaw[key].name)
  .map((id) => {
    const productData = allProductsRaw[id];
    return {
      id,
      image: productData.image,
      category: productData.category,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      features: Array.isArray(productData.features)
        ? (productData.features as { title: string; icon: string }[])
        : [],
    };
  });


  return (
    <>
      <Header />
      <ProductTemplatePage
        heroTitle={t("hero.title")}
        heroSubtitle={t("hero.subtitle")}
        productsTitle={t("products.title")}
        productsSubtitle={t("products.subtitle")}
        products={products}
      />
      <WhyChooseSection
                  title="Dlaczego warto wybrać"
                  subtitle="Poznaj nasze innowacyjne rozwiązania"
                  leftItem={{
                    id: "left1",
                    image: "/whychoose_1.png",
                    title: "Efektywność energetyczna",
                    description:
                      "Wiodące w branży oceny SEER i innowacyjna technologia inwertera dla maksymalnych oszczędności energii",
                  }}
                  rightItems={[
                    {
                      id: "right1",
                      image: "/whychoose_2.png",
                      title: "Inteligentna technologia",
                      description:
                        "Zaawansowane sterowanie i integracja IoT dla inteligentnego zarządzania komfortem.",
                    },
                    {
                      id: "right2",
                      image: "/whychoose_3.png",
                      title: "Niezawodność",
                      description:
                        "Sprawdzona wydajność z kompleksowymi gwarancjami i wyjątkową jakością wykonania.",
                    },
                  ]}
                />
      <Footer />
    </>
  );
}
