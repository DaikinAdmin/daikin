"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Loader2, Save, Plus, Trash2, Check, ChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUserRole } from "@/hooks/use-user-role";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  productSlug: string;
  productName: string;
  warranty: string;
  price: number;
  quantity: number;
  totalPrice: number;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type ProductOption = {
  slug: string;
  articleId: string;
  name: string;
  price: number | null;
};

export default function NewOrderPage() {
  const t = useTranslations("dashboard.orders");
  const router = useRouter();
  const userRole = useUserRole();
  const [saving, setSaving] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  // Redirect user role to orders list page
  useEffect(() => {
    if (userRole === "user") {
      router.replace("/dashboard/orders");
    }
  }, [userRole, router]);
  
  const [orderData, setOrderData] = useState({
    orderId: "",
    customerEmail: "",
    dateOfPurchase: new Date().toISOString().split("T")[0],
    nextDateOfService: "",
    daikinCoins: 0,
  });

  const [products, setProducts] = useState<Product[]>([]);
  
  // Categories and products state
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<ProductOption[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  
  // Email autocomplete state
  const [openEmailCombobox, setOpenEmailCombobox] = useState(false);
  const [emailSearchQuery, setEmailSearchQuery] = useState("");
  const [emailSuggestions, setEmailSuggestions] = useState<Array<{ email: string; name: string | null }>>([]);
  
  // Search for user emails
  useEffect(() => {
    const searchEmails = async () => {
      if (emailSearchQuery.length < 2) {
        setEmailSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(emailSearchQuery)}`);
        if (response.ok) {
          const users = await response.json();
          setEmailSuggestions(users);
        }
      } catch (error) {
        console.error("Error searching emails:", error);
      }
    };

    const debounce = setTimeout(searchEmails, 300);
    return () => clearTimeout(debounce);
  }, [emailSearchQuery]);
  
  const [newProduct, setNewProduct] = useState({
    categorySlug: "",
    productSlug: "",
    productName: "",
    warranty: "",
    price: 0,
    quantity: 1,
  });

  // Load categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Load products when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (!newProduct.categorySlug) {
        setCategoryProducts([]);
        return;
      }

      setLoadingProducts(true);
      try {
        const response = await fetch(`/api/products?categorySlug=${newProduct.categorySlug}&locale=en`);
        if (response.ok) {
          const data = await response.json();
          const productOptions: ProductOption[] = data.map((p: any) => ({
            slug: p.slug,
            articleId: p.articleId,
            name: p.productDetails?.[0]?.name || p.articleId,
            price: p.price,
          }));
          setCategoryProducts(productOptions);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [newProduct.categorySlug]);

  const calculateProductTotal = () => {
    return newProduct.price * newProduct.quantity;
  };

  const calculateOrderTotal = () => {
    return products.reduce((sum, product) => sum + product.totalPrice, 0);
  };

  const handleAddProduct = () => {
    const product: Product = {
      id: Date.now().toString(),
      productSlug: newProduct.productSlug,
      productName: newProduct.productName,
      warranty: newProduct.warranty,
      price: newProduct.price,
      quantity: newProduct.quantity,
      totalPrice: calculateProductTotal(),
    };

    setProducts([...products, product]);
    setNewProduct({
      categorySlug: "",
      productSlug: "",
      productName: "",
      warranty: "",
      price: 0,
      quantity: 1,
    });
    setCategoryProducts([]);
    setIsProductDialogOpen(false);
  };

  const handleRemoveProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleSave = async () => {
    if (!orderData.orderId || !orderData.customerEmail || products.length === 0) {
      alert("Please fill in Order ID, customer email and add at least one product");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.orderId,
          customerEmail: orderData.customerEmail,
          dateOfPurchase: orderData.dateOfPurchase,
          nextDateOfService: orderData.nextDateOfService,
          daikinCoins: orderData.daikinCoins,
          products: products.map(({ id, productName, ...product }) => product),
        }),
      });

      if (response.ok) {
        alert("Order created successfully");
        router.push("/dashboard/orders");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{t("createNewOrder")}</h1>
      </div>

      {/* Order Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t("orderInformation")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="orderId">{t("orderId")} *</Label>
            <Input
              id="orderId"
              type="text"
              value={orderData.orderId}
              onChange={(e) =>
                setOrderData({ ...orderData, orderId: e.target.value })
              }
              placeholder={t("orderIdPlaceholder")}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="customerEmail">{t("customerEmail")} *</Label>
            <Popover open={openEmailCombobox} onOpenChange={setOpenEmailCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openEmailCombobox}
                  className="w-full justify-between"
                >
                  {orderData.customerEmail || t("selectCustomerEmail")}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder={t("searchEmail")} 
                    value={emailSearchQuery}
                    onValueChange={setEmailSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>{t("noEmailFound")}</CommandEmpty>
                    <CommandGroup>
                      {emailSuggestions.map((user) => (
                        <CommandItem
                          key={user.email}
                          value={user.email}
                          onSelect={(currentValue) => {
                            setOrderData({ ...orderData, customerEmail: currentValue });
                            setOpenEmailCombobox(false);
                            setEmailSearchQuery("");
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              orderData.customerEmail === user.email ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span>{user.email}</span>
                            {user.name && <span className="text-sm text-muted-foreground">{user.name}</span>}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dateOfPurchase">{t("dateOfPurchase")}</Label>
              <Input
                id="dateOfPurchase"
                type="date"
                value={orderData.dateOfPurchase}
                onChange={(e) =>
                  setOrderData({ ...orderData, dateOfPurchase: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nextDateOfService">{t("nextDateOfService")}</Label>
              <Input
                id="nextDateOfService"
                type="date"
                value={orderData.nextDateOfService}
                onChange={(e) =>
                  setOrderData({ ...orderData, nextDateOfService: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="daikinCoins">{t("daikinCoins")}</Label>
            <Input
              id="daikinCoins"
              type="number"
              min="0"
              value={orderData.daikinCoins}
              onChange={(e) =>
                setOrderData({ ...orderData, daikinCoins: parseInt(e.target.value) || 0 })
              }
              placeholder="0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t("products")}</CardTitle>
            <Button onClick={() => setIsProductDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("addProduct")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {t("noProductsYet")}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("productSlug")}</TableHead>
                  <TableHead>{t("productName")}</TableHead>
                  <TableHead>{t("warranty")}</TableHead>
                  <TableHead>{t("price")}</TableHead>
                  <TableHead>{t("quantity")}</TableHead>
                  <TableHead>{t("total")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.productSlug}</TableCell>
                    <TableCell>{product.productName}</TableCell>
                    <TableCell>{product.warranty || "N/A"}</TableCell>
                    <TableCell>{product.price.toFixed(2)} zł</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.totalPrice.toFixed(2)} zł</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={5} className="text-right font-bold">
                    {t("totalPrice")}:
                  </TableCell>
                  <TableCell className="font-bold">
                    {calculateOrderTotal().toFixed(2)} zł
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          {t("cancel")}
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("creating")}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {t("createOrder")}
            </>
          )}
        </Button>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("addProduct")}</DialogTitle>
            <DialogDescription>
              {t("addProductDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category">{t("category")} *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {newProduct.categorySlug
                      ? categories.find((c) => c.slug === newProduct.categorySlug)?.name
                      : t("selectCategory")}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder={t("searchCategory")} />
                    <CommandList>
                      <CommandEmpty>{t("noCategoryFound")}</CommandEmpty>
                      <CommandGroup>
                        {categories.map((category) => (
                          <CommandItem
                            key={category.slug}
                            value={category.slug}
                            onSelect={(currentValue) => {
                              setNewProduct({
                                ...newProduct,
                                categorySlug: currentValue,
                                productSlug: "",
                                productName: "",
                                price: 0,
                              });
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                newProduct.categorySlug === category.slug
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {category.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="product">{t("product")} *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                    disabled={!newProduct.categorySlug || loadingProducts}
                  >
                    {loadingProducts ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("loadingProducts")}
                      </>
                    ) : newProduct.productSlug ? (
                      categoryProducts.find((p) => p.slug === newProduct.productSlug)?.name
                    ) : (
                      t("selectProduct")
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder={t("searchProduct")} />
                    <CommandList>
                      <CommandEmpty>{t("noProductFound")}</CommandEmpty>
                      <CommandGroup>
                        {categoryProducts.map((product) => (
                          <CommandItem
                            key={product.slug}
                            value={product.slug}
                            onSelect={(currentValue) => {
                              const selectedProduct = categoryProducts.find(
                                (p) => p.slug === currentValue
                              );
                              setNewProduct({
                                ...newProduct,
                                productSlug: currentValue,
                                productName: selectedProduct?.name || "",
                                price: selectedProduct?.price || 0,
                              });
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                newProduct.productSlug === product.slug
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span>{product.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {product.articleId} {product.price ? `- ${product.price.toFixed(2)} zł` : ""}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="warranty">{t("warranty")}</Label>
              <Input
                id="warranty"
                value={newProduct.warranty}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, warranty: e.target.value })
                }
                placeholder="e.g., 24 months"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">{t("price")} *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">{t("quantity")} *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={newProduct.quantity}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      quantity: parseInt(e.target.value) || 1,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="totalPrice">{t("totalPrice")}</Label>
              <Input
                id="totalPrice"
                type="number"
                value={calculateProductTotal().toFixed(2)}
                disabled
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsProductDialogOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleAddProduct}
              disabled={
                !newProduct.productSlug ||
                newProduct.price <= 0
              }
            >
              {t("addProduct")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
