import Footer from "@/components/footer";
import Header from "@/components/header";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import InstallationCarousel from "@/components/installation-carousel";
import { FadeIn } from "@/components/fade-in";
import { WhyChooseGrid } from "@/components/why-choose-grid";

export default function InstallationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("services.installation");

  const whyChooseItems = [
    { key: "certified", img: "https://daikinkobierzyce.pl/api/images/installation/Certyfikowani_technicy-1765203546613.jpg" },
    { key: "quality", img: "https://daikinkobierzyce.pl/api/images/installation/Gwarancja_jakosci-1765203688866.jpg" },
    { key: "fast", img: "https://daikinkobierzyce.pl/api/images/installation/Szybko_i_efektywnie-1765203842446.jpg" },
    { key: "warranty", img: "https://daikinkobierzyce.pl/api/images/installation/Rozszerzona_gwarancja-1765203918859.jpg" },
  ];

  const processSteps = ["step1", "step2", "step3", "step4", "step5", "step6"];

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
              <p className="w-full  text-subtitle-mobile md:text-subtitle text-amm mb-8">
                {t("hero.subtitle")}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <WhyChooseGrid
          items={whyChooseItems}
          namespace="services.installation"
        />

        {/* Process Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <FadeIn>
                <h2 className="text-h1-mobile lg:text-h1">
                  {t("process.title")}
                </h2>
                <p className="text-subtitle-mobile lg:text-subtitle text-amm">
                  {t("process.subtitle")}
                </p>
              </FadeIn>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {processSteps.map((step, index) => (
                <FadeIn key={step} delay={index * 100} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 md:w-14 md:h-14 rounded-full border border-opacity-50 border-amm text-black flex items-center justify-center text-h3-mobile md:text-h3">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-h3-mobile lg:text-h3 mb-2">
                      {t(`process.steps.${step}.title`)}
                    </h3>
                    <p className="text-main-text-mobile lg:text-main-text">
                      {t(`process.steps.${step}.description`)}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* What We Install Section */}
        <section className="py-16 w-full bg-container">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <FadeIn>
                <h2 className="text-h1-mobile lg:text-h1">
                  {t("whatWeInstall.title")}
                </h2>
                <p className="text-subtitle-mobile lg:text-subtitle text-amm">
                  {t("whatWeInstall.subtitle")}
                </p>
              </FadeIn>
            </div>

            <FadeIn delay={200}>
              <InstallationCarousel />
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
