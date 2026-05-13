/**
 * components/common/Layout.tsx
 *
 * The main page wrapper — wraps every page with the Header and a
 * centred content area.
 *
 * Usage in AppRouter.tsx:
 *   <Route element={<Layout />}>
 *     <Route path="/" element={<HomePage />} />
 *   </Route>
 *
 * React Router's <Outlet /> is where the child page gets rendered.
 */

import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Persistent top navigation */}
      <Header />

      {/* Page content — React Router renders the matching child route here */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
