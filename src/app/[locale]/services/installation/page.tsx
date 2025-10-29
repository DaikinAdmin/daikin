import Footer from '@/components/footer';
import Header from '@/components/header';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Shield, 
  Award, 
  Wrench, 
  FileCheck,
  Users,
  Phone,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

export default function InstallationPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('services.installation');

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#003D7A] to-[#0052CC] text-white py-20">
        <div className="absolute inset-0 bg-grid-slate-200/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30 mb-6">
              <Wrench className="h-5 w-5" />
              <span className="text-sm font-medium">{t('hero.badge')}</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#003D7A] rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold text-lg shadow-lg"
              >
                <Calendar className="h-5 w-5" />
                {t('hero.cta.schedule')}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-[#003D7A] transition-all duration-200 font-semibold text-lg"
              >
                <Phone className="h-5 w-5" />
                {t('hero.cta.contact')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Installation Service */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#003D7A] mb-4">
              {t('whyChoose.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('whyChoose.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-[#003D7A]" />
              </div>
              <h3 className="text-lg font-semibold text-[#003D7A] mb-2">
                {t('whyChoose.reasons.certified.title')}
              </h3>
              <p className="text-gray-600">
                {t('whyChoose.reasons.certified.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-[#003D7A] mb-2">
                {t('whyChoose.reasons.quality.title')}
              </h3>
              <p className="text-gray-600">
                {t('whyChoose.reasons.quality.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-[#003D7A] mb-2">
                {t('whyChoose.reasons.fast.title')}
              </h3>
              <p className="text-gray-600">
                {t('whyChoose.reasons.fast.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-[#003D7A] mb-2">
                {t('whyChoose.reasons.warranty.title')}
              </h3>
              <p className="text-gray-600">
                {t('whyChoose.reasons.warranty.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Process */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#003D7A] mb-4">
              {t('process.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('process.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#003D7A] text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#003D7A] mb-2">
                      {t(`process.steps.step${step}.title`)}
                    </h3>
                    <p className="text-gray-600">
                      {t(`process.steps.step${step}.description`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Install */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#003D7A] mb-4">
              {t('whatWeInstall.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('whatWeInstall.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['residential', 'commercial', 'industrial', 'specialized'].map((category) => (
              <div key={category} className="bg-gradient-to-br from-blue-50 to-white rounded-xl border-2 border-blue-100 p-8 hover:border-[#003D7A] transition-colors">
                <h3 className="text-2xl font-bold text-[#003D7A] mb-4">
                  {t(`whatWeInstall.categories.${category}.title`)}
                </h3>
                <ul className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        {t(`whatWeInstall.categories.${category}.items.${item}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Guarantee */}
      <section className="py-16 bg-gradient-to-br from-[#003D7A] to-[#0052CC] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                {t('guarantee.title')}
              </h2>
              <p className="text-xl text-white/90 mb-8">
                {t('guarantee.subtitle')}
              </p>
              <ul className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-300 flex-shrink-0 mt-0.5" />
                    <span className="text-white/90">
                      {t(`guarantee.items.${item}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
              <div className="flex items-center gap-4 mb-6">
                <FileCheck className="h-12 w-12 text-white" />
                <div>
                  <h3 className="text-2xl font-bold">{t('guarantee.certification.title')}</h3>
                  <p className="text-white/80">{t('guarantee.certification.subtitle')}</p>
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((cert) => (
                  <div key={cert} className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-yellow-300" />
                    <span>{t(`guarantee.certification.items.${cert}`)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="h-16 w-16 text-[#003D7A] mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold text-[#003D7A] mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#003D7A] text-white rounded-xl hover:bg-[#002855] transition-colors font-semibold text-lg shadow-lg"
            >
              <Calendar className="h-5 w-5" />
              {t('cta.schedule')}
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#003D7A] text-[#003D7A] rounded-xl hover:bg-[#003D7A] hover:text-white transition-colors font-semibold text-lg"
            >
              {t('cta.viewProducts')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
