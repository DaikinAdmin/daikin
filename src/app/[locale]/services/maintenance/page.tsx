import Footer from "@/components/footer";
import Header from "@/components/header";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/fade-in";
import { WhyChooseGrid } from "@/components/why-choose-grid";

export default function MaintenancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("services.maintenance");

  const whyChooseItems = [
    { key: "specialistKnowledge", img: "https://daikinkobierzyce.pl/api/images/maintenance/Specjalistyczna_wiedza-1765205535225.jpg" },
    { key: "regularInspections", img: "https://daikinkobierzyce.pl/api/images/maintenance/Regularne_przeglady (2)-1765206731158.jpg" },
    { key: "modernization", img: "https://daikinkobierzyce.pl/api/images/maintenance/Modernizacja (3)-1765206675432.jpg" },
    { key: "partsAndRepairs", img: "https://daikinkobierzyce.pl/api/images/maintenance/Czesci_naprawy-1765206125871.jpg" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto py-7 md:py-10 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto flex flex-col items-start">
            <FadeIn>
              <h1 className="text-h1-mobile md:text-h1 mb-4">
                {t("hero.title")}
              </h1>
            </FadeIn>
            <FadeIn delay={100}>
              <p className="w-full text-subtitle-mobile md:text-subtitle text-amm">
                {t("hero.subtitle")}
              </p>
            </FadeIn>
          </div>
        </section>
        {/* Why Choose Us Section */}
        <WhyChooseGrid
          items={whyChooseItems}
          namespace="services.maintenance"
        />
      </main>

      <Footer />
    </div>
  );
}
