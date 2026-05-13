/**
 * routes/ProtectedRoute.tsx
 *
 * Guards private app routes. Logged-out users are redirected to the login page.
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { APP_ROUTES } from "@/lib/constants";

export function ProtectedRoute() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}
