import { Suspense } from "react";
import ServiceBookingsDashboard from "@/components/dashboard/admin/service-bookings/ServiceBookingsDashboard";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import { requireRole } from "@/lib/auth-guards";

export default async function ServiceBookingsPage() {
  await requireRole("admin");

  return (
    <Suspense fallback={<DashboardLoading />}>
      <ServiceBookingsDashboard />
    </Suspense>
  );
}
