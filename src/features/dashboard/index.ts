/**
 * features/dashboard/index.ts
 *
 * Public API for the dashboard feature.
 *
 * Rule: Other parts of the app must ONLY import from here,
 * never from deep internal paths.
 */

// API
export { dashboardApi, useGetDashboardHeaderQuery } from "./api/dashboardApi";
// Components
export { DashboardCard } from "./components/DashboardCard";
export { DashboardGrid } from "./components/DashboardGrid";

// Types
export type { DashboardData, DashboardState } from "./types/dashboard.types";
