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
import { hex } from "framer-motion";

type ProductImage = {
  id?: string;
  color: string;
  imgs: string[];
};

type ProductImagesTabProps = {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
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
  const [formData, setFormData] = useState<ProductImage>({
    color: "",
    imgs: [],
  });
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    const currentCount = formData.imgs.length;
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

      // Add uploaded URLs to imgs array
      setFormData({
        ...formData,
        imgs: [...formData.imgs, ...uploadedUrls],
      });

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

  const handleAdd = () => {
    if (formData.imgs.length > 0) {
      onChange([...images, formData]);
      setFormData({ color: "", imgs: [] });
      setError(null);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(images[index]);
    setError(null);
  };

  const handleUpdate = () => {
    if (editingIndex !== null && formData.imgs.length > 0) {
      const updated = [...images];
      updated[editingIndex] = formData;
      onChange(updated);
      setEditingIndex(null);
      setFormData({ color: "", imgs: [] });
      setError(null);
    }
  };

  const handleDelete = (index: number) => {
    if (confirm(t("confirmDelete"))) {
      onChange(images.filter((_, i) => i !== index));
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setFormData({ color: "", imgs: [] });
    setError(null);
  };

  const removeImg = (index: number) => {
    setFormData({
      ...formData,
      imgs: formData.imgs.filter((_, i) => i !== index),
    });
  };

  const canUploadMore = formData.imgs.length < MAX_FILES;

  return (
    <div className="space-y-6" data-testid="product-images-tab">
      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-lg">
          {editingIndex !== null ? t("editImage") : t("addImage")}
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-color">{t("color")}</Label>
            <Input
              id="image-color"
              data-testid="input-image-color"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              disabled={disabled || uploading}
              placeholder={t("colorPlaceholder")}
            />

            <ColorPickerButton
              value={formData.color}
              onChange={(color) => setFormData({ ...formData, color: color })}
            />
          </div>

          <div className="space-y-2">
            <Label>
              {t("images")}{" "}
              <span className="text-sm text-muted-foreground">
                ({formData.imgs.length}/{MAX_FILES})
              </span>
            </Label>

            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}

            {canUploadMore && (
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  disabled={disabled || uploading || !canUploadMore}
                  className="hidden"
                  id="image-upload-input"
                  data-testid="input-image-upload"
                />
                <Label
                  htmlFor="image-upload-input"
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
                        {MAX_FILES - formData.imgs.length} files, 1MB each)
                      </span>
                    </>
                  )}
                </Label>
              </div>
            )}

            {formData.imgs.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {formData.imgs.map((imgUrl, index) => (
                  <div
                    key={index}
                    data-testid={`img-preview-${index}`}
                    className="relative group aspect-square border rounded-lg overflow-hidden bg-muted"
                  >
                    <img
                      src={imgUrl}
                      alt={`Preview ${index + 1}`}
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
                      onClick={() => removeImg(index)}
                      disabled={disabled || uploading}
                      className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      data-testid={`btn-remove-img-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {!canUploadMore && (
              <p className="text-sm text-muted-foreground">
                {t("maxFilesReached")?.replace("{max}", MAX_FILES.toString()) ||
                  `Maximum of ${MAX_FILES} images reached`}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {editingIndex !== null ? (
              <>
                <Button
                  data-testid="btn-update-image"
                  onClick={handleUpdate}
                  disabled={disabled || uploading || formData.imgs.length === 0}
                >
                  {t("update")}
                </Button>
                <Button
                  data-testid="btn-cancel-image"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={disabled || uploading}
                >
                  {t("cancel")}
                </Button>
              </>
            ) : (
              <Button
                data-testid="btn-add-image"
                onClick={handleAdd}
                disabled={disabled || uploading || formData.imgs.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("addImage")}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">{t("productImages")}</h3>
        {images.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {t("noImages")}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("color")}</TableHead>
                <TableHead>{t("images")}</TableHead>
                <TableHead>{t("preview")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {images.map((image, index) => (
                <TableRow key={index} data-testid={`image-row-${index}`}>
                  <TableCell>{image.color || "—"}</TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {image.imgs.length} {t("imagesCount")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {image.imgs.slice(0, 3).map((imgUrl, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="w-10 h-10 rounded border overflow-hidden bg-muted"
                        >
                          <img
                            src={imgUrl}
                            alt={`Preview ${imgIndex + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        </div>
                      ))}
                      {image.imgs.length > 3 && (
                        <div className="w-10 h-10 rounded border bg-muted flex items-center justify-center text-xs">
                          +{image.imgs.length - 3}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <ButtonGroup>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(index)}
                          disabled={disabled}
                          data-testid={`btn-edit-image-${index}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(index)}
                          disabled={disabled}
                          data-testid={`btn-delete-image-${index}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </ButtonGroup>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
