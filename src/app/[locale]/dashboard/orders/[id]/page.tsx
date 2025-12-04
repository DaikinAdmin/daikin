"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Loader2, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUserRole } from "@/hooks/use-user-role";

type OrderProduct = {
  id: string;
  productSlug: string;
  warranty: string | null;
  quantity: number;
  totalPrice: number;
  product: {
    articleId: string;
    price: number | null;
    productDetails: Array<{
      name: string;
    }>;
  };
};

type OrderData = {
  id: string;
  orderId: string;
  customerEmail: string;
  customerPhoneNumber?: string | null;
  dateOfPurchase: string;
  nextDateOfService: string | null;
  totalPrice: number;
  daikinCoins: number;
  products: OrderProduct[];
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

export default function ViewOrderPage() {
  const t = useTranslations("dashboard.orders");
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const userRole = useUserRole();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">{t("orderDetails")}</h1>
        </div>
        {(userRole === "admin" || userRole === "employee") && (
          <Button onClick={() => router.push(`/dashboard/orders/${orderId}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" />
            {t("editOrder")}
          </Button>
        )}
      </div>

      {/* Order Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t("orderInformation")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("orderId")}</p>
              <p className="text-lg font-semibold">{order.orderId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("customerEmail")}</p>
              <p className="text-lg">{order.customerEmail}</p>
            </div>
          </div>

          {(userRole === "admin" || userRole === "employee") && order.customerPhoneNumber && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("phoneNumber")}</p>
              <p className="text-lg">{order.customerPhoneNumber}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("dateOfPurchase")}</p>
              <p className="text-lg">
                {new Date(order.dateOfPurchase).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("nextDateOfService")}
              </p>
              {order.nextDateOfService ? (
                <p className={`text-lg font-medium px-3 py-1.5 rounded inline-block ${getServiceDateColor(order.nextDateOfService)}`}>
                  {new Date(order.nextDateOfService).toLocaleDateString()}
                </p>
              ) : (
                <p className="text-lg">{t("notScheduled")}</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">{t("totalPrice")}</p>
            <p className="text-2xl font-bold text-green-600">
              {order.totalPrice.toFixed(2)} zł
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">{t("daikinCoins")}</p>
            <p className="text-2xl font-bold text-blue-600">
              {order.daikinCoins}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Products */}
      <Card>
        <CardHeader>
          <CardTitle>{t("products")} ({order.products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("productId")}</TableHead>
                <TableHead>{t("productName")}</TableHead>
                <TableHead>{t("warranty")}</TableHead>
                <TableHead>{t("price")}</TableHead>
                <TableHead>{t("quantity")}</TableHead>
                <TableHead>{t("totalPrice")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.product.articleId}</TableCell>
                  <TableCell>{product.product.productDetails[0]?.name || product.productSlug}</TableCell>
                  <TableCell>{product.warranty || "N/A"}</TableCell>
                  <TableCell>{product.product.price?.toFixed(2) || "N/A"} zł</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell className="font-semibold">
                    {product.totalPrice.toFixed(2)} zł
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
