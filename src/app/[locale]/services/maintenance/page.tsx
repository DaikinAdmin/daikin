import Footer from '@/components/footer';
import Header from '@/components/header';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Shield, 
  Settings, 
  Wrench, 
  AlertTriangle,
  TrendingUp,
  Phone,
  Calendar,
  FileText,
  ThermometerSun,
  Wind
} from 'lucide-react';
import Link from 'next/link';

export default function MaintenancePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('services.maintenance');

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-700 via-emerald-600 to-teal-500 text-white py-20">
        <div className="absolute inset-0 bg-grid-slate-200/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30 mb-6">
              <Settings className="h-5 w-5" />
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
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-700 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold text-lg shadow-lg"
              >
                <Calendar className="h-5 w-5" />
                {t('hero.cta.schedule')}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-green-700 transition-all duration-200 font-semibold text-lg"
              >
                <Phone className="h-5 w-5" />
                {t('hero.cta.emergency')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Regular Maintenance */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('whyMaintenance.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('whyMaintenance.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('whyMaintenance.benefits.efficiency.title')}
              </h3>
              <p className="text-gray-600">
                {t('whyMaintenance.benefits.efficiency.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('whyMaintenance.benefits.lifespan.title')}
              </h3>
              <p className="text-gray-600">
                {t('whyMaintenance.benefits.lifespan.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('whyMaintenance.benefits.reliability.title')}
              </h3>
              <p className="text-gray-600">
                {t('whyMaintenance.benefits.reliability.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wind className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('whyMaintenance.benefits.airQuality.title')}
              </h3>
              <p className="text-gray-600">
                {t('whyMaintenance.benefits.airQuality.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Maintenance Plans */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('plans.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('plans.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['basic', 'standard', 'premium'].map((plan) => (
              <div key={plan} className={`bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow flex flex-col ${plan === 'standard' ? 'ring-4 ring-green-500 transform scale-105' : ''}`}>
                {plan === 'standard' && (
                  <div className="bg-green-500 text-white text-center py-2 font-semibold text-sm">
                    {t('plans.recommended')}
                  </div>
                )}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {t(`plans.packages.${plan}.title`)}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t(`plans.packages.${plan}.description`)}
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      {t(`plans.packages.${plan}.price`)}
                    </span>
                    <span className="text-gray-600">
                      {t('plans.perVisit')}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {[1, 2, 3, 4, 5].map((item) => {
                      const itemText = t(`plans.packages.${plan}.features.${item}`);
                      if (!itemText || itemText === `plans.packages.${plan}.features.${item}`) return null;
                      return (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{itemText}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <Link
                    href="/contact"
                    className={`block text-center px-6 py-3 rounded-xl font-semibold transition-colors mt-auto ${
                      plan === 'standard'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {t('plans.selectPlan')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('included.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('included.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
              <div key={item} className="flex items-start gap-4 p-6 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100 hover:border-green-300 transition-colors">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {t(`included.services.${item}.title`)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t(`included.services.${item}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warning Signs */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AlertTriangle className="h-16 w-16 text-orange-600 mx-auto mb-4" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('warningSigns.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('warningSigns.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((sign) => (
              <div key={sign} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {t(`warningSigns.signs.${sign}.title`)}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {t(`warningSigns.signs.${sign}.description`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
              <Phone className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('warningSigns.emergency.title')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('warningSigns.emergency.description')}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-semibold text-lg"
              >
                <Phone className="h-5 w-5" />
                {t('warningSigns.emergency.cta')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Seasonal Maintenance */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <ThermometerSun className="h-16 w-16 text-[#003D7A] mx-auto mb-4" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('seasonal.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('seasonal.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-8 border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t('seasonal.spring.title')}
              </h3>
              <ul className="space-y-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      {t(`seasonal.spring.tasks.${item}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl p-8 border-2 border-orange-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t('seasonal.fall.title')}
              </h3>
              <ul className="space-y-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      {t(`seasonal.fall.tasks.${item}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-green-700 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-700 rounded-xl hover:bg-gray-100 transition-colors font-semibold text-lg shadow-lg"
            >
              <Calendar className="h-5 w-5" />
              {t('cta.schedule')}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-green-700 transition-colors font-semibold text-lg"
            >
              <Phone className="h-5 w-5" />
              {t('cta.contact')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
