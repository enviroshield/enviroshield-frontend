"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Boxes,
  Calendar,
  CalendarCheck,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Loader2,
  Mail,
  Package,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  deleteNotification,
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  resolveNotificationLink,
} from "@/lib/api/notifications";
import { cn } from "@/lib/utils";
import { INotification, TNotificationType } from "@/types/notification.type";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NotificationCenterProps {
  role?: string | null;
}

function getNotificationIcon(type: TNotificationType) {
  if (type.startsWith("order")) {
    if (type === "order.payment_confirmed") {
      return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    }
    if (type === "order.cancelled") {
      return <AlertTriangle className="h-5 w-5 text-rose-500" />;
    }
    return <Package className="h-5 w-5 text-blue" />;
  }

  if (type.startsWith("booking")) {
    if (type === "booking.cancelled") {
      return <AlertTriangle className="h-5 w-5 text-rose-500" />;
    }
    return <CalendarCheck className="h-5 w-5 text-teal-600" />;
  }

  if (type.startsWith("contact")) {
    return <Mail className="h-5 w-5 text-indigo-500" />;
  }

  if (type === "site_visit.scheduled") {
    return <Calendar className="h-5 w-5 text-amber-500" />;
  }

  if (type.startsWith("inventory")) {
    return <Boxes className="h-5 w-5 text-orange-500" />;
  }

  return <Bell className="h-5 w-5 text-blue" />;
}

function formatFullDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return dateString;
  }
}

export function NotificationCenter({ role }: NotificationCenterProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [readingId, setReadingId] = useState<string | null>(null);

  const {
    data: notifData,
    error,
    isLoading,
    mutate,
  } = useSWR(
    [`/notifications/center`, page, unreadOnly],
    () => fetchNotifications({ page, limit: 10, unreadOnly }),
    {
      revalidateOnFocus: true,
    },
  );

  const { data: unreadCount = 0, mutate: mutateCount } = useSWR(
    "/notifications/unread-count",
    fetchUnreadCount,
  );

  const notifications = notifData?.data || [];
  const meta = notifData?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 };

  async function handleMarkAll() {
    if (markingAll || unreadCount === 0) return;
    try {
      setMarkingAll(true);
      await markAllNotificationsAsRead();
      void mutateCount(0, false);
      void mutate();
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    } finally {
      setMarkingAll(false);
    }
  }

  async function handleMarkAsRead(id: string) {
    try {
      setReadingId(id);
      await markNotificationAsRead(id);
      void mutateCount(Math.max(0, unreadCount - 1), false);
      if (notifData) {
        void mutate(
          {
            ...notifData,
            data: notifData.data.map((n) =>
              n._id === id ? { ...n, isRead: true } : n,
            ),
          },
          false,
        );
      }
      toast.success("Notification marked as read");
    } catch {
      toast.error("Failed to update notification");
    } finally {
      setReadingId(null);
    }
  }

  async function handleDelete(id: string) {
    try {
      setDeletingId(id);
      await deleteNotification(id);
      void mutate();
      void mutateCount();
      toast.success("Notification deleted");
    } catch {
      toast.error("Failed to delete notification");
    } finally {
      setDeletingId(null);
    }
  }

  function handleNavigate(notification: INotification) {
    if (!notification.isRead) {
      void markNotificationAsRead(notification._id);
      void mutateCount(Math.max(0, unreadCount - 1), false);
    }
    const destination = resolveNotificationLink(notification, role);
    router.push(destination);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue/10 text-blue">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-navy">
                Notifications
              </h1>
              <p className="text-xs text-ink/50 sm:text-sm">
                Activity alerts, status transitions, and administrative updates.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void mutate()}
            className="h-9 gap-1.5 rounded-xl border-line bg-white text-ink/70 hover:text-navy"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleMarkAll}
            disabled={markingAll || unreadCount === 0}
            className="h-9 gap-1.5 rounded-xl bg-navy text-white hover:bg-navy-dark disabled:opacity-50"
          >
            {markingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4" />
            )}
            <span>Mark all read</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Stats */}
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setUnreadOnly(false);
              setPage(1);
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors sm:text-sm",
              !unreadOnly
                ? "bg-navy text-white shadow-xs"
                : "text-ink/60 hover:bg-white hover:text-navy",
            )}
          >
            <span>All</span>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[11px]",
                !unreadOnly ? "bg-white/20 text-white" : "bg-line/70 text-ink/60",
              )}
            >
              {meta.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setUnreadOnly(true);
              setPage(1);
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors sm:text-sm",
              unreadOnly
                ? "bg-navy text-white shadow-xs"
                : "text-ink/60 hover:bg-white hover:text-navy",
            )}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[11px] font-bold",
                  unreadOnly
                    ? "bg-white text-navy"
                    : "bg-blue text-white",
                )}
              >
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <p className="text-xs text-ink/45">
          Showing {notifications.length} of {meta.total} notifications
        </p>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-2xl border border-line/60 bg-white p-4 shadow-xs animate-pulse"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-slate-200" />
                  <div className="h-3.5 w-3/4 rounded bg-slate-100" />
                  <div className="h-3 w-1/4 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white/60 px-4 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mist text-ink/40 mb-3">
              <Inbox className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-navy">
              {unreadOnly ? "No unread notifications" : "No notifications"}
            </h3>
            <p className="mt-1 text-xs text-ink/50 max-w-sm">
              {unreadOnly
                ? "You have acknowledged all recent notifications. Switch to 'All' to review your past activity."
                : "You don't have any notifications right now. System updates, order events, and booking changes will appear here."}
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={cn(
                "group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4 sm:p-5 transition-all shadow-xs",
                !notification.isRead
                  ? "border-blue/30 bg-blue/[0.02] hover:border-blue/50"
                  : "border-line/70 bg-white hover:border-line",
              )}
            >
              {/* Left Details */}
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                    !notification.isRead
                      ? "bg-white border border-blue/20 shadow-xs"
                      : "bg-mist",
                  )}
                >
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4
                      className={cn(
                        "text-sm leading-snug",
                        !notification.isRead
                          ? "font-bold text-navy"
                          : "font-semibold text-ink/80",
                      )}
                    >
                      {notification.title}
                    </h4>

                    {!notification.isRead && (
                      <span className="rounded-full bg-blue px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        New
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs leading-relaxed text-ink/65 sm:text-sm">
                    {notification.message}
                  </p>

                  <p className="mt-2 text-[11px] font-medium text-ink/45">
                    {formatFullDate(notification.createdAt)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0 border-t border-line/40 pt-3 sm:border-0 sm:pt-0">
                {!notification.isRead && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(notification._id)}
                    disabled={readingId === notification._id}
                    title="Mark as read"
                    className="h-8 gap-1 rounded-xl text-xs text-ink/60 hover:bg-mist hover:text-navy"
                  >
                    {readingId === notification._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    <span className="hidden sm:inline">Read</span>
                  </Button>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(notification._id)}
                  disabled={deletingId === notification._id}
                  title="Delete notification"
                  className="h-8 w-8 rounded-xl text-ink/40 hover:bg-rose-50 hover:text-rose-600"
                >
                  {deletingId === notification._id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleNavigate(notification)}
                  className="h-8 gap-1.5 rounded-xl bg-blue px-3 text-xs font-semibold text-white hover:bg-blue-dark shadow-xs"
                >
                  <span>View Details</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-line pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="h-9 gap-1 rounded-xl border-line"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <span className="text-xs font-medium text-ink/60">
            Page {meta.page} of {meta.totalPages}
          </span>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            disabled={page >= meta.totalPages}
            className="h-9 gap-1 rounded-xl border-line"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
