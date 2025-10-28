'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Home, Search, ArrowLeft } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function NotFound() {
  const t = useTranslations('errors');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full text-center">
          {/* Error Code */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-[#003D7A] opacity-20">404</h1>
            <div className="-mt-16">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-[#003D7A] rounded-full mb-6">
                <Search className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h2 className="text-3xl lg:text-4xl font-bold text-[#003D7A] mb-4">
            {t('notFound.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('notFound.description')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#003D7A] text-white rounded-lg hover:bg-[#0052CC] transition-colors font-medium"
            >
              <Home className="h-5 w-5 mr-2" />
              {t('notFound.backHome')}
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#003D7A] text-[#003D7A] rounded-lg hover:bg-[#F5F8FF] transition-colors font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              {t('notFound.goBack')}
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              {t('notFound.helpfulLinks')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/products/air-conditioning"
                className="text-[#003D7A] hover:text-[#0052CC] font-medium text-sm"
              >
                {t('notFound.products')}
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                href="/contact"
                className="text-[#003D7A] hover:text-[#0052CC] font-medium text-sm"
              >
                {t('notFound.contact')}
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                href="/dashboard"
                className="text-[#003D7A] hover:text-[#0052CC] font-medium text-sm"
              >
                {t('notFound.dashboard')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
