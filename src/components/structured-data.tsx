import Script from 'next/script';

interface OrganizationSchemaProps {
  locale: string;
}

export function OrganizationSchema({ locale }: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AMM Salon - Daikin Kobierzyce",
    "url": "https://daikinkobierzyce.pl",
    "logo": "https://daikinkobierzyce.pl/logo.png",
    "description": locale === 'pl' 
      ? "Autoryzowany partner Daikin w Polsce. Oferujemy profesjonalne systemy klimatyzacji, pompy ciepła i oczyszczacze powietrza."
      : "Authorized Daikin partner in Poland. We offer professional air conditioning systems, heat pumps and air purifiers.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kobierzyce",
      "addressCountry": "PL"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Polish", "English", "Ukrainian"]
    },
    "sameAs": [
      // Add social media profiles here
    ]
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://daikinkobierzyce.pl${item.url}`
    }))
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  sku: string;
  price?: number;
  category: string;
  brand?: string;
}

export function ProductSchema({
  name,
  description,
  image,
  sku,
  price,
  category,
  brand = "Daikin"
}: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": image,
    "sku": sku,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "category": category,
    ...(price && {
      "offers": {
        "@type": "Offer",
        "price": price,
        "priceCurrency": "PLN",
        "availability": "https://schema.org/InStock"
      }
    })
  };

  return (
    <Script
      id="product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ArticleSchemaProps {
  title: string;
  description: string;
  image: string;
  publishedAt: string;
  url: string;
}

export function ArticleSchema({
  title,
  description,
  image,
  publishedAt,
  url
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": image,
    "datePublished": publishedAt,
    "url": url,
    "publisher": {
      "@type": "Organization",
      "name": "AMM Salon - Daikin Kobierzyce",
      "logo": {
        "@type": "ImageObject",
        "url": "https://daikinkobierzyce.pl/logo.png"
      }
    }
  };

  return (
    <Script
      id="article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
