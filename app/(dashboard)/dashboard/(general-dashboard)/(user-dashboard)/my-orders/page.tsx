import { Suspense } from "react";
import MyOrdersDashboard from "@/components/dashboard/user/orders/MyOrdersDashboard";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import { requireAuth } from "@/lib/auth-guards";

export default async function MyOrdersPage() {
  const session = await requireAuth();

  return (
    <Suspense fallback={<DashboardLoading />}>
      <MyOrdersDashboard userId={session.user.id} />
    </Suspense>
  );
}

