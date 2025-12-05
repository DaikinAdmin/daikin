// app/[locale]/products/[categorySlug]/[productSlug]/ProductView.client.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Product, Feature, Spec, Item, Image } from "@/types/product";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import DaikinIcon from "@/components/daikin-icon";
import { EmblaFadeCarousel } from "@/components/ui/emblaFadeCarousel";
import { EmblaCardCarousel } from "@/components/ui/emblaCardCarousel";
import { Icon } from "@iconify-icon/react";
import { useColorLabel } from "@/utils/colors";
import {
  TabsUnderline,
  TabsUnderlineList,
  TabsUnderlineTrigger,
  TabsUnderlineContent,
} from "@/components/ui/tabs-underline";
import { useTranslations } from "next-intl";

type Props = {
  product: Product;
  locale: string;
};

export default function ProductView({ product, locale }: Props) {
  const t = useTranslations("product"); // keep translations for static UI
  const router = useRouter();
  const { getColorLabel } = useColorLabel();

  // normalize arrays
  const images: Image[] = (product.img ?? []) as Image[];
  const features: Feature[] = product.features ?? [];
  const specsAll = product.specs ?? [];
  const items: Item[] = product.items ?? [];

  // pick localized product details
  const details = useMemo(() => {
    const d = product.productDetails ?? [];
    // find matching locale or fallback to first
    return d.find((x) => x.locale === locale) ?? d[0] ?? { name: product.slug ?? "", title: "", subtitle: "" };
  }, [product, locale]);

  // specs filtered by locale (if specs have locale)
  const specs: { title: string; subtitle: string }[] = useMemo(
    () =>
      specsAll
        .filter((s) => !s.locale || s.locale === locale)
        .map((s) => ({ title: s.title, subtitle: s.subtitle })),
    [specsAll, locale]
  );

  // color/image selection
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);

  useEffect(() => {
    if (images.length > 0) setSelectedColorIndex(0);
  }, [images.length]);

  const selectedImages = images[selectedColorIndex]?.imgs ?? [];

  return (
    <main className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 py-8 flex flex-col gap-4 md:gap-8">
      {/* Back button */}
      <div className="w-full flex justify-start">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-main-text text-primary opacity-80 hover:opacity-100 transition"
        >
          <Icon
            icon="hugeicons:arrow-left-01"
            className="text-3xl text-black transition-colors duration-200 hover:text-primary block md:hidden"
          />
          <span className="hidden md:block text-xl">{t("backButton")}</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-12">
        {/* Carousel */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <EmblaFadeCarousel images={selectedImages} />
        </div>

        {/* Info */}
        <div className="w-full md:w-6/12 flex flex-col gap-4 md:justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <h1 className="text-h1-mobile md:text-h1">{details.name || product.slug}</h1>

              <div className="flex w-full items-center gap-2 mt-2 md:w-auto md:justify-end">
                <div className="flex flex-row-reverse md:flex-row items-center gap-2">
                  <span className="text-sm text-main-text md:mr-2 md:ml-0">
                    {images[selectedColorIndex]?.color ? getColorLabel(images[selectedColorIndex].color!) : ""}
                  </span>

                  <div className="flex gap-2">
                    {images.map((c: Image, idx: number) => (
                      <button
                        key={c.id ?? idx}
                        className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full p-[3px] border-2 border-primary ${selectedColorIndex === idx ? "border-opacity-100" : "border-opacity-0"
                          }`}
                        onClick={() => setSelectedColorIndex(idx)}
                        aria-label={`Select color ${c.color ?? idx}`}
                        type="button"
                      >
                        <span className="block w-full h-full rounded-full border" style={{ backgroundColor: c.color ?? "#fff" }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button className="px-4 py-4 rounded-full w-full mt-4 md:hidden" variant={"default"}>
                {t("getQuote") ?? "Get quote"}
              </Button>
            </div>

            {/* Specs (desktop) */}
            <div className="hidden md:grid gap-4 text-sm text-main-text md:grid-cols-1 mt-4 md:mt-0">
              {specs.map((item, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-subtitle-mobile md:text-subtitle text-amm">{item.title}</span>
                  <span className="text-h3-mobile md:text-h3 text-black">{item.subtitle}</span>
                </div>
              ))}
            </div>
          </div>

          <Button className="px-4 py-4 rounded-full w-full mt-2 md:mt-4 hidden md:block" variant={"default"}>
            {t("getQuote") ?? "Get quote"}
          </Button>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="md:hidden">
        <TabsUnderline defaultValue="features">
          <TabsUnderlineList>
            <TabsUnderlineTrigger value="features">{t("tabs.features") ?? "Features"}</TabsUnderlineTrigger>
            <TabsUnderlineTrigger value="specs">{t("tabs.specs") ?? "Specs"}</TabsUnderlineTrigger>
            <TabsUnderlineTrigger value="description">{t("tabs.description") ?? "Description"}</TabsUnderlineTrigger>
          </TabsUnderlineList>

          <TabsUnderlineContent value="features">
            <div className="grid grid-cols-1 gap-y-8 pt-4">
              {features
                .filter((f: Feature) => !f.preview)
                .map((f: Feature, i: number) => {
                  const name = f.featureDetails?.find((d) => d.locale === locale)?.name ?? f.name;
                  const desc = f.featureDetails?.find((d) => d.locale === locale)?.desc ?? "";
                  return (
                    <div key={f.id ?? i} className="flex flex-row gap-4 items-start">
                      <div className="w-20 h-20 shrink-0 rounded-full flex items-center justify-center border-[1.5px] transition-all duration-200">
                        <DaikinIcon name={f.img ?? ""} className="w-10 h-10" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-h3-mobile md:text-h3">{name}</span>
                        <p className="text-subtitle-mobile md:text-subtitle">{desc}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </TabsUnderlineContent>

          <TabsUnderlineContent value="specs">
            <div className="grid gap-7 text-sm text-main-text pt-4">
              {specs.map((item, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-subtitle-mobile md:text-subtitle text-amm">{item.title}</span>
                  <span className="text-h3-mobile md:text-h3 text-black">{item.subtitle}</span>
                </div>
              ))}
            </div>
          </TabsUnderlineContent>

          <TabsUnderlineContent value="description">
            <div className="text-main-text pt-4 flex flex-col gap-2">
              <span className="text-h3-mobile md:text-h3">{t("whyChooseTitle") + " " + details.name}</span>
              <span className="text-subtitle-mobile md:text-subtitle text-amm leading-10">{details.subtitle}</span>
            </div>
          </TabsUnderlineContent>
        </TabsUnderline>
      </div>

      {/* Desktop features */}
      <div className="hidden md:block">
        <span className="text-h1-mobile md:text-h1">{t("keyFeatures")}</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-y-10 md:gap-x-32 mt-6">
          {features
            .filter((f: Feature) => !f.preview)
            .map((f: Feature, i: number) => {
              const name = f.featureDetails?.find((d) => d.locale === locale)?.name ?? f.name;
              const desc = f.featureDetails?.find((d) => d.locale === locale)?.desc ?? "";
              return (
                <div key={f.id ?? i} className="flex flex-col gap-4">
                  <div className="w-14 h-14 md:w-28 md:h-28 rounded-full flex items-center justify-center border-[1.5px] transition-all duration-200">
                    <DaikinIcon name={f.img ?? ""} />
                  </div>
                  <span className="text-h3-mobile md:text-h3 ">{name}</span>
                  <p className="text-main-text-mobile md:text-main-text text-amm leading-10">{desc}</p>
                </div>
              );
            })}
        </div>
      </div>

      {/* Includes / Items */}
      <div className="mt-16">
        <h2 className="text-h1-mobile md:text-h1 mb-6">{t("includesTitle")}</h2>
        {product.items && <EmblaCardCarousel items={product.items} />}
      </div>

      {/* Desktop description */}
      <div className="text-main-text mb-6 flex-col gap-2 hidden md:flex">
        <span className="text-h1-mobile md:text-h1">{t("whyChooseTitle") + " " + details.name}</span>
        <span className="text-subtitle-mobile md:text-subtitle text-amm leading-10">{details.subtitle}</span>
      </div>
    </main>
  );
}
