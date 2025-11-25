"use client";

import { WhyChooseProps } from "@/types/product";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { ArrowLeft, ArrowRight } from "./ui/arrows";

export default function WhyChooseSection({
  title,
  subtitle,
  leftItem,
  rightItems,
}: WhyChooseProps) {
  const t = useTranslations("whyChoose");
  const [emblaRef, emblaApi] = useEmblaCarousel({align: "start" });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const allItems = [leftItem, ...rightItems];

  return (
    <div>
      {/* WHY CHOOSE Section */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-h1-mobile md:text-h1">{title}</h2>
            <p className="text-subtitle-mobile md:text-subtitle mx-auto">{subtitle}</p>
          </div>

          {/* Mobile Carousel */}
          <div className="block md:hidden relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-8">
                {allItems.map((item) => (
                  <div className="flex-[0_0_85%] min-w-0" key={item.id}>
                    <div className="flex flex-col h-full">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-96 object-cover"
                      />
                      <div className="mt-4 flex flex-col">
                        <p className="text-h3-mobile md:text-h3">{item.title}</p>
                        <p className="mt-2 text-main-text">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:flex flex-row gap-12 items-start">
            {/* LEFT COLUMN */}
            <div className="w-[70%] flex flex-col">
              <img
                src={leftItem.image}
                alt={leftItem.title}
                className="w-full object-cover"
              />
              <div className="mt-auto flex flex-col">
                <p className="mt-3 text-h3">{leftItem.title}</p>
                <p className="mt-3 text-main-text">{leftItem.description}</p>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-[30%] flex flex-col gap-8">
              {rightItems.map((item) => (
                <div key={item.id} className="flex flex-col h-full">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full object-cover"
                  />
                  <div className="mt-auto flex flex-col">
                    <p className="mt-3 text-h3">{item.title}</p>
                    <p className="mt-4 text-main-text">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section — статична */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:text-left flex-1">
              <h2 className="text-h2-mobile md:text-h1 mb-4">{t("cta.title")}</h2>
              <p className="text-main-text-mobile md:text-main-text opacity-90">{t("cta.subtitle")}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Button
                className="px-12 py-4 md:px-20 md:py-2 rounded-full transition-colors font-medium"
                variant="accent"
              >
                {t("cta.consultation")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
