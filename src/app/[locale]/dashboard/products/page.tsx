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
import { NativeSelect } from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { MainInfoTab } from "@/components/dashboard/products/main-info-tab";
import { ProductDetailsTab } from "@/components/dashboard/products/product-details-tab";
import { FeaturesTab } from "@/components/dashboard/products/features-tab";
import { SpecificationsTab } from "@/components/dashboard/products/specifications-tab";
import { ProductImagesTab } from "@/components/dashboard/products/product-images-tab";
import { ProductItemsTab } from "@/components/dashboard/products/product-items-tab";

type ProductTranslation = {
  locale: string;
  name: string;
  title: string;
  subtitle: string;
};

type ProductSpec = {
  id?: string;
  locale: string;
  title: string;
  subtitle: string;
};

type ProductImage = {
  id?: string;
  color: string;
  imgs: string[];
  url: string[];
};

type ProductItem = {
  id?: string;
  locale: string;
  title: string;
  subtitle: string;
  img: string;
  isActive: boolean;
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
  preview: boolean | null;
};

type Product = {
  id: string;
  articleId: string;
  price: number | null;
  img: ProductImage[]; // Relation name in Prisma schema
  categoryId: string;
  slug: string | null;
  energyClass: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  productDetails: ProductTranslation[];
  category: Category;
  features: Feature[];
  specs: ProductSpec[];
  items: ProductItem[];
};

export default function ProductsManagementPage() {
  const t = useTranslations("dashboard.products");
  const router = useRouter();
  const userRole = useUserRole();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [previewFeatures, setPreviewFeatures] = useState<Feature[]>([]);
  const [regularFeatures, setRegularFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuresLoading, setFeaturesLoading] = useState(false);
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
    categoryId: "",
    slug: "",
    energyClass: "None",
    isActive: true,
    previewFeatureIds: [] as string[],
    featureIds: [] as string[],
    translations: [] as ProductTranslation[],
    specs: [] as ProductSpec[],
    images: [] as ProductImage[],
    items: [] as ProductItem[],
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
    setFeaturesLoading(true);
    try {
      // Fetch preview features
      const previewResponse = await fetch("/api/features?preview=true");
      if (previewResponse.ok) {
        const previewData = await previewResponse.json();
        setPreviewFeatures(previewData.filter((f: Feature & { isActive: boolean }) => f.isActive));
      }

      // Fetch regular features
      const regularResponse = await fetch("/api/features?preview=false");
      if (regularResponse.ok) {
        const regularData = await regularResponse.json();
        setRegularFeatures(regularData.filter((f: Feature & { isActive: boolean }) => f.isActive));
      }
    } catch (error) {
      console.error("Error fetching features:", error);
    } finally {
      setFeaturesLoading(false);
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
      // Separate preview and regular features
      const preview = product.features.filter(f => f.preview === true).map(f => f.id);
      const regular = product.features.filter(f => f.preview === false || f.preview === null).map(f => f.id);
      
      setFormData({
        articleId: product.articleId,
        price: product.price ? product.price.toString() : "",
        categoryId: product.categoryId,
        slug: product.slug || "",
        energyClass: product.energyClass || "None",
        isActive: product.isActive,
        previewFeatureIds: preview,
        featureIds: regular,
        translations: product.productDetails || [],
        specs: product.specs || [],
        images: product.img || [], // 'img' is the relation name in Prisma schema
        items: product.items || [],
      });
    } else {
      setEditingProduct(null);
      setFormData({
        articleId: "",
        price: "",
        categoryId: "",
        slug: "",
        energyClass: "None",
        isActive: true,
        previewFeatureIds: [],
        featureIds: [],
        translations: [],
        specs: [],
        images: [],
        items: [],
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

      // Combine preview and regular features
      const allFeatureIds = [...formData.previewFeatureIds, ...formData.featureIds];

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: formData.articleId,
          price: formData.price ? parseFloat(formData.price) : null,
          categoryId: formData.categoryId,
          slug: formData.slug,
          energyClass: formData.energyClass === "None" ? null : formData.energyClass,
          isActive: formData.isActive,
          featureIds: allFeatureIds,
          translations: formData.translations,
          specs: formData.specs,
          images: formData.images,
          items: formData.items,
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
            <NativeSelect
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-[200px]"
            >
              <option value="">{t("allCategories")}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </NativeSelect>
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
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? t("editProduct") : t("createNewProduct")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <Tabs defaultValue="main-info" className="flex-1 overflow-hidden flex flex-col">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="main-info" data-testid="tab-main-info">
                  {t("mainInformation")}
                </TabsTrigger>
                <TabsTrigger value="details" data-testid="tab-details">
                  {t("productDetails")}
                </TabsTrigger>
                <TabsTrigger value="preview-features" data-testid="tab-preview-features">
                  {t("previewFeatures")}
                </TabsTrigger>
                <TabsTrigger value="features" data-testid="tab-features">
                  {t("features")}
                </TabsTrigger>
                <TabsTrigger value="specifications" data-testid="tab-specifications">
                  {t("specifications")}
                </TabsTrigger>
                <TabsTrigger value="images" data-testid="tab-images">
                  {t("productImages")}
                </TabsTrigger>
                <TabsTrigger value="items" data-testid="tab-items">
                  {t("productItems")}
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto py-4">
                <TabsContent value="main-info" className="mt-0">
                  <MainInfoTab
                    formData={formData}
                    onChange={(field, value) => setFormData({ ...formData, [field]: value })}
                    categories={categories}
                    t={t}
                  />
                </TabsContent>

                <TabsContent value="details" className="mt-0">
                  <ProductDetailsTab
                    translations={formData.translations}
                    onChange={(translations) => setFormData({ ...formData, translations })}
                    t={t}
                  />
                </TabsContent>

                <TabsContent value="preview-features" className="mt-0">
                  <FeaturesTab
                    preview={true}
                    availableFeatures={previewFeatures}
                    selectedFeatureIds={formData.previewFeatureIds}
                    onChange={(ids) => setFormData({ ...formData, previewFeatureIds: ids })}
                    loading={featuresLoading}
                    t={t}
                  />
                </TabsContent>

                <TabsContent value="features" className="mt-0">
                  <FeaturesTab
                    preview={false}
                    availableFeatures={regularFeatures}
                    selectedFeatureIds={formData.featureIds}
                    onChange={(ids) => setFormData({ ...formData, featureIds: ids })}
                    loading={featuresLoading}
                    t={t}
                  />
                </TabsContent>

                <TabsContent value="specifications" className="mt-0">
                  <SpecificationsTab
                    specs={formData.specs}
                    onChange={(specs) => setFormData({ ...formData, specs })}
                    t={t}
                  />
                </TabsContent>

                <TabsContent value="images" className="mt-0">
                  <ProductImagesTab
                    images={formData.images}
                    onChange={(images) => setFormData({ ...formData, images })}
                    t={t}
                  />
                </TabsContent>

                <TabsContent value="items" className="mt-0">
                  <ProductItemsTab
                    items={formData.items}
                    onChange={(items) => setFormData({ ...formData, items })}
                    t={t}
                  />
                </TabsContent>
              </div>
            </Tabs>
            <DialogFooter className="mt-4">
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
