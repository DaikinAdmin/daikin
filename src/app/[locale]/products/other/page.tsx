import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { Zap, Smartphone, Settings, Wind } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function OtherProductsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('otherProducts');

  const products = [
    {
      id: 'thermostat',
      icon: Smartphone,
      image: '/images/thermostat.jpg'
    },
    {
      id: 'vrv',
      icon: Wind,
      image: '/images/vrv.jpg'
    },
    {
      id: 'rebel',
      icon: Settings,
      image: '/images/rebel.jpg'
    },
    {
      id: 'accessories',
      icon: Zap,
      image: '/images/accessories.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#003D7A] to-[#0052CC] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-4xl mx-auto opacity-90">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-gradient-to-br from-[#F5F8FF] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#003D7A] mb-4">
              {t('products.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('products.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((product) => {
              const Icon = product.icon;
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                >
                  {/* Product Image */}
                  <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-[#003D7A] rounded-full flex items-center justify-center mb-4 mx-auto">
                          <Icon className="h-12 w-12 text-white" />
                        </div>
                      </div>
                    </div>
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#003D7A] text-white px-3 py-1 rounded-full text-sm font-medium">
                        {t(`products.${product.id}.category`)}
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-[#003D7A] mb-3">
                      {t(`products.${product.id}.name`)}
                    </h3>
                    
                    <p className="text-gray-700 mb-4">
                      {t(`products.${product.id}.description`)}
                    </p>

                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-[#003D7A] mb-2">{t('features')}:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {Array.isArray(t.raw(`products.${product.id}.features`)) && 
                          (t.raw(`products.${product.id}.features`) as string[]).map((feature: string, index: number) => (
                            <div key={index} className="flex items-center">
                              <div className="w-2 h-2 bg-[#0052CC] rounded-full mr-2"></div>
                              <span className="text-gray-700 text-sm">{feature}</span>
                            </div>
                          ))
                        }
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mt-auto mb-4">
                      <span className="text-xl font-bold text-[#003D7A]">
                        {t(`products.${product.id}.price`)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-[#003D7A] text-white rounded-lg hover:bg-[#0052CC] transition-colors font-medium flex-1">
                        {t('learnMore')}
                      </button>
                      <button className="px-4 py-2 border-2 border-[#003D7A] text-[#003D7A] rounded-lg hover:bg-[#F5F8FF] transition-colors font-medium flex-1">
                        {t('getQuote')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#003D7A] mb-4">
              {t('solutions.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#003D7A] rounded-full flex items-center justify-center mb-4 mx-auto">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#003D7A] mb-2">
                {t('solutions.smart.title')}
              </h3>
              <p className="text-gray-600">
                {t('solutions.smart.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#003D7A] rounded-full flex items-center justify-center mb-4 mx-auto">
                <Wind className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#003D7A] mb-2">
                {t('solutions.commercial.title')}
              </h3>
              <p className="text-gray-600">
                {t('solutions.commercial.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#003D7A] rounded-full flex items-center justify-center mb-4 mx-auto">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#003D7A] mb-2">
                {t('solutions.accessories.title')}
              </h3>
              <p className="text-gray-600">
                {t('solutions.accessories.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
