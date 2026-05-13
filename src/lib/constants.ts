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
 */

// ─── App navigation paths ─────────────────────────────────────────────────────
export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
} as const;

// ─── API endpoint paths (relative to VITE_API_BASE_URL) ──────────────────────
export const API_ROUTES = {
  AUTH: {
    LOGIN: "api/superadmin/admin/login/",
  },
} as const;
