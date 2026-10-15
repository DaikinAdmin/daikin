export const dynamic = 'force-dynamic';

import Footer from "@/components/footer";
import Header from "@/components/header";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { RealizationAccordion } from "@/components/realization-accordion";
import { getRealizationGroup } from "@/data/realizations";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const group = getRealizationGroup(id);
  if (!group) return {};

  const t = await getTranslations({ locale, namespace: "realizations" });
  const title = `${t(`groups.${id}.title`)} - Daikin Kobierzyce`;
  const description = t(`groups.${id}.subtitle`);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://daikinkobierzyce.pl/${locale}/realizations/${id}`,
      type: "website",
    },
    alternates: {
      canonical: `/pl/realizations/${id}`,
    },
  };
}

export default async function RealizationGroupPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const group = getRealizationGroup(id);
  if (!group) notFound();

  const t = await getTranslations({ locale, namespace: "realizations" });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="w-full">
        <section className="relative w-full overflow-hidden">
          <Image
            src={group.bannerImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
            <h1 className="text-h1-mobile md:text-h1 text-white mb-4">{t(`groups.${id}.title`)}</h1>
            <p className="w-full text-subtitle-mobile md:text-subtitle text-white/90">
              {t(`groups.${id}.subtitle`)}
            </p>
          </div>
        </section>

        <div className="h-8 lg:h-12" />

        <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RealizationAccordion groupId={group.id} items={group.items} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
