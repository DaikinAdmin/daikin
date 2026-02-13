import type { Metadata } from "next";
import prisma from "@/db";

type Props = {
  params: Promise<{ locale: string; categorySlug: string; productSlug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, categorySlug, productSlug } = await params;

  try {
    // Fetch product details from the database
    const product = await prisma.product.findUnique({
      where: { slug: productSlug },
      include: {
        productDetails: {
          where: { locale },
        },
        category: {
          include: {
            categoryDetails: {
              where: { locale },
            },
          },
        },
      },
    });

    if (!product || !product.productDetails[0]) {
      return {
        title: 'Produkt - Daikin Kobierzyce',
        description: 'Poznaj produkty Daikin',
      };
    }

    const productName = product.productDetails[0].name;
    const productDescription = product.productDetails[0].description || '';
    const categoryName = product.category.categoryDetails[0]?.name || product.category.name;
    const articleId = product.articleId;
    const price = product.price;

    const metaTitle = `${productName} - ${categoryName} | Daikin Kobierzyce`;
    const metaDescription = productDescription.length > 160 
      ? productDescription.substring(0, 157) + '...'
      : productDescription || `${productName} - profesjonalny system Daikin. ${categoryName}. Sprawdź specyfikację, cenę i dostępność.`;

    return {
      title: metaTitle,
      description: metaDescription,
      keywords: [
        productName,
        categoryName,
        'Daikin',
        articleId,
        'HVAC',
        'klimatyzacja',
        'pompy ciepła',
        'oczyszczacze powietrza'
      ],
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        url: `https://daikinkobierzyce.pl/${locale}/products/${categorySlug}/${productSlug}`,
        type: 'website',
        images: product.img && product.img.length > 0 && product.img[0].imgs.length > 0
          ? [
              {
                url: product.img[0].imgs[0],
                width: 800,
                height: 600,
                alt: productName,
              },
            ]
          : [],
      },
      ...(price && {
        other: {
          'product:price:amount': price.toString(),
          'product:price:currency': 'PLN',
        },
      }),
      alternates: {
        canonical: `/${locale}/products/${categorySlug}/${productSlug}`,
        languages: {
          'pl': `/pl/products/${categorySlug}/${productSlug}`,
          'en': `/en/products/${categorySlug}/${productSlug}`,
          'uk': `/ua/products/${categorySlug}/${productSlug}`,
        },
      },
    };
  } catch (error) {
    console.error('Error generating metadata for product:', error);
    return {
      title: 'Produkt - Daikin Kobierzyce',
      description: 'Poznaj produkty Daikin',
    };
  }
}

export default function ProductLayout({ children }: Props) {
  return <>{children}</>;
}
