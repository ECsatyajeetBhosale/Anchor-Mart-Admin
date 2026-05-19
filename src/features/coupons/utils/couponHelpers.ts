/**
 * Coupon Helper Functions
 * Utility functions for coupon data manipulation and formatting
 */

import type { Coupon, CouponStatus, CouponWithStatus } from "../types/coupon";

/**
 * Determine coupon status based on dates
 */
export function getCouponStatus(coupon: Coupon): CouponStatus {
  const now = new Date();
  const validFrom = new Date(coupon.valid_from);
  const validTo = new Date(coupon.valid_to);

  if (now < validFrom) return "upcoming";
  if (now > validTo) return "expired";
  return "active";
}

/**
 * Check if coupon is expired
 */
export function isExpired(coupon: Coupon): boolean {
  return new Date() > new Date(coupon.valid_to);
}

/**
 * Check if coupon is active
 */
export function isActive(coupon: Coupon): boolean {
  const now = new Date();
  const validFrom = new Date(coupon.valid_from);
  const validTo = new Date(coupon.valid_to);
  return now >= validFrom && now <= validTo;
}

/**
 * Check if coupon is upcoming
 */
export function isUpcoming(coupon: Coupon): boolean {
  return new Date() < new Date(coupon.valid_from);
}

/**
 * Calculate usage percentage
 */
export function getUsagePercentage(coupon: Coupon): number {
  if (coupon.usage_limit === null) return 0;
  return Math.round((coupon.times_used / coupon.usage_limit) * 100);
}

/**
 * Check if usage limit is reached
 */
export function isUsageLimitReached(coupon: Coupon): boolean {
  if (coupon.usage_limit === null) return false;
  return coupon.times_used >= coupon.usage_limit;
}

/**
 * Calculate days until expiry
 */
export function getDaysUntilExpiry(coupon: Coupon): number {
  const now = new Date();
  const validTo = new Date(coupon.valid_to);
  const diffTime = validTo.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Enrich coupon with computed properties
 */
export function enrichCoupon(coupon: Coupon): CouponWithStatus {
  const status = getCouponStatus(coupon);
  return {
    ...coupon,
    status,
    isExpired: isExpired(coupon),
    isActive: isActive(coupon),
    isUpcoming: isUpcoming(coupon),
    usagePercentage: getUsagePercentage(coupon),
    isLimitReached: isUsageLimitReached(coupon),
    daysUntilExpiry: getDaysUntilExpiry(coupon),
  };
}

/**
 * Format discount value for display
 */
export function formatDiscount(coupon: Coupon): string {
  const value = parseFloat(coupon.discount_value);
  if (coupon.discount_type === "percentage") {
    return `${value.toFixed(0)}%`;
  }
  return `$${value.toFixed(2)}`;
}

/**
 * Format discount with label
 */
export function formatDiscountLabel(coupon: Coupon): string {
  const value = parseFloat(coupon.discount_value);
  if (coupon.discount_type === "percentage") {
    return `${value.toFixed(0)}%`;
  }
  return `$${value.toFixed(2)}`;
}

/**
 * Format currency
 */
export function formatCurrency(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return `$${num.toFixed(2)}`;
}

/**
 * Get status badge color
 */
export function getStatusColor(status: CouponStatus): string {
  switch (status) {
    case "active":
      return "bg-green-600";
    case "expired":
      return "bg-red-600";
    case "upcoming":
      return "bg-amber-600";
    default:
      return "bg-gray-600";
  }
}

/**
 * Get status badge icon
 */
export function getStatusIcon(status: CouponStatus): string {
  switch (status) {
    case "active":
      return "🟢";
    case "expired":
      return "🔴";
    case "upcoming":
      return "🟡";
    default:
      return "⚪";
  }
}

/**
 * Get discount type color
 */
export function getDiscountTypeColor(type: "percentage" | "flat"): string {
  return type === "percentage" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800";
}

/**
 * Get visibility label
 */
export function getVisibilityLabel(isPublic: boolean): string {
  return isPublic ? "Public" : "Private";
}

/**
 * Get visibility icon
 */
export function getVisibilityIcon(isPublic: boolean): string {
  return isPublic ? "🌐" : "🔒";
}

/**
 * Format usage display
 */
export function formatUsage(coupon: Coupon): string {
  if (coupon.usage_limit === null) {
    return `${coupon.times_used} / Unlimited`;
  }
  return `${coupon.times_used} / ${coupon.usage_limit}`;
}

/**
 * Check if coupon is expiring soon (within 7 days)
 */
export function isExpiringSoon(coupon: Coupon): boolean {
  const daysUntilExpiry = getDaysUntilExpiry(coupon);
  return daysUntilExpiry <= 7 && daysUntilExpiry > 0 && isActive(coupon);
}

/**
 * Check if coupon has high usage (>80%)
 */
export function hasHighUsage(coupon: Coupon): boolean {
  if (coupon.usage_limit === null) return false;
  return getUsagePercentage(coupon) > 80;
}

/**
 * Sort coupons by field
 */
export function sortCoupons(
  coupons: Coupon[],
  field: "discount_value" | "times_used" | "valid_to" | "created_at",
  order: "asc" | "desc" = "asc",
): Coupon[] {
  const sorted = [...coupons].sort((a, b) => {
    let aVal: string | number;
    let bVal: string | number;

    switch (field) {
      case "discount_value":
        aVal = parseFloat(a.discount_value);
        bVal = parseFloat(b.discount_value);
        break;
      case "times_used":
        aVal = a.times_used;
        bVal = b.times_used;
        break;
      case "valid_to":
        aVal = new Date(a.valid_to).getTime();
        bVal = new Date(b.valid_to).getTime();
        break;
      default:
        return 0;
    }

    if (order === "asc") {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  return sorted;
}

/**
 * Filter coupons by search term
 */
export function filterCouponsBySearch(coupons: Coupon[], searchTerm: string): Coupon[] {
  if (!searchTerm.trim()) return coupons;

  const term = searchTerm.toLowerCase();
  return coupons.filter((coupon) => coupon.code.toLowerCase().includes(term));
}

/**
 * Filter coupons by status
 */
export function filterCouponsByStatus(coupons: Coupon[], status: "all" | CouponStatus): Coupon[] {
  if (status === "all") return coupons;

  return coupons.filter((coupon) => getCouponStatus(coupon) === status);
}

/**
 * Filter coupons by type
 */
export function filterCouponsByType(
  coupons: Coupon[],
  type: "all" | "percentage" | "flat",
): Coupon[] {
  if (type === "all") return coupons;

  return coupons.filter((coupon) => coupon.discount_type === type);
}

/**
 * Filter coupons by visibility
 */
export function filterCouponsByVisibility(
  coupons: Coupon[],
  visibility: "all" | "public" | "private",
): Coupon[] {
  if (visibility === "all") return coupons;

  if (visibility === "public") {
    return coupons.filter((coupon) => coupon.is_public);
  }
  return coupons.filter((coupon) => !coupon.is_public);
}

/**
 * Filter coupons by usage
 */
export function filterCouponsByUsage(
  coupons: Coupon[],
  usage: "all" | "limited" | "unlimited",
): Coupon[] {
  if (usage === "all") return coupons;

  if (usage === "limited") {
    return coupons.filter((coupon) => coupon.usage_limit !== null);
  }
  return coupons.filter((coupon) => coupon.usage_limit === null);
}
