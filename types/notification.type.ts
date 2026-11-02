export type TNotificationType =
  | "order.created"
  | "order.status_changed"
  | "order.payment_confirmed"
  | "order.cancelled"
  | "booking.created"
  | "booking.status_changed"
  | "booking.cancelled"
  | "contact.created"
  | "contact.status_changed"
  | "site_visit.scheduled"
  | "inventory.low_stock"
  | "inventory.out_of_stock";

export type TNotificationEntityType =
  | "order"
  | "booking"
  | "contact"
  | "product";

export interface INotification {
  _id: string;
  recipient: string;
  type: TNotificationType;
  title: string;
  message: string;
  entityType?: TNotificationEntityType;
  entityId?: string;
  actionUrl?: string;
  isRead: boolean;
  readAt?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  unreadCount?: number;
}

export interface NotificationListResponse {
  meta: NotificationPaginationMeta;
  data: INotification[];
}

