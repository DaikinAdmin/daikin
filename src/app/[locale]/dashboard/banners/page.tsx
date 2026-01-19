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
import { Plus, Loader2, Pencil, Trash2, ExternalLink } from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";
import { NativeSelect } from "@/components/ui/native-select";
import Image from "next/image";

interface Banner {
  id: string;
  img: string;
  link: string | null;
  location: string;
  locale: string;
  isMobile: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  slug: string;
  name: string;
}

const LOCALES = [
  { value: "ua", label: "Українська" },
  { value: "en", label: "English" },
  { value: "pl", label: "Polski" },
];

export default function BannersManagementPage() {
  const router = useRouter();
  const userRole = useUserRole();

  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterLocale, setFilterLocale] = useState<string>("");
  const [filterLocation, setFilterLocation] = useState<string>("");

  const [formData, setFormData] = useState({
    img: "",
    link: "",
    location: "",
    locale: "",
    isMobile: false,
    isActive: true,
  });

  // Redirect non-admin users
  useEffect(() => {
    if (userRole && userRole !== "admin") {
      router.replace("/dashboard");
    }
  }, [userRole, router]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        
        // Формуємо список locations
        const categoryLocations = data.map((cat: Category) => ({
          value: `${cat.slug}_top`,
          label: `${cat.name} - Верх`,
        }));
        
        setLocations([
          { value: "home-top", label: "Головна - Верх" },
          ...categoryLocations,
        ]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("includeInactive", "true");
      if (filterLocale) params.append("locale", filterLocale);
      if (filterLocation) params.append("location", filterLocation);

      const response = await fetch(`/api/banners?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setBanners(data);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === "admin") {
      fetchCategories();
      fetchBanners();
    }
  }, [userRole, filterLocale, filterLocation]);

  const handleOpenDialog = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        img: banner.img,
        link: banner.link || "",
        location: banner.location,
        locale: banner.locale,
        isMobile: banner.isMobile,
        isActive: banner.isActive,
      });
    } else {
      setEditingBanner(null);
      setFormData({
        img: "",
        link: "",
        location: "",
        locale: "uk",
        isMobile: false,
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBanner(null);
    setFormData({
      img: "",
      link: "",
      location: "",
      locale: "uk",
      isMobile: false,
      isActive: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingBanner
        ? `/api/banners/${editingBanner.id}`
        : "/api/banners";
      const method = editingBanner ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchBanners();
        handleCloseDialog();
      } else {
        const error = await response.json();
        console.error("Error saving banner:", error);
        alert("Помилка при збереженні банера");
      }
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("Помилка при збереженні банера");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBanner) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/banners/${selectedBanner.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchBanners();
        setIsDeleteDialogOpen(false);
        setSelectedBanner(null);
      } else {
        const error = await response.json();
        console.error("Error deleting banner:", error);
        alert("Помилка при видаленні банера");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Помилка при видаленні банера");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLocationLabel = (value: string) => {
    return locations.find((loc) => loc.value === value)?.label || value;
  };

  const getLocaleLabel = (value: string) => {
    return LOCALES.find((loc) => loc.value === value)?.label || value;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-2xl font-bold">Управління банерами</CardTitle>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Додати банер
          </Button>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="w-48">
              <Label>Мова</Label>
              <NativeSelect
                value={filterLocale}
                onChange={(e) => setFilterLocale(e.target.value)}
              >
                <option value="">Всі мови</option>
                {LOCALES.map((locale) => (
                  <option key={locale.value} value={locale.value}>
                    {locale.label}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="w-64">
              <Label>Розміщення</Label>
              <NativeSelect
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                <option value="">Всі розміщення</option>
                {locations.map((location) => (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ))}
              </NativeSelect>
            </div>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Превью</TableHead>
                <TableHead>Розміщення</TableHead>
                <TableHead>Мова</TableHead>
                <TableHead>Пристрій</TableHead>
                <TableHead>Посилання</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Створено</TableHead>
                <TableHead className="text-right">Дії</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Банери не знайдено
                  </TableCell>
                </TableRow>
              ) : (
                banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <div className="w-32 h-20 relative rounded overflow-hidden border">
                        <Image
                          src={banner.img}
                          alt="Banner preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{getLocationLabel(banner.location)}</TableCell>
                    <TableCell>{getLocaleLabel(banner.locale)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        banner.isMobile 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-purple-100 text-purple-800"
                      }`}>
                        {banner.isMobile ? "Мобільний" : "Десктоп"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {banner.link ? (
                        <a
                          href={banner.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span className="max-w-[200px] truncate">{banner.link}</span>
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          banner.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {banner.isActive ? "Активний" : "Неактивний"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(banner.createdAt).toLocaleDateString("uk-UA")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(banner)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBanner(banner);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? "Редагувати банер" : "Створити банер"}
            </DialogTitle>
            <DialogDescription>
              Заповніть форму для {editingBanner ? "оновлення" : "створення"} банера
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="img">URL зображення *</Label>
              <Input
                id="img"
                type="text"
                placeholder="https://example.com/banner.jpg"
                value={formData.img}
                onChange={(e) =>
                  setFormData({ ...formData, img: e.target.value })
                }
                required
              />
              {formData.img && (
                <div className="w-full h-32 relative rounded overflow-hidden border mt-2">
                  <Image
                    src={formData.img}
                    alt="Banner preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Посилання (необов'язково)</Label>
              <Input
                id="link"
                type="text"
                placeholder="https://example.com/page"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Розміщення *</Label>
                <NativeSelect
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                >
                  <option value="">Оберіть розміщення</option>
                  {locations.map((location) => (
                    <option key={location.value} value={location.value}>
                      {location.label}
                    </option>
                  ))}
                </NativeSelect>
              </div>

              <div className="space-y-2">
                <Label htmlFor="locale">Мова *</Label>
                <NativeSelect
                  id="locale"
                  value={formData.locale}
                  onChange={(e) =>
                    setFormData({ ...formData, locale: e.target.value })
                  }
                  required
                >
                  {LOCALES.map((locale) => (
                    <option key={locale.value} value={locale.value}>
                      {locale.label}
                    </option>
                  ))}
                </NativeSelect>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isMobile"
                  checked={formData.isMobile}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isMobile: checked })
                  }
                />
                <Label htmlFor="isMobile">Мобільна версія</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">Активний</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isSubmitting}
              >
                Скасувати
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Збереження...
                  </>
                ) : editingBanner ? (
                  "Оновити"
                ) : (
                  "Створити"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Видалити банер?</DialogTitle>
            <DialogDescription>
              Ця дія незворотна. Банер буде видалено назавжди.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Скасувати
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Видалення...
                </>
              ) : (
                "Видалити"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
