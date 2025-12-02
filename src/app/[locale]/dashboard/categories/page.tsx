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
import { Plus, Loader2, Pencil, Trash2, Search } from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateSlug } from "@/utils/slug";

type CategoryTranslation = {
  locale: string;
  name: string;
  isActive: boolean;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  categoryDetails: CategoryTranslation[];
  _count?: {
    products: number;
  };
};

export default function CategoriesManagementPage() {
  const t = useTranslations("dashboard.categories");
  const router = useRouter();
  const userRole = useUserRole();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    isActive: true,
    translations: [
      { locale: "en", name: "", isActive: true },
      { locale: "pl", name: "", isActive: true },
      { locale: "ua", name: "", isActive: true },
    ],
  });

  // Redirect non-admin users
  useEffect(() => {
    if (userRole && userRole !== "admin") {
      router.replace("/dashboard");
    }
  }, [userRole, router]);

  const fetchCategories = async (search = "") => {
    try {
      const url = search 
        ? `/api/categories?search=${encodeURIComponent(search)}&includeInactive=true`
        : "/api/categories?includeInactive=true";
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === "admin") {
      fetchCategories();
    }
  }, [userRole]);

  const handleSearch = () => {
    setLoading(true);
    fetchCategories(searchQuery);
  };

  const handleToggleActive = async (category: Category) => {
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: !category.isActive,
        }),
      });

      if (response.ok) {
        await fetchCategories(searchQuery);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category");
    }
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        isActive: category.isActive,
        translations: category.categoryDetails.length > 0
          ? category.categoryDetails.map(t => ({
              locale: t.locale,
              name: t.name,
              isActive: t.isActive,
            }))
          : [
              { locale: "en", name: "", isActive: true },
              { locale: "pl", name: "", isActive: true },
              { locale: "ua", name: "", isActive: true },
            ],
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        slug: "",
        isActive: true,
        translations: [
          { locale: "en", name: "", isActive: true },
          { locale: "pl", name: "", isActive: true },
          { locale: "ua", name: "", isActive: true },
        ],
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingCategory 
        ? `/api/categories/${editingCategory.id}` 
        : "/api/categories";
      
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        handleCloseDialog();
        await fetchCategories(searchQuery);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIsDeleteDialogOpen(false);
        setSelectedCategory(null);
        await fetchCategories(searchQuery);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
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
        <Button data-testid="create-category" onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          {t("addNewCategory")}
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} variant="secondary">
              <Search className="h-4 w-4 mr-2" />
              {t("search")}
            </Button>
            {searchQuery && (
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setLoading(true);
                  fetchCategories("");
                }}
                variant="outline"
              >
                {t("clear")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("allCategories")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("slug")}</TableHead>
                <TableHead>{t("productsCount")}</TableHead>
                <TableHead>{t("isActive")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    {t("noCategoriesFound")}
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id} data-testid="category-row">
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                    <TableCell>{category._count?.products || 0}</TableCell>
                    <TableCell>
                      <Switch
                        checked={category.isActive}
                        onCheckedChange={() => handleToggleActive(category)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <ButtonGroup>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(category)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedCategory(category);
                              setIsDeleteDialogOpen(true);
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? t("editCategory") : t("createNewCategory")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Base Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">{t("baseInformation")}</h3>
                <div className="space-y-2">
                  <Label htmlFor="name">{t("name")}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({ 
                        ...formData, 
                        name,
                        slug: editingCategory ? formData.slug : generateSlug(name)
                      });
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">{t("slug")}</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">{t("slugHelp")}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">{t("isActive")}</Label>
                </div>
              </div>

              {/* Translations */}
              <div className="space-y-4">
                <h3 className="font-semibold">{t("translations")}</h3>
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="pl">Polski</TabsTrigger>
                    <TabsTrigger value="ua">Українська</TabsTrigger>
                  </TabsList>
                  {formData.translations.map((translation, index) => (
                    <TabsContent key={translation.locale} value={translation.locale} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`translation-${translation.locale}-name`}>
                          {t("translatedName")}
                        </Label>
                        <Input
                          id={`translation-${translation.locale}-name`}
                          value={translation.name}
                          onChange={(e) => {
                            const newTranslations = [...formData.translations];
                            newTranslations[index].name = e.target.value;
                            setFormData({ ...formData, translations: newTranslations });
                          }}
                          placeholder={t("translationPlaceholder")}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`translation-${translation.locale}-active`}
                          checked={translation.isActive}
                          onCheckedChange={(checked) => {
                            const newTranslations = [...formData.translations];
                            newTranslations[index].isActive = checked;
                            setFormData({ ...formData, translations: newTranslations });
                          }}
                        />
                        <Label htmlFor={`translation-${translation.locale}-active`}>
                          {t("translationActive")}
                        </Label>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" data-testid="save-category" disabled={isSubmitting}>
                {isSubmitting 
                  ? (editingCategory ? t("saving") : t("creating"))
                  : (editingCategory ? t("save") : t("createCategory"))
                }
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("areYouSure")}</DialogTitle>
            <DialogDescription>
              {t("deleteConfirmation")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? t("deleting") : t("deleteCategory")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
