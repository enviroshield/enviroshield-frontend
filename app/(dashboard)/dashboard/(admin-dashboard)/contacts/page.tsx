import { Suspense } from "react";
import ContactsDashboard from "@/components/dashboard/admin/contacts/ContactsDashboard";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import { requireRole } from "@/lib/auth-guards";

export default async function ContactsPage() {
  await requireRole("admin");

  return (
    <Suspense fallback={<DashboardLoading />}>
      <ContactsDashboard />
    </Suspense>
  );
}
