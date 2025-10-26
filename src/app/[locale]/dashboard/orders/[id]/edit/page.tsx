"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
  productId: string;
  productDescription: string;
  warranty: string;
  price: number;
  quantity: number;
  totalPrice: number;
};

type OrderData = {
  id: string;
  orderId: string;
  customerEmail: string;
  dateOfPurchase: string;
  nextDateOfService: string | null;
  totalPrice: number;
  products: Product[];
};

export default function EditOrderPage() {
  const t = useTranslations("dashboard.orders");
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const userRole = useUserRole();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null);

  // Redirect USER role to view page
  useEffect(() => {
    if (userRole === "USER") {
      router.replace(`/dashboard/orders/${orderId}`);
    }
  }, [userRole, orderId, router]);

  const [orderData, setOrderData] = useState({
    customerEmail: "",
    dateOfPurchase: "",
    nextDateOfService: "",
    daikinCoins: 0,
  });

  const [products, setProducts] = useState<Product[]>([]);
  
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
    productId: "",
    productDescription: "",
    warranty: "",
    price: 0,
    quantity: 1,
  });

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        setOrderData({
          customerEmail: data.customerEmail,
          dateOfPurchase: new Date(data.dateOfPurchase).toISOString().split("T")[0],
          nextDateOfService: data.nextDateOfService
            ? new Date(data.nextDateOfService).toISOString().split("T")[0]
            : "",
          daikinCoins: data.daikinCoins || 0,
        });
        setProducts(data.products || []);
      } else {
        alert("Failed to fetch order");
        router.back();
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      alert("Failed to fetch order");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const calculateProductTotal = () => {
    return newProduct.price * newProduct.quantity;
  };

  const calculateOrderTotal = () => {
    return products.reduce((sum, product) => sum + product.totalPrice, 0);
  };

  const handleAddProduct = () => {
    if (editingProductIndex !== null) {
      // Update existing product
      const updatedProducts = [...products];
      updatedProducts[editingProductIndex] = {
        ...updatedProducts[editingProductIndex],
        ...newProduct,
        totalPrice: calculateProductTotal(),
      };
      setProducts(updatedProducts);
      setEditingProductIndex(null);
    } else {
      // Add new product
      const product: Product = {
        id: Date.now().toString(),
        ...newProduct,
        totalPrice: calculateProductTotal(),
      };
      setProducts([...products, product]);
    }

    setNewProduct({
      productId: "",
      productDescription: "",
      warranty: "",
      price: 0,
      quantity: 1,
    });
    setIsProductDialogOpen(false);
  };

  const handleEditProduct = (index: number) => {
    const product = products[index];
    setNewProduct({
      productId: product.productId,
      productDescription: product.productDescription,
      warranty: product.warranty || "",
      price: product.price,
      quantity: product.quantity,
    });
    setEditingProductIndex(index);
    setIsProductDialogOpen(true);
  };

  const handleRemoveProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!orderData.customerEmail || products.length === 0) {
      alert("Please fill in customer email and add at least one product");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...orderData,
          products: products.map(({ id, ...product }) => product),
        }),
      });

      if (response.ok) {
        alert("Order updated successfully");
        router.push("/dashboard/orders");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Edit Order: {order.orderId}</h1>
      </div>

      {/* Order Information */}
      <Card>
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="orderId">Order ID</Label>
            <Input
              id="orderId"
              type="text"
              value={order?.orderId || ""}
              disabled
              className="bg-gray-100"
            />
            <p className="text-sm text-muted-foreground">Order ID cannot be changed</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="customerEmail">Customer Email *</Label>
            <Popover open={openEmailCombobox} onOpenChange={setOpenEmailCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openEmailCombobox}
                  className="w-full justify-between"
                >
                  {orderData.customerEmail || "Select customer email..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Search email..." 
                    value={emailSearchQuery}
                    onValueChange={setEmailSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No email found</CommandEmpty>
                    <CommandGroup>
                      {emailSuggestions.map((user) => (
                        <CommandItem
                          key={user.email}
                          value={user.email}
                          onSelect={(currentValue) => {
                            setOrderData({ ...orderData, customerEmail: currentValue })
                            setOpenEmailCombobox(false)
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
              <Label htmlFor="dateOfPurchase">Date of Purchase</Label>
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
              <Label htmlFor="nextDateOfService">Next Date of Service</Label>
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
            <Label htmlFor="daikinCoins">Daikin Coins</Label>
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
            <CardTitle>Products</CardTitle>
            <Button onClick={() => {
              setEditingProductIndex(null);
              setNewProduct({
                productId: "",
                productDescription: "",
                warranty: "",
                price: 0,
                quantity: 1,
              });
              setIsProductDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No products added yet. Click "Add Product" to add items to this order.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Warranty</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.productId}</TableCell>
                    <TableCell>{product.productDescription}</TableCell>
                    <TableCell>{product.warranty || "N/A"}</TableCell>
                    <TableCell>{product.price.toFixed(2)} zł</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.totalPrice.toFixed(2)} zł</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProduct(index)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveProduct(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={5} className="text-right font-bold">
                    Total Price:
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
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProductIndex !== null ? "Edit Product" : "Add Product"}
            </DialogTitle>
            <DialogDescription>
              Fill in the product details to {editingProductIndex !== null ? "update" : "add"} it to the order.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="productId">Product ID *</Label>
              <Input
                id="productId"
                value={newProduct.productId}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, productId: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="productDescription">Product Description *</Label>
              <Input
                id="productDescription"
                value={newProduct.productDescription}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    productDescription: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="warranty">Warranty</Label>
              <Input
                id="warranty"
                value={newProduct.warranty}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, warranty: e.target.value })
                }
                placeholder="e.g., 2 years"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price *</Label>
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
                <Label htmlFor="quantity">Quantity *</Label>
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
              <Label htmlFor="totalPrice">Total Price</Label>
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
              onClick={() => {
                setIsProductDialogOpen(false);
                setEditingProductIndex(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddProduct}
              disabled={
                !newProduct.productId ||
                !newProduct.productDescription ||
                newProduct.price <= 0
              }
            >
              {editingProductIndex !== null ? "Update Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
