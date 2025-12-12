export const dynamic = 'force-dynamic';

import Footer from "@/components/footer";
import Header from "@/components/header";
import ProductCarousel from "@/components/product-carousel";
import { HeroCarousel } from "@/components/hero-carousel";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Button } from "@/components/ui/button";
import WhyChooseSection from "@/components/why-choose";

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("home");
  return (
    <div className="min-h-screen bg-white">
      <Header />

            {/* Hero Carousel Section */}
      <HeroCarousel />

      {/* Product Carousel */}
      <ProductCarousel />

      <WhyChooseSection
        title="Dlaczego Daikin?"
        subtitle="Liderujemy w branży dzięki innowacyjnej technologii i doskonałej wydajności"
        leftItem={{
          id: "left1",
          image: t("whyChoose.left1.image"),
          title: t("whyChoose.left1.title"),
          description: t("whyChoose.left1.description"),
        }}
        rightItems={[
          {
            id: "right1",
            image: t("whyChoose.right1.image"),
            title: t("whyChoose.right1.title"),
            description:t("whyChoose.right1.description"),
          },
          {
            id: "right2",
            image: t("whyChoose.right2.image"),
            title: t("whyChoose.right2.title"),
            description: t("whyChoose.right2.description"),
          },
        ]}
      />

      <Footer />
    </div>
  );
}
