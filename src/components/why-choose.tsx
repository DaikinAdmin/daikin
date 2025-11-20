import { WhyChooseProps } from "@/types/product";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";

export default function WhyChooseSection({
  title,
  subtitle,
  leftItem,
  rightItems,
}: WhyChooseProps) {
  const t = useTranslations("whyChoose");

  return (
    <div>
      {/* WHY CHOOSE Section */}
      <section className="py-4">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-h1">{title}</h2>
            <p className="text-subtitle mx-auto">{subtitle}</p>
          </div>

          <div className="flex flex-col md:flex-row gap-12 items-start">
            {/* LEFT COLUMN */}
            <div className="w-full md:w-[70%] flex flex-col">
              <img
                src={leftItem.image}
                alt={leftItem.title}
                className="w-full object-cover"
              />
              <div className="mt-auto flex flex-col">
                <p className="mt-3 text-h3">{leftItem.title}</p>
                <p className="mt-3 text-main-text">{leftItem.description}</p>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full md:w-[30%] flex flex-col gap-8">
              {rightItems.map((item) => (
                <div key={item.id} className="flex flex-col h-full">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full object-cover"
                  />
                  <div className="mt-auto flex flex-col">
                    <p className="mt-3 text-h3">{item.title}</p>
                    <p className="mt-4 text-main-text">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section — статична */}
      <section className="py-16">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:text-left max-w-3xl">
              <h2 className="text-h1 mb-4">{t("cta.title")}</h2>
              <p className="text-subtitle opacity-90">{t("cta.subtitle")}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                className="px-20 py-2 rounded-full transition-colors font-medium flex-1"
                variant="default"
              >
                {t("cta.consultation")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
