import Footer from "@/components/footer";
import Header from "@/components/header";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/fade-in";

export default function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("about");

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero + Grid Section */}
      <section className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Row 1: image left, text right */}
          <FadeIn className="relative w-full h-72 md:h-96 overflow-hidden order-1">
            <Image
              src="/whychoose_1.png"
              alt="Daikin installation"
              fill
              className="object-cover"
            />
          </FadeIn>

          <FadeIn delay={200} className="space-y-4 order-2 px-4 md:px-0">
            <h1 className="text-h1-mobile md:text-h1 text-left">
              {t("intro.aboutUs.title")}
            </h1>
            <p className="text-subtitle-mobile md:text-subtitle text-amm text-left">
              {t("intro.aboutUs.subtitle")}
            </p>
          </FadeIn>

          {/* Row 2: text left, image right (mirrored) */}
          <FadeIn delay={200} className="space-y-4 order-4 md:order-3 px-4 md:px-0">
            <h2 className="text-h2-mobile md:text-h2 text-left">
              {t("intro.daikin.title")}
            </h2>
            <p className="text-subtitle-mobile md:text-subtitle text-amm text-left">
              {t("intro.daikin.subtitle")}
            </p>
          </FadeIn>

          <FadeIn className="relative w-full h-72 md:h-96 overflow-hidden order-3 md:order-4">
            <Image
              src="/whychoose_2.png"
              alt="Daikin service"
              fill
              className="object-cover"
            />
          </FadeIn>
        </div>
      </section>

      {/* Stats Icons Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:mt-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <FadeIn className="flex flex-col items-center gap-4 mx-4">
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
                {t("stats.items.1.title")}
              </h3>
              <p className="text-main-text-mobile md:text-main-text text-amm">
                {t("stats.items.1.subtitle")}
              </p>
            </div>
          </FadeIn>

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

          <FadeIn delay={200} className="flex flex-col items-center gap-4">
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
                src="/icons/hugeicons_chatting-01.svg"
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

      {/* Two-column content section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <FadeIn className="mb-10 text-left">
          <h2 className="text-h1-mobile md:text-h1">{t("section.title")}</h2>
          <p className="text-subtitle-mobile md:text-subtitle text-amm mt-2">
            {t("section.subtitle")}
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left column: two image cards stacked */}
          <div className="space-y-8">
            {/* Card 1 */}
            <FadeIn delay={100} className="flex flex-col gap-4">
              <div className="relative w-full h-72 md:h-96 overflow-hidden">
                <Image
                  src="/whychoose_1.png"
                  alt={t("intro.aboutUs.title")}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="px-2 md:px-0">
                <h3 className="text-h3-mobile md:text-h3 text-left">
                  {t("intro.aboutUs.title")}
                </h3>
                <p className="text-main-text-mobile md:text-main-text text-amm text-left mt-2">
                  {t("intro.aboutUs.subtitle")}
                </p>
              </div>
            </FadeIn>

            {/* Card 2 */}
            <FadeIn delay={200} className="flex flex-col gap-4">
              <div className="relative w-full h-72 md:h-96 overflow-hidden">
                <Image
                  src="/whychoose_2.png"
                  alt={t("intro.daikin.title")}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="px-2 md:px-0">
                <h3 className="text-h3-mobile md:text-h3 text-left">
                  {t("intro.daikin.title")}
                </h3>
                <p className="text-main-text-mobile md:text-main-text text-amm text-left mt-2">
                  {t("intro.daikin.subtitle")}
                </p>
              </div>
            </FadeIn>
          </div>

          {/* Right column: image + text + CTA */}
          <FadeIn delay={300} className="flex flex-col gap-6 lg:pl-8">
            <div className="relative w-full h-72 md:h-96 overflow-hidden">
              <Image
                src="/whychoose_3.png"
                alt={t("grid.item1.title")}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-h3-mobile md:text-h3 text-left">
                {t("grid.item1.title")}
              </h3>
              <p className="text-main-text-mobile md:text-main-text text-amm text-left mt-2">
                {t("grid.item1.subtitle")}
              </p>
            </div>

            {/* CTA section */}
            <div className="mt-4 flex flex-col items-start gap-4">
              <h4 className="text-h2-mobile md:text-h2 text-left">
                {t("cta.title")}
              </h4>
              <p className="text-subtitle-mobile md:text-subtitle text-amm text-left max-w-xl">
                {t("cta.subtitle")}
              </p>
              <Button
                className="px-12 py-4 md:px-20 md:py-2 rounded-full transition-colors font-medium"
                variant="accent"
                asChild
              >
                <Link href="/contact">{t("grid.cta.text")}</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Bottom full-width image */}
      <section className="w-full py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="relative w-full h-[300px] md:h-[450px] overflow-hidden mx-auto">
            <Image
              src="/whychoose_2.png"
              alt="Daikin systems"
              fill
              className="object-cover"
            />
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
