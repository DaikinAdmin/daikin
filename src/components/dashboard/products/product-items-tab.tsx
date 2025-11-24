"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";

type ProductItem = {
  id?: string;
  locale: string;
  title: string;
  subtitle: string;
  img: string;
  isActive: boolean;
};

type ProductItemsTabProps = {
  items: ProductItem[];
  onChange: (items: ProductItem[]) => void;
  t: (key: string) => string;
  disabled?: boolean;
};

const LOCALES = [
  { value: "en", label: "English" },
  { value: "pl", label: "Polski" },
  { value: "ua", label: "Українська" },
];

export function ProductItemsTab({
  items,
  onChange,
  t,
  disabled = false,
}: ProductItemsTabProps) {
  const handleChange = (index: number, field: keyof Omit<ProductItem, 'locale' | 'id'>, value: string | boolean) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addItem = (locale: string) => {
    onChange([...items, { locale, title: "", subtitle: "", img: "", isActive: true }]);
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  const getItemsByLocale = (locale: string): ProductItem[] => {
    return items.filter(item => item.locale === locale);
  };

  return (
    <div className="space-y-4" data-testid="product-items-tab">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{t("productItems")}</h3>
      </div>
      <Tabs defaultValue="en" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="pl">Polski</TabsTrigger>
          <TabsTrigger value="ua">Українська</TabsTrigger>
        </TabsList>
        {LOCALES.map((locale) => {
          const localeItems = getItemsByLocale(locale.value);
          return (
            <TabsContent key={locale.value} value={locale.value} className="space-y-4">
              {localeItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>{t("noItemsYet")}</p>
                </div>
              ) : (
                localeItems.map((item, localIndex) => {
                  const globalIndex = items.findIndex((itm, i) => 
                    itm.locale === locale.value && 
                    items.filter((it, idx) => idx <= i && it.locale === locale.value).length === localIndex + 1
                  );
                  return (
                    <div key={globalIndex} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm">
                          {t("item")} #{localIndex + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(globalIndex)}
                          disabled={disabled}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`item-${globalIndex}-title`}>
                          {t("title")} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`item-${globalIndex}-title`}
                          data-testid={`input-item-${locale.value}-${localIndex}-title`}
                          value={item.title}
                          onChange={(e) => handleChange(globalIndex, "title", e.target.value)}
                          disabled={disabled}
                          placeholder={t("itemTitlePlaceholder")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`item-${globalIndex}-subtitle`}>
                          {t("subtitle")}
                        </Label>
                        <Input
                          id={`item-${globalIndex}-subtitle`}
                          data-testid={`input-item-${locale.value}-${localIndex}-subtitle`}
                          value={item.subtitle}
                          onChange={(e) => handleChange(globalIndex, "subtitle", e.target.value)}
                          disabled={disabled}
                          placeholder={t("itemSubtitlePlaceholder")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`item-${globalIndex}-img`}>
                          {t("imageUrl")}
                        </Label>
                        <Input
                          id={`item-${globalIndex}-img`}
                          data-testid={`input-item-${locale.value}-${localIndex}-img`}
                          value={item.img}
                          onChange={(e) => handleChange(globalIndex, "img", e.target.value)}
                          disabled={disabled}
                          placeholder="/images/item.jpg"
                        />
                      </div>
                      <div className="flex items-center space-x-2" data-testid={`switch-item-${locale.value}-${localIndex}-isActive`}>
                        <Switch
                          id={`item-${globalIndex}-isActive`}
                          checked={item.isActive}
                          onCheckedChange={(checked) => handleChange(globalIndex, "isActive", checked)}
                          disabled={disabled}
                        />
                        <Label htmlFor={`item-${globalIndex}-isActive`}>{t("isActive")}</Label>
                      </div>
                    </div>
                  );
                })
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => addItem(locale.value)}
                disabled={disabled}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("addItem")}
              </Button>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
