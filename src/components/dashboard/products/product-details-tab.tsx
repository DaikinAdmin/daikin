"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ProductTranslation = {
  locale: string;
  name: string;
  title: string;
  subtitle: string;
};

type ProductDetailsTabProps = {
  translations: ProductTranslation[];
  onChange: (translations: ProductTranslation[]) => void;
  t: (key: string) => string;
  disabled?: boolean;
};

const LOCALES = [
  { value: "en", label: "English" },
  { value: "pl", label: "Polski" },
  { value: "ua", label: "Українська" },
];

export function ProductDetailsTab({
  translations,
  onChange,
  t,
  disabled = false,
}: ProductDetailsTabProps) {
  const handleChange = (locale: string, field: keyof Omit<ProductTranslation, 'locale'>, value: string) => {
    const existingIndex = translations.findIndex(tr => tr.locale === locale);
    
    if (existingIndex >= 0) {
      // Update existing translation
      const updated = [...translations];
      updated[existingIndex] = { ...updated[existingIndex], [field]: value };
      onChange(updated);
    } else {
      // Create new translation
      onChange([...translations, { locale, name: "", title: "", subtitle: "", [field]: value }]);
    }
  };

  const getTranslation = (locale: string): ProductTranslation => {
    return translations.find(t => t.locale === locale) || {
      locale,
      name: "",
      title: "",
      subtitle: "",
    };
  };

  return (
    <div className="space-y-4" data-testid="product-details-tab">
      <h3 className="font-semibold text-lg">{t("translations")}</h3>
      <Tabs defaultValue="en" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="pl">Polski</TabsTrigger>
          <TabsTrigger value="ua">Українська</TabsTrigger>
        </TabsList>
        {LOCALES.map((locale) => {
          const translation = getTranslation(locale.value);
          return (
            <TabsContent key={locale.value} value={locale.value} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`translation-${locale.value}-name`}>
                  {t("productName")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`translation-${locale.value}-name`}
                  data-testid={`input-translation-${locale.value}-name`}
                  value={translation.name}
                  onChange={(e) => handleChange(locale.value, "name", e.target.value)}
                  disabled={disabled}
                  placeholder={t("productNamePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`translation-${locale.value}-title`}>
                  {t("title")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`translation-${locale.value}-title`}
                  data-testid={`input-translation-${locale.value}-title`}
                  value={translation.title}
                  onChange={(e) => handleChange(locale.value, "title", e.target.value)}
                  disabled={disabled}
                  placeholder={t("titlePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`translation-${locale.value}-subtitle`}>
                  {t("subtitle")}
                </Label>
                <Input
                  id={`translation-${locale.value}-subtitle`}
                  data-testid={`input-translation-${locale.value}-subtitle`}
                  value={translation.subtitle}
                  onChange={(e) => handleChange(locale.value, "subtitle", e.target.value)}
                  disabled={disabled}
                  placeholder={t("subtitlePlaceholder")}
                />
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
