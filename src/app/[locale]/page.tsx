export const dynamic = "force-dynamic";
import Footer from "@/components/footer";
import Header from "@/components/header";
import ProductCarousel from "@/components/product-carousel";
import { HeroCarousel } from "@/components/hero-carousel";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import WhyChooseSection from "@/components/why-choose";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    title:
      "Klimatyzacja Wrocław i Kobierzyce | Pompy Ciepła Daikin – Montaż i Serwis",
    description:
      "Profesjonalny montaż klimatyzacji, pomp ciepła oraz oczyszczaczy powietrza Daikin we Wrocławiu i Kobierzycach. Autoryzowany partner, szybka realizacja, serwis i doradztwo. Skontaktuj się z nami już dziś!",
    keywords: [
      "Daikin Wrocław",
      "klimatyzatory Wrocław",
      "pompy ciepła Wrocław",
      "pompy ciepła Kobierzyce",
      "klimatyzacja Polska",
      "montaż klimatyzacji Wrocław",
      "serwis klimatyzacji Wrocław",
      "klimatyzacja Kobierzyce",
      "oczyszczacze powietrza Daikin",
      "Daikin Kobierzyce",
      "HVAC Wrocław",
    ],
    openGraph: {
      title: "Klimatyzacja i Pompy Ciepła Daikin – Wrocław | AMM Salon",
      description:
        "Autoryzowany partner Daikin. Montaż i serwis klimatyzacji, pomp ciepła i oczyszczaczy powietrza we Wrocławiu i Kobierzycach.",
      url: `https://daikinkobierzyce.pl/pl`,
      type: "website",
    },
    alternates: {
      canonical: "https://daikinkobierzyce.pl/pl",
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
            description: t("whyChoose.right1.description"),
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
