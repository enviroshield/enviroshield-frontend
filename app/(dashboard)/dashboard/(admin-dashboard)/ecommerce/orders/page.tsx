import { Suspense } from "react";
import OrdersDashboard from "@/components/dashboard/admin/ecommerce/orders/OrdersDashboard";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
import { requireRole } from "@/lib/auth-guards";

export default async function OrdersPage() {
  await requireRole("admin");

  return (
    <Suspense fallback={<DashboardLoading />}>
      <OrdersDashboard />
    </Suspense>
  );
}
