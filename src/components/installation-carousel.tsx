"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-autoplay";
import Image from "next/image";
import { useTranslations } from "next-intl";

const installCategories = ['residential', 'commercial', 'industrial', 'specialized'];

const categoryImages: Record<string, string> = {
  residential: "/whychoose_1.png",
  commercial: "/whychoose_2.png",
  industrial: "/whychoose_3.png",
  specialized: "/whychoose_1.png",
};

export default function InstallationCarousel() {
  const t = useTranslations('services.installation.whatWeInstall');
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    AutoScroll({ delay: 4000, stopOnInteraction: false }),
  ]);

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-6">
        {installCategories.map((category) => (
          <div key={category} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33%] min-w-0">
            <div className="flex flex-col h-full">
              <div className="relative h-[300px] w-full mb-6 overflow-hidden">
                <Image
                  src={categoryImages[category]}
                  alt={t(`categories.${category}.title`)}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
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
  );
}
