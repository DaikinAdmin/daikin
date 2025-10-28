'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Home, Lock, LogIn } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function UnauthorizedPage() {
  const t = useTranslations('errors');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full text-center">
          {/* Error Code */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-[#003D7A] opacity-20">401</h1>
            <div className="-mt-16">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-500 rounded-full mb-6">
                <Lock className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h2 className="text-3xl lg:text-4xl font-bold text-[#003D7A] mb-4">
            {t('unauthorized.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('unauthorized.description')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signin"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#003D7A] text-white rounded-lg hover:bg-[#0052CC] transition-colors font-medium"
            >
              <LogIn className="h-5 w-5 mr-2" />
              {t('unauthorized.signIn')}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#003D7A] text-[#003D7A] rounded-lg hover:bg-[#F5F8FF] transition-colors font-medium"
            >
              <Home className="h-5 w-5 mr-2" />
              {t('unauthorized.backHome')}
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              {t('unauthorized.noAccount')}
            </p>
            <Link
              href="/signup"
              className="text-[#003D7A] hover:text-[#0052CC] font-medium text-sm"
            >
              {t('unauthorized.createAccount')}
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
