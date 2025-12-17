export const dynamic = "force-dynamic";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
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
import { getBuilderNews } from "@/lib/getBuilderNews";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");

  const builderArticles = await getBuilderNews(locale);

  const newsArticles = [
    {
      id: 1,
      category: "company",
      image: "/news/daikin-poland.jpg",
      date: "2025-10-15",
      readTime: "5 min",
      featured: true,
    },
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

      {/* Featured Article */}
      <section className="py-12">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden border border-gray-100 duration-300 rounded-md">
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

      {/* Builder.io Articles */}
      {builderArticles.length > 0 && (
        <section className="py-12 bg-container">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-h2-mobile lg:text-h2 mb-6">{t("latestNews")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {builderArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="block bg-white border border-gray-100 rounded-sm overflow-hidden shadow-sm"
                >
                  {article.coverImage && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-h3-mobile md:text-h3 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-main-text-mobile lg:text-main-text text-amm mb-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-gray-400 mt-2">
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString(
                          locale
                        )}
                      </span>
                      <a
                        href={`/news/${article.slug}`}
                        className="text-primary hover:underline text-main-text-mobile lg:text-main-text flex items-center gap-1"
                      >
                        {t("readMore")}
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 12h14m0 0l-6-6m6 6l-6 6"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
