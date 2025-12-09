import Footer from "@/components/footer";
import Header from "@/components/header";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { motion } from "framer-motion";
import { WhyChooseGrid } from "@/components/why-choose-grid";

export default function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("about");

  const whyChooseItems = [
    { key: "craftsmanship", img: "https://daikinkobierzyce.pl/api/images/about-us/Perfekcja_wykonania-1765200955251.jpg" },
    { key: "partnership", img: "https://daikinkobierzyce.pl/api/images/about-us/Partnerskie_podejscie-1765201386744.jpg" },
    { key: "responsibility", img: "https://daikinkobierzyce.pl/api/images/about-us/odpowiedzialnosc_za_kazdy_etap-1765202132579.jpg" },
    { key: "development", img: "https://daikinkobierzyce.pl/api/images/about-us/ciagly_rozwoj_i_certyfikacja-1765200585193.jpg" },
  ];

  const columnVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i, duration: 0.8, ease: "easeOut" },
    }),
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero + Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-14 items-center">
          {/* Row 1: image left, text right */}
          <FadeIn className="relative w-full h-72 md:h-96 overflow-hidden order-1">
            <Image
              src="https://daikinkobierzyce.pl/api/images/about-us/O nas-1765198703761.jpg"
              alt="Daikin installation"
              fill
              className="object-cover"
            />
          </FadeIn>

          <FadeIn delay={200} className="space-y-2 md:space-y-2 order-2">
            <h1 className="text-h1-mobile md:text-h1 text-left">
              {t("intro.aboutUs.title")}
            </h1>
            <p className="text-main-text-mobile md:text-main-text text-amm text-left">
              {t("intro.aboutUs.subtitle")}
            </p>
          </FadeIn>
        </div>

        {/* Stats Icons Row */}
        <section className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <FadeIn delay={100} className="flex flex-col items-center gap-4">
              <div className="rounded-full flex items-center justify-center">
                <Image
                  src="/icons/hugeicons_chatting-01.svg"
                  alt="Icon"
                  width={120}
                  height={120}
                />
              </div>
              <div>
                <h3 className="text-h1-mobile md:text-h1">
                  {t("stats.items.2.title")}
                </h3>
                <p className="text-main-text-mobile md:text-main-text text-amm">
                  {t("stats.items.2.subtitle")}
                </p>
              </div>
            </FadeIn>

            <FadeIn className="flex flex-col items-center gap-4 mx-4">
              <div className="rounded-full flex items-center justify-center">
                <Image
                  src="/icons/hugeicons_chatting-01-1.svg"
                  alt="Icon"
                  width={120}
                  height={120}
                />
              </div>
              <div>
                <h3 className="text-h1-mobile md:text-h1">
                  {t("stats.items.1.title")}
                </h3>
                <p className="text-main-text-mobile md:text-main-text text-amm">
                  {t("stats.items.1.subtitle")}
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={200} className="flex flex-col items-center gap-4">
              <div className="rounded-full flex items-center justify-center">
                <Image
                  src="/icons/hugeicons_chatting-01-2.svg"
                  alt="Icon"
                  width={120}
                  height={120}
                />
              </div>
              <div>
                <h3 className="text-h1-mobile md:text-h1">
                  {t("stats.items.3.title")}
                </h3>
                <p className="text-main-text-mobile md:text-main-text text-amm">
                  {t("stats.items.3.subtitle")}
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={300} className="flex flex-col items-center gap-4">
              <div className="rounded-full flex items-center justify-center">
                <Image
                  src="/icons/hugeicons_chatting-01-3.svg"
                  alt="Icon"
                  width={120}
                  height={120}
                />
              </div>
              <div>
                <h3 className="text-h1-mobile md:text-h1">
                  {t("stats.items.4.title")}
                </h3>
                <p className="text-main-text-mobile md:text-main-text text-amm">
                  {t("stats.items.4.subtitle")}
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Row 2: text left, image right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-14 items-center">
          <FadeIn delay={200} className="space-y-2 md:space-y-2 order-4 md:order-3 md:px-0">
            <h2 className="text-h2-mobile md:text-h2 text-left">
              {t("intro.daikin.title")}
            </h2>
            <p className="text-main-text-mobile md:text-main-text text-amm text-left">
              {t("intro.daikin.subtitle")}
            </p>
          </FadeIn>

          <FadeIn className="relative w-full h-72 md:h-96 overflow-hidden order-3 md:order-4">
            <Image
              src="https://daikinkobierzyce.pl/api/images/about-us/Daikin-1765198718132.jpg"
              alt="Daikin service"
              fill
              className="object-cover"
            />
          </FadeIn>
        </div>
      </section>

      <WhyChooseGrid items={whyChooseItems} namespace="about" />

      <section className="w-full">
        <FadeIn delay={200} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* Title */}
          <h2 className="text-h1-mobile md:text-h1">{t("application.title")}</h2>
          <p className="text-subtitle-mobile md:text-subtitle text-amm mb-10">
            {t("application.subtitle")}
          </p>
 
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left column */}
            <div className="flex flex-col gap-8 md:gap-28 self-end md:pb-10 order-2 lg:order-1">
              <FadeIn delay={200}>
                <h3 className="text-h3-mobile md:text-h3 mb-3 text-left lg:text-left">
                  {t("application.items.1.title")}
                </h3>
                <p className="text-main-text-mobile md:text-main-text text-amm text-left lg:text-left">
                  {t("application.items.1.description")}
                </p>
              </FadeIn>

              <FadeIn delay={200}>
                <h3 className="text-h3-mobile md:text-h3 mb-3 text-left lg:text-left">
                  {t("application.items.2.title")}
                </h3>
                <p className="text-main-text-mobile md:text-main-text text-amm text-left lg:text-left">
                  {t("application.items.2.description")}
                </p>
              </FadeIn>
            </div>

            {/* Center phone image */}
            <div className="flex justify-center order-1 lg:order-2">
              <div className="relative w-[300px] h-[600px]">
                <Image
                  src="https://daikinkobierzyce.pl/api/images/about-us/Onecta-1765198753714.png"
                  alt="Onecta App"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-8 md:gap-28 self-start md:pt-10 order-3 lg:order-3">
              <FadeIn delay={200}>
                <h3 className="text-h3-mobile md:text-h3 mb-3 text-left lg:text-right">
                  {t("application.items.3.title")}
                </h3>
                <p className="text-main-text-mobile md:text-main-text text-amm text-left lg:text-right">
                  {t("application.items.3.description")}
                </p>
              </FadeIn>

              <FadeIn delay={200}>
                <h3 className="text-h3-mobile md:text-h3 mb-3 text-left lg:text-right">
                  {t("application.items.4.title")}
                </h3>
                <p className="text-main-text-mobile md:text-main-text text-amm text-left lg:text-right">
                  {t("application.items.4.description")}
                </p>
              </FadeIn>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Bottom full-width image (intrinsic height, not constrained) */}
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="relative w-full overflow-hidden mx-auto">
            <Image
              src="https://daikinkobierzyce.pl/api/images/about-us/Dobrze miec wybor-1765198739628.png"
              alt="Daikin systems"
              width={1920}
              height={1080}
              className="w-full h-auto object-cover"
              priority
            />
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
