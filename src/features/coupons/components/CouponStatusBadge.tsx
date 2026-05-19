/**
 * CouponStatusBadge Component
 * Compact status badge with color coding
 */

import type { CouponStatus } from "../types/coupon";
import { getStatusColor } from "../utils/couponHelpers";

interface CouponStatusBadgeProps {
  status: CouponStatus;
  className?: string;
}

export function CouponStatusBadge({ status, className = "" }: CouponStatusBadgeProps) {
  const color = getStatusColor(status);
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold text-white ${color} ${className}`}
    >
      {label}
    </span>
  );
}
