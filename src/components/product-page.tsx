import { ProductPageProps } from "@/types/product";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button"; 

export default function ProductTemplatePage({
  heroTitle,
  heroSubtitle,
  productsTitle,
  productsSubtitle,
  featuresTitle,
  products,
  benefits,
  iconMap,
  children,
}: ProductPageProps) {
  const t = useTranslations("productPage");
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-h2 lg:text-h1 mb-6">{heroTitle}</h1>
          <p className="text-subtitle lg:text-subtitle mb-8 max-w-4xl mx-auto opacity-90">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-h1 text-black mb-2">
              {productsTitle}
            </h2>
            <p className="text-subtitle text-amm max-w-3xl">
              {productsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {products.map((product) => {
              const Icon = iconMap[product.iconName];
              return (
                <div
                  key={product.id}
                  className="bg-white overflow-hidden flex flex-col h-full"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 bg-amm rounded-full flex items-center justify-center mb-4 mx-auto">
                        {Icon && <Icon className="h-12 w-12 text-white" />}
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-amm text-white px-5 py-1 rounded-full text-main-text">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="py-6 flex flex-col flex-grow">
                    <h3 className="text-h2 text-black mb-3">
                      {product.name}
                    </h3>
                    <p className="text-main-text text-amm text-justify mb-4">{product.description}</p>

                    {/* Product Features */}
                    {product.features && product.features.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-black text-h3 mb-2">
                          {t("features")}
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                          {product.features.slice(0, 3).map((f, i) => (
                            <div key={i} className="flex items-center">
                              <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                              <span className="text-main-text text-amm text-sm">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                      <Button className="px-4 py-2 rounded-full max-w-64 transition-colors font-medium" variant={"default"}>
                        {t("getQuote")}
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
