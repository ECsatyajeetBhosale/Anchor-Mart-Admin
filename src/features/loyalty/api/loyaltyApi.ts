import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import type { LoyaltyQueryParams, LoyaltyResponse, SailorLoyalty } from "../types/loyalty";

export const loyaltyApi = createApi({
  reducerPath: "loyaltyApi",

  baseQuery: fetchBaseQuery({
    // Use relative URL in development to utilize Vite proxy (prevents CORS issues)
    baseUrl: import.meta.env.MODE === "development" ? "" : import.meta.env.VITE_API_BASE_URL,

    // Attach token authorization
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
    getLoyaltyPoints: builder.query<LoyaltyResponse, LoyaltyQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        // Pass standard page and page_size for DRF pagination
        searchParams.append("page", (params.page || 1).toString());
        searchParams.append("page_size", (params.limit || 10).toString());

        if (params.search) {
          searchParams.append("search", params.search);
        }
        if (params.ordering) {
          searchParams.append("ordering", params.ordering);
        }

        const queryString = searchParams.toString();

        return {
          url: `${API_ENDPOINTS.LOYALTY.POINTS}${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
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

        // Handle case where results are wrapped in a 'data' property
        const payload = (isRecord(raw.data) || Array.isArray(raw.data) ? raw.data : raw) as Record<
          string,
          unknown
        >;

        const resultsArray = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.results)
            ? (payload.results as SailorLoyalty[])
            : Array.isArray(payload.data)
              ? (payload.data as SailorLoyalty[])
              : [];

        const total =
          typeof payload.count === "number"
            ? payload.count
            : typeof raw.count === "number"
              ? raw.count
              : isRecord(raw.pagination) && typeof raw.pagination.total === "number"
                ? raw.pagination.total
                : resultsArray.length;

        const next =
          typeof payload.next === "string" || payload.next === null
            ? payload.next
            : typeof raw.next === "string" || raw.next === null
              ? raw.next
              : undefined;
        const previous =
          typeof payload.previous === "string" || payload.previous === null
            ? payload.previous
            : typeof raw.previous === "string" || raw.previous === null
              ? raw.previous
              : undefined;

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
            next,
            previous,
          },
        };
      },
      transformErrorResponse: (response) => {
        return response;
      },
    }),
  }),
});

export const { useGetLoyaltyPointsQuery, useLazyGetLoyaltyPointsQuery } = loyaltyApi;
