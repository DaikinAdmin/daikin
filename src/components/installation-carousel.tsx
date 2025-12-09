"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "./ui/arrows";

const installCategories = [
  "residential",
  "commercial",
  "industrial",
  "specialized",
];

const categoryImages: Record<string, string> = {
  residential: "https://daikinkobierzyce.pl/api/images/installation/Systeme_mieszkaniowe-1765204029926.jpg",
  commercial: "https://daikinkobierzyce.pl/api/images/installation/Rozwiązanie_komercyjne-1765204217900.jpg",
  industrial: "https://daikinkobierzyce.pl/api/images/installation/Zastosowania_przemyslowe-1765204105408.jpg",
  specialized: "https://daikinkobierzyce.pl/api/images/installation/Systemy_specjalistyczne-1765204111296.jpg",
};

export default function InstallationCarousel() {
  const t = useTranslations("services.installation.whatWeInstall");
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <div className="relative">
      {/* ---- arrows positioned relative to image height ---- */}
      <button
        onClick={scrollPrev}
        className="absolute left-1 top-[225px] -translate-y-1/2 z-20 p-2"
      >
        <ArrowLeft />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-1 top-[225px] -translate-y-1/2 z-20 p-2"
      >
        <ArrowRight />
      </button>

      {/* ---- carousel ---- */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {installCategories.map((category) => (
            <div
              key={category}
              className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33%] min-w-0"
            >
              <div className="flex flex-col h-full">
                <div className="relative h-[450px] w-full mb-6 overflow-hidden">
                  <Image
                    src={categoryImages[category]}
                    alt={t(`categories.${category}.title`)}
                    fill
                    className="object-cover transition-transform duration-500"
                  />
                </div>

                <h3 className="text-h3 mb-4 font-medium">
                  {t(`categories.${category}.title`)}
                </h3>

                <ul className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                      <span className="text-main-text text-amm">
                        {t(`categories.${category}.items.${item}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
