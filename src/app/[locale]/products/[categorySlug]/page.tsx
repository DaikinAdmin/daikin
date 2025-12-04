import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductTemplatePage from "@/components/product-page";
import WhyChooseSection from "@/components/why-choose";
import { Product } from "@/types/product";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string, categorySlug: string }>;
}) {
  const { locale, categorySlug } = await params;
  setRequestLocale(locale);
  const t = useTranslations("airConditioning");

  // Fetch products from API
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products?categorySlug=${categorySlug}&locale=${locale}`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  
  const products = response.ok ? await response.json() as Product[] : [];


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
