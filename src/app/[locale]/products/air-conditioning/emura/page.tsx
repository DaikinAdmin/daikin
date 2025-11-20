"use client";

import { useTranslations } from "next-intl";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import DaikinIcon from "@/components/daikin-icon";
import { EmblaFadeCarousel } from "@/components/ui/emblaFadeCarousel";
import { EmblaCardCarousel } from "@/components/ui/emblaCardCarousel";

export default function EmuraPage() {
  const t = useTranslations("product.emura");

  const images = t.raw("images") as { color: string; imgs: string[] }[];
  const specs = t.raw("specs") as { title: string; subtitle: string }[];
  const features = t.raw("features") as {
    title: string;
    icon: string;
    description: string;
  }[];
  const includes = (
    t.raw("includes") as { title: string; subtitle: string; image: string }[]
  ).map((item) => ({
    img: item.image,
    title: item.title,
    subtitle: item.subtitle,
  }));

  const [selectedColor, setSelectedColor] = useState(images[0]);

  return (
    <>
      <Header />

      <main className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <EmblaFadeCarousel images={selectedColor.imgs} />
          </div>

          <div className="w-full md:w-6/12 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-h1">{t("name")}</h1>
              <div className="flex gap-2">
                {images.map((c) => (
                  <button
                    key={c.color}
                    className={`w-14 h-14 rounded-full border-2 ${
                      selectedColor.color === c.color
                        ? "border-primary"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: c.color }}
                    onClick={() => {
                      setSelectedColor(c);
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-7 mt-8 text-sm text-main-text">
              {specs.map((item, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-subtitle text-amm">{item.title}</span>
                  <span className="text-h3 text-black">{item.subtitle}</span>
                </div>
              ))}
              <Button
                className="px-4 py-2 rounded-full w-full"
                variant={"default"}
              >
                {t("getQuote")}
              </Button>
            </div>
          </div>
        </div>

        <div className="text-main-text mb-6 flex flex-col gap-2">
          <span className="text-h1">{t("description.title")}</span>
          <span className="text-subtitle text-amm leading-10">
            {t("description.subtitle")}
          </span>
        </div>

        <span className="text-h1">{t("featuresTitle")}</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-y-10 md:gap-x-32">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col gap-4">
              <span className="text-h3 ">{f.title}</span>
              <div
                className={`w-14 h-14 md:w-28 md:h-28 rounded-full flex items-center justify-center border-[1.5px] transition-all duration-200`}
              >
                <DaikinIcon name={f.icon} className={"stroke-amm"} />
              </div>
              <p className="text-subtitle leading-10">{f.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-16">
          <h2 className="text-h1 mb-6">{t("includesTitle")}</h2>
          <EmblaCardCarousel items={includes} />
        </div>
      </main>

      <Footer />
    </>
  );
}
