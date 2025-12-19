import { notFound } from "next/navigation";
import { getBuilderNewsBySlug, NewsArticle } from "@/lib/getBuilderNews";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import Header from "@/components/header";
import Footer from "@/components/footer";
import parse from 'html-react-parser';
import { ar } from "zod/v4/locales";

interface Props {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function NewsArticlePage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const article: NewsArticle | null = await getBuilderNewsBySlug(slug, locale);

  if (!article) {
    notFound(); // якщо немає статті – Next.js поверне 404
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8 py-4">
        <h1 className="text-h1-mobile lg:text-h1 mb-2">{article.title}</h1>
        <p className="text-amm mb-6">
          {new Date(article.publishedAt).toLocaleDateString(locale)}
        </p>
        <div className="relative h-96 w-full mb-6">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover rounded-sm"
          />
        </div>
        <div className="prose max-w-none text-main-text-mobile lg:text-main-text text-amm">
            {parse(article.body || article.excerpt)}
        </div>
      </div>
      <Footer />
    </div>
  );
}
