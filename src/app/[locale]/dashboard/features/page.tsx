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
import { Feature } from "@/types/feature";
import { generateSlug } from "@/utils/slug";
import IconPicker from "@/components/icons-picker";

export default function FeaturesManagementPage() {
  const t = useTranslations("dashboard.features");
  const router = useRouter();
  const userRole = useUserRole();

  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    img: "",
    isActive: true,
    preview: false,
    translations: [
      { locale: "en", name: "", desc: "", isActive: true },
      { locale: "pl", name: "", desc: "", isActive: true },
      { locale: "ua", name: "", desc: "", isActive: true },
    ],
  });

  // Redirect non-admin users
  useEffect(() => {
    if (userRole && userRole !== "admin") {
      router.replace("/dashboard");
    }
  }, [userRole, router]);

  const fetchFeatures = async (search = "") => {
    try {
      const url = search
        ? `/api/features?search=${encodeURIComponent(
            search
          )}&includeInactive=true`
        : "/api/features?includeInactive=true";

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setFeatures(data);
      } else {
        console.error("Failed to fetch features");
      }
    } catch (error) {
      console.error("Error fetching features:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === "admin") {
      fetchFeatures();
    }
  }, [userRole]);

  const handleSearch = () => {
    setLoading(true);
    fetchFeatures(searchQuery);
  };

  const handleToggleActive = async (feature: Feature) => {
    try {
      const response = await fetch(`/api/features/${feature.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: !feature.isActive,
        }),
      });

      if (response.ok) {
        await fetchFeatures(searchQuery);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update feature");
      }
    } catch (error) {
      console.error("Error updating feature:", error);
      alert("Failed to update feature");
    }
  };

  const handleOpenDialog = (feature?: Feature) => {
    if (feature) {
      setEditingFeature(feature);
      setFormData({
        name: feature.name,
        slug: feature.slug,
        img: feature.img || "",
        isActive: feature.isActive,
        preview: feature.preview || false,
        translations:
          feature.featureDetails.length > 0
            ? feature.featureDetails.map((t) => ({
                locale: t.locale,
                name: t.name,
                desc: t.desc || "",
                isActive: t.isActive,
              }))
            : [
                { locale: "en", name: "", desc: "", isActive: true },
                { locale: "pl", name: "", desc: "", isActive: true },
                { locale: "ua", name: "", desc: "", isActive: true },
              ],
      });
    } else {
      setEditingFeature(null);
      setFormData({
        name: "",
        slug: "",
        img: "",
        isActive: true,
        preview: false,
        translations: [
          { locale: "en", name: "", desc: "", isActive: true },
          { locale: "pl", name: "", desc: "", isActive: true },
          { locale: "ua", name: "", desc: "", isActive: true },
        ],
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingFeature(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingFeature
        ? `/api/features/${editingFeature.id}`
        : "/api/features";

      const method = editingFeature ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          img: formData.img || null,
        }),
      });

      if (response.ok) {
        handleCloseDialog();
        await fetchFeatures(searchQuery);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save feature");
      }
    } catch (error) {
      console.error("Error saving feature:", error);
      alert("Failed to save feature");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFeature) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/features/${selectedFeature.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIsDeleteDialogOpen(false);
        setSelectedFeature(null);
        await fetchFeatures(searchQuery);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete feature");
      }
    } catch (error) {
      console.error("Error deleting feature:", error);
      alert("Failed to delete feature");
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
        <Button data-testid="create-feature" onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          {t("addNewFeature")}
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
                  fetchFeatures("");
                }}
                variant="outline"
              >
                {t("clear")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Features Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("allFeatures")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("slug")}</TableHead>
                <TableHead>{t("image")}</TableHead>
                <TableHead>{t("productsCount")}</TableHead>
                <TableHead>{t("isActive")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    {t("noFeaturesFound")}
                  </TableCell>
                </TableRow>
              ) : (
                features.map((feature) => (
                  <TableRow key={feature.id} data-testid="feature-row">
                    <TableCell className="font-medium">
                      {feature.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {feature.slug}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {feature.img ? (
                        <span className="text-xs truncate max-w-[200px] block">
                          {feature.img}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">No image</span>
                      )}
                    </TableCell>
                    <TableCell>{feature._count?.products || 0}</TableCell>
                    <TableCell>
                      <Switch
                        checked={feature.isActive}
                        onCheckedChange={() => handleToggleActive(feature)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <ButtonGroup>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(feature)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedFeature(feature);
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
              {editingFeature ? t("editFeature") : t("createNewFeature")}
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
                        slug: editingFeature
                          ? formData.slug
                          : generateSlug(name),
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
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="feature-slug"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("slugHelp")}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="img">{t("imageUrl")}</Label>
                  <Input
                    id="img"
                    name="img"
                    value={formData.img}
                    onChange={(e) =>
                      setFormData({ ...formData, img: e.target.value })
                    }
                    placeholder="/icons/feature.svg"
                  />
                  <IconPicker
                    value={formData.img}
                    onChange={(iconPath) =>
                      setFormData({ ...formData, img: iconPath })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("imageHelp")}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: checked })
                    }
                  />
                  <Label htmlFor="isActive">{t("isActive")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="preview"
                    name="preview"
                    checked={formData.preview}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, preview: checked })
                    }
                  />
                  <Label htmlFor="preview">{t("preview")}</Label>
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
                    <TabsContent
                      key={translation.locale}
                      value={translation.locale}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label
                          htmlFor={`translation-${translation.locale}-name`}
                        >
                          {t("translatedName")}
                        </Label>
                        <Input
                          id={`translation-${translation.locale}-name`}
                          value={translation.name}
                          onChange={(e) => {
                            const newTranslations = [...formData.translations];
                            newTranslations[index].name = e.target.value;
                            setFormData({
                              ...formData,
                              translations: newTranslations,
                            });
                          }}
                          placeholder={t("translationPlaceholder")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor={`translation-${translation.locale}-desc`}
                        >
                          {t("translatedDescription")}
                        </Label>
                        <Input
                          id={`translation-${translation.locale}-desc`}
                          value={translation.desc}
                          onChange={(e) => {
                            const newTranslations = [...formData.translations];
                            newTranslations[index].desc = e.target.value;
                            setFormData({
                              ...formData,
                              translations: newTranslations,
                            });
                          }}
                          placeholder={t("descriptionPlaceholder")}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`translation-${translation.locale}-active`}
                          checked={translation.isActive}
                          onCheckedChange={(checked) => {
                            const newTranslations = [...formData.translations];
                            newTranslations[index].isActive = checked;
                            setFormData({
                              ...formData,
                              translations: newTranslations,
                            });
                          }}
                        />
                        <Label
                          htmlFor={`translation-${translation.locale}-active`}
                        >
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
              <Button
                type="submit"
                data-testid="save-feature"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? editingFeature
                    ? t("saving")
                    : t("creating")
                  : editingFeature
                  ? t("save")
                  : t("createFeature")}
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
            <DialogDescription>{t("deleteConfirmation")}</DialogDescription>
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
              {isSubmitting ? t("deleting") : t("deleteFeature")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
