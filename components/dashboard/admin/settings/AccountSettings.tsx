"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertTriangle,
  BadgeCheck,
  Bell,
  Boxes,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  KeyRound,
  Laptop,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Monitor,
  Package,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Tablet,
  Trash2,
  User,
  Volume2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import {
  fetchNotificationPreferences,
  updateNotificationPreferences,
} from "@/lib/api/user-preferences";
import {
  fetchUnreadCount,
  markAllNotificationsAsRead,
} from "@/lib/api/notifications";
import {
  defaultNotificationPreferences,
  INotificationPreferences,
} from "@/types/user-preferences.type";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DashboardButton from "@/components/dashboard/DashboardButton";

interface SessionItem {
  id: string;
  token: string;
  createdAt: string | Date;
  expiresAt: string | Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  userId: string;
}

function parseUserAgent(ua?: string | null) {
  if (!ua) {
    return {
      browser: "Web Browser",
      os: "Unknown System",
      deviceType: "desktop" as const,
    };
  }

  let os = "Unknown OS";
  let deviceType: "desktop" | "mobile" | "tablet" = "desktop";

  if (/iPad/i.test(ua)) {
    os = "iPadOS";
    deviceType = "tablet";
  } else if (/iPhone/i.test(ua)) {
    os = "iOS";
    deviceType = "mobile";
  } else if (/Android/i.test(ua)) {
    os = "Android";
    deviceType = /Mobile/i.test(ua) ? "mobile" : "tablet";
  } else if (/Windows NT 10/i.test(ua)) {
    os = "Windows 10/11";
  } else if (/Windows/i.test(ua)) {
    os = "Windows";
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    os = "macOS";
  } else if (/Linux/i.test(ua)) {
    os = "Linux";
  }

  let browser = "Web Browser";
  if (/Edg\//i.test(ua)) {
    browser = "Microsoft Edge";
  } else if (/OPR\/|Opera/i.test(ua)) {
    browser = "Opera";
  } else if (/Chrome\//i.test(ua)) {
    browser = "Google Chrome";
  } else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) {
    browser = "Apple Safari";
  } else if (/Firefox\//i.test(ua)) {
    browser = "Mozilla Firefox";
  }

  return { browser, os, deviceType };
}

function formatRelativeTime(dateInput: string | Date): string {
  try {
    const date = new Date(dateInput);
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
  } catch {
    return "Recently";
  }
}

