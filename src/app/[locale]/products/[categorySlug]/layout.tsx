import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string; categorySlug: string }>;
  children: React.ReactNode;
};

const categoryMetadata: Record<string, { 
  title: string; 
  description: string; 
  keywords: string[];
}> = {
  'air-conditioning': {
    title: 'Klimatyzacja - Systemy Klimatyzacyjne Daikin',
    description: 'Odkryj profesjonalne systemy klimatyzacji Daikin. Split, multi-split i VRV - energooszczędne rozwiązania dla domu i biznesu. Doskonały komfort przez cały rok.',
    keywords: ['klimatyzacja Daikin', 'systemy split', 'multi-split', 'klimatyzacja domowa', 'klimatyzacja biurowa', 'VRV systemy', 'energooszczędna klimatyzacja']
  },
  'heat-pumps': {
    title: 'Pompy Ciepła - Ekologiczne Ogrzewanie Daikin',
    description: 'Nowoczesne pompy ciepła Daikin - ekologiczne i ekonomiczne ogrzewanie domu. Powietrzne pompy ciepła najwyższej jakości. Komfort przez cały rok z minimalnym zużyciem energii.',
    keywords: ['pompy ciepła Daikin', 'powietrzne pompy ciepła', 'ekologiczne ogrzewanie', 'pompa ciepła do domu', 'energooszczędne ogrzewanie', 'systemy grzewcze']
  },
  'air-purifiers': {
    title: 'Oczyszczacze Powietrza - Czyste Powietrze w Domu',
    description: 'Zaawansowane oczyszczacze powietrza Daikin z technologią Streamer. Skuteczne usuwanie alergenów, kurzu, bakterii i wirusów. Oddychaj zdrowszym powietrzem każdego dnia.',
    keywords: ['oczyszczacze powietrza Daikin', 'filtr HEPA', 'technologia Streamer', 'oczyszczacz do domu', 'czyste powietrze', 'usuwanie alergenów', 'jakość powietrza']
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, categorySlug } = await params;
  const categoryMeta = categoryMetadata[categorySlug] || {
    title: 'Produkty Daikin',
    description: 'Poznaj pełną gamę produktów Daikin.',
    keywords: ['Daikin', 'produkty HVAC']
  };

  return {
    title: categoryMeta.title,
    description: categoryMeta.description,
    keywords: categoryMeta.keywords,
    openGraph: {
      title: categoryMeta.title,
      description: categoryMeta.description,
      url: `https://daikinkobierzyce.pl/${locale}/products/${categorySlug}`,
      type: 'website',
      images: [
        {
          url: `/og-${categorySlug}.jpg`,
          width: 1200,
          height: 630,
          alt: categoryMeta.title,
        },
      ],
    },
    alternates: {
      canonical: `/${locale}/products/${categorySlug}`,
      languages: {
        'pl': `/pl/products/${categorySlug}`,
        'en': `/en/products/${categorySlug}`,
        'uk': `/ua/products/${categorySlug}`,
      },
    },
  };
}

export default function ProductCategoryLayout({ children }: Props) {
  return <>{children}</>;
}
