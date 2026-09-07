export const dynamic = 'force-dynamic';

import Footer from "@/components/footer";
import Header from "@/components/header";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/fade-in";
import { RealizationsGallery } from "@/components/realizations-gallery";
import type { RealizationPhoto } from "@/components/realizations-gallery";
import type { Metadata } from "next";
import { getRealizationPhotos } from "@/lib/realizations.server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "realizations" });

  return {
    title: "Realizacje - Daikin Kobierzyce",
    description:
      "Poznaj nasze realizacje – profesjonalny montaż klimatyzacji, pomp ciepła i systemów HVAC Daikin na terenie Wrocławia i okolic.",
    keywords: [
      "realizacje Daikin",
      "montaż klimatyzacji Wrocław",
      "instalacja pompy ciepła",
      "projekty HVAC",
      "Daikin Kobierzyce",
      "klimatyzatory Wrocław",
      "pompy ciepła Kobierzyce",
    ],
    openGraph: {
      title: "Realizacje - Daikin Kobierzyce",
      description:
        "Profesjonalny montaż systemów Daikin – nasze realizacje.",
      url: `https://daikinkobierzyce.pl/${locale}/realizations`,
      type: "website",
    },
    alternates: {
      canonical: `/pl/realizations`,
    },
  };
}

export default async function RealizationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "realizations" });

  // Gallery content is managed in the admin panel (Dashboard -> Realizations)
  const photos: RealizationPhoto[] = (await getRealizationPhotos()).map(
    (photo) => ({
      id: photo.id,
      src: photo.img,
      alt: photo.alt ?? undefined,
    })
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="w-full">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto py-7 md:py-7 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto flex flex-col items-start">
            <FadeIn>
              <h1 className="text-h1-mobile md:text-h1 mb-4">
                {t("hero.title")}
              </h1>
            </FadeIn>
            <FadeIn delay={100}>
              <p className="w-full text-subtitle-mobile md:text-subtitle text-amm mb-8">
                {t("hero.subtitle")}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RealizationsGallery photos={photos} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
