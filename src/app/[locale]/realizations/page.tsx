export const dynamic = 'force-dynamic';

import Footer from "@/components/footer";
import Header from "@/components/header";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { use } from "react";
import { FadeIn } from "@/components/fade-in";
import { RealizationsGallery } from "@/components/realizations-gallery";
import type { RealizationPhoto } from "@/components/realizations-gallery";
import type { Metadata } from "next";

// ── Konfiguracja galerii – dodaj lub usuń zdjęcia tutaj ──────────────────────
const PHOTOS: RealizationPhoto[] = [
  {
    id: "r1",
    src: "https://daikinkobierzyce.pl/api/images/realization/IMG_2886-1781178758410.JPG",
    alt: "Montaż klimatyzacji Daikin – realizacja 1",
  },
  {
    id: "r2",
    src: "https://daikinkobierzyce.pl/api/images/realization/IMG_2922-1781178849941.JPG",
    alt: "Montaż pompy ciepła – realizacja 2",
  },
  {
    id: "r3",
    src: "https://daikinkobierzyce.pl/api/images/realization/IMG_2913-1781178811793.JPG",
    alt: "Instalacja systemu multi-split – realizacja 3",
  },
  {
    id: "r4",
    src: "https://daikinkobierzyce.pl/api/images/realization/IMG_2907-1781178787191.JPG",
    alt: "Montaż systemu VRV – realizacja 4",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

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

export default function RealizationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("realizations");

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
          <RealizationsGallery photos={PHOTOS} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
