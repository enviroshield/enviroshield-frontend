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
  let targetUrl = rawUrl || "";

  if (targetUrl) {
    if (!isAdmin) {
      // For regular users, map any admin destinations to user-appropriate destinations
      if (targetUrl.startsWith("/dashboard/ecommerce/orders")) {
        targetUrl = "/dashboard/my-orders";
      } else if (targetUrl.startsWith("/dashboard/service-bookings")) {
        targetUrl = "/dashboard/my-services";
      } else if (
        targetUrl.startsWith("/dashboard/contacts") ||
        targetUrl.startsWith("/dashboard/ecommerce/inventory") ||
        targetUrl.startsWith("/dashboard/users") ||
        targetUrl.startsWith("/dashboard/services")
      ) {
        targetUrl = "/dashboard";
      }
    }
  } else {
    // Fallback if no actionUrl is set
    switch (notification.entityType) {
      case "order":
        targetUrl = isAdmin ? "/dashboard/ecommerce/orders" : "/dashboard/my-orders";
        break;
      case "booking":
        targetUrl = isAdmin ? "/dashboard/service-bookings" : "/dashboard/my-services";
        break;
      case "contact":
        targetUrl = isAdmin ? "/dashboard/contacts" : "/dashboard";
        break;
      case "product":
        targetUrl = isAdmin ? "/dashboard/ecommerce/inventory" : "/dashboard";
        break;
      default:
        targetUrl = "/dashboard";
        break;
    }
  }

  // Attach modal trigger parameter if entityId exists
  if (notification.entityId) {
    const separator = targetUrl.includes("?") ? "&" : "?";
    if (
      notification.entityType === "order" ||
      targetUrl.includes("/orders") ||
      targetUrl.includes("/my-orders")
    ) {
      if (!targetUrl.includes("orderId=")) {
        targetUrl = `${targetUrl}${separator}orderId=${encodeURIComponent(notification.entityId)}`;
      }
    } else if (
      notification.entityType === "booking" ||
      targetUrl.includes("/service-bookings") ||
      targetUrl.includes("/my-services")
    ) {
      if (!targetUrl.includes("bookingId=")) {
        targetUrl = `${targetUrl}${separator}bookingId=${encodeURIComponent(notification.entityId)}`;
      }
    } else if (
      notification.entityType === "contact" ||
      targetUrl.includes("/contacts")
    ) {
      if (!targetUrl.includes("contactId=")) {
        targetUrl = `${targetUrl}${separator}contactId=${encodeURIComponent(notification.entityId)}`;
      }
    }
  }

  return targetUrl;
}
