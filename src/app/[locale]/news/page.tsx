import Footer from '@/components/footer';
import Header from '@/components/header';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { Calendar, Clock, ArrowRight, TrendingUp, Zap, Award } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function NewsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('news');

  const newsArticles = [
    {
      id: 1,
      category: 'company',
      image: '/news/daikin-poland.jpg',
      date: '2025-10-15',
      readTime: '5 min',
      featured: true
    },
    {
      id: 2,
      category: 'technology',
      image: '/news/ai-hvac.jpg',
      date: '2025-10-10',
      readTime: '4 min',
      featured: false
    },
    {
      id: 3,
      category: 'sustainability',
      image: '/news/green-hvac.jpg',
      date: '2025-10-05',
      readTime: '6 min',
      featured: false
    },
    {
      id: 4,
      category: 'industry',
      image: '/news/heat-pumps.jpg',
      date: '2025-09-28',
      readTime: '5 min',
      featured: false
    },
    {
      id: 5,
      category: 'innovation',
      image: '/news/smart-buildings.jpg',
      date: '2025-09-20',
      readTime: '7 min',
      featured: false
    },
    {
      id: 6,
      category: 'market',
      image: '/news/hvac-market.jpg',
      date: '2025-09-15',
      readTime: '4 min',
      featured: false
    }
  ];

  const categories = ['all', 'company', 'technology', 'sustainability', 'industry', 'innovation', 'market'];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#003D7A] via-[#0052CC] to-[#0066FF] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">{t('hero.badge')}</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
                  category === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t(`categories.${category}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <div className="text-white text-center p-8">
                    <Award className="h-20 w-20 mx-auto mb-4" />
                    <p className="text-sm font-medium">{t('featured.imageLabel')}</p>
                  </div>
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {t('categories.company')}
                  </span>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {t('articles.1.date')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {t('articles.1.readTime')}
                    </span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {t('articles.1.title')}
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {t('articles.1.excerpt')}
                </p>
                <div className="flex gap-4">
                  <Link
                    href={`/news/${newsArticles[0].id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    {t('readMore')}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {t('latestNews')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsArticles.slice(1).map((article) => (
              <article key={article.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {article.category === 'technology' && <Zap className="h-16 w-16 text-gray-500" />}
                    {article.category === 'sustainability' && <TrendingUp className="h-16 w-16 text-gray-500" />}
                    {article.category === 'industry' && <Award className="h-16 w-16 text-gray-500" />}
                    {article.category === 'innovation' && <Zap className="h-16 w-16 text-gray-500" />}
                    {article.category === 'market' && <TrendingUp className="h-16 w-16 text-gray-500" />}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {t(`categories.${article.category}`)}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {t(`articles.${article.id}.date`)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {t(`articles.${article.id}.readTime`)}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {t(`articles.${article.id}.title`)}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {t(`articles.${article.id}.excerpt`)}
                  </p>
                  <Link
                    href={`/news/${article.id}`}
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
                  >
                    {t('readMore')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            {t('newsletter.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('newsletter.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('newsletter.placeholder')}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-transparent focus:border-white focus:outline-none"
            />
            <button className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
              {t('newsletter.subscribe')}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
