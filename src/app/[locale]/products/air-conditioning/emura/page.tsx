"use client";

import { useTranslations } from "next-intl";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useState } from "react";

type ProductImage = {
  color: string;
  imgs: string[];
};

type ProductFeature = {
  title: string;
  icon: string;
  description: string;
};

type ProductDetails = {
  name: string;
  description: string;
  soundPressure: string;
  label: string;
  power: string;
  size: string;
  features: ProductFeature[];
  images: ProductImage[];
};

export default function EmuraPage() {
  const t = useTranslations("product.emura");

  // Дані продукту через next-intl
  const product: ProductDetails = {
    name: t("name"),
    description: t("description"),
    soundPressure: t("soundPressure"),
    label: t("label"),
    power: t("power"),
    size: t("size"),
    features: t.raw("features") as ProductFeature[],
    images: t.raw("images") as ProductImage[],
  };

  const [selectedColor, setSelectedColor] = useState<ProductImage>(product.images[0]);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  return (
    <>
      <Header />

      <main className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-12">
        {/* Верхній блок: Фото + Назва/Кольори/Характеристики */}
        <div className="flex flex-col md:flex-row gap-12">
          {/* Ліва частина — Image Viewer */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="w-full aspect-square bg-gray-50 flex items-center justify-center">
              <img
                src={selectedColor.imgs[selectedImgIndex]}
                alt={`${product.name} image`}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Права частина — Назва, кольори, основні характеристики */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            {/* Назва + селектор кольорів */}
            <div className="flex items-center justify-between">
              <h1 className="text-h1 font-bold">{product.name}</h1>
              <div className="flex gap-2">
                {product.images.map((c: ProductImage) => (
                  <button
                    key={c.color}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor.color === c.color ? "border-primary" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: c.color }}
                    onClick={() => {
                      setSelectedColor(c);
                      setSelectedImgIndex(0);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Основні характеристики */}
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-main-text">
              <div>
                <span className="font-semibold">Sound Pressure: </span>{product.soundPressure}
              </div>
              <div>
                <span className="font-semibold">Label: </span>{product.label}
              </div>
              <div>
                <span className="font-semibold">Power: </span>{product.power}
              </div>
              <div>
                <span className="font-semibold">Size: </span>{product.size}
              </div>
            </div>
          </div>
        </div>

        {/* Опис на всю ширину */}
        <div className="text-main-text mb-6">{product.description}</div>

        {/* Features у дві колонки */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {product.features.map((f: ProductFeature, i: number) => (
            <div key={i} className="flex flex-col gap-2">
              <h4 className="font-semibold">{f.title}</h4>
              <p className="text-sm">{f.description}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
