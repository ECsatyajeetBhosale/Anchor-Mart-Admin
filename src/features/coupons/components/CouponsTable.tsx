/**
 * CouponsTable Component
 * Compact, responsive table view for coupons
 */

import type { Coupon } from "../types/coupon";
import { CouponRow } from "./CouponRow";

interface CouponsTableProps {
  coupons: Coupon[];
  isLoading?: boolean;
  onEdit?: (coupon: Coupon) => void;
  onDelete?: (coupon: Coupon) => void;
  onView?: (coupon: Coupon) => void;
}

export function CouponsTable({
  coupons,
  isLoading = false,
  onEdit,
  onDelete,
  onView,
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
            <tr className="border-b border-border">
              <td colSpan={8} className="px-3 py-2">
                <div className="h-3 bg-muted rounded animate-pulse" />
              </td>
            </tr>
            <tr className="border-b border-border">
              <td colSpan={8} className="px-3 py-2">
                <div className="h-3 bg-muted rounded animate-pulse" />
              </td>
            </tr>
            <tr className="border-b border-border">
              <td colSpan={8} className="px-3 py-2">
                <div className="h-3 bg-muted rounded animate-pulse" />
              </td>
            </tr>
            <tr className="border-b border-border">
              <td colSpan={8} className="px-3 py-2">
                <div className="h-3 bg-muted rounded animate-pulse" />
              </td>
            </tr>
            <tr className="border-b border-border">
              <td colSpan={8} className="px-3 py-2">
                <div className="h-3 bg-muted rounded animate-pulse" />
              </td>
            </tr>
          </tbody>
        </table>
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
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
