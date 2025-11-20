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
import { Pencil, Trash2, Plus, X } from "lucide-react";

type ProductImage = {
  id?: string;
  color: string;
  imgs: string[];
  url: string[];
};

type ProductImagesTabProps = {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  t: (key: string) => string;
  disabled?: boolean;
};

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
    url: [],
  });
  const [currentImg, setCurrentImg] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");

  const handleAdd = () => {
    if (formData.imgs.length > 0 || formData.url.length > 0) {
      onChange([...images, formData]);
      setFormData({ color: "", imgs: [], url: [] });
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(images[index]);
  };

  const handleUpdate = () => {
    if (editingIndex !== null && (formData.imgs.length > 0 || formData.url.length > 0)) {
      const updated = [...images];
      updated[editingIndex] = formData;
      onChange(updated);
      setEditingIndex(null);
      setFormData({ color: "", imgs: [], url: [] });
    }
  };

  const handleDelete = (index: number) => {
    if (confirm(t("confirmDelete"))) {
      onChange(images.filter((_, i) => i !== index));
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setFormData({ color: "", imgs: [], url: [] });
    setCurrentImg("");
    setCurrentUrl("");
  };

  const addImg = () => {
    if (currentImg.trim()) {
      setFormData({ ...formData, imgs: [...formData.imgs, currentImg.trim()] });
      setCurrentImg("");
    }
  };

  const removeImg = (index: number) => {
    setFormData({
      ...formData,
      imgs: formData.imgs.filter((_, i) => i !== index),
    });
  };

  const addUrl = () => {
    if (currentUrl.trim()) {
      setFormData({ ...formData, url: [...formData.url, currentUrl.trim()] });
      setCurrentUrl("");
    }
  };

  const removeUrl = (index: number) => {
    setFormData({
      ...formData,
      url: formData.url.filter((_, i) => i !== index),
    });
  };

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
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              disabled={disabled}
              placeholder={t("colorPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("images")}</Label>
            <div className="flex gap-2">
              <Input
                data-testid="input-image-path"
                value={currentImg}
                onChange={(e) => setCurrentImg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImg())}
                disabled={disabled}
                placeholder="/images/product-1.jpg"
              />
              <Button
                type="button"
                data-testid="btn-add-img"
                onClick={addImg}
                disabled={disabled || !currentImg.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.imgs.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.imgs.map((img, index) => (
                  <div
                    key={index}
                    data-testid={`img-badge-${index}`}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                  >
                    <span className="truncate max-w-[200px]">{img}</span>
                    <button
                      type="button"
                      onClick={() => removeImg(index)}
                      disabled={disabled}
                      className="hover:text-destructive"
                      data-testid={`btn-remove-img-${index}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t("urls")}</Label>
            <div className="flex gap-2">
              <Input
                data-testid="input-image-url"
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
                disabled={disabled}
                placeholder="https://example.com/image.jpg"
              />
              <Button
                type="button"
                data-testid="btn-add-url"
                onClick={addUrl}
                disabled={disabled || !currentUrl.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.url.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.url.map((url, index) => (
                  <div
                    key={index}
                    data-testid={`url-badge-${index}`}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                  >
                    <span className="truncate max-w-[200px]">{url}</span>
                    <button
                      type="button"
                      onClick={() => removeUrl(index)}
                      disabled={disabled}
                      className="hover:text-destructive"
                      data-testid={`btn-remove-url-${index}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {editingIndex !== null ? (
              <>
                <Button
                  data-testid="btn-update-image"
                  onClick={handleUpdate}
                  disabled={disabled || (formData.imgs.length === 0 && formData.url.length === 0)}
                >
                  {t("update")}
                </Button>
                <Button
                  data-testid="btn-cancel-image"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={disabled}
                >
                  {t("cancel")}
                </Button>
              </>
            ) : (
              <Button
                data-testid="btn-add-image"
                onClick={handleAdd}
                disabled={disabled || (formData.imgs.length === 0 && formData.url.length === 0)}
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
                <TableHead>{t("urls")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {images.map((image, index) => (
                <TableRow key={index} data-testid={`image-row-${index}`}>
                  <TableCell>{image.color || "—"}</TableCell>
                  <TableCell>
                    <span className="text-sm">{image.imgs.length} {t("imagesCount")}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{image.url.length} {t("urlsCount")}</span>
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
