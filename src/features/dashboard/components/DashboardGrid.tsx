/**
 * features/dashboard/components/DashboardGrid.tsx
 *
 * Main dashboard grid component that displays all metrics.
 *
 * Layout:
 *   - Desktop: 2x2 grid
 *   - Mobile: Stacked (1 column)
 *
 * Handles loading and error states.
 */

import { APP_TEXT } from "@/lib/messages";
import { useGetDashboardHeaderQuery } from "../api/dashboardApi";
import { DashboardCard } from "./DashboardCard";

export function DashboardGrid() {
  const { data, isLoading, isFetching } = useGetDashboardHeaderQuery();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DashboardCard
          title={APP_TEXT.DASHBOARD.PENDING_INTENTS}
          value={data?.pending_intent_count ?? 0}
          isLoading={isLoading || isFetching}
        />
        <DashboardCard
          title={APP_TEXT.DASHBOARD.SPECIAL_INTEREST_PRODUCTS}
          value={data?.special_intrest_product_count ?? 0}
          isLoading={isLoading || isFetching}
        />
        {/* <DashboardCard
          title={APP_TEXT.DASHBOARD.SILENT_ALERTS}
          value={data?.silent_alerts_count ?? "0"}
          isLoading={isLoading || isFetching}
        /> */}
        <DashboardCard
          title={APP_TEXT.DASHBOARD.ACTIVE_ORDERS_TODAY}
          value={data?.active_orders_today ?? 0}
          isLoading={isLoading || isFetching}
        />
      </div>
    </div>
  );
}
