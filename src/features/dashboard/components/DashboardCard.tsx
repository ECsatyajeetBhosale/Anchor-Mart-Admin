/**
 * features/dashboard/components/DashboardCard.tsx
 *
 * Reusable card component for displaying a single dashboard metric.
 *
 * Props:
 *   - title: The label for the metric
 *   - value: The metric value to display
 *   - isLoading: Whether data is still loading
 */

import type { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: ReactNode;
  isLoading?: boolean;
}

export function DashboardCard({ title, value, isLoading = false }: DashboardCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{isLoading ? "—" : value}</p>
    </div>
  );
}
