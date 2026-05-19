/**
 * Coupon Types
 * Defines all TypeScript interfaces for coupon management
 */

export type DiscountType = "percentage" | "flat";
export type CouponStatus = "active" | "expired" | "upcoming";
export type SortField = "discount_value" | "times_used" | "valid_to" | "created_at";
export type SortOrder = "asc" | "desc";

/**
 * Core Coupon Data Structure
 */
export interface Coupon {
  id: string;
  code: string;
  image: string;
  discount_type: DiscountType;
  discount_value: string; // Decimal as string from API
  min_purchase_amount: string;
  max_discount_amount: string;
  valid_from: string; // ISO 8601 datetime
  valid_to: string; // ISO 8601 datetime
  usage_limit: number | null;
  times_used: number;
  is_public: boolean;
}

/**
 * Computed Coupon Properties
 * Derived from base Coupon data
 */
export interface CouponWithStatus extends Coupon {
  status: CouponStatus;
  isExpired: boolean;
  isActive: boolean;
  isUpcoming: boolean;
  usagePercentage: number; // 0-100
  isLimitReached: boolean;
  daysUntilExpiry: number;
}

/**
 * API Response Types
 */
export interface CouponsResponse {
  data: Coupon[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

/**
 * Filter State
 */
export interface CouponFilters {
  search: string;
  status: "all" | CouponStatus;
  type: "all" | DiscountType;
  visibility: "all" | "public" | "private";
  usage: "all" | "limited" | "unlimited";
}

/**
 * Pagination State
 */
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

/**
 * Sorting State
 */
export interface SortState {
  field: SortField;
  order: SortOrder;
}

/**
 * API Query Parameters
 */
export interface CouponQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: DiscountType;
  sort?: SortField;
  order?: SortOrder;
}

/**
 * Action Payloads
 */
export interface CreateCouponPayload {
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  min_purchase_amount: number;
  max_discount_amount: number;
  valid_from: string;
  valid_to: string;
  usage_limit: number | null;
  is_public: boolean;
  image?: File;
}

export interface UpdateCouponPayload extends Partial<CreateCouponPayload> {
  id: string;
}

export interface DeleteCouponPayload {
  id: string;
}

export interface TogglePublicPayload {
  id: string;
  is_public: boolean;
}

/**
 * UI State
 */
export interface CouponsUIState {
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  selectedCoupon: Coupon | null;
  isModalOpen: boolean;
  modalMode: "view" | "edit" | "create";
}

/**
 * Table Column Configuration
 */
export interface TableColumn {
  key: keyof Coupon;
  label: string;
  sortable: boolean;
  width?: string;
  render?: (value: unknown, coupon: Coupon) => React.ReactNode;
}
