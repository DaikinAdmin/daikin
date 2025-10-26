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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Search, Mail, Wrench } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/use-user-role";
import { useUserProfile } from "@/hooks/use-user-profile";

type OrderProduct = {
  id: string;
  productId: string;
  productDescription: string;
  warranty: string | null;
  price: number;
  quantity: number;
  totalPrice: number;
};

type ServiceRequest = {
  id: string;
  dateOfProposedService: string;
  dateOfService: string | null;
  serviceDetails: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  user?: {
    name: string;
    email: string;
  };
};

type Service = {
  id: string;
  orderId: string;
  customerEmail: string;
  nextDateOfService: string;
  notificationSent30Days: boolean;
  notificationSent7Days: boolean;
  products: OrderProduct[];
  services: ServiceRequest[];
};

export default function ServicesPage() {
  const t = useTranslations("dashboard.services");
  const userRole = useUserRole();
  const { userProfile } = useUserProfile();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sendingNotification, setSendingNotification] = useState<string | null>(null);
  
  // Service request dialog state
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isSubmittingService, setIsSubmittingService] = useState(false);
  const [serviceFormData, setServiceFormData] = useState({
    dateOfProposedService: "",
    serviceDetails: "",
  });

  // Service details dialog state (for admin/employee)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedServiceRequest, setSelectedServiceRequest] = useState<ServiceRequest | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [approvalFormData, setApprovalFormData] = useState({
    dateOfService: "",
  });

  useEffect(() => {
    fetchServices("");
  }, []);

  const fetchServices = async (search: string) => {
    try {
      const response = await fetch(`/api/services?search=${encodeURIComponent(search)}`);
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else {
        const error = await response.json();
        console.error("Services API error:", error);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchServices(searchQuery);
  };

  const handleSendNotification = async (serviceId: string, notificationType: "30days" | "7days") => {
    setSendingNotification(serviceId);
    try {
      const response = await fetch(`/api/services/${serviceId}/notify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationType }),
      });

      if (response.ok) {
        alert(t("notificationSentSuccess"));
        fetchServices(searchQuery);
      } else {
        const error = await response.json();
        alert(error.error || t("notificationSentError"));
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert(t("notificationSentError"));
    } finally {
      setSendingNotification(null);
    }
  };

  const handleOpenServiceDialog = (service: Service) => {
    setSelectedService(service);
    // Pre-fill with next service date and user address
    setServiceFormData({
      dateOfProposedService: new Date(service.nextDateOfService).toISOString().split('T')[0],
      serviceDetails: userProfile?.userDetails 
        ? `${userProfile.userDetails.street || ''} ${userProfile.userDetails.apartmentNumber || ''}, ${userProfile.userDetails.postalCode || ''} ${userProfile.userDetails.city || ''}`.trim()
        : "",
    });
    setIsServiceDialogOpen(true);
  };

  const handleSubmitServiceRequest = async () => {
    if (!selectedService) return;

    setIsSubmittingService(true);
    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: selectedService.id,
          dateOfProposedService: serviceFormData.dateOfProposedService,
          serviceDetails: serviceFormData.serviceDetails,
        }),
      });

      if (response.ok) {
        alert(t("serviceRequestSuccess"));
        setIsServiceDialogOpen(false);
        fetchServices(searchQuery);
      } else {
        const error = await response.json();
        alert(error.error || t("serviceRequestError"));
      }
    } catch (error) {
      console.error("Error submitting service request:", error);
      alert(t("serviceRequestError"));
    } finally {
      setIsSubmittingService(false);
    }
  };

  const handleOpenServiceDetails = (service: Service, serviceRequest: ServiceRequest) => {
    setSelectedService(service);
    setSelectedServiceRequest(serviceRequest);
    setApprovalFormData({
      dateOfService: serviceRequest.dateOfService 
        ? new Date(serviceRequest.dateOfService).toISOString().split('T')[0]
        : new Date(serviceRequest.dateOfProposedService).toISOString().split('T')[0],
    });
    setIsDetailsDialogOpen(true);
  };

  const handleUpdateServiceStatus = async (status: "APPROVED" | "REJECTED") => {
    if (!selectedServiceRequest) return;

    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/services/${selectedServiceRequest.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          dateOfService: status === "APPROVED" ? approvalFormData.dateOfService : null,
        }),
      });

      if (response.ok) {
        alert(t(status === "APPROVED" ? "serviceApproved" : "serviceRejected"));
        setIsDetailsDialogOpen(false);
        fetchServices(searchQuery);
      } else {
        const error = await response.json();
        alert(error.error || t("serviceUpdateError"));
      }
    } catch (error) {
      console.error("Error updating service status:", error);
      alert(t("serviceUpdateError"));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getServiceStatus = (serviceDate: string, notificationSent30Days: boolean, notificationSent7Days: boolean) => {
    const now = new Date();
    const service = new Date(serviceDate);
    const daysUntil = Math.ceil((service.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntil < -1) {
      return {
        status: "overdue",
        color: "bg-red-100 text-red-800 border-red-300",
        days: daysUntil,
        canSend: true,
        notificationType: "7days" as const,
        notificationSent: notificationSent7Days,
      };
    } else if (daysUntil < 7) {
      return {
        status: "dueSoon",
        color: "bg-orange-100 text-orange-800 border-orange-300",
        days: daysUntil,
        canSend: true,
        notificationType: "7days" as const,
        notificationSent: notificationSent7Days,
      };
    } else if (daysUntil < 30) {
      return {
        status: "upcoming",
        color: "bg-yellow-100 text-yellow-800 border-yellow-300",
        days: daysUntil,
        canSend: !notificationSent30Days,
        notificationType: "30days" as const,
        notificationSent: notificationSent30Days,
      };
    } else {
      return {
        status: "scheduled",
        color: "bg-gray-100 text-gray-800 border-gray-300",
        days: daysUntil,
        canSend: false,
        notificationType: null,
        notificationSent: false,
      };
    }
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
        <h1 className="text-3xl font-bold">{t("title")}</h1>
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
                  fetchServices("");
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
          <CardTitle>{userRole === "USER" ? t("myServices") : t("allServices")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("orderId")}</TableHead>
                {userRole !== "USER" && <TableHead>{t("customerEmail")}</TableHead>}
                <TableHead>{t("productDescription")}</TableHead>
                <TableHead>{t("serviceDate")}</TableHead>
                {userRole !== "USER" && <TableHead>{t("serviceRequest")}</TableHead>}
                <TableHead>{t("status")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={userRole === "USER" ? 5 : 7} className="text-center text-muted-foreground">
                    {t("noServicesFound")}
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => {
                  const statusInfo = getServiceStatus(
                    service.nextDateOfService,
                    service.notificationSent30Days,
                    service.notificationSent7Days
                  );
                  const hasServiceRequest = service.services && service.services.length > 0;
                  const serviceRequest = hasServiceRequest ? service.services[0] : null;

                  return (
                    <TableRow key={service.id} className={cn("border-l-4", statusInfo.color)}>
                      <TableCell className="font-medium">{service.orderId}</TableCell>
                      {userRole !== "USER" && <TableCell>{service.customerEmail}</TableCell>}
                      <TableCell>
                        <div className="max-w-xs">
                          {service.products.map((p) => p.productDescription).join(", ")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {new Date(service.nextDateOfService).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {statusInfo.days < -1
                            ? `${Math.abs(statusInfo.days)} ${t("overdue")}`
                            : `${statusInfo.days} ${t("daysUntilService")}`}
                        </div>
                      </TableCell>
                      {userRole !== "USER" && (
                        <TableCell>
                          {serviceRequest ? (
                            <div className="text-sm">
                              <div className="font-medium">
                                {new Date(serviceRequest.dateOfProposedService).toLocaleDateString()}
                              </div>
                              <div className="text-muted-foreground">
                                {serviceRequest.user?.name || serviceRequest.user?.email}
                              </div>
                              <div className={cn(
                                "inline-flex mt-1 px-2 py-0.5 rounded-full text-xs font-medium",
                                serviceRequest.status === "APPROVED" && "bg-green-100 text-green-800",
                                serviceRequest.status === "REJECTED" && "bg-red-100 text-red-800",
                                serviceRequest.status === "PENDING" && "bg-yellow-100 text-yellow-800"
                              )}>
                                {t(`serviceStatus${serviceRequest.status}`)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      )}
                      <TableCell>
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium", statusInfo.color)}>
                          {statusInfo.status === "overdue" && t("statusOverdue")}
                          {statusInfo.status === "dueSoon" && t("statusDueSoon")}
                          {statusInfo.status === "upcoming" && t("statusUpcoming")}
                          {statusInfo.status === "scheduled" && t("statusScheduled")}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {userRole === "USER" ? (
                            <Button
                              size="sm"
                              onClick={() => handleOpenServiceDialog(service)}
                              disabled={hasServiceRequest}
                              variant={hasServiceRequest ? "outline" : "default"}
                            >
                              <Wrench className="h-4 w-4 mr-2" />
                              {hasServiceRequest ? t("serviceRequested") : t("orderService")}
                            </Button>
                          ) : (
                            <>
                              {serviceRequest && serviceRequest.status === "PENDING" ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleOpenServiceDetails(service, serviceRequest)}
                                  variant="default"
                                >
                                  <Wrench className="h-4 w-4 mr-2" />
                                  {t("reviewRequest")}
                                </Button>
                              ) : (
                                statusInfo.canSend && statusInfo.notificationType && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleSendNotification(service.id, statusInfo.notificationType!)}
                                    disabled={sendingNotification === service.id || statusInfo.notificationSent || hasServiceRequest}
                                  >
                                    {sendingNotification === service.id ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        {t("sending")}
                                      </>
                                    ) : hasServiceRequest ? (
                                      <>
                                        <Mail className="h-4 w-4 mr-2" />
                                        {t("serviceRequested")}
                                      </>
                                    ) : statusInfo.notificationSent ? (
                                      <>
                                        <Mail className="h-4 w-4 mr-2" />
                                        {t("notificationSent")}
                                      </>
                                    ) : (
                                      <>
                                        <Mail className="h-4 w-4 mr-2" />
                                        {t("sendNotification")}
                                      </>
                                    )}
                                  </Button>
                                )
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Service Request Dialog */}
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("orderServiceTitle")}</DialogTitle>
            <DialogDescription>
              {t("orderServiceDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderId">{t("orderId")}</Label>
              <Input
                id="orderId"
                value={selectedService?.orderId || ""}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proposedDate">{t("proposedServiceDate")} *</Label>
              <Input
                id="proposedDate"
                type="date"
                value={serviceFormData.dateOfProposedService}
                onChange={(e) =>
                  setServiceFormData({ ...serviceFormData, dateOfProposedService: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceDetails">{t("serviceAddress")}</Label>
              <Input
                id="serviceDetails"
                value={serviceFormData.serviceDetails}
                onChange={(e) =>
                  setServiceFormData({ ...serviceFormData, serviceDetails: e.target.value })
                }
                placeholder={t("serviceAddressPlaceholder")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsServiceDialogOpen(false)}
              disabled={isSubmittingService}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSubmitServiceRequest}
              disabled={isSubmittingService || !serviceFormData.dateOfProposedService}
            >
              {isSubmittingService ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("submitting")}
                </>
              ) : (
                t("confirmService")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Details Dialog (Admin/Employee) */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("serviceRequestDetails")}</DialogTitle>
            <DialogDescription>
              {t("serviceRequestDetailsDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("orderId")}</Label>
                <Input
                  value={selectedService?.orderId || ""}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("customerEmail")}</Label>
                <Input
                  value={selectedService?.customerEmail || ""}
                  disabled
                  className="bg-gray-100"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>{t("requestedBy")}</Label>
              <Input
                value={selectedServiceRequest?.user?.name || selectedServiceRequest?.user?.email || ""}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("proposedServiceDate")}</Label>
                <Input
                  value={selectedServiceRequest?.dateOfProposedService 
                    ? new Date(selectedServiceRequest.dateOfProposedService).toLocaleDateString()
                    : ""}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("approvedServiceDate")}</Label>
                <Input
                  type="date"
                  value={approvalFormData.dateOfService}
                  onChange={(e) => setApprovalFormData({ dateOfService: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("serviceAddress")}</Label>
              <Input
                value={selectedServiceRequest?.serviceDetails || ""}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label>{t("currentStatus")}</Label>
              <div className={cn(
                "inline-flex px-3 py-1.5 rounded-full text-sm font-medium",
                selectedServiceRequest?.status === "APPROVED" && "bg-green-100 text-green-800",
                selectedServiceRequest?.status === "REJECTED" && "bg-red-100 text-red-800",
                selectedServiceRequest?.status === "PENDING" && "bg-yellow-100 text-yellow-800"
              )}>
                {selectedServiceRequest && t(`serviceStatus${selectedServiceRequest.status}`)}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailsDialogOpen(false)}
              disabled={isUpdatingStatus}
            >
              {t("close")}
            </Button>
            {selectedServiceRequest?.status === "PENDING" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleUpdateServiceStatus("REJECTED")}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t("processing")}
                    </>
                  ) : (
                    t("reject")
                  )}
                </Button>
                <Button
                  onClick={() => handleUpdateServiceStatus("APPROVED")}
                  disabled={isUpdatingStatus || !approvalFormData.dateOfService}
                >
                  {isUpdatingStatus ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t("processing")}
                    </>
                  ) : (
                    t("approve")
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
