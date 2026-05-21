import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetLoyaltyPointsQuery } from "../api/loyaltyApi";
import type { LoyaltyResponse, SailorLoyalty } from "../types/loyalty";

interface UseLoyaltyReturn {
  sailors: SailorLoyalty[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => Promise<LoyaltyResponse>;
}

/**
 * Hook to manage loyalty points data with URL query sync and RTK query caching
 */
export function useLoyalty(): UseLoyaltyReturn {
  const [searchParams] = useSearchParams();

  // Parse state from URL search parameters (URL query sync)
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const ordering = searchParams.get("ordering") || "-total_points"; // Default: highest total points

  // Debounce the search input to prevent excessive API requests
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isFetching, error, refetch } = useGetLoyaltyPointsQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    ordering: ordering || undefined,
  });

  return useMemo(() => {
    const sailors = data?.data || [];
    const total = data?.pagination?.total || 0;
    const pages = data?.pagination?.pages || 0;
    const errorMessage = error
      ? typeof error === "string"
        ? error
        : "Failed to fetch loyalty points"
      : null;

    return {
      sailors,
      total,
      page,
      limit,
      pages,
      isLoading,
      isFetching,
      isError: !!error,
      error: errorMessage,
      refetch: () => refetch().unwrap(),
    };
  }, [data, error, isLoading, isFetching, page, limit, refetch]);
}

/**
 * Hook to read and write loyalty filter states with URL query sync
 */
export function useLoyaltyFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const ordering = searchParams.get("ordering") || "-total_points";

  const setPage = (newPage: number) => {
    setSearchParams(
      (prev) => {
        prev.set("page", newPage.toString());
        return prev;
      },
      { replace: true },
    );
  };

  const setLimit = (newLimit: number) => {
    setSearchParams(
      (prev) => {
        prev.set("limit", newLimit.toString());
        prev.set("page", "1"); // Reset to page 1 when changing page size
        return prev;
      },
      { replace: true },
    );
  };

  const setSearch = (newSearch: string) => {
    setSearchParams(
      (prev) => {
        if (newSearch) {
          prev.set("search", newSearch);
        } else {
          prev.delete("search");
        }
        prev.set("page", "1"); // Reset to page 1 when typing search
        return prev;
      },
      { replace: true },
    );
  };

  const setOrdering = (newOrdering: string) => {
    setSearchParams(
      (prev) => {
        if (newOrdering) {
          prev.set("ordering", newOrdering);
        } else {
          prev.delete("ordering");
        }
        prev.set("page", "1"); // Reset to page 1 on sorting change
        return prev;
      },
      { replace: true },
    );
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const hasActiveFilters = !!search || ordering !== "-total_points" || page !== 1 || limit !== 10;

  return {
    page,
    limit,
    search,
    ordering,
    setPage,
    setLimit,
    setSearch,
    setOrdering,
    resetFilters,
    hasActiveFilters,
  };
}

/**
 * Simple debounce utility hook
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
