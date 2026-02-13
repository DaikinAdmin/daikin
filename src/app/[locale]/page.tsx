export const dynamic = 'force-dynamic';

import Footer from "@/components/footer";
import Header from "@/components/header";
import ProductCarousel from "@/components/product-carousel";
import { HeroCarousel } from "@/components/hero-carousel";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Button } from "@/components/ui/button";
import WhyChooseSection from "@/components/why-choose";
import type { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  
  return {
    title: "Strona Główna - Systemy Klimatyzacji i Pompy Ciepła Daikin",
    description: "Witamy w AMM Salon - Twoim zaufanym partnerze Daikin w Polsce. Oferujemy profesjonalne systemy klimatyzacji, pompy ciepła, oczyszczacze powietrza oraz pełen zakres usług instalacyjnych i serwisowych.",
    keywords: ['Daikin Polska', 'klimatyzacja domowa', 'pompy ciepła Daikin', 'systemy HVAC', 'klimatyzacja Wrocław', 'montaż klimatyzacji', 'oczyszczacze powietrza'],
    openGraph: {
      title: "Daikin Kobierzyce - Profesjonalne Systemy Klimatyzacji",
      description: "Oferujemy profesjonalne systemy klimatyzacji, pompy ciepła i oczyszczacze powietrza Daikin z pełnym zakresem usług instalacji i serwisu.",
      url: `https://daikinkobierzyce.pl/${locale}`,
      type: 'website',
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'pl': '/pl',
        'en': '/en',
        'uk': '/ua',
      },
    },
  };
}

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
