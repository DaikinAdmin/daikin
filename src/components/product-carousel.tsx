"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import DaikinIcon from "./daikin-icon";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight } from "./ui/arrows";

const productKeys = ["daikinFit", "vrv", "thermostat", "aurora", "rebel"];
const productIcons = [
  "temperature",
  "slow-winds",
  "thermometer-warm",
  "nuclear-power",
  "eco-power",
];

export default function ProductCarousel() {
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

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
    <section className="py-16 bg-gradient-to-br bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl lg:text-h1 font-normal text-black mb-2">
            {t("home.products.title")}
          </h2>
          <p className="text-xl lg:text-subtitle text-black font-medium">
            {t("home.products.subtitle")}
          </p>
        </div>

        <div
          className="relative bg-white overflow-hidden"
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
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
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-6">
                <h2 className="text-h2 font-normal text-black mb-4">
                  {t(`products.${currentProductKey}.name`)}
                </h2>

                <p className="text-amm text-main-text leading-relaxed mb-6">
                  {t(`products.${currentProductKey}.description`)}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <p className="text-h3 text-black mb-3">Key Features:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.isArray(
                      t.raw(`products.${currentProductKey}.features`)
                    ) &&
                      (
                        t.raw(
                          `products.${currentProductKey}.features`
                        ) as string[]
                      ).map((feature: string, index: number) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          <span className="text-main-text text-amm">
                            {feature}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
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
        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-8 justify-items-center">
          {productKeys.map((productKey, index) => {
            const ProductIcon = productIcons[index];
            const isActive = index === currentIndex;

            return (
              <button
                key={productKey}
                onClick={() => setCurrentIndex(index)}
                className="flex flex-col items-center group"
              >
                {/* Іконка в колі */}
                <div
                  className={`w-28 h-28 rounded-full flex items-center justify-center border-[1.5px] transition-all duration-200
          ${
            isActive
              ? "border-primary"
              : "bg-white border-gray-300 group-hover:border-black"
          }`}
                >
                  <DaikinIcon
                    name={ProductIcon}
                    className={`${
                      isActive
                        ? "stroke-primary"
                        : "stroke-amm"
                    }`}
                  />
                </div>

                {/* Назва під іконкою */}
                <p
                  className={`mt-3 text-main-text text-center transition-colors duration-200
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
