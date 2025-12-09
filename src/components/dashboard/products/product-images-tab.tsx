"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Upload,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { uploadImage } from "@/lib/image-upload";
import ColorPickerButton from "@/components/color-selector";
import { Image } from "@/types/product";

type ProductImagesTabProps = {
  images: Image[];
  onChange: (images: Image[]) => void;
  t: (key: string) => string;
  disabled?: boolean;
};

const MAX_FILES = 5;
const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes

export function ProductImagesTab({
  images,
  onChange,
  t,
  disabled = false,
}: ProductImagesTabProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return t("errorNotImage") || "File must be an image";
    }
    if (file.size > MAX_FILE_SIZE) {
      return t("errorFileSize") || "File size must be less than 1MB";
    }
    return null;
  };

  const handleChange = (index: number, field: keyof Image, value: any) => {
    const updated = [...images];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    const currentCount = images[index]?.imgs.length || 0;
    const totalCount = currentCount + files.length;

    if (totalCount > MAX_FILES) {
      setError(
        t("errorMaxFiles")?.replace("{max}", MAX_FILES.toString()) ||
          `Maximum ${MAX_FILES} images allowed`
      );
      return;
    }

    // Validate all files first
    for (const file of files) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setUploading(true);
    setError(null);
    setUploadProgress({ current: 0, total: files.length });

    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await uploadImage(file, { folder: "productImages" });
        uploadedUrls.push(result.url);
        setUploadProgress({ current: i + 1, total: files.length });
      }

      // Add uploaded URLs directly to the parent state
      const currentImgs = images[index]?.imgs || [];
      handleChange(index, 'imgs', [...currentImgs, ...uploadedUrls]);

      // Clear the file input
      e.target.value = "";
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
    } finally {
      setUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  const addImageGroup = () => {
    onChange([...images, {
      id: "",
      productSlug: "",
      color: "",
      imgs: [],
    }]);
  };

  const removeImageGroup = (index: number) => {
    if (confirm(t("confirmDelete"))) {
      onChange(images.filter((_, i) => i !== index));
    }
  };

  const removeImg = (groupIndex: number, imgIndex: number) => {
    if (!confirm(t("confirmDelete") || "Are you sure you want to delete this image?")) {
      return;
    }
    
    const updated = [...images];
    updated[groupIndex] = {
      ...updated[groupIndex],
      imgs: updated[groupIndex].imgs.filter((_, i) => i !== imgIndex),
    };
    onChange(updated);
  };

  const canUploadMore = (index: number) => {
    return (images[index]?.imgs.length || 0) < MAX_FILES;
  };

  return (
    <div className="space-y-4" data-testid="product-images-tab">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{t("productImages")}</h3>
        <Button
          type="button"
          variant="outline"
          onClick={addImageGroup}
          disabled={disabled}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("addImageGroup")}
        </Button>
      </div>

      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          {error}
        </div>
      )}

      {images.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <p>{t("noImages")}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {images.map((image, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-4 bg-card">
              <div className="flex justify-between items-center pb-4 border-b">
                <h4 className="font-semibold text-base">
                  {t("imageGroup")} #{index + 1}
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImageGroup(index)}
                  disabled={disabled}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`image-${index}-color`}>{t("color")}</Label>
                <Input
                  id={`image-${index}-color`}
                  data-testid={`input-image-${index}-color`}
                  value={image.color || ""}
                  onChange={(e) => handleChange(index, "color", e.target.value)}
                  disabled={disabled}
                  placeholder={t("colorPlaceholder")}
                />
                <ColorPickerButton
                  value={image.color || ""}
                  onChange={(color) => handleChange(index, "color", color)}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  {t("images")}{" "}
                  <span className="text-sm text-muted-foreground">
                    ({image.imgs.length}/{MAX_FILES})
                  </span>
                </Label>

                {canUploadMore(index) && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload(index, e)}
                      disabled={disabled || uploading}
                      className="hidden"
                      id={`image-upload-input-${index}`}
                      data-testid={`input-image-upload-${index}`}
                    />
                    <Label
                      htmlFor={`image-upload-input-${index}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-md cursor-pointer hover:bg-accent transition-colors w-full"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>
                            {t("uploading")} ({uploadProgress.current}/
                            {uploadProgress.total})
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          <span>
                            {t("uploadImages")} (Max{" "}
                            {MAX_FILES - image.imgs.length} files, 1MB each)
                          </span>
                        </>
                      )}
                    </Label>
                  </div>
                )}

                {image.imgs.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {image.imgs.map((imgUrl, imgIndex) => (
                      <div
                        key={imgIndex}
                        data-testid={`img-preview-${index}-${imgIndex}`}
                        className="relative group aspect-square border rounded-lg overflow-hidden bg-muted"
                      >
                        <img
                          src={imgUrl}
                          alt={`Preview ${imgIndex + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            target.nextElementSibling?.classList.remove("hidden");
                          }}
                        />
                        <div className="hidden items-center justify-center w-full h-full bg-muted">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImg(index, imgIndex)}
                          disabled={disabled || uploading}
                          className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`btn-remove-img-${index}-${imgIndex}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {!canUploadMore(index) && (
                  <p className="text-sm text-muted-foreground">
                    {t("maxFilesReached")?.replace("{max}", MAX_FILES.toString()) ||
                      `Maximum of ${MAX_FILES} images reached`}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
