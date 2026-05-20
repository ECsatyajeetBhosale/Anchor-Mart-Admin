/**
 * constants.ts
 *
 * Central place for all route strings.
 * Never hardcode paths or API URLs directly in components.
 *
 * Usage:
 *   import { APP_ROUTES, API_ROUTES } from "@/lib/constants";
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
} as const;

// ─── API endpoint paths (relative to VITE_API_BASE_URL) ──────────────────────
export const API_ROUTES = {
  AUTH: {
    LOGIN: "api/superadmin/admin/login/",
  },
  DASHBOARD: {
    HEADER: "api/superadmin/dashboard/dashboard/",
  },
} as const;
