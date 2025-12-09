"use client";

import React, { useEffect, useState, use } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductView from "./ProductView.client";
import { Product } from "@/types/product";

export default function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string; productSlug: string }>;
}) {
  const { locale, productSlug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(productSlug)}?locale=${encodeURIComponent(locale)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: Product = await res.json();
        setProduct(json);
      } catch (e: any) {
        console.error("Product fetch error:", e);
        setError(e?.message ?? "Fetch error");
      } finally {
        setLoading(true);
        setLoading(false);
      }
    };
    run();
  }, [productSlug, locale]);

  return (
    <>
      <Header />
      {loading && (
        <div className="max-w-7xl mx-auto px-4 py-16">Loading...</div>
      )}
      {!loading && error && (
        <div className="max-w-7xl mx-auto px-4 py-16 text-red-600">{error}</div>
      )}
      {!loading && product && <ProductView product={product} locale={locale} />}
      <Footer />
    </>
  );
}
