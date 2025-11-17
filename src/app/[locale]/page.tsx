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

      {/* Features Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#003D7A] mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#F5F8FF] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#003D7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#003D7A] mb-4">{t('features.efficiency.title')}</h3>
              <p className="text-gray-600">{t('features.efficiency.description')}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#F5F8FF] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#003D7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#003D7A] mb-4">{t('features.reliability.title')}</h3>
              <p className="text-gray-600">{t('features.reliability.description')}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#F5F8FF] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#003D7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#003D7A] mb-4">{t('features.smart.title')}</h3>
              <p className="text-gray-600">{t('features.smart.description')}</p>
            </div>
          </div>
        </div>
      </section> */}

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
