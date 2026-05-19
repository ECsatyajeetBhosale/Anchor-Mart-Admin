/**
 * CouponDiscountBadge Component
 * Compact discount badge with type color coding
 */

import type { Coupon } from "../types/coupon";
import { formatDiscountLabel, getDiscountTypeColor } from "../utils/couponHelpers";

interface CouponDiscountBadgeProps {
  coupon: Coupon;
  className?: string;
}

export function CouponDiscountBadge({ coupon, className = "" }: CouponDiscountBadgeProps) {
  const color = getDiscountTypeColor(coupon.discount_type);
  const label = formatDiscountLabel(coupon);

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${color} whitespace-nowrap ${className}`}
    >
      {label}
    </span>
  );
}
