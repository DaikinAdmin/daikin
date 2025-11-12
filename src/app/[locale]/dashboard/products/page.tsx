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
import { Plus, Loader2, Pencil, Trash2, Search, X } from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductTranslation = {
  locale: string;
  name: string;
  description: string;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Feature = {
  id: string;
  name: string;
  img: string | null;
};

type Product = {
  id: string;
  articleId: string;
  price: number | null;
  img: string | null;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  productDetails: ProductTranslation[];
  category: Category;
  features: Feature[];
};

export default function ProductsManagementPage() {
  const t = useTranslations("dashboard.products");
  const router = useRouter();
  const userRole = useUserRole();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allFeatures, setAllFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    articleId: "",
    price: "",
    img: "",
    categoryId: "",
    isActive: true,
    featureIds: [] as string[],
    translations: [
      { locale: "en", name: "", description: "" },
      { locale: "pl", name: "", description: "" },
      { locale: "ua", name: "", description: "" },
    ],
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
        setCategories(data.filter((c: Category & { isActive: boolean }) => c.isActive));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchFeatures = async () => {
    try {
      const response = await fetch("/api/features");
      if (response.ok) {
        const data = await response.json();
        setAllFeatures(data.filter((f: Feature & { isActive: boolean }) => f.isActive));
      }
    } catch (error) {
      console.error("Error fetching features:", error);
    }
  };

  const fetchProducts = async (search = "", categoryFilter = "") => {
    try {
      let url = "/api/products?includeInactive=true";
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (categoryFilter) url += `&categoryId=${categoryFilter}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === "admin") {
      fetchCategories();
      fetchFeatures();
      fetchProducts();
    }
  }, [userRole]);

  const handleSearch = () => {
    setLoading(true);
    fetchProducts(searchQuery, selectedCategory);
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: !product.isActive,
        }),
      });

      if (response.ok) {
        await fetchProducts(searchQuery, selectedCategory);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        articleId: product.articleId,
        price: product.price ? product.price.toString() : "",
        img: product.img || "",
        categoryId: product.categoryId,
        isActive: product.isActive,
        featureIds: product.features.map(f => f.id),
        translations: product.productDetails.length > 0
          ? product.productDetails.map(t => ({
              locale: t.locale,
              name: t.name,
              description: t.description,
            }))
          : [
              { locale: "en", name: "", description: "" },
              { locale: "pl", name: "", description: "" },
              { locale: "ua", name: "", description: "" },
            ],
      });
    } else {
      setEditingProduct(null);
      setFormData({
        articleId: "",
        price: "",
        img: "",
        categoryId: "",
        isActive: true,
        featureIds: [],
        translations: [
          { locale: "en", name: "", description: "" },
          { locale: "pl", name: "", description: "" },
          { locale: "ua", name: "", description: "" },
        ],
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const toggleFeature = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      featureIds: prev.featureIds.includes(featureId)
        ? prev.featureIds.filter(id => id !== featureId)
        : [...prev.featureIds, featureId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct.id}` 
        : "/api/products";
      
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? parseFloat(formData.price) : null,
          img: formData.img || null,
        }),
      });

      if (response.ok) {
        handleCloseDialog();
        await fetchProducts(searchQuery, selectedCategory);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/products/${selectedProduct.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIsDeleteDialogOpen(false);
        setSelectedProduct(null);
        await fetchProducts(searchQuery, selectedCategory);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
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
        <Button data-testid="create-product" onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          {t("addNewProduct")}
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder={t("filterByCategory")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allCategories")}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} variant="secondary">
              <Search className="h-4 w-4 mr-2" />
              {t("search")}
            </Button>
            {(searchQuery || selectedCategory) && (
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                  setLoading(true);
                  fetchProducts("", "");
                }}
                variant="outline"
              >
                {t("clear")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("allProducts")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("articleId")}</TableHead>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("category")}</TableHead>
                <TableHead>{t("price")}</TableHead>
                <TableHead>{t("features")}</TableHead>
                <TableHead>{t("isActive")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    {t("noProductsFound")}
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id} data-testid="product-row">
                    <TableCell className="font-medium">{product.articleId}</TableCell>
                    <TableCell>
                      {product.productDetails[0]?.name || <span className="text-muted-foreground">No name</span>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.category?.name || "—"}
                    </TableCell>
                    <TableCell>
                      {product.price ? `$${product.price.toFixed(2)}` : "—"}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {product.features.length} {t("featuresCount")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={product.isActive}
                        onCheckedChange={() => handleToggleActive(product)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <ButtonGroup>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? t("editProduct") : t("createNewProduct")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6 py-4">
              {/* Base Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">{t("baseInformation")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="articleId">{t("articleId")}</Label>
                    <Input
                      id="articleId"
                      name="articleId"
                      value={formData.articleId}
                      onChange={(e) => setFormData({ ...formData, articleId: e.target.value })}
                      required
                      placeholder="AC-2000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">{t("price")}</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="1999.99"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="img">{t("imageUrl")}</Label>
                  <Input
                    id="img"
                    name="img"
                    value={formData.img}
                    onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                    placeholder="/images/product.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryId">{t("category")}</Label>
                  <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

              {/* Features Selection */}
              <div className="space-y-4">
                <h3 className="font-semibold">{t("features")}</h3>
                <div className="border rounded-lg p-4 max-h-[200px] overflow-y-auto">
                  {allFeatures.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("noFeaturesAvailable")}</p>
                  ) : (
                    <div className="space-y-2">
                      {allFeatures.map((feature) => (
                        <div key={feature.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`feature-${feature.id}`}
                            checked={formData.featureIds.includes(feature.id)}
                            onChange={() => toggleFeature(feature.id)}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`feature-${feature.id}`} className="font-normal cursor-pointer">
                            {feature.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formData.featureIds.length} {t("featuresSelected")}
                </p>
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
                          {t("productName")}
                        </Label>
                        <Input
                          id={`translation-${translation.locale}-name`}
                          value={translation.name}
                          onChange={(e) => {
                            const newTranslations = [...formData.translations];
                            newTranslations[index].name = e.target.value;
                            setFormData({ ...formData, translations: newTranslations });
                          }}
                          placeholder={t("productNamePlaceholder")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`translation-${translation.locale}-description`}>
                          {t("description")}
                        </Label>
                        <textarea
                          id={`translation-${translation.locale}-description`}
                          value={translation.description}
                          onChange={(e) => {
                            const newTranslations = [...formData.translations];
                            newTranslations[index].description = e.target.value;
                            setFormData({ ...formData, translations: newTranslations });
                          }}
                          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder={t("descriptionPlaceholder")}
                        />
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
              <Button type="submit" data-testid="save-product" disabled={isSubmitting}>
                {isSubmitting 
                  ? (editingProduct ? t("saving") : t("creating"))
                  : (editingProduct ? t("save") : t("createProduct"))
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
              {isSubmitting ? t("deleting") : t("deleteProduct")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
