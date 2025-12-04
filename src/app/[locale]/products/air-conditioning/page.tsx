"use client";

import { useTranslations } from "next-intl";
import { use, useState, useEffect } from "react";
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
  const t = useTranslations("airConditioning");

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/products?categorySlug=air-conditioning&locale=${locale}`
        );
        if (response.ok) {
          const data = await response.json();
          const mappedProducts = data.map((product: any) => {
            const translation = product.productDetails?.[0];
            const categoryTranslation = product.category?.categoryDetails?.[0];
            const firstImage = product.img?.[0];

            return {
              id: product.slug || product.id,
              image: firstImage?.imgs?.[0],
              category:
                categoryTranslation?.name,
              categorySlug: product.category?.slug,
              name: translation?.name,
              description: translation?.title,
              price: product.price ? `${product.price} PLN` : "",
              features:
                product.features?.slice(0, 3).map((feature: any) => {
                  const featureTranslation = feature.featureDetails?.[0];
                  return {
                    title: featureTranslation?.name || feature.name,
                    icon: feature.img || "mdi:check-circle",
                  };
                }) || [],
            };
          });
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [locale]);

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
        title={t("whyChoose.title")}
        subtitle={t("whyChoose.subtitle")}
        leftItem={{
          id: "left1",
          image: "/whychoose_1.png",
          title: t("whyChoose.left1.title"),
          description:
            t("whyChoose.left1.description"),
        }}
        rightItems={[
          {
            id: "right1",
            image: "/whychoose_2.png",
            title: t("whyChoose.right1.title"),
            description:
              t("whyChoose.right1.description"),
          },
          {
            id: "right2",
            image: "/whychoose_3.png",
            title: t("whyChoose.right2.title"),
            description:
              t("whyChoose.right2.description"),
          },
        ]}
      />
      <Footer />
    </>
  );
}
