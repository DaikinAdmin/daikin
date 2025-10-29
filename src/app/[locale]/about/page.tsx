import Footer from '@/components/footer';
import Header from '@/components/header';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('about');

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#003D7A] to-[#0052A3] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl lg:text-2xl max-w-3xl mx-auto opacity-90">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#003D7A] mb-6">
                {t('overview.title')}
              </h2>
              <div className="space-y-4 text-gray-700 text-lg">
                <p>{t('overview.paragraph1')}</p>
                <p>{t('overview.paragraph2')}</p>
                <p>{t('overview.paragraph3')}</p>
              </div>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/daikin_logo.png"
                alt="AMM Salon Office"
                fill
                className="object-contain p-8 bg-gray-50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-[#003D7A] mb-2">
                {t('stats.experience')}
              </div>
              <div className="text-gray-600 text-lg">
                {t('stats.experienceLabel')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-[#003D7A] mb-2">
                {t('stats.projects')}
              </div>
              <div className="text-gray-600 text-lg">
                {t('stats.projectsLabel')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-[#003D7A] mb-2">
                {t('stats.clients')}
              </div>
              <div className="text-gray-600 text-lg">
                {t('stats.clientsLabel')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-[#003D7A] mb-2">
                {t('stats.satisfaction')}
              </div>
              <div className="text-gray-600 text-lg">
                {t('stats.satisfactionLabel')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#003D7A] mb-4">
              {t('values.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('values.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-[#003D7A] transition-colors">
              <div className="w-16 h-16 bg-[#F5F8FF] rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#003D7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#003D7A] mb-4">
                {t('values.quality.title')}
              </h3>
              <p className="text-gray-600">
                {t('values.quality.description')}
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-[#003D7A] transition-colors">
              <div className="w-16 h-16 bg-[#F5F8FF] rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#003D7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#003D7A] mb-4">
                {t('values.customer.title')}
              </h3>
              <p className="text-gray-600">
                {t('values.customer.description')}
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-[#003D7A] transition-colors">
              <div className="w-16 h-16 bg-[#F5F8FF] rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#003D7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#003D7A] mb-4">
                {t('values.innovation.title')}
              </h3>
              <p className="text-gray-600">
                {t('values.innovation.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#003D7A] mb-4">
              {t('services.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-[#003D7A] mb-3">
                {t('services.installation.title')}
              </h3>
              <p className="text-gray-600">
                {t('services.installation.description')}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-[#003D7A] mb-3">
                {t('services.maintenance.title')}
              </h3>
              <p className="text-gray-600">
                {t('services.maintenance.description')}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-[#003D7A] mb-3">
                {t('services.consultation.title')}
              </h3>
              <p className="text-gray-600">
                {t('services.consultation.description')}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-[#003D7A] mb-3">
                {t('services.warranty.title')}
              </h3>
              <p className="text-gray-600">
                {t('services.warranty.description')}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-[#003D7A] mb-3">
                {t('services.repair.title')}
              </h3>
              <p className="text-gray-600">
                {t('services.repair.description')}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-[#003D7A] mb-3">
                {t('services.modernization.title')}
              </h3>
              <p className="text-gray-600">
                {t('services.modernization.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#003D7A] mb-4">
              {t('whyUs.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#003D7A] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#003D7A] mb-2">
                  {t('whyUs.certified.title')}
                </h3>
                <p className="text-gray-600">
                  {t('whyUs.certified.description')}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#003D7A] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#003D7A] mb-2">
                  {t('whyUs.experience.title')}
                </h3>
                <p className="text-gray-600">
                  {t('whyUs.experience.description')}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#003D7A] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#003D7A] mb-2">
                  {t('whyUs.warranty.title')}
                </h3>
                <p className="text-gray-600">
                  {t('whyUs.warranty.description')}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#003D7A] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#003D7A] mb-2">
                  {t('whyUs.support.title')}
                </h3>
                <p className="text-gray-600">
                  {t('whyUs.support.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#003D7A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-white text-[#003D7A] rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg inline-block"
            >
              {t('cta.getStarted')}
            </Link>
            <a
              href="tel:+48123456789"
              className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-[#003D7A] transition-colors font-semibold text-lg inline-block"
            >
              {t('cta.contact')}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
