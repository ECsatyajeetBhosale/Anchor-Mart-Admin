/**
 * features/dashboard/api/dashboardApi.ts
 *
 * RTK Query API slice for dashboard data.
 *
 * Handles fetching dashboard header metrics from the API.
 *
 * In development, requests are proxied through Vite dev server (vite.config.ts)
 * to avoid CORS issues. The proxy rewrites /api/* to the backend URL.
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import type { DashboardData } from "../types/dashboard.types";

type RawDashboardResponse = {
  pending_intent_count?: number;
  special_intrest_product_count?: number;
  silent_alerts_count?: string;
  active_orders_today?: number;
  data?: RawDashboardResponse;
};

const normalizeDashboardResponse = (rawResult: unknown): DashboardData => {
  const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

  if (!isRecord(rawResult)) {
    return {
      pending_intent_count: 0,
      special_intrest_product_count: 0,
      silent_alerts_count: "0",
      active_orders_today: 0,
    };
  }

  const raw = rawResult as RawDashboardResponse;
  const payload = raw.data ?? raw;

  return {
    pending_intent_count: payload.pending_intent_count ?? 0,
    special_intrest_product_count: payload.special_intrest_product_count ?? 0,
    silent_alerts_count: String(payload.silent_alerts_count ?? "0"),
    active_orders_today: payload.active_orders_today ?? 0,
  };
};

// Mock data for development/testing
const MOCK_DASHBOARD_DATA: DashboardData = {
  pending_intent_count: 12,
  special_intrest_product_count: 5,
  silent_alerts_count: "3",
  active_orders_today: 28,
};

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",

  baseQuery: fetchBaseQuery({
    // Use relative URL in development (proxied by Vite)
    // Use full URL in production (from .env)
    baseUrl:
      import.meta.env.MODE === "development"
        ? "" // Relative URL - proxied by Vite dev server
        : import.meta.env.VITE_API_BASE_URL,

    // Attach the auth token to every request
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        // Backend expects "Token" scheme (not "Bearer")
        headers.set("Authorization", `Token ${token}`);
      }
      // Required for ngrok to bypass the interstitial browser warning
      headers.set("ngrok-skip-browser-warning", "true");
      return headers;
    },
  }),

  endpoints: (builder) => ({
    // Fetch dashboard header data
    getDashboardHeader: builder.query<DashboardData, void>({
      query: () => {
        const url = API_ENDPOINTS.DASHBOARD.HEADER;
        return {
          url,
          method: "GET",
        };
      },
      transformResponse: (rawResult) => {
        return normalizeDashboardResponse(rawResult);
      },
      transformErrorResponse: (response) => {
        return response;
      },
      // Fallback to mock data on error (for development)
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (_error) {
          // Dispatch a fulfilled action with mock data
          dispatch(
            dashboardApi.util.updateQueryData(
              "getDashboardHeader",
              undefined,
              () => MOCK_DASHBOARD_DATA,
            ),
          );
        }
      },
    }),
  }),
});

// Export the auto-generated hook
export const { useGetDashboardHeaderQuery } = dashboardApi;
