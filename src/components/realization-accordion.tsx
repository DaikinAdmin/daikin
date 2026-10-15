"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Coins,
  Home,
  Leaf,
  MapPin,
  Settings,
  Snowflake,
  Sparkles,
  Volume2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "@/i18n/navigation";
import type { RealizationItemConfig } from "@/data/realizations";

const MAX_THUMBS = 3;
const FEATURE_ICONS = [Snowflake, Leaf, Volume2, Sparkles];

interface RealizationGalleryProps {
  title: string;
  afterLabel: string;
  images: string[];
}

function RealizationGallery({ title, afterLabel, images }: RealizationGalleryProps) {
  const [index, setIndex] = useState(-1);
  const [main, ...allThumbs] = images;
  const thumbs = allThumbs.slice(0, MAX_THUMBS);
  const hiddenCount = allThumbs.length - MAX_THUMBS;

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setIndex(0)}
        aria-label={title}
        className="relative aspect-[4/3] lg:aspect-auto lg:flex-1 lg:min-h-[280px] cursor-zoom-in"
      >
        <span className="absolute top-3 left-3 z-10 rounded-sm bg-primary px-3 py-1 text-xs font-semibold uppercase text-white">
          {afterLabel}
        </span>
        <Image
          src={main}
          alt={title}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover rounded-sm"
        />
      </button>
      <div className="grid grid-cols-3 gap-3">
        {thumbs.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setIndex(i + 1)}
            aria-label={`${title} ${i + 1}`}
            className="relative cursor-zoom-in"
          >
            <Image
              src={src}
              alt={`${title} ${i + 1}`}
              width={300}
              height={225}
              className="w-full h-auto aspect-[4/3] object-cover rounded-sm"
            />
            {hiddenCount > 0 && i === thumbs.length - 1 && (
              <span className="absolute inset-0 flex items-center justify-center rounded-sm bg-black/60 text-xl font-semibold text-white">
                +{hiddenCount}
              </span>
            )}
          </button>
        ))}
      </div>
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={images.map((src, i) => ({ src, alt: `${title} ${i + 1}` }))}
        plugins={[Thumbnails, Zoom]}
      />
    </div>
  );
}

interface RealizationAccordionProps {
  groupId: string;
  items: RealizationItemConfig[];
}

export function RealizationAccordion({ groupId, items }: RealizationAccordionProps) {
  const t = useTranslations("realizations");

  return (
    <Accordion
      type="single"
      collapsible
      className="flex flex-col gap-4"
    >
      {items.map((item) => {
        const base = `groups.${groupId}.items.${item.id}`;
        const hasCost = t.has(`${base}.cost.title`);
        const hasFeatures = t.has(`${base}.features`);
        const solutionList = t.raw(`${base}.solution.list`) as string[];
        const includes = hasCost ? (t.raw(`${base}.cost.includes`) as string[]) : [];
        const features = hasFeatures
          ? (t.raw(`${base}.features`) as { title: string; text: string }[])
          : [];

        return (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="border rounded-sm bg-white overflow-hidden"
          >
            <AccordionTrigger className="px-4 sm:px-6 py-5 text-left hover:no-underline gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {t(`${base}.tag`)}
                </span>
                <span className="text-h3-mobile lg:text-h3 leading-snug text-black">
                  {t(`${base}.title`)}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-500 font-normal">
                  <MapPin className="h-4 w-4 text-primary" />
                  {t(`${base}.location`)}
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 sm:px-6 pb-6">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Opis */}
                <div className="flex flex-col gap-6">
                  <div className="flex gap-4">
                    <Home className="h-8 w-8 shrink-0 text-primary" />
                    <div>
                      <h3 className="text-h3-mobile lg:text-h3 text-black mb-1">
                        {t(`${base}.building.title`)}
                      </h3>
                      <p className="text-main-text-mobile lg:text-main-text text-gray-600">{t(`${base}.building.text`)}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Settings className="h-8 w-8 shrink-0 text-primary" />
                    <div>
                      <h3 className="text-h3-mobile lg:text-h3 text-black mb-1">
                        {t(`${base}.solution.title`)}
                      </h3>
                      <p className="text-main-text-mobile lg:text-main-text text-gray-600 mb-2">{t(`${base}.solution.text`)}</p>
                      <ul className="text-main-text-mobile lg:text-main-text text-gray-600 list-disc pl-5 space-y-1">
                        {solutionList.map((entry) => (
                          <li key={entry}>{entry}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {hasCost && (
                    <div className="flex gap-4">
                      <Coins className="h-8 w-8 shrink-0 text-primary" />
                      <div>
                        <h3 className="text-sm lg:text-base text-black">
                          {t(`${base}.cost.title`)}
                        </h3>
                        <p className="font-medium text-lg lg:text-2xl text-black mb-2">
                          {t(`${base}.cost.price`)}
                        </p>
                        <p className="text-main-text-mobile lg:text-main-text text-black mb-1">
                          {t(`${base}.cost.includesTitle`)}
                        </p>
                        <ul className="text-main-text-mobile lg:text-main-text text-amm list-disc pl-5 space-y-1">
                          {includes.map((entry) => (
                            <li key={entry}>{entry}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Zdjęcia */}
                <RealizationGallery
                  title={t(`${base}.title`)}
                  afterLabel={t("booklet.after")}
                  images={[item.mainImage, ...item.thumbnails]}
                />
              </div>

              {/* Przed / Po */}
              <div className="grid gap-4 sm:grid-cols-2 mt-8">
                {[
                  { src: item.beforeImage, label: t("booklet.before"), dark: true },
                  { src: item.afterImage, label: t("booklet.after"), dark: false },
                ].map(({ src, label, dark }) => (
                  <div key={label} className="relative">
                    <span
                      className={`absolute top-3 left-3 z-10 rounded-sm px-3 py-1 text-xs font-semibold uppercase text-white ${
                        dark ? "bg-gray-700" : "bg-primary"
                      }`}
                    >
                      {label}
                    </span>
                    <Image
                      src={src}
                      alt={`${label} – ${t(`${base}.title`)}`}
                      width={800}
                      height={450}
                      className="w-full h-auto aspect-video object-cover rounded-sm"
                    />
                  </div>
                ))}
              </div>

              {/* Zalety */}
              {hasFeatures && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8 rounded-lg bg-blue-50/60 p-6">
                  {features.map((feature, i) => {
                    const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                    return (
                      <div key={feature.title} className="flex gap-3">
                        <Icon className="h-7 w-7 shrink-0 text-primary" />
                        <div>
                          <h4 className="font-semibold text-sm text-amm">{feature.title}</h4>
                          <p className="text-xs text-gray-600">{feature.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Akcje */}
              <div className="flex flex-wrap items-center justify-end gap-4 mt-8">
                <Link
                  href="/?visit=1"
                  className="flex items-right gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  {t("booklet.contact")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
