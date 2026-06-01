/**
 * constants.ts
 *
 * Central place for all route strings.
 * Never hardcode paths or API URLs directly in components.
 *
 * Usage:
 *   import { APP_ROUTES } from "@/lib/constants";
 *   import { API_ENDPOINTS } from "@/lib/apiEndpoints";
 *   navigate(APP_ROUTES.LOGIN);
 *   authApi.endpoints.login — base URL is in .env
 *
 * Note: In development, /api/* requests are proxied through Vite dev server
 * to avoid CORS issues. The proxy target is configured in vite.config.ts.
 */

// ─── App navigation paths ─────────────────────────────────────────────────────
export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  COUPONS: "/coupons",
  NOTIFICATIONS: "/notifications",
  LOYALTY_POINTS: "/loyalty/points",
  CATEGORIES: "/categories",
} as const;
