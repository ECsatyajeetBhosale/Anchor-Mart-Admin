/**
 * routes/AppRouter.tsx
 *
 * All application routes are defined here in one place.
 *
 * Structure:
 *   /           → HomePage  (inside Layout — has Header)
 *   /login      → LoginPage (standalone — no Header)
 *
 * To add a new page:
 *   1. Create src/pages/NewPage.tsx
 *   2. Add a new <Route> here
 */

import { Route, Routes } from "react-router-dom";
import { Layout } from "@/components/common/Layout";
import { CouponsPage } from "@/features/coupons/components/CouponsPage";
import { APP_ROUTES } from "@/lib/constants";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginPage } from "@/pages/LoginPage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

export function AppRouter() {
  return (
    <Routes>
      {/*
        Routes inside this parent share the Layout (Header + wrapper).
        Add any "authenticated" pages here in the future.
      */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path={APP_ROUTES.HOME} element={<DashboardPage />} />
          <Route path={APP_ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={APP_ROUTES.COUPONS} element={<CouponsPage />} />
        </Route>
      </Route>

      {/* Standalone pages — no Layout wrapper */}
      <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
    </Routes>
  );
}
