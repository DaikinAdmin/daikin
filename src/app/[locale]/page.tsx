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
    </div>
  );
}
