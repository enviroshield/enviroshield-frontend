import { NotificationCenter } from "@/components/dashboard/notifications/NotificationCenter";
import { requireAuth } from "@/lib/auth-guards";

export const metadata = {
  title: "Notifications | Enviroshield Dashboard",
  description: "View and manage your in-app notifications and alerts.",
};

export default async function NotificationsPage() {
  const session = await requireAuth();

  return <NotificationCenter role={session.user.role ?? undefined} />;
}
