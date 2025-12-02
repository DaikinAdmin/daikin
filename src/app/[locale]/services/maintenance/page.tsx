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

export default function MaintenancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("services.maintenance");

  // Warning signs 1-6
  const signs = ["1", "2", "3", "4", "5", "6"];

  const signItems = signs.map((sign, index) => ({
    type: "photo",
    title: t(`warningSigns.signs.${sign}.title`),
    subtitle: t(`warningSigns.signs.${sign}.description`),
    img: `/whychoose_${(index % 3) + 1}.png`,
  }));

  const ctaItem = {
    type: "cta",
    title: t("cta.title"),
    subtitle: t("cta.subtitle"),
    buttonText: t("cta.schedule"),
    link: "/contact",
  };

  // Construct grid: [CTA, Photo, Photo, Photo] and [Photo, Photo, Photo, CTA]
  // Left: CTA (hidden on mobile), Photo 1, Photo 3, Photo 5
  const leftColumnItems = [
    { ...ctaItem, className: "hidden md:flex" },
    signItems[0],
    signItems[2],
    signItems[4],
  ];

  // Right: Photo 2, Photo 4, Photo 6, CTA
  const rightColumnItems = [signItems[1], signItems[3], signItems[5], ctaItem];

  const renderItem = (item: any, index: number) => {
    if (item.type === "cta") {
      return (
        <FadeIn key={`cta-${index}`} className={cn("h-full", item.className)}>
          <div className="flex flex-col justify-start items-start h-full">
            <h3 className="text-h2-mobile lg:text-h2 mb-4">{item.title}</h3>
            <p className="text-subtitle-mobile lg:text-subtitle text-amm mb-8">
              {item.subtitle}
            </p>
            <Button
              className="px-12 py-4 md:px-20 md:py-2 rounded-full transition-colors font-medium"
              variant="accent"
              asChild
            >
              <Link href={item.link}>{item.buttonText}</Link>
            </Button>
          </div>
        </FadeIn>
      );
    } else {
      return (
        <FadeIn key={`photo-${index}`} delay={index * 100}>
          <div className="flex flex-col items-start">
            <div className="relative w-full h-[28rem] mb-6 overflow-hidden">
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-h3-mobile lg:text-h3 mb-2">{item.title}</h3>
            <p className="text-main-text-mobile lg:text-main-text text-amm">
              {item.subtitle}
            </p>
          </div>
        </FadeIn>
      );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto py-12 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto flex flex-col items-start">
            <FadeIn>
              <h1 className="text-h1-mobile md:text-h1 mb-4">
                {t("hero.title")}
              </h1>
            </FadeIn>
            <FadeIn delay={100}>
              <p className="w-full text-subtitle-mobile md:text-subtitle text-amm mb-8">
                {t("hero.subtitle")}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Grid Section */}
        <section className="w-full ">
          <div className="py-8 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
              {/* Left Column */}
              <div className="flex flex-col gap-8">
                {leftColumnItems.map((item, index) => renderItem(item, index))}
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-8">
                {rightColumnItems.map((item, index) => renderItem(item, index))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
