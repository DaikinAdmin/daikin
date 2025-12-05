import { ProductPageProps } from "@/types/product";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "./ui/button";
import { Link } from "@/i18n/navigation";
import { Icon } from "@iconify/react";

export default function ProductTemplatePage({
  heroTitle,
  heroSubtitle,
  productsTitle,
  productsSubtitle,
  products,
  children,
  categorySlug
}: ProductPageProps) {
  const t = useTranslations("productPage");
  const locale = useLocale();
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-h1-mobile md:text-h1 mb-6">{heroTitle}</h1>
          <p className="text-subtitle-mobile md:text-subtitle mb-8 max-w-4xl mx-auto opacity-90">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-h1-mobile md:text-h1 text-black mb-2">{productsTitle}</h2>
            <p className="text-subtitle-mobile md:text-subtitle text-amm max-w-3xl">
              {productsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {products.map((product) => {
              return (
                <div
                  key={product.id}
                  className="bg-white overflow-hidden flex flex-col h-full"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    {/* Product Image */}
                    <img
                      src={product.img[0]?.imgs[0] || "/placeholder-image.png"}
                      alt={product.articleId}
                      className="w-full h-full object-cover"
                    />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-amm text-white px-5 py-1 rounded-full text-main-text-mobile md:text-main-text">
                        {product.category.name}
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="py-6 flex flex-col flex-grow">
                    <h3 className="text-h2-mobile md:text-h2 text-black mb-3">{product.productDetails[0].name}</h3>
                    <p className="text-main-text text-amm mb-4">
                      {product.productDetails[0].title}
                    </p>
                    {product.features && product.features.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-black text-h3-mobile md:text-h3 mb-2">
                          {t("features")}
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                          {product.features.map((f, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="flex items-center justify-center">
                                <Icon icon={f.img!} className="text-primary text-2xl" />
                              </div>
                              <span className="text-main-text text-amm text-sm">
                                {f.featureDetails[0].name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <Button
                      className="px-4 py-2 mt-3 rounded-full w-full transition-colors font-medium"
                      variant={"default"}
                    >
                      <Link href={`/products/${categorySlug}/${product.slug}`}>
                        {t("getQuote")}
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {children}
    </div>
  );
}
