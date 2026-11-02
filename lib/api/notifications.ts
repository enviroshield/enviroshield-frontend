import { axiosInstance } from "@/lib/axios";
import {
  INotification,
  NotificationListResponse,
} from "@/types/notification.type";

type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message?: string;
  meta?: any;
  data: T;
};

export async function fetchNotifications(params?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}): Promise<NotificationListResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.unreadOnly) query.append("unreadOnly", "true");

  const qs = query.toString();
  const url = `/notifications${qs ? `?${qs}` : ""}`;

  const response = await axiosInstance.get<ApiResponse<INotification[]>>(url);
  const result = response.data;

  return {
    data: result.data || [],
    meta: result.meta || {
      page: params?.page || 1,
      limit: params?.limit || 10,
      total: (result.data || []).length,
      totalPages: 1,
      unreadCount: 0,
    },
  };
}

export async function fetchUnreadCount(): Promise<number> {
  const response = await axiosInstance.get<
    ApiResponse<{ unreadCount: number }>
  >("/notifications/unread-count");
  return response.data.data?.unreadCount ?? 0;
}

export async function markNotificationAsRead(
  id: string,
): Promise<INotification> {
  const response = await axiosInstance.patch<ApiResponse<INotification>>(
    `/notifications/${encodeURIComponent(id)}/read`,
  );
  return response.data.data;
}

export async function markAllNotificationsAsRead(): Promise<{
  modifiedCount: number;
}> {
  const response = await axiosInstance.patch<
    ApiResponse<{ modifiedCount: number }>
  >("/notifications/read-all");
  return response.data.data;
}

export async function deleteNotification(
  id: string,
): Promise<{ success: boolean; message: string }> {
  const response = await axiosInstance.delete<
    ApiResponse<{ success: boolean; message: string }>
  >(`/notifications/${encodeURIComponent(id)}`);
  return response.data.data;
}

export function resolveNotificationLink(
  notification: INotification,
  role?: string | null,
): string {
  const isAdmin = role === "admin";
  const rawUrl = notification.actionUrl;

  if (rawUrl) {
    if (isAdmin) {
      return rawUrl;
    }
    // For regular users, map any admin destinations to user-appropriate destinations
    if (rawUrl.startsWith("/dashboard/ecommerce/orders")) {
      return "/dashboard/my-orders";
    }
    if (rawUrl.startsWith("/dashboard/service-bookings")) {
      return "/dashboard/my-services";
    }
    if (
      rawUrl.startsWith("/dashboard/contacts") ||
      rawUrl.startsWith("/dashboard/ecommerce/inventory") ||
      rawUrl.startsWith("/dashboard/users") ||
      rawUrl.startsWith("/dashboard/services")
    ) {
      return "/dashboard";
    }
    return rawUrl;
  }

  // Fallback if no actionUrl is set
  switch (notification.entityType) {
    case "order":
      return isAdmin ? "/dashboard/ecommerce/orders" : "/dashboard/my-orders";
    case "booking":
      return isAdmin ? "/dashboard/service-bookings" : "/dashboard/my-services";
    case "contact":
      return isAdmin ? "/dashboard/contacts" : "/dashboard";
    case "product":
      return isAdmin ? "/dashboard/ecommerce/inventory" : "/dashboard";
    default:
      return "/dashboard";
  }
}
