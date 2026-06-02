import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import type { ProductQueryParams, ProductsResponse } from "../types/product";

export const productApi = createApi({
  reducerPath: "productApi",
  tagTypes: ["Products"],

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.MODE === "development" ? "" : import.meta.env.VITE_API_BASE_URL,

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Token ${token}`);
      }
      headers.set("ngrok-skip-browser-warning", "true");
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        searchParams.append("page", (params.page || 1).toString());
        searchParams.append("page_size", (params.limit || 10).toString());

        if (params.search) {
          searchParams.append("search", params.search);
        }

        const queryString = searchParams.toString();

        return {
          url: `${API_ENDPOINTS.CATALOG.GET_PRODUCTS}${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result) => {
        const tags: Array<"Products" | { type: "Products"; id: string }> = ["Products"];
        if (result?.data) {
          result.data.forEach((product) => {
            tags.push({ type: "Products", id: product.id });
          });
        }
        return tags;
      },
      transformResponse: (rawResult: unknown, _meta, arg) => {
        const isRecord = (value: unknown): value is Record<string, unknown> =>
          typeof value === "object" && value !== null;

        if (!isRecord(rawResult)) {
          return {
            data: [],
            pagination: { total: 0, page: 1, limit: 10, pages: 0 },
          };
        }

        const raw = rawResult as Record<string, unknown>;
        const payload = isRecord(raw.results) ? raw.results : raw;

        const resultsArray = Array.isArray(payload.data) ? payload.data : [];

        const total = typeof raw.count === "number" ? raw.count : resultsArray.length;
        const limit = arg?.limit || 10;
        const page = arg?.page || 1;
        const pages = Math.max(1, Math.ceil(total / limit));

        return {
          data: resultsArray,
          pagination: {
            total,
            page,
            limit,
            pages,
          },
        };
      },
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
