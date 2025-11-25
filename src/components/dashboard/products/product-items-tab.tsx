"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Upload, Loader2, Image as ImageIcon, X } from "lucide-react";
import { uploadImage } from "@/lib/image-upload";

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

const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes

export function ProductItemsTab({
  items,
  onChange,
  t,
  disabled = false,
}: ProductItemsTabProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<number, string>>({});

  const handleChange = (index: number, field: keyof Omit<ProductItem, 'locale' | 'id'>, value: string | boolean) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, [index]: t('errorNotImage') || 'File must be an image' });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrors({ ...errors, [index]: t('errorFileSize') || 'File size must be less than 1MB' });
      return;
    }

    setUploadingIndex(index);
    setErrors({ ...errors, [index]: '' });

    try {
      const result = await uploadImage(file, { folder: 'productItems' });
      handleChange(index, 'img', result.url);
      
      // Clear the file input
      e.target.value = '';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setErrors({ ...errors, [index]: errorMessage });
    } finally {
      setUploadingIndex(null);
    }
  };

  const removeImage = (index: number) => {
    handleChange(index, 'img', '');
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
                          {t("image")}
                        </Label>
                        
                        {errors[globalIndex] && (
                          <div className="p-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                            {errors[globalIndex]}
                          </div>
                        )}

                        {item.img ? (
                          <div className="relative w-full aspect-video border rounded-lg overflow-hidden bg-muted group">
                            <img
                              src={item.img}
                              alt="Item preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <div className="hidden items-center justify-center w-full h-full bg-muted">
                              <ImageIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(globalIndex)}
                              disabled={disabled || uploadingIndex === globalIndex}
                              className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(globalIndex, e)}
                              disabled={disabled || uploadingIndex === globalIndex}
                              className="hidden"
                              id={`item-${globalIndex}-img-input`}
                              data-testid={`input-item-${locale.value}-${localIndex}-img`}
                            />
                            <Label
                              htmlFor={`item-${globalIndex}-img-input`}
                              className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed rounded-md cursor-pointer hover:bg-accent transition-colors w-full"
                            >
                              {uploadingIndex === globalIndex ? (
                                <>
                                  <Loader2 className="h-5 w-5 animate-spin" />
                                  <span>{t('uploading')}</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="h-5 w-5" />
                                  <span>{t('uploadImage')} (Max 1MB)</span>
                                </>
                              )}
                            </Label>
                          </div>
                        )}
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
