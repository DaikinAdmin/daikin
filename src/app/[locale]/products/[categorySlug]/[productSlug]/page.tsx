import Header from "@/components/header";
import Footer from "@/components/footer";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import ProductView from "./product-view";

export default async function ProductPage({ params }: { params: { locale: string; categorySlug: string; productSlug: string } }) {
  noStore();
  const { locale, categorySlug, productSlug } = params;

  const base = process.env.NEXT_PUBLIC_APP_URL || "";
  const res = await fetch(
    `${base}/api/products?categorySlug=${encodeURIComponent(categorySlug)}&slug=${encodeURIComponent(productSlug)}&locale=${encodeURIComponent(locale)}`,
    { next: { revalidate: 0 } }
  );

  if (!res.ok) {
    const fallback = await fetch(
      `${base}/api/products?categorySlug=${encodeURIComponent(categorySlug)}&locale=${encodeURIComponent(locale)}`,
      { next: { revalidate: 0 } }
    );
    if (!fallback.ok) return notFound();
    const list = await fallback.json();
    const product = Array.isArray(list?.data) ? list.data.find((p: any) => p.slug === productSlug) : null;
    if (!product) return notFound();
    return <ProductView product={product} />;
  }

  const data = await res.json();
  const product = data?.data ?? data;
  if (!product) return notFound();

  return <ProductView product={product} />;
}
