"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import DaikinIcon from "./daikin-icon";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight } from "./ui/arrows";

const productKeys = ["daikinFit", "vrv", "thermostat", "aurora", "rebel"];
const productIcons = [
  "air_filter",
  "comfort_mode",
  "heat_plus",
  "streamer",
  "stylish",
];

export default function ProductCarousel() {
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
        setCurrentIndex((prevIndex) => (prevIndex + 1) % productKeys.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlay]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? productKeys.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % productKeys.length);
  };

  const currentProductKey = productKeys[currentIndex];
  const currentIcon = productIcons[currentIndex];

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
                {t(`products.${currentProductKey}.name`)}
              </h2>
              <p className="text-main-text-mobile text-black font-medium mb-1">
                {t("home.products.subtitle")}
              </p>
            </div>

            {/* Product Image */}
            <div className="relative h-96 lg:h-[500px] bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500">Product Image</p>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
              >
                <ArrowLeft />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <ArrowRight />
              </button>
            </div>

            {/* Product Details */}
            <div className="py-6 lg:p-12 flex flex-col justify-center">
              <div className="mb-6">
                <h2 className="text-h2 text-black mb-4 hidden lg:block">
                  {t(`products.${currentProductKey}.name`)}
                </h2>

                <p className="text-amm text-main-text leading-relaxed mb-6 hidden lg:block">
                  {t(`products.${currentProductKey}.description`)}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <p className="text-h3-mobile md:text-h3 text-black mb-3">
                    Key Features:
                  </p>
                  <div className="ml-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Array.isArray(
                      t.raw(`products.${currentProductKey}.features`)
                    ) &&
                      (
                        t.raw(
                          `products.${currentProductKey}.features`
                        ) as string[]
                      ).map((feature: string, index: number) => (
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
          {productKeys.map((productKey, index) => {
            const ProductIcon = productIcons[index];
            const isActive = index === currentIndex;

            return (
              <button
                key={productKey}
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
                  {t(`products.${productKey}.name`)}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
