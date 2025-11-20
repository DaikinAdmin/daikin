"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const handleChange = (locale: string, field: keyof Omit<ProductItem, 'locale' | 'id'>, value: string | boolean) => {
    const existingIndex = items.findIndex(item => item.locale === locale);
    
    if (existingIndex >= 0) {
      // Update existing item
      const updated = [...items];
      updated[existingIndex] = { ...updated[existingIndex], [field]: value };
      onChange(updated);
    } else {
      // Create new item
      onChange([...items, { locale, title: "", subtitle: "", img: "", isActive: true, [field]: value }]);
    }
  };

  const getItem = (locale: string): ProductItem => {
    return items.find(item => item.locale === locale) || {
      locale,
      title: "",
      subtitle: "",
      img: "",
      isActive: true,
    };
  };

  return (
    <div className="space-y-4" data-testid="product-items-tab">
      <h3 className="font-semibold text-lg">{t("productItems")}</h3>
      <Tabs defaultValue="en" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="pl">Polski</TabsTrigger>
          <TabsTrigger value="ua">Українська</TabsTrigger>
        </TabsList>
        {LOCALES.map((locale) => {
          const item = getItem(locale.value);
          return (
            <TabsContent key={locale.value} value={locale.value} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`item-${locale.value}-title`}>
                  {t("title")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`item-${locale.value}-title`}
                  data-testid={`input-item-${locale.value}-title`}
                  value={item.title}
                  onChange={(e) => handleChange(locale.value, "title", e.target.value)}
                  disabled={disabled}
                  placeholder={t("itemTitlePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`item-${locale.value}-subtitle`}>
                  {t("subtitle")}
                </Label>
                <Input
                  id={`item-${locale.value}-subtitle`}
                  data-testid={`input-item-${locale.value}-subtitle`}
                  value={item.subtitle}
                  onChange={(e) => handleChange(locale.value, "subtitle", e.target.value)}
                  disabled={disabled}
                  placeholder={t("itemSubtitlePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`item-${locale.value}-img`}>
                  {t("imageUrl")}
                </Label>
                <Input
                  id={`item-${locale.value}-img`}
                  data-testid={`input-item-${locale.value}-img`}
                  value={item.img}
                  onChange={(e) => handleChange(locale.value, "img", e.target.value)}
                  disabled={disabled}
                  placeholder="/images/item.jpg"
                />
              </div>
              <div className="flex items-center space-x-2" data-testid={`switch-item-${locale.value}-isActive`}>
                <Switch
                  id={`item-${locale.value}-isActive`}
                  checked={item.isActive}
                  onCheckedChange={(checked) => handleChange(locale.value, "isActive", checked)}
                  disabled={disabled}
                />
                <Label htmlFor={`item-${locale.value}-isActive`}>{t("isActive")}</Label>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
