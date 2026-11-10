import type { InventoryPagination } from "./inventory.type";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderPaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  productId: string;
  variantId?: string;
  weight?: string;
  size?: string;
  name: string;
  slug: string;
  sku: string;
  primaryImage: {
    url: string;
    publicId: string;
    alt: string;
  };
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface AdminOrder {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  deliveryAddress: {
    addressLine: string;
    area: string;
    city: string;
    district: string;
    postalCode?: string;
  };
  deliveryZone: "dhaka" | "outside_dhaka";
  deliveryFee: number;
  subtotal: number;
  totalAmount: number;
  currency: "BDT";
  paymentMethod: "cod";
  paymentStatus: OrderPaymentStatus;
  status: OrderStatus;
  customerNote?: string;
  cancellationReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrdersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: InventoryPagination;
  data: AdminOrder[];
}

export interface OrderSingleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AdminOrder;
}

export const ORDER_STATUS_TRANSITIONS: Record<
  OrderStatus,
  readonly OrderStatus[]
> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
} as const;

export const getAllowedOrderStatusTransitions = (
  currentStatus: OrderStatus,
): readonly OrderStatus[] => {
  return ORDER_STATUS_TRANSITIONS[currentStatus] ?? [];
};

export const isAllowedOrderStatusTransition = (
  currentStatus: OrderStatus,
  nextStatus: OrderStatus,
): boolean => {
  return (getAllowedOrderStatusTransitions(currentStatus) as readonly string[]).includes(nextStatus);
};

export const PAYMENT_STATUS_TRANSITIONS: Record<
  OrderPaymentStatus,
  readonly OrderPaymentStatus[]
> = {
  pending: ["paid", "failed"],
  paid: ["refunded"],
  failed: [],
  refunded: [],
} as const;

export const getAllowedPaymentStatusTransitions = (
  currentStatus: OrderPaymentStatus,
): readonly OrderPaymentStatus[] => {
  return PAYMENT_STATUS_TRANSITIONS[currentStatus] ?? [];
};

export const isAllowedPaymentStatusTransition = (
  currentStatus: OrderPaymentStatus,
  nextStatus: OrderPaymentStatus,
): boolean => {
  return (getAllowedPaymentStatusTransitions(currentStatus) as readonly string[]).includes(nextStatus);
};

