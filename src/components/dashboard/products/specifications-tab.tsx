"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";

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
  const handleChange = (index: number, field: keyof Omit<ProductSpec, 'locale' | 'id'>, value: string) => {
    const updated = [...specs];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addSpec = (locale: string) => {
    onChange([...specs, { locale, title: "", subtitle: "" }]);
  };

  const removeSpec = (index: number) => {
    const updated = specs.filter((_, i) => i !== index);
    onChange(updated);
  };

  const getSpecsByLocale = (locale: string): ProductSpec[] => {
    return specs.filter(s => s.locale === locale);
  };

  return (
    <div className="space-y-4" data-testid="specifications-tab">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{t("specifications")}</h3>
      </div>
      <Tabs defaultValue="en" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="pl">Polski</TabsTrigger>
          <TabsTrigger value="ua">Українська</TabsTrigger>
        </TabsList>
        {LOCALES.map((locale) => {
          const localeSpecs = getSpecsByLocale(locale.value);
          return (
            <TabsContent key={locale.value} value={locale.value} className="space-y-4">
              {localeSpecs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>{t("noSpecsYet")}</p>
                </div>
              ) : (
                localeSpecs.map((spec, localIndex) => {
                  const globalIndex = specs.findIndex((s, i) => 
                    s.locale === locale.value && 
                    specs.filter((sp, idx) => idx <= i && sp.locale === locale.value).length === localIndex + 1
                  );
                  return (
                    <div key={globalIndex} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm">
                          {t("specification")} #{localIndex + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSpec(globalIndex)}
                          disabled={disabled}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`spec-${globalIndex}-title`}>
                          {t("title")} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`spec-${globalIndex}-title`}
                          data-testid={`input-spec-${locale.value}-${localIndex}-title`}
                          value={spec.title}
                          onChange={(e) => handleChange(globalIndex, "title", e.target.value)}
                          disabled={disabled}
                          placeholder={t("specTitlePlaceholder")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`spec-${globalIndex}-subtitle`}>
                          {t("subtitle")}
                        </Label>
                        <Input
                          id={`spec-${globalIndex}-subtitle`}
                          data-testid={`input-spec-${locale.value}-${localIndex}-subtitle`}
                          value={spec.subtitle}
                          onChange={(e) => handleChange(globalIndex, "subtitle", e.target.value)}
                          disabled={disabled}
                          placeholder={t("specSubtitlePlaceholder")}
                        />
                      </div>
                    </div>
                  );
                })
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => addSpec(locale.value)}
                disabled={disabled}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("addSpecification")}
              </Button>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
