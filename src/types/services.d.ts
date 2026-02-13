import type { OrderListProduct } from "./orders";

export interface ServiceRequest {
  id: string;
  dateOfProposedService: string;
  dateOfService: string | null;
  serviceDetails: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  user?: {
    name: string;
    email: string;
  };
}

export interface Service {
  id: string;
  orderId: string;
  customerEmail: string;
  nextDateOfService: string;
  notificationSent30Days: boolean;
  notificationSent7Days: boolean;
  products: OrderListProduct[];
  services: ServiceRequest[];
}
