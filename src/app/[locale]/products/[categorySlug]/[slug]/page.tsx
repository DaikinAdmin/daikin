"use client";

import { useTranslations } from "next-intl";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { use, useState, useEffect } from "react";
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
import { Product } from "@/types/product";

export default function ProductPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = use(params);
  const router = useRouter();
  const t = useTranslations();
  const { getColorLabel } = useColorLabel();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/product/${slug}?locale=${locale}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          if (data.images && data.images.length > 0) {
            setSelectedColor(data.images[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, locale]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <p className="text-xl">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <p className="text-xl">Product not found</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 py-8 flex flex-col gap-4 md:gap-8">
        {/* Кнопка назад */}
        <div className="w-full flex justify-start">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-main-text text-primary opacity-80 hover:opacity-100 transition"
          >
            <Icon
              icon="hugeicons:arrow-left-01"
              className="text-3xl text-black transition-colors duration-200 hover:text-primary block md:hidden"
            />
            <span className="hidden md:block text-xl">Wróć</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-12">
          {/* Карусель зображень */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <EmblaFadeCarousel images={selectedColor.imgs} />
          </div>

          {/* Блок інформації про товар */}
          <div className="w-full md:w-6/12 flex flex-col gap-4 md:justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <h1 className="text-h1-mobile md:text-h1">{t("name")}</h1>

                {/* Кольори і підпис */}
                <div className="flex w-full items-center gap-2 mt-2 md:w-auto md:justify-end">
                  <div className="flex flex-row-reverse md:flex-row items-center gap-2">
                    {/* Підпис */}
                    <span className="text-sm text-main-text md:mr-2 md:ml-0">
                      {getColorLabel(selectedColor.color)}
                    </span>

                    {/* Кружки */}
                    <div className="flex gap-2">
                      {product.img.map((c) => (
                        <button
                          key={c.color}
                          className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full p-[3px] border-2 border-primary ${
                            selectedColor.color === c.color
                              ? "border-opacity-100" // Змінюється колір зовнішньої рамки при виборі
                              : "border-opacity-0"
                          }`}
                          onClick={() => setSelectedColor(c)}
                        >
                          <span
                            className="block w-full h-full rounded-full border"
                            style={{ backgroundColor: c.color }}
                          ></span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action for phone */}
                <Button
                  className="px-4 py-4 rounded-full w-full mt-4 md:hidden"
                  variant={"default"}
                >
                  {t("getQuote")}
                </Button>
              </div>

              {/* Характеристики */}
              <div className="hidden md:grid gap-4 text-sm text-main-text md:grid-cols-1 mt-4 md:mt-0">
                {product.specs.map((item, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-subtitle-mobile md:text-subtitle text-amm">{item.title}</span>
                    <span className="text-h3-mobile md:text-h3 text-black">{item.subtitle}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action for PC */}
            <Button
              className="px-4 py-4 rounded-full w-full mt-2 md:mt-4 hidden md:block"
              variant={"default"}
            >
              {t("getQuote")}
            </Button>
          </div>
        </div>

        {/* Tabs for mobile */}
        <div className="md:hidden">
          <TabsUnderline defaultValue="features">
            <TabsUnderlineList>
              <TabsUnderlineTrigger value="features">
                {t("tabs.features")}
              </TabsUnderlineTrigger>
              <TabsUnderlineTrigger value="specs">
                {t("tabs.specs")}
              </TabsUnderlineTrigger>
              <TabsUnderlineTrigger value="description">
                {t("tabs.description")}
              </TabsUnderlineTrigger>
            </TabsUnderlineList>
            <TabsUnderlineContent value="features">
              <div className="grid grid-cols-1 gap-y-8 pt-4">
                {product.features.map((f, i) => (
                  <div key={i} className="flex flex-row gap-4 items-start">
                    <div
                      className={`w-20 h-20 shrink-0 rounded-full flex items-center justify-center border-[1.5px] transition-all duration-200`}
                    >
                      <DaikinIcon name={f.img!} className="w-10 h-10" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-h3-mobile md:text-h3">{f.featureDetails[0]?.name}</span>
                      <p className="text-subtitle-mobile md:text-subtitle">
                        {f.featureDetails[0]?.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsUnderlineContent>
            <TabsUnderlineContent value="specs">
              <div className="grid gap-7 text-sm text-main-text pt-4">
                {product.specs.map((item, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-subtitle-mobile md:text-subtitle text-amm">{item.title}</span>
                    <span className="text-h3-mobile md:text-h3 text-black">{item.subtitle}</span>
                  </div>
                ))}
              </div>
            </TabsUnderlineContent>
            <TabsUnderlineContent value="description">
              <div className="text-main-text pt-4 flex flex-col gap-2">
                <span className="text-h3-mobile md:text-h3">{t("description.title")}</span>
                <span className="text-subtitle-mobile md:text-subtitle text-amm leading-10">
                  {t("description.subtitle")}
                </span>
              </div>
            </TabsUnderlineContent>
          </TabsUnderline>
        </div>

        {/* Функції */}
        <div className="hidden md:block">
          <span className="text-h1-mobile md:text-h1">{t("featuresTitle")}</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-y-10 md:gap-x-32 mt-6">
            {product.features.map((f, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div
                  className={`w-14 h-14 md:w-28 md:h-28 rounded-full flex items-center justify-center border-[1.5px] transition-all duration-200`}
                >
                  <DaikinIcon name={f.img!} />
                </div>
                <span className="text-h3-mobile md:text-h3 ">{f.featureDetails[0]?.name}</span>
                <p className="text-main-text-mobile md:text-main-text text-amm leading-10">{f.featureDetails[0]?.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Включено */}
        <div className="mt-16">
          <h2 className="text-h1-mobile md:text-h1 mb-6">{t("includesTitle")}</h2>
          <EmblaCardCarousel items={product.items} />
        </div>

        {/* Опис */}
        <div className="text-main-text mb-6 flex-col gap-2 hidden md:flex">
          <span className="text-h1-mobile md:text-h1">{t("description.title")}</span>
          <span className="text-subtitle-mobile md:text-subtitle text-amm leading-10">
            {t("description.subtitle")}
          </span>
        </div>
      </main>

      <Footer />
    </>
  );
}
