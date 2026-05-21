import { Button } from "@/components/ui/button";
import type { Coupon } from "../types/coupon";
import { CouponRow } from "./CouponRow";

const skeletonRows = [
  "coupon-skeleton-1",
  "coupon-skeleton-2",
  "coupon-skeleton-3",
  "coupon-skeleton-4",
  "coupon-skeleton-5",
];

interface CouponsTableProps {
  coupons: Coupon[];
  isLoading?: boolean;
  isError?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onViewDetails: (coupon: Coupon) => void;
  onEdit: (coupon: Coupon) => void;
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
}

export function CouponsTable({
  coupons,
  isLoading = false,
  isError = false,
  error,
  onRetry,
  onViewDetails,
  onEdit,
  hasActiveFilters = false,
  onResetFilters,
}: CouponsTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-muted border-b border-border sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Code</th>
              <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Discount</th>
              <th className="px-3 py-2 text-left font-semibold text-muted-foreground">
                Min Purchase
              </th>
              <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Usage</th>
              <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Valid To</th>
              <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Status</th>
              <th className="px-3 py-2 text-left font-semibold text-muted-foreground">
                Visibility
              </th>
              <th className="px-3 py-2 text-right font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skeletonRows.map((rowKey) => (
              <tr key={rowKey} className="border-b border-border">
                <td colSpan={8} className="px-3 py-2">
                  <div className="h-3 bg-muted rounded animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <p className="text-sm text-destructive mb-4">{error || "Failed to load coupons"}</p>
        {onRetry && (
          <Button type="button" onClick={onRetry} size="sm" className="text-xs">
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <p className="text-sm text-muted-foreground mb-4">
          {hasActiveFilters ? "No coupons match your filters" : "No coupons found"}
        </p>
        {hasActiveFilters && onResetFilters && (
          <Button type="button" onClick={onResetFilters} size="sm" className="text-xs">
            Reset Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-xs border-collapse">
        <thead className="bg-muted border-b border-border sticky top-0">
          <tr>
            <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Code</th>
            <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Discount</th>
            <th className="px-3 py-2 text-left font-semibold text-muted-foreground">
              Min Purchase
            </th>
            <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Usage</th>
            <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Valid To</th>
            <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Status</th>
            <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Visibility</th>
            <th className="px-3 py-2 text-right font-semibold text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {coupons.map((coupon) => (
            <CouponRow
              key={coupon.id}
              coupon={coupon}
              onEdit={onEdit}
              onViewDetails={onViewDetails}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