export function AccountSettings() {
  const router = useRouter();
  const { data: currentSessionData } = authClient.useSession();
  const currentUser = currentSessionData?.user;
  const currentToken = currentSessionData?.session?.token;

  // ---------------------------------------------------------
  // SESSIONS STATE
  // ---------------------------------------------------------
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [revokingToken, setRevokingToken] = useState<string | null>(null);
  const [isRevokingOther, setIsRevokingOther] = useState(false);
  const [sessionToRevoke, setSessionToRevoke] = useState<SessionItem | null>(
    null,
  );

  const loadSessions = useCallback(async () => {
    setIsLoadingSessions(true);
    try {
      const response = await authClient.listSessions();
      if (response && response.data) {
        setSessions(response.data as SessionItem[]);
      }
    } catch (error) {
      console.error("Failed to load sessions:", error);
      toast.error("Failed to fetch active sessions.");
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleRevokeSingle = async (token: string) => {
    setRevokingToken(token);
    try {
      const result = await authClient.revokeSession({ token });
      if (result.error) {
        toast.error(result.error.message || "Failed to revoke session.");
      } else {
        toast.success("Session revoked successfully.");
        if (token === currentToken) {
          router.push("/login");
          return;
        }
        await loadSessions();
      }
    } catch {
      toast.error("An unexpected error occurred while revoking the session.");
    } finally {
      setRevokingToken(null);
      setSessionToRevoke(null);
    }
  };

  const handleRevokeOtherSessions = async () => {
    setIsRevokingOther(true);
    try {
      const result = await authClient.revokeOtherSessions();
      if (result.error) {
        toast.error(
          result.error.message || "Failed to revoke other sessions.",
        );
      } else {
        toast.success("All other active sessions have been terminated.");
        await loadSessions();
      }
    } catch {
      toast.error(
        "An unexpected error occurred while revoking other sessions.",
      );
    } finally {
      setIsRevokingOther(false);
    }
  };

  // ---------------------------------------------------------
  // NOTIFICATIONS PREFERENCES STATE
  // ---------------------------------------------------------
  const [preferences, setPreferences] = useState<INotificationPreferences>(
    defaultNotificationPreferences,
  );
  const [savedPreferences, setSavedPreferences] =
    useState<INotificationPreferences>(defaultNotificationPreferences);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const [isSavingPreferences, startTransition] = useTransition();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isMarkingRead, setIsMarkingRead] = useState(false);

  const loadPreferencesAndUnread = useCallback(async () => {
    setIsLoadingPreferences(true);
    try {
      const [prefs, unread] = await Promise.allSettled([
        fetchNotificationPreferences(),
        fetchUnreadCount(),
      ]);

      if (prefs.status === "fulfilled") {
        setPreferences(prefs.value);
        setSavedPreferences(prefs.value);
      }
      if (unread.status === "fulfilled") {
        setUnreadCount(unread.value);
      }
    } catch (err) {
      console.error("Failed to load notification settings:", err);
    } finally {
      setIsLoadingPreferences(false);
    }
  }, []);

  useEffect(() => {
    loadPreferencesAndUnread();
  }, [loadPreferencesAndUnread]);

  const hasUnsavedPreferences =
    JSON.stringify(preferences) !== JSON.stringify(savedPreferences);

  const handleTogglePreference = (
    key: keyof INotificationPreferences,
    value: boolean,
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSavePreferences = () => {
    startTransition(async () => {
      try {
        const updated = await updateNotificationPreferences(preferences);
        setPreferences(updated);
        setSavedPreferences(updated);
        toast.success("Notification preferences saved successfully.");
      } catch (error: unknown) {
        console.error("Save notification preferences error:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to save notification preferences.",
        );
      }
    });
  };

  const handleMarkAllRead = async () => {
    setIsMarkingRead(true);
    try {
      await markAllNotificationsAsRead();
      setUnreadCount(0);
      toast.success("All notifications marked as read.");
    } catch {
      toast.error("Failed to mark notifications as read.");
    } finally {
      setIsMarkingRead(false);
    }
  };

  const handleRequestPushPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("Your browser does not support desktop notifications.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        handleTogglePreference("browserPush", true);
        toast.success("Desktop notifications enabled!");
      } else {
        handleTogglePreference("browserPush", false);
        toast.info("Desktop notifications were denied or dismissed.");
      }
    } catch {
      toast.error("Could not request notification permissions.");
    }
  };

  // ---------------------------------------------------------
  // ACCOUNT DELETION STATE
  // ---------------------------------------------------------
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const canConfirmDelete =
    deleteConfirmationText.trim().toUpperCase() === "DELETE" &&
    deletePassword.length > 0;

  const handleDeleteAccount = async () => {
    if (!canConfirmDelete) return;

    setIsDeletingAccount(true);
    setDeleteError(null);

    try {
      const response = await authClient.deleteUser({
        password: deletePassword,
      });

      if (response.error) {
        const errMsg =
          response.error.message ||
          "Failed to delete account. Please verify your password.";
        setDeleteError(errMsg);
        toast.error(errMsg);
        setIsDeletingAccount(false);
        return;
      }

      toast.success("Your account has been deleted successfully.");
      setIsDeleteDialogOpen(false);

      // Force redirect to login page
      window.location.href = "/login";
    } catch (err: unknown) {
      console.error("Account deletion failed:", err);
      const errMsg =
        err instanceof Error ? err.message : "Failed to delete account.";
      setDeleteError(errMsg);
      toast.error(errMsg);
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Account Profile Summary */}
      <Card className="relative overflow-hidden rounded-2xl border-border/70 bg-gradient-to-br from-background via-background to-muted/20 shadow-none">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-blue via-indigo to-teal opacity-60" />
        <CardContent className="p-6 sm:p-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-border/80 shadow-sm">
                <AvatarImage
                  src={currentUser?.image || undefined}
                  alt={currentUser?.name || "Admin"}
                />
                <AvatarFallback className="bg-blue/[0.08] text-lg font-bold text-blue">
                  {currentUser?.name
                    ? currentUser.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "AD"}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-lg font-bold tracking-tight sm:text-xl">
                    {currentUser?.name || "Administrator"}
                  </h2>
                  <Badge
                    variant="outline"
                    className="border-blue/30 bg-blue/5 text-xs font-semibold capitalize text-blue"
                  >
                    {currentUser?.role || "admin"}
                  </Badge>
                  {currentUser?.emailVerified && (
                    <Badge
                      variant="outline"
                      className="border-teal/30 bg-teal/5 text-xs font-semibold text-teal"
                    >
                      <BadgeCheck className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentUser?.email}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/dashboard/profile">
                <Button
                  variant="outline"
                  className="rounded-xl border-border/70 text-xs font-semibold hover:border-blue/40 hover:text-blue"
                >
                  <User className="mr-2 h-3.5 w-3.5" />
                  Edit Profile
                </Button>
              </Link>
              <Link href="/dashboard/profile">
                <Button
                  variant="outline"
                  className="rounded-xl border-border/70 text-xs font-semibold hover:border-blue/40 hover:text-blue"
                >
                  <KeyRound className="mr-2 h-3.5 w-3.5" />
                  Change Password
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Active Sessions Management */}
      <Card className="rounded-2xl border-border/70 bg-background shadow-none">
        <CardHeader className="border-b border-border/60 px-6 py-5 sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/[0.08] text-teal">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="font-display text-base font-bold tracking-tight sm:text-lg">
                    Active Sessions
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  >
                    {sessions.length} {sessions.length === 1 ? "device" : "devices"}
                  </Badge>
                </div>
                <CardDescription className="mt-1 text-sm text-muted-foreground">
                  View and manage devices currently signed in to your Enviroshield account.
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadSessions}
                disabled={isLoadingSessions}
                className="h-9 rounded-xl border-border/70 text-xs font-medium"
              >
                <RefreshCw
                  className={`mr-1.5 h-3.5 w-3.5 ${
                    isLoadingSessions ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>

              {sessions.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRevokeOtherSessions}
                  disabled={isRevokingOther || isLoadingSessions}
                  className="h-9 rounded-xl border-amber-500/30 text-xs font-medium text-amber-600 hover:bg-amber-500/10 hover:text-amber-700 dark:text-amber-400"
                >
                  {isRevokingOther ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <LogOut className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Revoke Other Sessions
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-7">
          {isLoadingSessions ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-blue" />
              <p className="mt-3 text-sm">Loading active sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No active sessions found.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {sessions.map((sess) => {
                const { browser, os, deviceType } = parseUserAgent(
                  sess.userAgent,
                );
                const isCurrent =
                  sess.token === currentToken ||
                  sess.id === currentSessionData?.session?.id;

                const DeviceIcon =
                  deviceType === "mobile"
                    ? Smartphone
                    : deviceType === "tablet"
                      ? Tablet
                      : Laptop;

                return (
                  <div
                    key={sess.id || sess.token}
                    className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isCurrent
                            ? "bg-teal/10 text-teal ring-1 ring-teal/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <DeviceIcon className="h-5 w-5" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">
                            {browser} on {os}
                          </p>
                          {isCurrent && (
                            <Badge
                              variant="outline"
                              className="border-teal/30 bg-teal/10 text-[11px] font-semibold text-teal"
                            >
                              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
                              Current device
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          {sess.ipAddress && (
                            <span>IP: {sess.ipAddress}</span>
                          )}
                          <span>•</span>
                          <span>
                            Created {formatRelativeTime(sess.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {isCurrent ? (
                        <span className="text-xs font-medium text-muted-foreground/80">
                          Active now
                        </span>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSessionToRevoke(sess)}
                          disabled={revokingToken === sess.token}
                          className="h-8 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          {revokingToken === sess.token ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <LogOut className="mr-1.5 h-3.5 w-3.5" />
                          )}
                          Revoke
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Notification Management */}
      <Card className="rounded-2xl border-border/70 bg-background shadow-none">
        <CardHeader className="border-b border-border/60 px-6 py-5 sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo/[0.08] text-indigo">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="font-display text-base font-bold tracking-tight sm:text-lg">
                    Notification Management
                  </CardTitle>
                  {unreadCount > 0 && (
                    <Badge className="bg-rose-500 text-white text-xs font-semibold">
                      {unreadCount} unread
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-1 text-sm text-muted-foreground">
                  Select which notifications and alerts you receive via email and in-app.
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllRead}
                  disabled={isMarkingRead}
                  className="h-9 rounded-xl border-border/70 text-xs font-medium"
                >
                  <Check className="mr-1.5 h-3.5 w-3.5 text-teal" />
                  Mark All Read
                </Button>
              )}

              <Link href="/dashboard/notifications">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-xl border-border/70 text-xs font-medium"
                >
                  Notification Center
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>

              <DashboardButton
                onClick={handleSavePreferences}
                disabled={isSavingPreferences || !hasUnsavedPreferences}
                icon={
                  isSavingPreferences ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )
                }
              >
                {isSavingPreferences ? "Saving..." : "Save Preferences"}
              </DashboardButton>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 p-6 sm:p-7">
          {isLoadingPreferences ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-indigo" />
              <p className="mt-3 text-sm">Loading notification preferences...</p>
            </div>
          ) : (
            <>
              {/* Group A: Email Notifications */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Email Notifications
                  </h3>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/20 p-4 divide-y divide-border/60">
                  {/* Order Updates */}
                  <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue/10 text-blue">
                        <Package className="h-4 w-4" />
                      </div>
                      <div>
                        <Label
                          htmlFor="emailOrders"
                          className="text-sm font-semibold cursor-pointer"
                        >
                          Orders &amp; Payments
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Receive email updates when orders are placed, paid, or updated.
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="emailOrders"
                      checked={preferences.emailOrders}
                      onCheckedChange={(checked) =>
                        handleTogglePreference("emailOrders", checked)
                      }
                    />
                  </div>

                  {/* Booking Alerts */}
                  <div className="flex items-center justify-between gap-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
                        <CalendarCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <Label
                          htmlFor="emailBookings"
                          className="text-sm font-semibold cursor-pointer"
                        >
                          Service Bookings &amp; Consultations
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Get notified when clients schedule, reschedule, or cancel bookings.
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="emailBookings"
                      checked={preferences.emailBookings}
                      onCheckedChange={(checked) =>
                        handleTogglePreference("emailBookings", checked)
                      }
                    />
                  </div>

                  {/* Contact / Inquiries */}
                  <div className="flex items-center justify-between gap-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo/10 text-indigo">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <Label
                          htmlFor="emailInquiries"
                          className="text-sm font-semibold cursor-pointer"
                        >
                          Customer Messages &amp; Inquiries
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Receive emails whenever someone submits the contact form or requests quotes.
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="emailInquiries"
                      checked={preferences.emailInquiries}
                      onCheckedChange={(checked) =>
                        handleTogglePreference("emailInquiries", checked)
                      }
                    />
                  </div>

                  {/* Inventory */}
                  <div className="flex items-center justify-between gap-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                        <Boxes className="h-4 w-4" />
                      </div>
                      <div>
                        <Label
                          htmlFor="emailInventory"
                          className="text-sm font-semibold cursor-pointer"
                        >
                          Inventory &amp; Stock Warnings
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Alerts when product inventory levels reach low or out-of-stock thresholds.
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="emailInventory"
                      checked={preferences.emailInventory}
                      onCheckedChange={(checked) =>
                        handleTogglePreference("emailInventory", checked)
                      }
                    />
                  </div>

                  {/* Security */}
                  <div className="flex items-center justify-between gap-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600">
                        <Lock className="h-4 w-4" />
                      </div>
                      <div>
                        <Label
                          htmlFor="emailSecurity"
                          className="text-sm font-semibold cursor-pointer"
                        >
                          Security &amp; Account Alerts
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Immediate email notifications for unrecognized logins or sensitive changes.
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="emailSecurity"
                      checked={preferences.emailSecurity}
                      onCheckedChange={(checked) =>
                        handleTogglePreference("emailSecurity", checked)
                      }
                    />
                  </div>

                  {/* Marketing */}
                  <div className="flex items-center justify-between gap-4 py-3 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
                        <Bell className="h-4 w-4" />
                      </div>
                      <div>
                        <Label
                          htmlFor="emailMarketing"
                          className="text-sm font-semibold cursor-pointer"
                        >
                          Product Updates &amp; Newsletter
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Occasional updates about new Enviroshield products and coating innovations.
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="emailMarketing"
                      checked={preferences.emailMarketing}
                      onCheckedChange={(checked) =>
                        handleTogglePreference("emailMarketing", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Group B: In-App & Browser Notifications */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-teal" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    In-App &amp; Desktop Notifications
                  </h3>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/20 p-4 divide-y divide-border/60">
                  {/* Sound alerts */}
                  <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
                        <Volume2 className="h-4 w-4" />
                      </div>
                      <div>
                        <Label
                          htmlFor="soundEnabled"
                          className="text-sm font-semibold cursor-pointer"
                        >
                          Notification Sound Chime
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Play an audible chime when new dashboard notifications arrive.
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="soundEnabled"
                      checked={preferences.soundEnabled}
                      onCheckedChange={(checked) =>
                        handleTogglePreference("soundEnabled", checked)
                      }
                    />
                  </div>

                  {/* Desktop Push */}
                  <div className="flex items-center justify-between gap-4 py-3 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo/10 text-indigo">
                        <Monitor className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor="browserPush"
                            className="text-sm font-semibold cursor-pointer"
                          >
                            Desktop Push Notifications
                          </Label>
                          {typeof window !== "undefined" &&
                            "Notification" in window &&
                            Notification.permission !== "granted" && (
                              <button
                                type="button"
                                onClick={handleRequestPushPermission}
                                className="text-[11px] font-semibold text-blue hover:underline"
                              >
                                (Enable in browser)
                              </button>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Receive browser notification banners even when Enviroshield is minimized.
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="browserPush"
                      checked={preferences.browserPush}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleRequestPushPermission();
                        } else {
                          handleTogglePreference("browserPush", false);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 4. Danger Zone - Account Deletion */}
      <Card className="rounded-2xl border-destructive/30 bg-destructive/[0.02] shadow-none">
        <CardHeader className="border-b border-destructive/20 px-6 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="font-display text-base font-bold tracking-tight text-destructive sm:text-lg">
                Danger Zone
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-muted-foreground">
                Permanently delete your Enviroshield account and all associated sessions.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col justify-between gap-6 px-6 py-6 sm:flex-row sm:items-center sm:px-7">
          <div className="max-w-xl space-y-1">
            <p className="text-sm font-semibold text-foreground">
              Delete Enviroshield Account
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Once you delete your account, there is no going back. All active sessions,
              personal data, and access permissions will be immediately purged.
            </p>
          </div>

          <Button
            variant="destructive"
            onClick={() => {
              setDeletePassword("");
              setDeleteConfirmationText("");
              setDeleteError(null);
              setIsDeleteDialogOpen(true);
            }}
            className="shrink-0 rounded-xl font-semibold shadow-none"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {/* Revoke Single Session Confirmation Dialog */}
      <AlertDialog
        open={Boolean(sessionToRevoke)}
        onOpenChange={(open) => !open && setSessionToRevoke(null)}
      >
        <AlertDialogContent className="rounded-2xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-amber-500" />
              Revoke Session?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately sign out the device and invalidate its authentication token.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {sessionToRevoke && (
            <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5 text-xs space-y-1 text-muted-foreground">
              <p className="font-semibold text-foreground">
                {parseUserAgent(sessionToRevoke.userAgent).browser} on{" "}
                {parseUserAgent(sessionToRevoke.userAgent).os}
              </p>
              {sessionToRevoke.ipAddress && (
                <p>IP Address: {sessionToRevoke.ipAddress}</p>
              )}
              <p>
                Created:{" "}
                {new Date(sessionToRevoke.createdAt).toLocaleString()}
              </p>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={Boolean(revokingToken)}
              onClick={() =>
                sessionToRevoke && handleRevokeSingle(sessionToRevoke.token)
              }
              className="rounded-xl font-semibold"
            >
              {revokingToken ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : null}
              Confirm Revoke
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!isDeletingAccount) setIsDeleteDialogOpen(open);
        }}
      >
        <AlertDialogContent className="rounded-2xl sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" />
              Delete Account Permanently?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Please verify your credentials to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive leading-relaxed">
              <p className="font-semibold">Warning:</p>
              <p className="mt-1">
                Your profile, privileges, and active sessions will be completely deleted from the database.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delete-account-password">
                Current Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="delete-account-password"
                type="password"
                placeholder="Enter your current account password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                disabled={isDeletingAccount}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delete-confirm-text">
                Type <span className="font-bold text-destructive">DELETE</span> to confirm
              </Label>
              <Input
                id="delete-confirm-text"
                placeholder="DELETE"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                disabled={isDeletingAccount}
                className="rounded-xl font-mono uppercase"
              />
            </div>

            {deleteError && (
              <p className="text-xs text-destructive font-medium">
                {deleteError}
              </p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeletingAccount}
              className="rounded-xl"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={!canConfirmDelete || isDeletingAccount}
              onClick={handleDeleteAccount}
              className="rounded-xl font-semibold"
            >
              {isDeletingAccount ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting Account...
                </>
              ) : (
                "Permanently Delete"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
