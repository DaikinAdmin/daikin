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
import { NativeSelect } from "@/components/ui/native-select";
import { ImagePickerDialog } from "@/components/dashboard/image-picker-dialog";
import { Plus, Loader2, Trash2, Pencil, ImageIcon } from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";
import { useTranslations } from "next-intl";
import { BANNER_LOCATIONS, BANNER_LOCALE_PRIORITY } from "@/lib/banners";

type Banner = {
  id: string;
  img: string;
  link: string | null;
  location: string;
  locale: string;
  isActive: boolean;
  isMobile: boolean;
  createdAt: string;
  updatedAt: string;
};

type BannerForm = {
  img: string;
  link: string;
  location: string;
  locale: string;
  isActive: boolean;
  isMobile: boolean;
};

const emptyForm: BannerForm = {
  img: "",
  link: "",
  location: BANNER_LOCATIONS[0],
  locale: BANNER_LOCALE_PRIORITY[0],
  isActive: true,
  isMobile: false,
};

export default function BannersManagementPage() {
  const t = useTranslations("dashboard.banners");
  const router = useRouter();
  const userRole = useUserRole();

  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
  const [form, setForm] = useState<BannerForm>(emptyForm);
  const [locationFilter, setLocationFilter] = useState("");

  // Redirect non-admin users
  useEffect(() => {
    if (userRole && userRole !== "admin") {
      router.replace("/dashboard");
    }
  }, [userRole, router]);

  const fetchBanners = async () => {
    try {
      const response = await fetch("/api/banners");
      if (response.ok) {
        setBanners(await response.json());
      } else {
        console.error("Failed to fetch banners");
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === "admin") {
      fetchBanners();
    }
  }, [userRole]);

  const openCreateDialog = () => {
    setEditingBanner(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const openEditDialog = (banner: Banner) => {
    setEditingBanner(banner);
    setForm({
      img: banner.img,
      link: banner.link ?? "",
      location: banner.location,
      locale: banner.locale,
      isActive: banner.isActive,
      isMobile: banner.isMobile,
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
        editingBanner ? `/api/banners/${editingBanner.id}` : "/api/banners",
        {
          method: editingBanner ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            img: form.img,
            link: form.link || null,
            location: form.location,
            locale: form.locale,
            isActive: form.isActive,
            isMobile: form.isMobile,
          }),
        }
      );

      if (response.ok) {
        setIsFormOpen(false);
        setEditingBanner(null);
        setForm(emptyForm);
        await fetchBanners();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save banner");
      }
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("Failed to save banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      const response = await fetch(`/api/banners/${banner.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });

      if (response.ok) {
        await fetchBanners();
      }
    } catch (error) {
      console.error("Error updating banner:", error);
    }
  };

  const handleDelete = async () => {
    if (!bannerToDelete) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/banners/${bannerToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIsDeleteOpen(false);
        setBannerToDelete(null);
        await fetchBanners();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete banner");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Failed to delete banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibleBanners = locationFilter
    ? banners.filter((b) => b.location === locationFilter)
    : banners;

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
          {t("addBanner")}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">{t("fallbackHint")}</p>

      <Card>
        <CardContent className="pt-6">
          <NativeSelect
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full sm:w-[260px]"
          >
            <option value="">{t("allLocations")}</option>
            {BANNER_LOCATIONS.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </NativeSelect>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("allBanners")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("preview")}</TableHead>
                <TableHead>{t("location")}</TableHead>
                <TableHead>{t("locale")}</TableHead>
                <TableHead>{t("device")}</TableHead>
                <TableHead>{t("link")}</TableHead>
                <TableHead>{t("active")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleBanners.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground"
                  >
                    {t("noBanners")}
                  </TableCell>
                </TableRow>
              ) : (
                visibleBanners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <div className="w-28 h-16 relative rounded overflow-hidden border">
                        <img
                          src={banner.img}
                          alt={banner.location}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {banner.location}
                    </TableCell>
                    <TableCell className="uppercase">{banner.locale}</TableCell>
                    <TableCell>
                      {banner.isMobile ? t("mobile") : t("desktop")}
                    </TableCell>
                    <TableCell>
                      {banner.link ? (
                        <a
                          href={banner.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate block max-w-[180px]"
                        >
                          {banner.link}
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={banner.isActive}
                        onCheckedChange={() => handleToggleActive(banner)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <ButtonGroup>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(banner)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setBannerToDelete(banner);
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
              {editingBanner ? t("editBanner") : t("addBanner")}
            </DialogTitle>
            <DialogDescription>{t("formDescription")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("image")}</Label>
              {form.img ? (
                <div className="w-full h-32 rounded border overflow-hidden">
                  <img
                    src={form.img}
                    alt="banner"
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="banner-location">{t("location")}</Label>
                <NativeSelect
                  id="banner-location"
                  className="w-full"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                >
                  {BANNER_LOCATIONS.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </NativeSelect>
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner-locale">{t("locale")}</Label>
                <NativeSelect
                  id="banner-locale"
                  className="w-full"
                  value={form.locale}
                  onChange={(e) => setForm({ ...form, locale: e.target.value })}
                >
                  {BANNER_LOCALE_PRIORITY.map((locale) => (
                    <option key={locale} value={locale}>
                      {locale.toUpperCase()}
                    </option>
                  ))}
                </NativeSelect>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner-link">{t("link")}</Label>
              <Input
                id="banner-link"
                value={form.link}
                placeholder="https://..."
                onChange={(e) => setForm({ ...form, link: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="banner-mobile">{t("isMobile")}</Label>
              <Switch
                id="banner-mobile"
                checked={form.isMobile}
                onCheckedChange={(checked) =>
                  setForm({ ...form, isMobile: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="banner-active">{t("active")}</Label>
              <Switch
                id="banner-active"
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
        defaultFolder="banners"
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
