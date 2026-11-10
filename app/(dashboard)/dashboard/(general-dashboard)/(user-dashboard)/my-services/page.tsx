import { Suspense } from "react";
import MyServicesDashboard from "@/components/dashboard/user/services/MyServicesDashboard";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import { requireRole } from "@/lib/auth-guards";

export default async function MyServicesPage() {
  await requireRole("user");

  return (
    <Suspense fallback={<DashboardLoading />}>
      <MyServicesDashboard />
    </Suspense>
  );
}

