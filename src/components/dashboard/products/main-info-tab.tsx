"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { NativeSelect } from "@/components/ui/native-select";
import { generateSlug } from "@/utils/slug";

type MainInfoTabProps = {
  formData: {
    articleId: string;
    price: string;
    categorySlug: string;
    slug: string;
    energyClass: string;
    isActive: boolean;
  };
  onChange: (field: string, value: any) => void;
  categories: Array<{ id: string; name: string; slug: string }>;
  t: (key: string) => string;
  disabled?: boolean;
};

const ENERGY_CLASSES = ["None", "A", "B", "C", "D", "E", "F"];

export function MainInfoTab({
  formData,
  onChange,
  categories,
  t,
  disabled = false,
}: MainInfoTabProps) {
  const handleSlugGeneration = () => {
    if (!formData.slug && formData.articleId) {
      onChange("slug", generateSlug(formData.articleId));
    }
  };

  return (
    <div className="space-y-4" data-testid="main-info-tab">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="articleId">
            {t("articleId")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="articleId"
            data-testid="input-articleId"
            name="articleId"
            value={formData.articleId}
            onChange={(e) => onChange("articleId", e.target.value)}
            onBlur={handleSlugGeneration}
            required
            disabled={disabled}
            placeholder="AC-2000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">{t("price")}</Label>
          <Input
            id="price"
            data-testid="input-price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => onChange("price", e.target.value)}
            disabled={disabled}
            placeholder="1999.99"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">
          {t("category")} <span className="text-destructive">*</span>
        </Label>
        <NativeSelect
          id="category"
          data-testid="select-category"
          value={formData.categorySlug}
          onChange={(e) => onChange("categorySlug", e.target.value)}
          required
          disabled={disabled}
        >
          <option value="">{t("selectCategory")}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">
          {t("slug")} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="slug"
          data-testid="input-slug"
          name="slug"
          value={formData.slug}
          onChange={(e) => onChange("slug", e.target.value)}
          required
          disabled={disabled}
          placeholder="product-slug"
        />
        <p className="text-sm text-muted-foreground">
          {t("slugHelp")}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="energyClass">{t("energyClass")}</Label>
        <NativeSelect
          id="energyClass"
          data-testid="select-energyClass"
          value={formData.energyClass || "None"}
          onChange={(e) => onChange("energyClass", e.target.value)}
          disabled={disabled}
        >
          {ENERGY_CLASSES.map((energyClass) => (
            <option key={energyClass} value={energyClass}>
              {t(`energyClasses.${energyClass}`)}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="flex items-center space-x-2" data-testid="switch-isActive">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => onChange("isActive", checked)}
          disabled={disabled}
        />
        <Label htmlFor="isActive">{t("isActive")}</Label>
      </div>
    </div>
  );
}
