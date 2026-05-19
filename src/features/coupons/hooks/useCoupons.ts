/**
 * useCoupons Hook
 * Main hook for fetching and managing coupons data using RTK Query
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetCouponsQuery } from "../api/couponsApi";
import type { Coupon, CouponQueryParams } from "../types/coupon";

interface UseCouponsOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  sort?: string;
  order?: string;
}

interface UseCouponsReturn {
  coupons: Coupon[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch coupons with pagination and filters using RTK Query
 */
export function useCoupons(options: UseCouponsOptions = {}): UseCouponsReturn {
  const params: CouponQueryParams = {
    page: options.page ?? 1,
    limit: options.limit ?? 20,
    search: options.search,
    status: options.status,
    type: options.type as CouponQueryParams["type"],
    sort: options.sort as CouponQueryParams["sort"],
    order: options.order as CouponQueryParams["order"],
  };

  console.log("useCoupons: Calling API with params:", params);

  const { data, isLoading, error, refetch } = useGetCouponsQuery(params);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => {
    const couponsData = data?.data || [];
    const total = data?.pagination?.total || 0;
    const pages = data?.pagination?.pages || 0;
    const errorMessage = error
      ? typeof error === "string"
        ? error
        : "Failed to fetch coupons"
      : null;

    console.log("useCoupons: Received data with", couponsData.length, "coupons, total:", total);

    return {
      coupons: couponsData,
      total,
      page: options.page ?? 1,
      limit: options.limit ?? 20,
      pages,
      isLoading,
      isError: !!error,
      error: errorMessage,
      refetch,
    };
  }, [data, error, isLoading, options.page, options.limit, refetch]);
}

/**
 * Hook to manage pagination
 */
export function usePagination(initialPage = 1, initialLimit = 20) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, newPage));
  }, []);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const setPageSize = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing page size
  }, []);

  return {
    page,
    limit,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
  };
}

/**
 * Hook to manage sorting
 */
export function useSorting(initialField = "created_at", initialOrder: "asc" | "desc" = "desc") {
  const [field, setField] = useState(initialField);
  const [order, setOrder] = useState<"asc" | "desc">(initialOrder);

  const toggleSort = useCallback(
    (newField: string) => {
      if (field === newField) {
        // Toggle order if same field
        setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        // Set new field with default order
        setField(newField);
        setOrder("desc");
      }
    },
    [field],
  );

  const setSortField = useCallback((newField: string) => {
    setField(newField);
  }, []);

  const setSortOrder = useCallback((newOrder: "asc" | "desc") => {
    setOrder(newOrder);
  }, []);

  return {
    field,
    order,
    toggleSort,
    setSortField,
    setSortOrder,
  };
}

/**
 * Hook to manage search with debounce
 */
export function useSearch(initialValue = "", debounceMs = 300) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  const updateSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  }, []);

  return {
    searchTerm,
    debouncedSearchTerm,
    updateSearch,
    clearSearch,
  };
}
