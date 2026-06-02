import { useState } from "react";
import { useGetProductsQuery } from "../api/productApi";
import type { Product } from "../types/product";

interface UseProductsReturn {
  products: Product[];
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

export function useProducts(params: {
  page: number;
  limit: number;
  search?: string;
}): UseProductsReturn {
  const { data, isLoading, isFetching, isError, refetch } = useGetProductsQuery({
    page: params.page,
    limit: params.limit,
    search: params.search,
  });

  const products = data?.data || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, pages: 0 };

  return {
    products,
    total: pagination.total,
    page: pagination.page,
    limit: pagination.limit,
    pages: pagination.pages,
    isLoading,
    isFetching,
    isError,
    error: isError ? "Failed to load products" : null,
    refetch: () => refetch(),
  };
}

interface UseProductFiltersReturn {
  search: string;
  setSearch: (value: string) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

export function useProductFilters(): UseProductFiltersReturn {
  const [search, setSearch] = useState("");

  const hasActiveFilters = search !== "";

  return {
    search,
    setSearch,
    resetFilters: () => {
      setSearch("");
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
    setPageSize: (size: number) => {
      setLimit(size);
      setPage(1);
    },
  };
}
