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
import { Plus, Loader2, Pencil, Trash2, Search, Upload } from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NativeSelect } from "@/components/ui/native-select";
import { MainInfoTab } from "@/components/dashboard/products/main-info-tab";
import { ProductDetailsTab } from "@/components/dashboard/products/product-details-tab";
import { FeaturesTab } from "@/components/dashboard/products/features-tab";
import { SpecificationsTab } from "@/components/dashboard/products/specifications-tab";
import { ProductImagesTab } from "@/components/dashboard/products/product-images-tab";
import { ProductItemsWithLookup } from "@/components/dashboard/products/product-items-with-lookup";
import { ProductItem } from "@/types/product-items";
import { Category, Feature, Image, Product, ProductDetail, Spec } from "@/types/product";


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
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bulkUploadResult, setBulkUploadResult] = useState<{
    created: number;
    updated: number;
    failed: number;
    errors: { articleId: string; error: string }[];
  } | null>(null);

  const [formData, setFormData] = useState({
    articleId: "",
    price: "",
    categorySlug: "",
    slug: "",
    energyClass: "None",
    isActive: true,
    previewFeatureSlugs: [] as string[],
    featureSlugs: [] as string[],
    translations: [] as ProductDetail[],
    specs: [] as Spec[],
    images: [] as Image[],
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
      let url = "/api/products?includeInactive=true&locale=pl";
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
      // Separate preview and regular features and get their slugs
      const preview = product.features.filter(f => f.preview === true).map(f => f.slug);
      const regular = product.features.filter(f => f.preview === false || f.preview === null).map(f => f.slug);
      
      // Transform items: map productItemDetails to translations for frontend compatibility
      const transformedItems = product.items?.map((item: any) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        img: item.img || "",
        isActive: item.isActive,
        translations: item.productItemDetails || [],
      })) || [];
      
      // Ensure all locales exist in translations
      const locales = ["en", "pl", "ua"];
      const existingTranslations = product.productDetails || [];
      const allTranslations = locales.map(locale => {
        const existing = existingTranslations.find(t => t.locale === locale);
        return existing || { locale, name: "", title: "", subtitle: "", productSlug: product.slug || "", id: "" };
      });
      
      setFormData({
        articleId: product.articleId,
        price: product.price ? product.price.toString() : "",
        categorySlug: product.category.slug,
        slug: product.slug || "",
        energyClass: product.energyClass || "None",
        isActive: product.isActive,
        previewFeatureSlugs: preview,
        featureSlugs: regular,
        translations: allTranslations,
        specs: product.specs || [],
        images: product.img || [], // 'img' is the relation name in Prisma schema
        items: transformedItems,
      });
    } else {
      setEditingProduct(null);
      // Initialize with empty translations for all locales
      const locales = ["en", "pl", "ua"];
      const emptyTranslations = locales.map(locale => ({
        locale,
        name: "",
        title: "",
        subtitle: "",
        productSlug: "",
        id: ""
      }));
      
      setFormData({
        articleId: "",
        price: "",
        categorySlug: "",
        slug: "",
        energyClass: "None",
        isActive: true,
        previewFeatureSlugs: [],
        featureSlugs: [],
        translations: emptyTranslations,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct.slug}` 
        : "/api/products";
      
      const method = editingProduct ? "PUT" : "POST";

      // Combine preview and regular features
      const allFeatureSlugs = [...formData.previewFeatureSlugs, ...formData.featureSlugs];

      // Filter out completely empty translations (all fields are empty)
      const validTranslations = formData.translations.filter(
        t => t.name!.trim() || t.title!.trim() || t.subtitle!.trim()
      );

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: formData.articleId,
          price: formData.price ? parseFloat(formData.price) : null,
          categorySlug: formData.categorySlug,
          slug: formData.slug,
          energyClass: formData.energyClass === "None" ? null : formData.energyClass,
          isActive: formData.isActive,
          featureSlugs: allFeatureSlugs,
          translations: validTranslations,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/json") {
      setSelectedFile(file);
    } else {
      alert(t("invalidFileType"));
      setSelectedFile(null);
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) {
      alert(t("noFileSelected"));
      return;
    }

    setIsSubmitting(true);
    try {
      const fileContent = await selectedFile.text();
      const products = JSON.parse(fileContent);

      const response = await fetch("/api/products/bulk-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products }),
      });

      if (response.ok) {
        const result = await response.json();
        setBulkUploadResult(result);
        setSelectedFile(null);
        await fetchProducts(searchQuery, selectedCategory);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to upload products");
      }
    } catch (error) {
      console.error("Error uploading products:", error);
      alert("Failed to parse or upload JSON file");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseBulkUploadDialog = () => {
    setIsBulkUploadDialogOpen(false);
    setSelectedFile(null);
    setBulkUploadResult(null);
  };

  const downloadSampleJSON = () => {
    const sample = [
      {
        articleId: "SAMPLE-001",
        price: 1299.99,
        categorySlug: "air-conditioning",
        slug: "sample-product-001",
        energyClass: "A",
        isActive: true,
        featureIds: [],
        translations: [
          {
            locale: "en",
            name: "Sample Product",
            title: "High-Efficiency Air Conditioner",
            subtitle: "Perfect for small to medium rooms"
          }
        ],
        specs: [
          {
            locale: "en",
            title: "Cooling Capacity",
            subtitle: "3.5 kW"
          }
        ],
        images: [
          {
            color: "White",
            imgs: ["/images/product-1.jpg"],
            url: ["/products/sample-001"]
          }
        ],
        items: [
          {
            locale: "en",
            title: "Indoor Unit",
            subtitle: "Wall-mounted",
            img: "/images/indoor-unit.jpg",
            isActive: true
          }
        ]
      }
    ];

    const blob = new Blob([JSON.stringify(sample, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products-sample.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsBulkUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            {t("bulkUpload")}
          </Button>
          <Button data-testid="create-product" onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            {t("addNewProduct")}
          </Button>
        </div>
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
                    onChange={(translations) => setFormData((prev) => ({ ...prev, translations }))}
                    t={t}
                  />
                </TabsContent>

                <TabsContent value="preview-features" className="mt-0">
                  <FeaturesTab
                    preview={true}
                    availableFeatures={previewFeatures}
                    selectedFeatureIds={formData.previewFeatureSlugs}
                    onChange={(ids) => setFormData((prev) => ({ ...prev, previewFeatureSlugs: ids }))}
                    loading={featuresLoading}
                    t={t}
                  />
                </TabsContent>

                <TabsContent value="features" className="mt-0">
                  <FeaturesTab
                    preview={false}
                    availableFeatures={regularFeatures}
                    selectedFeatureIds={formData.featureSlugs}
                    onChange={(ids) => setFormData((prev) => ({ ...prev, featureSlugs: ids }))}
                    loading={featuresLoading}
                    t={t}
                  />
                </TabsContent>

                <TabsContent value="specifications" className="mt-0">
                  <SpecificationsTab
                    specs={formData.specs}
                    onChange={(specs) => setFormData((prev) => ({ ...prev, specs }))}
                    t={t} productSlug={formData.slug}                  />
                </TabsContent>

                <TabsContent value="images" className="mt-0">
                  <ProductImagesTab
                    images={formData.images}
                    onChange={(images) => setFormData((prev) => ({ ...prev, images }))}
                    t={t}
                  />
                </TabsContent>

                <TabsContent value="items" className="mt-0">
                  <ProductItemsWithLookup
                    items={formData.items}
                    onChange={(items) => setFormData((prev) => ({ ...prev, items }))}
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

      {/* Bulk Upload Dialog */}
      <Dialog open={isBulkUploadDialogOpen} onOpenChange={setIsBulkUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("bulkUploadTitle")}</DialogTitle>
            <DialogDescription>
              {t("bulkUploadDescription")}
            </DialogDescription>
          </DialogHeader>
          
          {!bulkUploadResult ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-upload">{t("selectFile")}</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">{t("bulkUploadHelp")}</p>
                <Button
                  variant="link"
                  onClick={downloadSampleJSON}
                  className="h-auto p-0 text-sm"
                >
                  {t("downloadSample")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">{t("bulkUploadResults")}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {bulkUploadResult.created}
                    </p>
                    <p className="text-sm text-muted-foreground">{t("productsCreated")}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {bulkUploadResult.updated}
                    </p>
                    <p className="text-sm text-muted-foreground">{t("productsUpdated")}</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {bulkUploadResult.failed}
                    </p>
                    <p className="text-sm text-muted-foreground">{t("productsFailed")}</p>
                  </div>
                </div>
              </div>

              {bulkUploadResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">{t("viewErrors")}</h4>
                  <div className="max-h-60 overflow-y-auto border rounded-lg p-3 space-y-2">
                    {bulkUploadResult.errors.map((error, index) => (
                      <div
                        key={index}
                        className="bg-red-50 dark:bg-red-950/50 p-2 rounded text-sm"
                      >
                        <p className="font-medium text-red-900 dark:text-red-200">
                          {error.articleId}
                        </p>
                        <p className="text-red-700 dark:text-red-300">{error.error}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {!bulkUploadResult ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCloseBulkUploadDialog}
                  disabled={isSubmitting}
                >
                  {t("cancel")}
                </Button>
                <Button
                  onClick={handleBulkUpload}
                  disabled={!selectedFile || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("uploading")}
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      {t("uploadFile")}
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={handleCloseBulkUploadDialog}>
                {t("closeResults")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
