"use client";

import { useState } from "react";
import Image from "next/image";
import { FadeIn } from "@/components/fade-in";

export interface RealizationPhoto {
  id: string;
  src: string;
  alt?: string;
}

interface RealizationsGalleryProps {
  photos: RealizationPhoto[];
}

export function RealizationsGallery({ photos }: RealizationsGalleryProps) {
  const [activePhoto, setActivePhoto] = useState<RealizationPhoto | null>(null);

  const leftPhotos = photos.filter((_, i) => i % 2 === 0);
  const rightPhotos = photos.filter((_, i) => i % 2 !== 0);

  return (
    <>
      <div className="hidden sm:grid sm:grid-cols-2 gap-4 md:gap-12 items-start">
        {/* Left column */}
        <div className="flex flex-col gap-4 md:gap-12">
          {leftPhotos.map((photo, index) => (
            <FadeIn key={photo.id} delay={index * 80}>
              <button
                onClick={() => setActivePhoto(photo)}
                className="block w-full overflow-hidden group cursor-zoom-in"
                aria-label={photo.alt ?? photo.id}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt ?? photo.id}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover aspect-[4/3] transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            </FadeIn>
          ))}
        </div>

        {/* Right column — offset down */}
        <div className="flex flex-col gap-4 md:gap-12 mt-16 md:mt-24">
          {rightPhotos.map((photo, index) => (
            <FadeIn key={photo.id} delay={index * 80 + 40}>
              <button
                onClick={() => setActivePhoto(photo)}
                className="block w-full overflow-hidden group cursor-zoom-in"
                aria-label={photo.alt ?? photo.id}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt ?? photo.id}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover aspect-[4/3] transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Mobile — single column */}
      <div className="flex flex-col gap-4 sm:hidden">
        {photos.map((photo, index) => (
          <FadeIn key={photo.id} delay={index * 60}>
            <button
              onClick={() => setActivePhoto(photo)}
              className="block w-full overflow-hidden rounded-sm group cursor-zoom-in"
              aria-label={photo.alt ?? photo.id}
            >
              <Image
                src={photo.src}
                alt={photo.alt ?? photo.id}
                width={800}
                height={600}
                className="w-full h-auto object-cover aspect-[4/3] transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          </FadeIn>
        ))}
      </div>

      {/* Lightbox */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute -top-10 right-0 text-white text-3xl leading-none hover:text-primary transition-colors"
              aria-label="Zamknij"
            >
              &times;
            </button>
            <Image
              src={activePhoto.src}
              alt={activePhoto.alt ?? activePhoto.id}
              width={1400}
              height={1050}
              className="object-contain w-full h-auto max-h-[85vh] rounded-sm"
            />
          </div>
        </div>
      )}
    </>
  );
}
