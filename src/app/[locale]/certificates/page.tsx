export const dynamic = 'force-dynamic';

import Footer from "@/components/footer";
import Header from "@/components/header";
import { FadeIn } from "@/components/fade-in";
import { CertificatesGrid } from "@/components/certificates-grid";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { use } from "react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Certyfikaty - AMM Daikin Kobierzyce",
    description:
      "Certyfikaty i uprawnienia naszych techników: szkolenia montażowe Daikin Altherma, klimatyzatory R32, VRV 5, lutowanie twarde, uprawnienia UDT i F-gazy.",
    keywords: [
      "certyfikaty Daikin",
      "uprawnienia F-gazy",
      "UDT chłodnictwo",
      "szkolenie montażowe Daikin",
      "certyfikat R32",
      "VRV 5 HR",
      "lutowanie twarde certyfikat",
      "Daikin Kobierzyce",
    ],
    openGraph: {
      title: "Certyfikaty - AMM Daikin Kobierzyce",
      description:
        "Certyfikaty i uprawnienia techników AMM: Daikin Altherma, klimatyzatory R32, VRV 5, UDT oraz F-gazy.",
      url: `https://daikinkobierzyce.pl/${locale}/certificates`,
      type: "website",
    },
    alternates: {
      canonical: `/pl/certificates`,
    },
  };
}

export default function CertificatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="w-full">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto py-7 md:py-7 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto flex flex-col items-start">
            <FadeIn>
              <h1 className="text-h1-mobile md:text-h1 mb-4">
                Nasze certyfikaty
              </h1>
            </FadeIn>
            <FadeIn delay={100}>
              <p className="w-full text-subtitle-mobile md:text-subtitle text-amm mb-8">
                Posiadamy pełne kwalifikacje i uprawnienia do montażu, serwisowania
                oraz uruchamiania systemów klimatyzacyjnych i pomp ciepła Daikin.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Certificates Grid */}
        <section className="py-8 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CertificatesGrid />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
