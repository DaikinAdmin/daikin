"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Upload, Loader2, Image as ImageIcon, X } from "lucide-react";
import { uploadImage } from "@/lib/image-upload";
import { ProductItem, ProductItemTranslation } from "@/types/product-items";


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

  const handleChange = (index: number, field: keyof Omit<ProductItem, 'id' | 'translations'>, value: string | boolean) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleTranslationChange = (
    index: number,
    locale: string,
    field: keyof ProductItemTranslation,
    value: string | boolean
  ) => {
    const updated = [...items];
    const translationIndex = updated[index].translations.findIndex((t: ProductItemTranslation) => t.locale === locale);
    
    if (translationIndex >= 0) {
      updated[index].translations[translationIndex] = {
        ...updated[index].translations[translationIndex],
        [field]: value,
      };
    } else {
      updated[index].translations.push({
        locale,
        title: field === 'title' ? String(value) : '',
        subtitle: field === 'subtitle' ? String(value) : '',
        isActive: field === 'isActive' ? Boolean(value) : true,
      });
    }
    
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

  const addItem = () => {
    onChange([
      ...items,
      {
        title: "",
        slug: "",
        img: "",
        isActive: true,
        translations: LOCALES.map(locale => ({
          locale: locale.value,
          title: "",
          subtitle: "",
          isActive: true,
        })),
      },
    ]);
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  const getTranslation = (item: ProductItem, locale: string): ProductItemTranslation => {
    return item.translations.find((t: ProductItemTranslation) => t.locale === locale) || {
      locale,
      title: "",
      subtitle: "",
      isActive: true,
    };
  };

  return (
    <div className="space-y-4" data-testid="product-items-tab">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{t("productItems")}</h3>
        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          disabled={disabled}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("addItem")}
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <p>{t("noItemsYet")}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-6 bg-card">
              <div className="flex justify-between items-center pb-4 border-b">
                <h4 className="font-semibold text-base">
                  {t("item")} #{index + 1}
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  disabled={disabled}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              {/* Base Information */}
              <div className="space-y-4">
                <h5 className="font-medium text-sm">{t("baseInformation")}</h5>
                
                <div className="space-y-2">
                  <Label htmlFor={`item-${index}-title`}>
                    {t("title")} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`item-${index}-title`}
                    data-testid={`input-item-${index}-title`}
                    value={item.title}
                    onChange={(e) => handleChange(index, "title", e.target.value)}
                    disabled={disabled}
                    placeholder={t("itemTitlePlaceholder")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`item-${index}-slug`}>
                    {t("slug")} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`item-${index}-slug`}
                    data-testid={`input-item-${index}-slug`}
                    value={item.slug}
                    onChange={(e) => handleChange(index, "slug", e.target.value)}
                    disabled={disabled}
                    placeholder="item-slug"
                    required
                  />
                  <p className="text-xs text-muted-foreground">{t("slugHelp")}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`item-${index}-img`}>
                    {t("image")}
                  </Label>
                  
                  {errors[index] && (
                    <div className="p-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                      {errors[index]}
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
                        onClick={() => removeImage(index)}
                        disabled={disabled || uploadingIndex === index}
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
                        onChange={(e) => handleImageUpload(index, e)}
                        disabled={disabled || uploadingIndex === index}
                        className="hidden"
                        id={`item-${index}-img-input`}
                        data-testid={`input-item-${index}-img`}
                      />
                      <Label
                        htmlFor={`item-${index}-img-input`}
                        className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed rounded-md cursor-pointer hover:bg-accent transition-colors w-full"
                      >
                        {uploadingIndex === index ? (
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

                <div className="flex items-center space-x-2" data-testid={`switch-item-${index}-isActive`}>
                  <Switch
                    id={`item-${index}-isActive`}
                    checked={item.isActive}
                    onCheckedChange={(checked) => handleChange(index, "isActive", checked)}
                    disabled={disabled}
                  />
                  <Label htmlFor={`item-${index}-isActive`}>{t("isActive")}</Label>
                </div>
              </div>

              {/* Translations */}
              <div className="space-y-4">
                <h5 className="font-medium text-sm">{t("translations")}</h5>
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="pl">Polski</TabsTrigger>
                    <TabsTrigger value="ua">Українська</TabsTrigger>
                  </TabsList>
                  {LOCALES.map((locale) => {
                    const translation = getTranslation(item, locale.value);
                    return (
                      <TabsContent key={locale.value} value={locale.value} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`item-${index}-trans-${locale.value}-title`}>
                            {t("translatedTitle")} <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id={`item-${index}-trans-${locale.value}-title`}
                            data-testid={`input-item-${index}-trans-${locale.value}-title`}
                            value={translation.title}
                            onChange={(e) =>
                              handleTranslationChange(index, locale.value, "title", e.target.value)
                            }
                            disabled={disabled}
                            placeholder={t("translationPlaceholder")}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`item-${index}-trans-${locale.value}-subtitle`}>
                            {t("translatedSubtitle")}
                          </Label>
                          <Input
                            id={`item-${index}-trans-${locale.value}-subtitle`}
                            data-testid={`input-item-${index}-trans-${locale.value}-subtitle`}
                            value={translation.subtitle}
                            onChange={(e) =>
                              handleTranslationChange(index, locale.value, "subtitle", e.target.value)
                            }
                            disabled={disabled}
                            placeholder={t("descriptionPlaceholder")}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`item-${index}-trans-${locale.value}-isActive`}
                            checked={translation.isActive}
                            onCheckedChange={(checked) =>
                              handleTranslationChange(index, locale.value, "isActive", checked)
                            }
                            disabled={disabled}
                          />
                          <Label htmlFor={`item-${index}-trans-${locale.value}-isActive`}>
                            {t("translationActive")}
                          </Label>
                        </div>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

