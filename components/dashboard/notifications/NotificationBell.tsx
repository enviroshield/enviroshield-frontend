"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  Boxes,
  Calendar,
  CalendarCheck,
  CheckCheck,
  CheckCircle2,
  ExternalLink,
  Inbox,
  Loader2,
  Mail,
  Package,
} from "lucide-react";
import { toast } from "sonner";

import DashboardButton from "@/components/dashboard/DashboardButton";
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  resolveNotificationLink,
} from "@/lib/api/notifications";
import { cn } from "@/lib/utils";
import { INotification, TNotificationType } from "@/types/notification.type";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NotificationBellProps {
  role?: string | null;
}

function getNotificationIcon(type: TNotificationType) {
  if (type.startsWith("order")) {
    if (type === "order.payment_confirmed") {
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    }
    if (type === "order.cancelled") {
      return <AlertTriangle className="h-4 w-4 text-rose-500" />;
    }
    return <Package className="h-4 w-4 text-blue" />;
  }

  if (type.startsWith("booking")) {
    if (type === "booking.cancelled") {
      return <AlertTriangle className="h-4 w-4 text-rose-500" />;
    }
    return <CalendarCheck className="h-4 w-4 text-teal-600" />;
  }

  if (type.startsWith("contact")) {
    return <Mail className="h-4 w-4 text-indigo-500" />;
  }

  if (type === "site_visit.scheduled") {
    return <Calendar className="h-4 w-4 text-amber-500" />;
  }

  if (type.startsWith("inventory")) {
    return <Boxes className="h-4 w-4 text-orange-500" />;
  }

  return <Bell className="h-4 w-4 text-blue" />;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffInSeconds) || diffInSeconds < 0) return "Just now";
  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function NotificationBell({ role }: NotificationBellProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  // Poll unread count every 30 seconds
  const { data: unreadCount = 0, mutate: mutateCount } = useSWR(
    "/notifications/unread-count",
    fetchUnreadCount,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    },
  );

  // Fetch recent notifications when dropdown is open or unread filter changes
  const {
    data: notifData,
    isLoading: notifLoading,
    mutate: mutateList,
  } = useSWR(
    isOpen ? [`/notifications/dropdown`, unreadOnly] : null,
    () => fetchNotifications({ limit: 6, unreadOnly }),
    {
      revalidateOnFocus: false,
    },
  );

  const notifications = notifData?.data || [];

  async function handleMarkAllRead(e: React.MouseEvent) {
    e.stopPropagation();
    if (markingAll || unreadCount === 0) return;

    try {
      setMarkingAll(true);
      await markAllNotificationsAsRead();
      void mutateCount(0, false);
      if (notifData) {
        void mutateList(
          {
            ...notifData,
            data: notifData.data.map((n) => ({ ...n, isRead: true })),
          },
          false,
        );
      }
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    } finally {
      setMarkingAll(false);
    }
  }

  async function handleNotificationClick(notification: INotification) {
    if (!notification.isRead) {
      void markNotificationAsRead(notification._id);
      void mutateCount(Math.max(0, unreadCount - 1), false);
      if (notifData) {
        void mutateList(
          {
            ...notifData,
            data: notifData.data.map((n) =>
              n._id === notification._id ? { ...n, isRead: true } : n,
            ),
          },
          false,
        );
      }
    }

    setIsOpen(false);
    const destination = resolveNotificationLink(notification, role);
    router.push(destination);
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={
            unreadCount > 0
              ? `${unreadCount} unread notifications`
              : "Notifications"
          }
          className={cn(
            "relative h-9 w-9 rounded-lg",
            "text-ink/60",
            "transition-colors duration-200",
            "hover:bg-blue/[0.08] hover:text-blue",
            isOpen && "bg-blue/[0.08] text-blue",
          )}
        >
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span
              className={cn(
                "absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-blue px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white",
                unreadCount > 9 ? "min-w-[18px] h-[18px]" : "h-4 w-4",
              )}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[360px] sm:w-[400px] rounded-2xl border-line/90 bg-white p-0 shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line/70 px-4 py-3 bg-mist/50">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-navy">Notifications</h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-blue/10 px-2 py-0.5 text-[11px] font-semibold text-blue">
                {unreadCount} new
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={markingAll || unreadCount === 0}
            className={cn(
              "inline-flex items-center gap-1 text-xs font-semibold text-blue transition-opacity hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed",
            )}
          >
            {markingAll ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <CheckCheck className="h-3.5 w-3.5" />
            )}
            <span>Mark all read</span>
          </button>
        </div>

        {/* Filter Tabs using DashboardButton styling */}
        <div className="flex items-center gap-2 border-b border-line/60 px-4 py-2.5 bg-white">
          <DashboardButton
            variant={!unreadOnly ? "default" : "outline"}
            onClick={() => setUnreadOnly(false)}
            className={cn(
              "h-7 rounded-full px-3 text-xs font-semibold transition-all duration-200",
              !unreadOnly
                ? "bg-blue text-white shadow-[0_2px_8px_rgba(1,110,220,0.25)] hover:bg-[#005cb9]"
                : "border-blue/30 bg-muted/30 text-navy hover:border-blue/30 hover:bg-blue/10 hover:text-blue shadow-none",
            )}
          >
            All
          </DashboardButton>
          <DashboardButton
            variant={unreadOnly ? "default" : "outline"}
            onClick={() => setUnreadOnly(true)}
            className={cn(
              "h-7 rounded-full px-3 text-xs font-semibold transition-all duration-200",
              unreadOnly
                ? "bg-blue text-white shadow-[0_2px_8px_rgba(1,110,220,0.25)] hover:bg-[#005cb9]"
                : "border-blue/30 bg-muted/30 text-navy hover:border-blue/30 hover:bg-blue/10 hover:text-blue shadow-none",
            )}
          >
            Unread
          </DashboardButton>
        </div>

        {/* Notification List */}
        <div className="max-h-[340px] overflow-y-auto divide-y divide-line/40">
          {notifLoading ? (
            <div className="space-y-3 p-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="h-9 w-9 rounded-xl bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-3/4 rounded bg-slate-200" />
                    <div className="h-3 w-full rounded bg-slate-100" />
                    <div className="h-2.5 w-1/4 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mist text-ink/40 mb-2.5">
                <Inbox className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-navy">
                {unreadOnly ? "No unread notifications" : "No notifications yet"}
              </p>
              <p className="mt-1 text-xs text-ink/50 max-w-[220px]">
                {unreadOnly
                  ? "You are caught up on everything!"
                  : "Important updates about your orders and bookings will appear here."}
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleNotificationClick(n)}
                role="button"
                tabIndex={0}
                className={cn(
                  "group relative flex cursor-pointer gap-3 p-3.5 text-left transition-colors",
                  !n.isRead
                    ? "bg-blue/[0.03] hover:bg-blue/[0.07]"
                    : "bg-white hover:bg-mist/70",
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                    !n.isRead ? "bg-white shadow-xs border border-line/60" : "bg-mist",
                  )}
                >
                  {getNotificationIcon(n.type)}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-xs leading-snug line-clamp-1",
                        !n.isRead
                          ? "font-bold text-navy"
                          : "font-semibold text-ink/80",
                      )}
                    >
                      {n.title}
                    </p>

                    <span className="shrink-0 text-[11px] font-medium text-ink/45">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs text-ink/65 line-clamp-2 leading-relaxed">
                    {n.message}
                  </p>
                </div>

                {/* Unread indicator dot */}
                {!n.isRead && (
                  <span
                    aria-hidden="true"
                    className="absolute top-4 right-3 h-2 w-2 rounded-full bg-blue shrink-0 ring-2 ring-white"
                  />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-line/70 bg-mist/40 p-2.5 text-center">
          <Link
            href="/dashboard/notifications"
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue hover:text-blue-dark transition-colors py-1 px-3 rounded-lg hover:bg-blue/[0.06]"
          >
            <span>View all notifications</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
