"use client";

import { useTranslations } from "next-intl";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductTemplatePage from "@/components/product-page";
import WhyChooseSection from "@/components/why-choose";
import { Product } from "@/types/product";
import { use, useEffect, useState } from "react";

export default function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string, categorySlug: string }>;
}) {
  const { locale, categorySlug } = use(params);
  const t = useTranslations("airConditioning");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products?categorySlug=${categorySlug}&locale=${locale}`
        );

        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, locale]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <p className="text-xl">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }


  return (
    <>
      <Header />
      <ProductTemplatePage
        heroTitle={t("hero.title")}
        heroSubtitle={t("hero.subtitle")}
        productsTitle={t("products.title")}
        productsSubtitle={t("products.subtitle")}
        products={products}
        categorySlug={categorySlug}
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
