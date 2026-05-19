/**
 * CouponRow Component
 * Compact table row for a single coupon
 */

import type { Coupon } from "../types/coupon";
import {
  enrichCoupon,
  formatCurrency,
  formatUsage,
  getVisibilityLabel,
} from "../utils/couponHelpers";
import { formatDate } from "../utils/dateHelpers";
import { CouponDiscountBadge } from "./CouponDiscountBadge";
import { CouponRowActions } from "./CouponRowActions";
import { CouponStatusBadge } from "./CouponStatusBadge";

interface CouponRowProps {
  coupon: Coupon;
  onEdit?: (coupon: Coupon) => void;
  onDelete?: (coupon: Coupon) => void;
  onView?: (coupon: Coupon) => void;
}

export function CouponRow({ coupon, onEdit, onDelete, onView }: CouponRowProps) {
  const enriched = enrichCoupon(coupon);

  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors text-xs">
      {/* Code - Truncated with max width */}
      <td className="px-3 py-2 font-medium text-foreground">
        <CouponRowActions.CodeCell coupon={coupon} />
      </td>

      {/* Discount */}
      <td className="px-3 py-2">
        <CouponDiscountBadge coupon={coupon} />
      </td>

      {/* Min Purchase - Right aligned */}
      <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
        {formatCurrency(coupon.min_purchase_amount)}
      </td>

      {/* Usage - Compact progress bar */}
      <td className="px-3 py-2">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-muted-foreground">{formatUsage(coupon)}</span>
          {coupon.usage_limit && (
            <div className="w-12 h-1.5 bg-border rounded-full overflow-hidden shrink-0">
              <div
                className={`h-full transition-colors ${
                  enriched.usagePercentage > 80 ? "bg-destructive" : "bg-primary"
                }`}
                style={{ width: `${Math.min(enriched.usagePercentage, 100)}%` }}
              />
            </div>
          )}
        </div>
      </td>

      {/* Valid To - Shortened date format */}
      <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
        <span className="text-xs">{formatDate(coupon.valid_to)}</span>
      </td>

      {/* Status */}
      <td className="px-3 py-2">
        <CouponStatusBadge status={enriched.status} />
      </td>

      {/* Visibility - Compact icon + text */}
      <td className="px-3 py-2">
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          {coupon.is_public ? "🌐" : "🔒"}
          <span className="text-xs hidden sm:inline">{getVisibilityLabel(coupon.is_public)}</span>
        </span>
      </td>

      {/* Actions - Icon-only buttons */}
      <td className="px-3 py-2 text-right">
        <div className="flex justify-end">
          <CouponRowActions coupon={coupon} onEdit={onEdit} onDelete={onDelete} onView={onView} />
        </div>
      </td>
    </tr>
  );
}
