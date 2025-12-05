"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import DaikinIcon from "./daikin-icon";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight } from "./ui/arrows";
import { Product } from "@/types/product";

// Manually set 5 product IDs here (replace placeholders with real slugs/IDs)
const productIds: string[] = [
  "cmipuhoqw000q01l64lrud61a",
  "cmipuhoqw000q01l64lrud61a",
  "cmipuhoqw000q01l64lrud61a",
  "cmipuhoqw000q01l64lrud61a",
  "cmipuhoqw000q01l64lrud61a",
];

const productIcons = [
  "air_filter",
  "comfort_mode",
  "heat_plus",
  "streamer",
  "stylish",
];

export default function ProductCarousel() {
  const t = useTranslations();
  const locale = useLocale();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeElement = container.children[currentIndex] as HTMLElement;

      if (activeElement && container.scrollWidth > container.clientWidth) {
        const newScrollLeft =
          activeElement.offsetLeft -
          container.clientWidth / 2 +
          activeElement.clientWidth / 2;

        container.scrollTo({
          left: newScrollLeft,
          behavior: "smooth",
        });
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % productIds.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlay]);

  // Fetch products by IDs
  useEffect(() => {
    const run = async () => {
      try {
        const results: Product[] = [];
        for (const id of productIds) {
          const res = await fetch(
            `/api/products/${encodeURIComponent(
              id
            )}?locale=${encodeURIComponent(locale)}`
          );
          if (!res.ok) continue;
          const json: Product = await res.json();
          results.push(json);
        }
        setProducts(results);
      } catch (e) {
        console.error("Carousel products fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [locale]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? productIds.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % productIds.length);
  };

  const currentIcon = productIcons[currentIndex];
  const currentProduct: Product | undefined = products[currentIndex];

  // Derive name/description from productDetails in current locale
  const currentName = currentProduct
    ? currentProduct.productDetails?.find((d) => d.locale === locale)?.name ??
      currentProduct.slug
    : "";
  const currentDescription = currentProduct
    ? currentProduct.productDetails?.find((d) => d.locale === locale)?.title ??
      ""
    : "";
  const currentFeatures: string[] = currentProduct
    ? (currentProduct.features ?? []).map(
        (f) =>
          f.featureDetails?.find((d) => d.locale === locale)?.name ?? f.name
      )
    : [];
  const currentFirstImage: string | undefined =
    currentProduct?.img?.[0]?.imgs?.[0];

  return (
    <section className="md:py-16 bg-gradient-to-br bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="md:mb-12 order-1">
          <h2 className="text-h1-mobile lg:text-h1 font-normal text-black mb-4 md:mb-2">
            {t("home.products.title")}
          </h2>
          <p className="text-subtitle text-black font-medium mb-1 hidden lg:block">
            {t("home.products.subtitle")}
          </p>
        </div>

        <div
          className="relative bg-white overflow-hidden order-3 lg:order-2"
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Mobile Header */}
            <div className="pt-8 lg:hidden">
              <h2 className="text-h2-mobile font-normal text-black">
                {currentName}
              </h2>
              <p className="text-main-text-mobile text-black font-medium mb-1">
                {t("home.products.subtitle")}
              </p>
            </div>

            {/* Product Image */}
            <div className="relative w-full flex items-center justify-center">
              {/* Image wrapper */}
              <div className="relative w-full flex items-center justify-center">
                {currentFirstImage ? (
                  <img
                    src={currentFirstImage}
                    alt={currentName}
                    className="mx-auto max-h-[600px] w-auto object-contain"
                  />
                ) : (
                  <p className="text-gray-500">Product Image</p>
                )}

                {/* Navigation Arrows (inside image) */}
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2 transition"
                >
                  <ArrowLeft />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 transition"
                >
                  <ArrowRight />
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="py-6 lg:p-12 flex flex-col justify-center">
              <div className="mb-6">
                <h2 className="text-h2 text-black mb-4 hidden lg:block">
                  {currentName}
                </h2>

                <p className="text-amm text-main-text leading-relaxed mb-6 hidden lg:block">
                  {currentDescription}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <p className="text-h3-mobile md:text-h3 text-black mb-3">
                    Key Features:
                  </p>
                  <div className="ml-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {currentFeatures.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <div className="w-1 h-1 md:w-2 md:h-2 bg-primary rounded-full mr-3"></div>
                        <span className="text-main-text-mobile md:text-main-text text-amm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row gap-3">
                  <Button
                    className="px-4 py-2 rounded-full transition-colors font-medium flex-1"
                    variant={"secondary"}
                  >
                    {t("home.products.learnMore")}
                  </Button>
                  <Button
                    className="px-4 py-2 rounded-full transition-colors font-medium flex-1"
                    variant={"default"}
                  >
                    {t("home.products.getQuote")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid Preview */}
        <div
          ref={scrollContainerRef}
          className="lg:mt-12 flex overflow-x-auto md:grid md:grid-cols-5 gap-7 md:gap-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x order-2 lg:order-3 lg:mb-0 relative"
        >
          {productIds.map((productId, index) => {
            const ProductIcon = productIcons[index];
            const isActive = index === currentIndex;
            const p = products[index];
            const name = p
              ? p.productDetails?.find((d) => d.locale === locale)?.name ??
                p.slug
              : "";

            return (
              <button
                key={productId}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlay(false);
                }}
                className="flex flex-col-reverse md:flex-col items-center group min-w-[100px] snap-center gap-3"
              >
                <div
                  className={`w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center border-[1.5px] transition-all duration-200
          ${
            isActive
              ? "border-primary"
              : "bg-white border-gray-300 group-hover:border-black"
          }`}
                >
                  <DaikinIcon
                    name={ProductIcon}
                    className={`${isActive ? "stroke-primary" : "stroke-amm"}`}
                  />
                </div>

                {/* Назва під іконкою */}
                <p
                  className={`text-sm text-center transition-colors duration-200
          ${
            isActive ? "text-primary" : "text-gray-700 group-hover:text-black"
          }`}
                >
                  {name}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
