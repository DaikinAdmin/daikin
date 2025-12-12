export const dynamic = 'force-dynamic';

import Footer from "@/components/footer";
import Header from "@/components/header";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import {
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Zap,
  Award,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("news");

  const newsArticles = [
    {
      id: 1,
      category: "company",
      image: "/news/daikin-poland.jpg",
      date: "2025-10-15",
      readTime: "5 min",
      featured: true,
    },
    {
      id: 2,
      category: "technology",
      image: "/news/ai-hvac.jpg",
      date: "2025-10-10",
      readTime: "4 min",
      featured: false,
    },
    {
      id: 3,
      category: "sustainability",
      image: "/news/green-hvac.jpg",
      date: "2025-10-05",
      readTime: "6 min",
      featured: false,
    },
    {
      id: 4,
      category: "industry",
      image: "/news/heat-pumps.jpg",
      date: "2025-09-28",
      readTime: "5 min",
      featured: false,
    },
    {
      id: 5,
      category: "innovation",
      image: "/news/smart-buildings.jpg",
      date: "2025-09-20",
      readTime: "7 min",
      featured: false,
    },
    {
      id: 6,
      category: "market",
      image: "/news/hvac-market.jpg",
      date: "2025-09-15",
      readTime: "4 min",
      featured: false,
    },
  ];

  const categories = [
    "all",
    "company",
    "technology",
    "sustainability",
    "industry",
    "innovation",
    "market",
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 lg:py-10">
        <div className="relative bg-primary p-8 lg:p-16 overflow-hidden text-center">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <TrendingUp className="h-5 w-5 text-white" />
              <span className="text-sm font-medium text-white">
                {t("hero.badge")}
              </span>
            </div>
            <h1 className="text-h1-mobile lg:text-h1 mb-6 text-white">
              {t("hero.title")}
            </h1>
            <p className="text-subtitle-mobile lg:text-subtitle text-blue-100 max-w-3xl mx-auto">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8"></div>
      </section>

      {/* Categories Filter */}
      <section className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                  category === "all"
                    ? "bg-primary text-white shadow-md hover:bg-[#2d96ff]"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
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
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden border border-gray-100 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto min-h-[400px]">
                <div className="absolute inset-0 bg-primary flex items-center justify-center">
                  <div className="text-white text-center p-8">
                    <Award className="h-24 w-24 mx-auto mb-6 opacity-90" />
                    <p className="text-lg font-medium opacity-90">
                      {t("featured.imageLabel")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-8 lg:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    {t("categories.company")}
                  </span>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {t("articles.1.date")}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {t("articles.1.readTime")}
                    </span>
                  </div>
                </div>
                <h2 className="text-h2-mobile lg:text-h2 text-gray-900 mb-6">
                  {t("articles.1.title")}
                </h2>
                <p className="text-main-text-mobile lg:text-main-text text-gray-600 mb-8">
                  {t("articles.1.excerpt")}
                </p>
                <div className="flex gap-4">
                  <Button asChild className="rounded-full" size="lg">
                    <Link href={`/news/${newsArticles[0].id}`}>
                      {t("readMore")}
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-h2-mobile lg:text-h2 text-gray-900">
              {t("latestNews")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsArticles.slice(1).map((article) => (
              <article
                key={article.id}
                className="bg-white border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
              >
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                    {article.category === "technology" && (
                      <Zap className="h-20 w-20 text-gray-400" />
                    )}
                    {article.category === "sustainability" && (
                      <TrendingUp className="h-20 w-20 text-gray-400" />
                    )}
                    {article.category === "industry" && (
                      <Award className="h-20 w-20 text-gray-400" />
                    )}
                    {article.category === "innovation" && (
                      <Zap className="h-20 w-20 text-gray-400" />
                    )}
                    {article.category === "market" && (
                      <TrendingUp className="h-20 w-20 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 uppercase tracking-wide">
                      {t(`categories.${article.category}`)}
                    </span>
                  </div>
                  <h3 className="text-h3-mobile lg:text-h3 text-gray-900 mb-3 group-hover:text-[#003D7A] transition-colors line-clamp-2">
                    {t(`articles.${article.id}.title`)}
                  </h3>
                  <p className="text-main-text-mobile lg:text-main-text text-gray-600 mb-6 line-clamp-3 flex-grow">
                    {t(`articles.${article.id}.excerpt`)}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {t(`articles.${article.id}.date`)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {t(`articles.${article.id}.readTime`)}
                      </span>
                    </div>
                    <Link
                      href={`/news/${article.id}`}
                      className="inline-flex items-center gap-2 text-[#003D7A] font-bold hover:gap-3 transition-all text-sm"
                    >
                      {t("readMore")}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 lg:py-16">
          <div className="relative bg-primary p-8 lg:p-20 text-center overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-h2-mobile lg:text-h1 text-white mb-6">
                {t("newsletter.title")}
              </h2>
              <p className="text-subtitle-mobile lg:text-subtitle text-blue-100 mb-10">
                {t("newsletter.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder={t("newsletter.placeholder")}
                  className="flex-1 px-8 py-4 rounded-full border-2 border-transparent focus:border-white focus:outline-none text-gray-900 placeholder-gray-500 shadow-lg"
                />
                <button className="px-10 py-4 bg-white text-[#003D7A] rounded-full font-bold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  {t("newsletter.subscribe")}
                </button>
              </div>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
