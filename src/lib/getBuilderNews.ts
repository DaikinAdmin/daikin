const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY;
const MODEL = process.env.NEXT_PUBLIC_BUILDER_NEWS_MODEL || "news";

export type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  body?: string;
  locale: string;
};

export async function getBuilderNews(locale?: string): Promise<NewsArticle[]> {
  if (!BUILDER_API_KEY) {
    console.warn(
      "Builder.io API key is missing. Set NEXT_PUBLIC_BUILDER_API_KEY in .env.local"
    );
    return [];
  }

  try {
    const url = new URL(`https://cdn.builder.io/api/v3/content/${MODEL}`);
    url.searchParams.set("apiKey", BUILDER_API_KEY);
    url.searchParams.set("limit", "20");
    url.searchParams.set("noTargeting", "true");

    if (locale) {
      const query = {
        $and: [
          { "data.locale": { $eq: locale } },
          { published: { $eq: "published" } },
        ],
      };
      url.searchParams.set("query", JSON.stringify(query));
      console.log("🔍 Builder.io query for locale:", locale);
      console.log("📝 Query JSON:", JSON.stringify(query, null, 2));
    }

    console.log("🌐 Full API URL:", url.toString());

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      console.error(
        "❌ Builder.io API error:",
        JSON.stringify(
          { status: res.status, statusText: res.statusText, body: errorText },
          null,
          2
        )
      );
      return [];
    }

    const data = await res.json();
    console.log("✅ Builder.io raw response:", JSON.stringify(data, null, 2));
    let results = data?.results || [];
    console.log(`📊 Total results received BEFORE filtering: ${results.length}`);
    
    if (results.length > 0) {
      console.log("📋 Article locales in response:", results.map((r: any) => ({
        title: r.data?.title,
        locale: r.data?.locale,
        slug: r.data?.slug
      })));
    }

    // Manual filtering by locale if Builder.io query didn't work
    if (locale && results.length > 0) {
      const beforeFilter = results.length;
      results = results.filter((item: any) => item.data?.locale === locale);
      console.log(`🔍 Filtered by locale "${locale}": ${beforeFilter} → ${results.length} articles`);
    }

    if (results.length === 0) {
      console.info(
        "⚠️ Builder.io returned 0 results after filtering",
        JSON.stringify({ url: url.toString(), locale }, null, 2)
      );
    }

    return results.map((item: any) => {
      const rawSlug = item.data?.slug || "";
      const normalizedSlug = rawSlug.startsWith("/")
        ? rawSlug.slice(1)
        : rawSlug;

      return {
        id: item.id || item.data?.id || "",
        title: item.data?.title || "",
        slug: normalizedSlug,
        excerpt: item.data?.excerpt || "",
        coverImage: item.data?.coverImage || "",
        publishedAt: item.data?.publishedAt || new Date().toISOString(),
        locale: item.data?.locale || locale || "en",
      };
    });
  } catch (error) {
    console.error("Failed to fetch Builder.io articles:", error);
    return [];
  }
}

export async function getBuilderNewsBySlug(
  slug: string,
  locale?: string
): Promise<NewsArticle | null> {
  if (!BUILDER_API_KEY) {
    console.warn(
      "Builder.io API key is missing. Set NEXT_PUBLIC_BUILDER_API_KEY in .env.local"
    );
    return null;
  }

  try {
    const url = new URL(`https://cdn.builder.io/api/v3/content/${MODEL}`);
    url.searchParams.set("apiKey", BUILDER_API_KEY);
    url.searchParams.set("limit", "1");
    url.searchParams.set("noTargeting", "true");

    // Try both slug formats: with and without leading slash
    const query: any = {
      $and: [
        {
          $or: [
            { "data.slug": { $eq: slug } },
            { "data.slug": { $eq: `/${slug}` } },
          ],
        },
      ],
    };

    if (locale) {
      query.$and.push({ "data.locale": { $eq: locale } });
    }

    url.searchParams.set("query", JSON.stringify(query));
    console.log("🔍 Builder.io query for slug & locale:", slug, locale);
    console.log("📝 Query JSON:", JSON.stringify(query, null, 2));
    console.log("🌐 Full API URL:", url.toString());

    const res = await fetch(url.toString(), { next: { revalidate: 60 } });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      console.error(
        "❌ Builder.io API error:",
        JSON.stringify(
          { status: res.status, statusText: res.statusText, body: errorText },
          null,
          2
        )
      );
      return null;
    }

    const data = await res.json();
    const results = data?.results || [];

    if (results.length === 0) {
      console.info(
        `⚠️ Builder.io returned 0 results for slug "${slug}" and locale "${locale}"`
      );
      return null;
    }

    const item = results[0];

    const rawSlug = item.data?.slug || "";
    const normalizedSlug = rawSlug.startsWith("/") ? rawSlug.slice(1) : rawSlug;

    return {
      id: item.id || item.data?.id || "",
      title: item.data?.title || "",
      slug: normalizedSlug,
      excerpt: item.data?.excerpt || "",
      coverImage: item.data?.coverImage || "",
      body: item.data?.body || "",
      publishedAt: item.data?.publishedAt || new Date().toISOString(),
      locale: item.data?.locale || locale || "en",
    };
  } catch (error) {
    console.error("Failed to fetch Builder.io article by slug:", error);
    return null;
  }
}
