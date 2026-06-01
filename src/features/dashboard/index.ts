/**
 * features/dashboard/index.ts
 *
 * Public API for the dashboard feature.
 */

export { dashboardApi, useGetDashboardHeaderQuery } from "./api/dashboardApi";
export { DashboardCard } from "./components/DashboardCard";
export { DashboardGrid } from "./components/DashboardGrid";

export type { DashboardData, DashboardState } from "./types/dashboard.types";
