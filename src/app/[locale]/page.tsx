import Footer from "@/components/footer";
import Header from "@/components/header";
import ProductCarousel from "@/components/product-carousel";
import { HeroCarousel } from "@/components/hero-carousel";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Button } from "@/components/ui/button";

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

      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-h1">{t("features.title")}</h2>
            <p className="text-subtitle mx-auto">{t("features.subtitle")}</p>
          </div>
          <div className="flex flex-col md:flex-row gap-12 items-start">
            {/* LEFT COLUMN — big image */}
            <div className="w-full md:w-[70%]">
              <img
                src="/whychoose_1.png"
                alt="Big image"
                className="w-full object-cover"
              />
              <p className="mt-3 text-h3">Efektywność energetyczna</p>
              <p className="mt-3 text-main-text">
                Wiodące w branży oceny SEER i innowacyjna technologia inwertera
                dla maksymalnych oszczędności energii
              </p>
            </div>

            {/* RIGHT COLUMN — two small images */}
            <div className="w-full md:w-[30%] flex flex-col gap-8">
              {/* Small Image 1 */}
              <div>
                <img
                  src="/whychoose_2.png"
                  alt="Small image 1"
                  className="w-full first-line:object-cover"
                />
                <p className="mt-3 text-h3">Inteligentna technologia</p>
                <p className="mt-4 text-main-text">
                  Zaawansowane sterowanie i integracja IoT dla inteligentnego
                  zarządzania komfortem.
                </p>
              </div>

              {/* Small Image 2 */}
              <div>
                <img
                  src="/whychoose_3.png"
                  alt="Small image 2"
                  className="w-full mt-6 object-cover"
                />
                <p className="mt-3 text-h3">Niezawodność</p>
                <p className="mt-4 text-main-text">
                  Sprawdzona wydajność z kompleksowymi gwarancjami i wyjątkową
                  jakością wykonania.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* TEXT LEFT */}
            <div className="md:text-left max-w-3xl">
              <h2 className="text-h1 mb-4">
                {t("cta.title")}
              </h2>
              <p className="text-subtitle opacity-90">{t("cta.subtitle")}</p>
            </div>

            {/* BUTTON RIGHT */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                    className="px-20 py-2 rounded-full transition-colors font-medium flex-1"
                    variant={"default"}
                  >
                    {t("cta.consultation")}
                  </Button>

              {/* <Link
                href="/dashboard"
                className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-[#003D7A] transition-colors font-semibold text-lg"
              >
                {t("cta.dashboard")}
              </Link> */}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
