"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ProductSpec = {
  id?: string;
  locale: string;
  title: string;
  subtitle: string;
};

type SpecificationsTabProps = {
  specs: ProductSpec[];
  onChange: (specs: ProductSpec[]) => void;
  t: (key: string) => string;
  disabled?: boolean;
};

const LOCALES = [
  { value: "en", label: "English" },
  { value: "pl", label: "Polski" },
  { value: "ua", label: "Українська" },
];

export function SpecificationsTab({
  specs,
  onChange,
  t,
  disabled = false,
}: SpecificationsTabProps) {
  const handleChange = (locale: string, field: keyof Omit<ProductSpec, 'locale' | 'id'>, value: string) => {
    const existingIndex = specs.findIndex(sp => sp.locale === locale);
    
    if (existingIndex >= 0) {
      // Update existing spec
      const updated = [...specs];
      updated[existingIndex] = { ...updated[existingIndex], [field]: value };
      onChange(updated);
    } else {
      // Create new spec
      onChange([...specs, { locale, title: "", subtitle: "", [field]: value }]);
    }
  };

  const getSpec = (locale: string): ProductSpec => {
    return specs.find(s => s.locale === locale) || {
      locale,
      title: "",
      subtitle: "",
    };
  };

  return (
    <div className="space-y-4" data-testid="specifications-tab">
      <h3 className="font-semibold text-lg">{t("specifications")}</h3>
      <Tabs defaultValue="en" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="pl">Polski</TabsTrigger>
          <TabsTrigger value="ua">Українська</TabsTrigger>
        </TabsList>
        {LOCALES.map((locale) => {
          const spec = getSpec(locale.value);
          return (
            <TabsContent key={locale.value} value={locale.value} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`spec-${locale.value}-title`}>
                  {t("title")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`spec-${locale.value}-title`}
                  data-testid={`input-spec-${locale.value}-title`}
                  value={spec.title}
                  onChange={(e) => handleChange(locale.value, "title", e.target.value)}
                  disabled={disabled}
                  placeholder={t("specTitlePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`spec-${locale.value}-subtitle`}>
                  {t("subtitle")}
                </Label>
                <Input
                  id={`spec-${locale.value}-subtitle`}
                  data-testid={`input-spec-${locale.value}-subtitle`}
                  value={spec.subtitle}
                  onChange={(e) => handleChange(locale.value, "subtitle", e.target.value)}
                  disabled={disabled}
                  placeholder={t("specSubtitlePlaceholder")}
                />
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
