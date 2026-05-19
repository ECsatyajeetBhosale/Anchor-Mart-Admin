/**
 * pages/DashboardPage.tsx
 *
 * The dashboard page — displays key metrics in a grid layout.
 * Wrapped inside the Layout component (so it has the Header).
 */

import { DashboardGrid } from "@/features/dashboard";

export function DashboardPage() {
  return (
    <div className="space-y-1">
      <DashboardGrid />
    </div>
  );
}
