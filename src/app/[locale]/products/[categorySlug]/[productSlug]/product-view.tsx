"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { EmblaFadeCarousel } from "@/components/ui/emblaFadeCarousel";
import { EmblaCardCarousel } from "@/components/ui/emblaCardCarousel";
import DaikinIcon from "@/components/daikin-icon";
import { Button } from "@/components/ui/button";
import { TabsUnderline, TabsUnderlineList, TabsUnderlineTrigger, TabsUnderlineContent } from "@/components/ui/tabs-underline";
import { Icon } from "@iconify-icon/react";
import { useColorLabel } from "@/utils/colors";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductView({ product }: { product: any }) {
  const router = useRouter();
  const { getColorLabel } = useColorLabel();

  const images: { color: string; imgs: string[] }[] = Array.isArray(product?.img)
    ? product.img.map((entry: any) => ({ color: entry.color || "#ffffff", imgs: entry.imgs || [] }))
    : [];

  const specs: { title: string; subtitle: string }[] = Array.isArray(product?.specs)
    ? product.specs.map((s: any) => ({ title: s.title, subtitle: s.subtitle || "" }))
    : [];

  const features: { title: string; icon: string; description: string }[] = Array.isArray(product?.features)
    ? product.features.map((f: any) => ({ title: f.name || f.title, icon: f.slug || f.icon || "", description: f.desc || f.description || "" }))
    : [];

  const includes: { img: string; title: string; subtitle: string }[] = Array.isArray(product?.items)
    ? product.items
        .map((i: any) => ({ img: i.img || "", title: i.title, subtitle: i.subtitle ?? "" }))
        .filter((x: any) => typeof x.img === "string")
    : [];

  const [selectedColor, setSelectedColor] = useState(images[0] ?? { color: "#ffffff", imgs: [] });

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 py-8 flex flex-col gap-4 md:gap-8">
        <div className="w-full flex justify-start">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-main-text text-primary opacity-80 hover:opacity-100 transition">
            <Icon icon="hugeicons:arrow-left-01" className="text-3xl text-black transition-colors duration-200 hover:text-primary block md:hidden" />
            <span className="hidden md:block text-xl">Wróć</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-12">
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <EmblaFadeCarousel images={selectedColor.imgs} />
          </div>

          <div className="w-full md:w-6/12 flex flex-col gap-4 md:justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <h1 className="text-h1-mobile md:text-h1">{product?.name || product?.title || product?.slug}</h1>
                <div className="flex w-full items-center gap-2 mt-2 md:w-auto md:justify-end">
                  <div className="flex flex-row-reverse md:flex-row items-center gap-2">
                    <span className="text-sm text-main-text md:mr-2 md:ml-0">{getColorLabel(selectedColor.color)}</span>
                    <div className="flex gap-2">
                      {images.map((c) => (
                        <button key={c.color} className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full p-[3px] border-2 border-primary ${selectedColor.color === c.color ? "border-opacity-100" : "border-opacity-0"}`} onClick={() => setSelectedColor(c)}>
                          <span className="block w-full h-full rounded-full border" style={{ backgroundColor: c.color }}></span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <Button className="px-4 py-4 rounded-full w-full mt-4 md:hidden" variant={"default"}>Get quote</Button>
              </div>
              <div className="hidden md:grid gap-4 text-sm text-main-text md:grid-cols-1 mt-4 md:mt-0">
                {specs.map((item, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-subtitle-mobile md:text-subtitle text-amm">{item.title}</span>
                    <span className="text-h3-mobile md:text-h3 text-black">{item.subtitle}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button className="px-4 py-4 rounded-full w-full mt-2 md:mt-4 hidden md:block" variant={"default"}>Get quote</Button>
          </div>
        </div>

        <div className="md:hidden">
          <TabsUnderline defaultValue="features">
            <TabsUnderlineList>
              <TabsUnderlineTrigger value="features">Features</TabsUnderlineTrigger>
              <TabsUnderlineTrigger value="specs">Specs</TabsUnderlineTrigger>
              <TabsUnderlineTrigger value="description">Description</TabsUnderlineTrigger>
            </TabsUnderlineList>
            <TabsUnderlineContent value="features">
              <div className="grid grid-cols-1 gap-y-8 pt-4">
                {features.map((f, i) => (
                  <div key={i} className="flex flex-row gap-4 items-start">
                    <div className={`w-20 h-20 shrink-0 rounded-full flex items-center justify-center border-[1.5px] transition-all duration-200`}>
                      <DaikinIcon name={f.icon} className="w-10 h-10" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-h3-mobile md:text-h3">{f.title}</span>
                      <p className="text-subtitle-mobile md:text-subtitle">{f.description}</p>
                    </div>
                  </div>
                ))}
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
                <span className="text-h3-mobile md:text-h3">{product?.title || product?.name}</span>
                <span className="text-subtitle-mobile md:text-subtitle text-amm leading-10">{product?.subtitle || ""}</span>
              </div>
            </TabsUnderlineContent>
          </TabsUnderline>
        </div>

        <div className="hidden md:block">
          <span className="text-h1-mobile md:text-h1">Features</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-y-10 md:gap-x-32 mt-6">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className={`w-14 h-14 md:w-28 md:h-28 rounded-full flex items-center justify-center border-[1.5px] transition-all duration-200`}>
                  <DaikinIcon name={f.icon} />
                </div>
                <span className="text-h3-mobile md:text-h3 ">{f.title}</span>
                <p className="text-main-text-mobile md:text-main-text text-amm leading-10">{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-h1-mobile md:text-h1 mb-6">Included</h2>
          <EmblaCardCarousel items={includes} />
        </div>

        <div className="text-main-text mb-6 flex-col gap-2 hidden md:flex">
          <span className="text-h1-mobile md:text-h1">{product?.title || product?.name}</span>
          <span className="text-subtitle-mobile md:text-subtitle text-amm leading-10">{product?.subtitle || ""}</span>
        </div>
      </main>
      <Footer />
    </>
  );
}