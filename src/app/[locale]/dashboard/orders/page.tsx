"use client";

import { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, Loader2, Eye, Search } from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";
import { useTranslations } from "next-intl";

type OrderProduct = {
  id: string;
  productId: string;
  productDescription: string;
  warranty: string | null;
  price: number;
  quantity: number;
  totalPrice: number;
  daikinCoins: number;
};

type Order = {
  id: string;
  orderId: string;
  customerEmail: string;
  dateOfPurchase: string;
  nextDateOfService: string | null;
  totalPrice: number;
  daikinCoins: number;
  products: OrderProduct[];
  createdAt: string;
};

// Helper function to get service date color based on days until service
const getServiceDateColor = (serviceDate: string | null): string => {
  if (!serviceDate) return "";
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const service = new Date(serviceDate);
  service.setHours(0, 0, 0, 0);
  
  const diffTime = service.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    // Service date has passed (1 day after or more)
    return "bg-red-100 text-red-900";
  } else if (diffDays < 7) {
    // Less than 7 days
    return "bg-orange-100 text-orange-900";
  } else if (diffDays < 30) {
    // Less than 30 days
    return "bg-yellow-100 text-yellow-900";
  } else {
    // More than 30 days
    return "bg-green-100 text-green-900";
  }
};

export default function OrdersPage() {
  const t = useTranslations("dashboard.orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const userRole = useUserRole();

  const fetchOrders = async (search = "") => {
    try {
      const url = search 
        ? `/api/orders?search=${encodeURIComponent(search)}`
        : "/api/orders";
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = () => {
    setLoading(true);
    fetchOrders(searchQuery);
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIsDeleteDialogOpen(false);
        setSelectedOrder(null);
        await fetchOrders(searchQuery);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    router.push(`/dashboard/orders/${order.id}`);
  };

  const handleEditOrder = (order: Order) => {
    router.push(`/dashboard/orders/${order.id}/edit`);
  };

  const handleNewOrder = () => {
    router.push("/dashboard/orders/new");
  };

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
        <h1 className="text-h2-mobile md:text-h2">{t("title")}</h1>
        {(userRole === "admin" || userRole === "employee") && (
          <Button onClick={handleNewOrder}>
            <Plus className="mr-2 h-4 w-4" />
            {t("addNewOrder")}
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder={
                userRole === "user" 
                  ? t("searchByOrderId")
                  : t("searchPlaceholder")
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="rounded-full px-6" variant="secondary">
              <Search className="h-4 w-4 mr-2" />
              {t("search")}
            </Button>
            {searchQuery && (
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setLoading(true);
                  fetchOrders("");
                }}
                variant="outline"
              >
                {t("clear")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {userRole === "user" ? t("myOrders") : t("allOrders")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("orderId")}</TableHead>
                {(userRole === "admin" || userRole === "employee") && (
                  <TableHead>{t("customerEmail")}</TableHead>
                )}
                <TableHead>{t("dateOfPurchase")}</TableHead>
                <TableHead>{t("dateOfService")}</TableHead>
                <TableHead>{t("totalPrice")}</TableHead>
                {userRole === "user" && (
                  <TableHead>{t("daikinCoins")}</TableHead>
                )}
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={userRole === "user" ? 6 : 6} 
                    className="text-center text-muted-foreground"
                  >
                    {t("noOrdersFound")}
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderId}</TableCell>
                    {(userRole === "admin" || userRole === "employee") && (
                      <TableCell>{order.customerEmail}</TableCell>
                    )}
                    <TableCell>
                      {new Date(order.dateOfPurchase).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {order.nextDateOfService ? (
                        <span className={`px-2 py-1 rounded font-medium ${getServiceDateColor(order.nextDateOfService)}`}>
                          {new Date(order.nextDateOfService).toLocaleDateString()}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>{order.totalPrice.toFixed(2)} zł</TableCell>
                    {userRole === "user" && (
                      <TableCell>{order.daikinCoins}</TableCell>
                    )}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(userRole === "admin" || userRole === "employee") && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditOrder(order)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            {userRole === "admin" && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

            {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("areYouSure")}</DialogTitle>
            <DialogDescription>
              {t("deleteConfirmation")}
              <strong> {selectedOrder?.orderId}</strong>
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
              onClick={handleDeleteOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? t("deleting") : t("deleteOrder")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
