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
  const t = useTranslations("productPage");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/products?categorySlug=${categorySlug}&locale=${locale}`
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
        heroTitle={t(`${categorySlug}.hero.title`)}
        heroSubtitle={t(`${categorySlug}.hero.subtitle`)}
        productsTitle={t(`${categorySlug}.products.title`)}
        productsSubtitle={t(`${categorySlug}.products.subtitle`)}
        products={products}
        categorySlug={categorySlug}
      />
      <WhyChooseSection
        title={t(`${categorySlug}.whyChoose.title`)}
        subtitle={t(`${categorySlug}.whyChoose.subtitle`)}
        leftItem={{
          id: "left1",
          image: "/whychoose_1.png",
          title: t(`${categorySlug}.whyChoose.left1.title`),
          description:
            t(`${categorySlug}.whyChoose.left1.description`),
        }}
        rightItems={[
          {
            id: "right1",
            image: "/whychoose_2.png",
            title: t(`${categorySlug}.whyChoose.right1.title`),
            description:
              t(`${categorySlug}.whyChoose.right1.description`),
          },
          {
            id: "right2",
            image: "/whychoose_3.png",
            title: t(`${categorySlug}.whyChoose.right2.title`),
            description:
              t(`${categorySlug}.whyChoose.right2.description`),
          },
        ]}
      />
      <Footer />
    </>
  );
}
