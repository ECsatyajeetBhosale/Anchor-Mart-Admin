/**
 * useCouponFilters Hook
 * Manages filter state for coupons
 */

import { useCallback, useMemo, useState } from "react";
import type { CouponFilters } from "../types/coupon";

interface UseCouponFiltersReturn {
  filters: CouponFilters;
  updateSearch: (search: string) => void;
  updateStatus: (status: CouponFilters["status"]) => void;
  updateType: (type: CouponFilters["type"]) => void;
  updateVisibility: (visibility: CouponFilters["visibility"]) => void;
  updateUsage: (usage: CouponFilters["usage"]) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

const DEFAULT_FILTERS: CouponFilters = {
  search: "",
  status: "all",
  type: "all",
  visibility: "all",
  usage: "all",
};

/**
 * Hook to manage coupon filters
 */
export function useCouponFilters(initialFilters?: Partial<CouponFilters>): UseCouponFiltersReturn {
  const [filters, setFilters] = useState<CouponFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  const updateSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const updateStatus = useCallback((status: CouponFilters["status"]) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const updateType = useCallback((type: CouponFilters["type"]) => {
    setFilters((prev) => ({ ...prev, type }));
  }, []);

  const updateVisibility = useCallback((visibility: CouponFilters["visibility"]) => {
    setFilters((prev) => ({ ...prev, visibility }));
  }, []);

  const updateUsage = useCallback((usage: CouponFilters["usage"]) => {
    setFilters((prev) => ({ ...prev, usage }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== "" ||
      filters.status !== "all" ||
      filters.type !== "all" ||
      filters.visibility !== "all" ||
      filters.usage !== "all"
    );
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search !== "") count++;
    if (filters.status !== "all") count++;
    if (filters.type !== "all") count++;
    if (filters.visibility !== "all") count++;
    if (filters.usage !== "all") count++;
    return count;
  }, [filters]);

  return {
    filters,
    updateSearch,
    updateStatus,
    updateType,
    updateVisibility,
    updateUsage,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
  };
}

/**
 * Hook to get filter options
 */
export function useFilterOptions() {
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "expired", label: "Expired" },
    { value: "upcoming", label: "Upcoming" },
  ];

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "percentage", label: "Percentage" },
    { value: "flat", label: "Flat Amount" },
  ];

  const visibilityOptions = [
    { value: "all", label: "All" },
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
  ];

  const usageOptions = [
    { value: "all", label: "All" },
    { value: "limited", label: "Limited" },
    { value: "unlimited", label: "Unlimited" },
  ];

  const sortOptions = [
    { value: "created_at", label: "Newest First" },
    { value: "discount_value", label: "Highest Discount" },
    { value: "times_used", label: "Most Used" },
    { value: "valid_to", label: "Expiring Soon" },
  ];

  const pageSizeOptions = [
    { value: 10, label: "10 per page" },
    { value: 20, label: "20 per page" },
    { value: 50, label: "50 per page" },
    { value: 100, label: "100 per page" },
  ];

  return {
    statusOptions,
    typeOptions,
    visibilityOptions,
    usageOptions,
    sortOptions,
    pageSizeOptions,
  };
}
