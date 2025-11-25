import Footer from '@/components/footer';
import Header from '@/components/header';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import InstallationCarousel from '@/components/installation-carousel';
import { FadeIn } from '@/components/fade-in';
import { cn } from '@/lib/utils';

export default function InstallationPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('services.installation');

  const whyChooseItems = [
    { key: 'certified', img: '/whychoose_1.png' },
    { key: 'quality', img: '/whychoose_2.png' },
    { key: 'fast', img: '/whychoose_3.png' },
    { key: 'warranty', img: '/whychoose_1.png' }, // Reusing image as placeholder
  ];

  const whyChooseData = whyChooseItems.map((item) => ({
    type: 'photo',
    title: t(`whyChoose.reasons.${item.key}.title`),
    subtitle: t(`whyChoose.reasons.${item.key}.description`),
    img: item.img
  }));

  const ctaItem = {
    type: 'cta',
    title: t('cta.title'),
    subtitle: t('cta.subtitle'),
    buttonText: t('cta.schedule'),
    link: '/contact'
  };

  // Left: CTA, Photo 1, Photo 3
  const leftColumnItems = [
    { ...ctaItem, className: 'hidden md:flex' },
    whyChooseData[0],
    whyChooseData[2]
  ];

  // Right: Photo 2, Photo 4, CTA
  const rightColumnItems = [
    whyChooseData[1],
    whyChooseData[3],
    ctaItem
  ];

  const renderItem = (item: any, index: number) => {
    if (item.type === 'cta') {
      return (
        <FadeIn key={`cta-${index}`} className={cn("h-full", item.className)}>
          <div className="flex flex-col justify-start items-start h-full">
            <h3 className="text-h2-mobile lg:text-h2 mb-4">{item.title}</h3>
            <p className="text-subtitle-mobile lg:text-subtitle text-amm mb-8">{item.subtitle}</p>
            <Button
              className="px-12 py-4 md:px-20 md:py-2 rounded-full transition-colors font-medium"
              variant="accent"
              asChild
            >
              <Link href={item.link}>
                {item.buttonText}
              </Link>
            </Button>
          </div>
        </FadeIn>
      );
    } else {
      return (
        <FadeIn key={`photo-${index}`} delay={index * 100}>
          <div className="flex flex-col items-start">
            <div className="relative w-full h-[28rem] mb-6 overflow-hidden">
              <Image 
                src={item.img} 
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-h3-mobile lg:text-h3 mb-2">{item.title}</h3>
            <p className="text-main-text-mobile lg:text-main-text text-amm">{item.subtitle}</p>
          </div>
        </FadeIn>
      );
    }
  };

  const processSteps = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto py-12 md:py-20">
          <div className="container mx-auto px-4 flex flex-col items-start">
            <FadeIn>
              <h1 className="text-h1-mobile md:text-h1 mb-4">
                {t('hero.title')}
              </h1>
            </FadeIn>
            <FadeIn delay={100}>
              <p className="w-full  text-subtitle-mobile md:text-subtitle text-amm mb-8">
                {t('hero.subtitle')}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-8 pb-32 max-w-[90rem] mx-auto px-4">
          <div className="mb-12">
            <FadeIn>
              <h2 className="text-h1-mobile lg:text-h1 mb-4">{t('whyChoose.title')}</h2>
            </FadeIn>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
            {/* Left Column */}
            <div className="flex flex-col gap-8">
              {leftColumnItems.map((item, index) => renderItem(item, index))}
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-8">
              {rightColumnItems.map((item, index) => renderItem(item, index))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16">
          <div className="max-w-[90rem] mx-auto px-4">
            <div className="mb-12">
              <FadeIn>
                <h2 className="text-h1-mobile lg:text-h1 mb-4">{t('process.title')}</h2>
                <p className="text-subtitle-mobile lg:text-subtitle text-amm">{t('process.subtitle')}</p>
              </FadeIn>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {processSteps.map((step, index) => (
                <FadeIn key={step} delay={index * 100} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 md:w-14 md:h-14 rounded-full bg-amm hover:bg-primary duration-200 transition-colors text-white flex items-center justify-center text-h3-mobile md:text-h3">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-h2-mobile lg:text-h2 mb-2">
                      {t(`process.steps.${step}.title`)}
                    </h3>
                    <p className="text-subltitle-mobile lg:text-subtitle">
                      {t(`process.steps.${step}.description`)}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* What We Install Section */}
        <section className="py-16 max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <FadeIn>
              <h2 className="text-h1-mobile lg:text-h1 mb-4">{t('whatWeInstall.title')}</h2>
              <p className="text-subtitle-mobile lg:text-subtitle text-amm">{t('whatWeInstall.subtitle')}</p>
            </FadeIn>
          </div>

          <FadeIn delay={200}>
            <InstallationCarousel />
          </FadeIn>
        </section>
      </main>

      <Footer />
    </div>
  );
}
