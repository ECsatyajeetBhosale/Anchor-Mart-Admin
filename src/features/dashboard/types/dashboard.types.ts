/**
 * features/dashboard/types/dashboard.types.ts
 *
 * Type definitions for the dashboard feature.
 */

export interface DashboardData {
  pending_intent_count: number;
  special_intrest_product_count: number;
  silent_alerts_count: string;
  active_orders_today: number;
}

export interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
}
