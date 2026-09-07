"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ButtonGroup } from "@/components/ui/button-group";
import { ImagePickerDialog } from "@/components/dashboard/image-picker-dialog";
import {
  Plus,
  Loader2,
  Trash2,
  Pencil,
  ImageIcon,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";
import { useTranslations } from "next-intl";

type Photo = {
  id: string;
  img: string;
  alt: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type PhotoForm = {
  img: string;
  alt: string;
  isActive: boolean;
};

const emptyForm: PhotoForm = { img: "", alt: "", isActive: true };

export default function RealizationsManagementPage() {
  const t = useTranslations("dashboard.realizations");
  const router = useRouter();
  const userRole = useUserRole();

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);
  const [form, setForm] = useState<PhotoForm>(emptyForm);

  // Redirect non-admin users
  useEffect(() => {
    if (userRole && userRole !== "admin") {
      router.replace("/dashboard");
    }
  }, [userRole, router]);

  const fetchPhotos = async () => {
    try {
      const response = await fetch("/api/realizations?includeInactive=true");
      if (response.ok) {
        setPhotos(await response.json());
      } else {
        console.error("Failed to fetch realization photos");
      }
    } catch (error) {
      console.error("Error fetching realization photos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === "admin") {
      fetchPhotos();
    }
  }, [userRole]);

  const openCreateDialog = () => {
    setEditingPhoto(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const openEditDialog = (photo: Photo) => {
    setEditingPhoto(photo);
    setForm({
      img: photo.img,
      alt: photo.alt ?? "",
      isActive: photo.isActive,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.img) {
      alert(t("imageRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        editingPhoto ? `/api/realizations/${editingPhoto.id}` : "/api/realizations",
        {
          method: editingPhoto ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            img: form.img,
            alt: form.alt || null,
            isActive: form.isActive,
          }),
        }
      );

      if (response.ok) {
        setIsFormOpen(false);
        setEditingPhoto(null);
        setForm(emptyForm);
        await fetchPhotos();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save photo");
      }
    } catch (error) {
      console.error("Error saving photo:", error);
      alert("Failed to save photo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (photo: Photo) => {
    try {
      const response = await fetch(`/api/realizations/${photo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !photo.isActive }),
      });

      if (response.ok) {
        await fetchPhotos();
      }
    } catch (error) {
      console.error("Error updating photo:", error);
    }
  };

  /** Move a photo one position up or down and persist the new order. */
  const handleMove = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= photos.length) return;

    const reordered = [...photos];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setPhotos(reordered);

    setIsReordering(true);
    try {
      const response = await fetch("/api/realizations/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: reordered.map((p) => p.id) }),
      });

      if (response.ok) {
        setPhotos(await response.json());
      } else {
        // Restore the server order when the update failed
        await fetchPhotos();
      }
    } catch (error) {
      console.error("Error reordering photos:", error);
      await fetchPhotos();
    } finally {
      setIsReordering(false);
    }
  };

  const handleDelete = async () => {
    if (!photoToDelete) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/realizations/${photoToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIsDeleteOpen(false);
        setPhotoToDelete(null);
        await fetchPhotos();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete photo");
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      alert("Failed to delete photo");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userRole !== "admin") {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          {t("addPhoto")}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">{t("orderHint")}</p>

      <Card>
        <CardHeader>
          <CardTitle>{t("allPhotos")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[110px]">{t("order")}</TableHead>
                <TableHead>{t("preview")}</TableHead>
                <TableHead>{t("alt")}</TableHead>
                <TableHead>{t("active")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {photos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    {t("noPhotos")}
                  </TableCell>
                </TableRow>
              ) : (
                photos.map((photo, index) => (
                  <TableRow key={photo.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="w-6 text-sm text-muted-foreground">
                          {index + 1}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={index === 0 || isReordering}
                          onClick={() => handleMove(index, -1)}
                          aria-label={t("moveUp")}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={index === photos.length - 1 || isReordering}
                          onClick={() => handleMove(index, 1)}
                          aria-label={t("moveDown")}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-28 h-20 rounded overflow-hidden border">
                        <img
                          src={photo.img}
                          alt={photo.alt ?? ""}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[260px]">
                      {photo.alt || (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={photo.isActive}
                        onCheckedChange={() => handleToggleActive(photo)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <ButtonGroup>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(photo)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setPhotoToDelete(photo);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </ButtonGroup>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create / Edit dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPhoto ? t("editPhoto") : t("addPhoto")}
            </DialogTitle>
            <DialogDescription>{t("formDescription")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("image")}</Label>
              {form.img ? (
                <div className="w-full h-40 rounded border overflow-hidden">
                  <img
                    src={form.img}
                    alt="realization"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setIsPickerOpen(true)}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                {form.img ? t("changeImage") : t("selectImage")}
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo-alt">{t("alt")}</Label>
              <Input
                id="photo-alt"
                value={form.alt}
                placeholder={t("altPlaceholder")}
                onChange={(e) => setForm({ ...form, alt: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="photo-active">{t("active")}</Label>
              <Switch
                id="photo-active"
                checked={form.isActive}
                onCheckedChange={(checked) =>
                  setForm({ ...form, isActive: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFormOpen(false)}
              disabled={isSubmitting}
            >
              {t("cancel")}
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("saving")}
                </>
              ) : (
                t("save")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image picker */}
      <ImagePickerDialog
        open={isPickerOpen}
        onOpenChange={setIsPickerOpen}
        value={form.img}
        defaultFolder="realization"
        onSelect={(url) => setForm((prev) => ({ ...prev, img: url }))}
      />

      {/* Delete confirmation */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("areYouSure")}</DialogTitle>
            <DialogDescription>{t("deleteConfirmation")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isSubmitting}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? t("deleting") : t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
