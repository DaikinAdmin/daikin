"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { Icon } from "@iconify-icon/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "@/components/ui/arrows";

type BannerSlide = {
  /** Translation key under `home.hero.banners` */
  key: string;
  imageDesktop: string;
  imageMobile: string;
  /** Where the banner image itself links to */
  href: string;
  ctaPrimaryHref: string;
  ctaSecondaryHref: string;
};

const SLIDES: BannerSlide[] = [
  {
    key: "heatpumpday",
    imageDesktop: "/banners/heatpumpday-desktop.webp",
    imageMobile: "/banners/heatpumpday-mobile.webp",
    href: "https://www.facebook.com/kobierzyce.daikin/posts/pfbid0i3SJcr2hMehruFJTyoaYHRNb5hK5x3rGYGFLT9wUxGTtXCDMfKT2mvK6HQBEduzkl",
    ctaPrimaryHref:
      "https://bsi.gs-net.pl/kalkulator_na_strone/kalkulator/2398",
    ctaSecondaryHref:
      "https://www.facebook.com/kobierzyce.daikin/posts/pfbid0i3SJcr2hMehruFJTyoaYHRNb5hK5x3rGYGFLT9wUxGTtXCDMfKT2mvK6HQBEduzkl",
  },
  {
    key: "cieploapp",
    imageDesktop: "/banners/cieploapp-desktop.webp",
    imageMobile: "/banners/cieploapp-mobile.webp",
    href: "https://ammproject.cieplo.app/",
    ctaPrimaryHref: "https://ammproject.cieplo.app/",
    ctaSecondaryHref:
      "https://www.facebook.com/share/p/1HVaJP8XV4/?mibextid=wwXIfr",
  },
];

const AUTOPLAY_DELAY = 7000;

// Responsive banner carousel (image + matching content under it)
export function HeroCarousel() {
  const t = useTranslations("home.hero.banners");

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 }, [
    Fade(),
    Autoplay({ delay: AUTOPLAY_DELAY, stopOnMouseEnter: true, stopOnInteraction: false }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const activeSlide = SLIDES[selectedIndex] ?? SLIDES[0];
  const hasMultipleSlides = SLIDES.length > 1;

  return (
    <section className="bg-white mb-8 md:mb-0">
      {/* Banner images (desktop/mobile) */}
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {SLIDES.map((slide, index) => (
              <div key={slide.key} className="flex-[0_0_100%] min-w-0">
                <Link
                  href={slide.href}
                  className="block w-full"
                  aria-hidden={index !== selectedIndex}
                  tabIndex={index !== selectedIndex ? -1 : undefined}
                >
                  <div className="w-full overflow-hidden md:aspect-[32/15] xl:aspect-auto xl:h-[37.5rem]">
                    <picture>
                      <source
                        media="(min-width: 768px)"
                        srcSet={slide.imageDesktop}
                      />
                      <img
                        src={slide.imageMobile}
                        alt={t(`${slide.key}.imageAlt`)}
                        className="block w-full h-auto md:h-full md:object-cover md:object-center"
                      />
                    </picture>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {hasMultipleSlides && (
          <>
            <button
              type="button"
              aria-label={t("prev")}
              className="hidden md:block absolute left-3 top-1/2 -translate-y-1/2"
              onClick={scrollPrev}
            >
              <ArrowLeft />
            </button>
            <button
              type="button"
              aria-label={t("next")}
              className="hidden md:block absolute right-3 top-1/2 -translate-y-1/2"
              onClick={scrollNext}
            >
              <ArrowRight />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {SLIDES.map((slide, index) => (
                <button
                  key={slide.key}
                  type="button"
                  aria-label={t("goToSlide", { number: index + 1 })}
                  aria-current={index === selectedIndex}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === selectedIndex ? "bg-primary" : "bg-white/70"
                  }`}
                  onClick={() => emblaApi?.scrollTo(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Banner content under image — follows the active slide */}
      <div
        key={activeSlide.key}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-4 grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-8 items-start animate-in fade-in duration-500"
      >
        <div>
          <h1 className="text-h2-mobile md:text-h2 text-black mb-2">
            {t(`${activeSlide.key}.title`)}
          </h1>
          {/* Primary CTA under title on desktop */}
          <div className="hidden md:block mt-4">
            <Button
              asChild
              className="px-8 py-4 rounded-full transition-colors font-medium w-full md:w-3/4 mt-4"
            >
              <Link href={activeSlide.ctaPrimaryHref}>
                {t(`${activeSlide.key}.ctaPrimary`)}
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:items-start">
          {/* Use shortDescription on mobile, full description on desktop */}
          <p className="hidden md:block text-main-text text-amm">
            {t(`${activeSlide.key}.description`)}
          </p>
          <p className="block md:hidden text-main-text-mobile text-amm">
            {t(`${activeSlide.key}.shortDescription`)}
          </p>
          <Link
            href={activeSlide.ctaSecondaryHref}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
          >
            <Icon icon="hugeicons:arrow-right-02" className="text-2xl" />
            {t(`${activeSlide.key}.ctaSecondary`)}
          </Link>
          {/* Primary CTA visible on mobile under description */}
          <Button
            asChild
            className="md:hidden px-8 py-4 rounded-full transition-colors font-medium w-full"
          >
            <Link href={activeSlide.ctaPrimaryHref}>
              {t(`${activeSlide.key}.ctaPrimary`)}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
