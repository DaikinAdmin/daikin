export interface OrderProduct {
  id: string;
  productSlug: string;
  productName: string;
  category: string;
  warranty: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderData {
  id: string;
  orderId: string;
  customerEmail: string;
  dateOfPurchase: string;
  nextDateOfService: string | null;
  totalPrice: number;
  products: OrderProduct[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductOption {
  slug: string;
  articleId: string;
  name: string;
  price: number | null;
  categorySlug: string;
}

export interface UserEmailSuggestion {
  email: string;
  name: string | null;
}

// API Response types
export interface OrderProductResponse {
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
}

export interface OrderDetailResponse {
  id: string;
  orderId: string;
  customerEmail: string;
  customerPhoneNumber?: string | null;
  dateOfPurchase: string;
  nextDateOfService: string | null;
  totalPrice: number;
  daikinCoins: number;
  products: OrderProductResponse[];
}

export interface OrderListProduct {
  id: string;
  productId: string;
  productDescription: string;
  warranty: string | null;
  price: number;
  quantity: number;
  totalPrice: number;
  daikinCoins: number;
}

export interface OrderListItem {
  id: string;
  orderId: string;
  customerEmail: string;
  dateOfPurchase: string;
  nextDateOfService: string | null;
  totalPrice: number;
  daikinCoins: number;
  products: OrderListProduct[];
  createdAt: string;
}
