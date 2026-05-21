import { useState } from "react";
import { useGetCouponsQuery } from "../api/couponsApi";
import type { Coupon } from "../types/coupon";

interface UseCouponsReturn {
  coupons: Coupon[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCoupons(params: {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  type?: string;
}): UseCouponsReturn {
  const { data, isLoading, isFetching, isError, refetch } = useGetCouponsQuery({
    page: params.page,
    limit: params.limit,
    search: params.search,
    status: params.status,
    type: params.type,
  });

  const coupons = data?.data || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, pages: 0 };

  return {
    coupons,
    total: pagination.total,
    page: pagination.page,
    limit: pagination.limit,
    pages: pagination.pages,
    isLoading,
    isFetching,
    isError,
    error: isError ? "Failed to load coupons" : null,
    refetch: () => refetch(),
  };
}

interface UseCouponFiltersReturn {
  search: string;
  status: string;
  type: string;
  setSearch: (value: string) => void;
  setStatus: (value: string) => void;
  setType: (value: string) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

export function useCouponFilters(): UseCouponFiltersReturn {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");

  const hasActiveFilters = search !== "" || status !== "all" || type !== "all";

  return {
    search,
    status,
    type,
    setSearch,
    setStatus,
    setType,
    resetFilters: () => {
      setSearch("");
      setStatus("all");
      setType("all");
    },
    hasActiveFilters,
  };
}

interface UsePaginationReturn {
  page: number;
  limit: number;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

export function usePagination(initialPage = 1, initialLimit = 10): UsePaginationReturn {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  return {
    page,
    limit,
    goToPage: (newPage: number) => setPage(newPage),
    setPageSize: (size: number) => setLimit(size),
  };
}
