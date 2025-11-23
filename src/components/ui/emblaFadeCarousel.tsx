"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";
import { ArrowLeft, ArrowRight } from "@/components/ui/arrows";

interface EmblaFadeCarouselProps {
  images: string[];
  loop?: boolean;
  duration?: number;
}

export const EmblaFadeCarousel: React.FC<EmblaFadeCarouselProps> = ({
  images,
  loop = true,
  duration = 50,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop, duration, axis: "x" },
    [Fade()]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <div className="w-full aspect-square bg-gray-50 relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((src, index) => (
            <div key={index} className="flex-[0_0_100%] relative">
              <img src={src} className="w-full h-full object-cover" />
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

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === selectedIndex ? "bg-black" : "bg-gray-400"
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};
