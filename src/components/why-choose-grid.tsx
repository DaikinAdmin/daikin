import { FadeIn } from "@/components/fade-in";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export interface WhyChooseItem {
  key: string;
  img: string;
}

interface WhyChooseGridProps {
  items: WhyChooseItem[];
  namespace: string;
  ctaLink?: string;
}

export function WhyChooseGrid({
  items,
  namespace,
  ctaLink = "/contact",
}: WhyChooseGridProps) {
  const t = useTranslations(namespace);

  const mappedItems = items.map((item) => ({
    type: "photo" as const,
    title: t(`whyChoose.reasons.${item.key}.title`),
    subtitle: t(`whyChoose.reasons.${item.key}.description`),
    img: item.img,
  }));

  const ctaItem = {
    type: "cta" as const,
    title: t("cta.title"),
    subtitle: t("cta.subtitle"),
    buttonText: t("cta.schedule"),
    link: ctaLink,
  };

  const evenItems = mappedItems.filter((_, i) => i % 2 === 0);
  const oddItems = mappedItems.filter((_, i) => i % 2 !== 0);

  // Left: Evens + CTA
  const leftItems = [
    ...evenItems,
    { ...ctaItem, className: "hidden md:flex" },
  ];

  // Right: CTA + Odds
  const rightItems = [
    { ...ctaItem, className: "hidden md:flex" },
    ...oddItems,
  ];

  const renderItem = (item: any, index: number) => {
    if (item.type === "cta") {
      return (
        <FadeIn key={`cta-${index}`} className={cn("h-full", item.className)}>
          <div className="flex flex-col justify-start items-start h-full mt-10 md:mt-0">
            <h3 className="text-h2-mobile lg:text-h2 mb-1">{item.title}</h3>
            <p className="text-subtitle-mobile lg:text-subtitle text-amm mb-6">
              {item.subtitle}
            </p>
            <Button
              className="px-12 py-4 md:px-20 md:py-2 rounded-full transition-colors font-medium w-full md:w-auto"
              variant="accent"
              asChild
            >
              <Link href={item.link || "#"}>{item.buttonText}</Link>
            </Button>
          </div>
        </FadeIn>
      );
    } else {
      return (
        <FadeIn key={`photo-${index}`} delay={index * 100}>
          <div className="flex flex-col items-start">
            <div className="relative w-full h-[25rem] mb-6 overflow-hidden">
              <Image
                src={item.img || ""}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-h2-mobile lg:text-h3 mb-2">{item.title}</h3>
            <p className="text-main-text-mobile lg:text-main-text text-amm">
              {item.subtitle}
            </p>
          </div>
        </FadeIn>
      );
    }
  };

  return (
    <section className="w-full bg-container py-10 md:py-[65px] md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-10">
          <FadeIn>
            <p className="text-h1-mobile lg:text-h1">
              {t("whyChoose.title")}
            </p>
            <p className="text-subtitle-mobile lg:text-subtitle text-amm mb-4">
              {t("whyChoose.subtitle")}
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
          {/* Left Column */}
          <div className="flex flex-col gap-14">
            {leftItems.map((item, index) => renderItem(item, index))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-14">
            {rightItems.map((item, index) => renderItem(item, index))}
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 md:hidden">
          {renderItem({ ...ctaItem, className: "w-full" }, 99)}
        </div>
      </div>
    </section>
  );
}
