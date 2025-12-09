"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCardCarouselProps } from "@/types/product";
import { ArrowLeft, ArrowRight } from "@/components/ui/arrows";

export const EmblaCardCarousel: React.FC<EmblaCardCarouselProps> = ({
  items,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    skipSnaps: false,
  });

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  return (
    <div className="relative w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-[0_0_80%] md:flex-[0_0_40%] flex flex-col transition-all duration-200"
            >
              <img
                src={item.img}
                className="w-full h-auto object-cover"
              />
              <span className="text-h2-mobile md:text-h2 mt-4 md:mt-6">{item.productItemDetails[0].title}</span>
              <span className="text-subtitle-mobile md:text-subtitle text-amm">{item.productItemDetails[0].subtitle}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        className="absolute left-3 top-1/2 -translate-y-1/2"
        onClick={scrollPrev}
      >
        <ArrowLeft />
      </button>
      <button
        className="absolute right-3 top-1/2 -translate-y-1/2"
        onClick={scrollNext}
      >
        <ArrowRight />
      </button>
    </div>
  );
};
