"use client";

import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

type Feature = {
  id: string;
  name: string;
  slug: string;
  img: string | null;
  preview: boolean | null;
};

type FeaturesTabProps = {
  selectedFeatureIds: string[]; // Actually slugs now
  availableFeatures: Feature[];
  onChange: (featureSlugs: string[]) => void;
  loading: boolean;
  t: (key: string) => string;
  disabled?: boolean;
  preview?: boolean;
};

export function FeaturesTab({
  selectedFeatureIds,
  availableFeatures,
  onChange,
  loading,
  t,
  disabled = false,
  preview = false,
}: FeaturesTabProps) {
  const handleToggle = (featureSlug: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedFeatureIds, featureSlug]);
    } else {
      onChange(selectedFeatureIds.filter((slug) => slug !== featureSlug));
    }
  };

  const handleSelectAll = () => {
    onChange(availableFeatures.map((f) => f.slug));
  };

  const handleDeselectAll = () => {
    onChange([]);
  };

  const testIdPrefix = preview ? "preview-feature" : "feature";

  return (
    <div className="space-y-4" data-testid={`${testIdPrefix}s-tab`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">
          {preview ? t("previewFeatures") : t("features")}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSelectAll}
            disabled={disabled || loading || availableFeatures.length === 0}
            className="text-sm text-primary hover:underline disabled:opacity-50"
            data-testid={`btn-select-all-${testIdPrefix}s`}
          >
            {t("selectAll")}
          </button>
          <span className="text-muted-foreground">|</span>
          <button
            type="button"
            onClick={handleDeselectAll}
            disabled={disabled || loading || selectedFeatureIds.length === 0}
            className="text-sm text-primary hover:underline disabled:opacity-50"
            data-testid={`btn-deselect-all-${testIdPrefix}s`}
          >
            {t("deselectAll")}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner className="h-8 w-8" />
        </div>
      ) : availableFeatures.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          {preview ? t("noPreviewFeatures") : t("noFeatures")}
        </p>
      ) : (
        <div className="border rounded-lg p-4 max-h-[400px] overflow-y-auto">
          <div className="space-y-3">
            {availableFeatures.map((feature) => {
              const isChecked = selectedFeatureIds.includes(feature.slug);
              return (
                <div
                  key={feature.id}
                  className="flex items-start space-x-3 p-2 rounded hover:bg-accent"
                  data-testid={`${testIdPrefix}-item-${feature.id}`}
                >
                  <input
                    type="checkbox"
                    id={`${testIdPrefix}-${feature.id}`}
                    checked={isChecked}
                    onChange={(e) => handleToggle(feature.slug, e.target.checked)}
                    disabled={disabled}
                    className="mt-1"
                    data-testid={`checkbox-${testIdPrefix}-${feature.id}`}
                  />
                  <Label
                    htmlFor={`${testIdPrefix}-${feature.id}`}
                    className="flex-1 cursor-pointer font-normal"
                  >
                    <div className="flex items-center gap-2">
                      {feature.img && (
                        <img
                          src={feature.img}
                          alt={feature.name}
                          className="w-6 h-6 object-contain"
                        />
                      )}
                      <span>{feature.name}</span>
                    </div>
                  </Label>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedFeatureIds.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {selectedFeatureIds.length} {preview ? t("previewFeaturesSelected") : t("featuresSelected")}
        </div>
      )}
    </div>
  );
}
