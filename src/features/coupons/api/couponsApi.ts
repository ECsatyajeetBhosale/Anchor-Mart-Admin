import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Coupon, CouponQueryParams, CouponsResponse } from "../types/coupon";

export const couponsApi = createApi({
  reducerPath: "couponsApi",

  baseQuery: fetchBaseQuery({
    // Use relative URL in development (proxied by Vite)
    // Use full URL in production (from .env)
    baseUrl:
      import.meta.env.MODE === "development"
        ? "" // Relative URL - proxied by Vite dev server
        : import.meta.env.VITE_API_BASE_URL,

    // Attach the auth token to every request
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      console.log("Coupons API: Auth token present:", !!token);
      if (token) {
        // Backend expects "Token" scheme (not "Bearer")
        headers.set("Authorization", `Token ${token}`);
      }
      // Required for ngrok to bypass the interstitial browser warning
      headers.set("ngrok-skip-browser-warning", "true");
      return headers;
    },
  }),

  endpoints: (builder) => ({
    // Fetch coupons with filters and pagination
    getCoupons: builder.query<CouponsResponse, CouponQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        // Always include page and page_size to ensure proper pagination
        searchParams.append("page", (params.page || 1).toString());
        searchParams.append("page_size", (params.limit || 20).toString());

        if (params.search) searchParams.append("search", params.search);
        if (params.status) searchParams.append("status", params.status);
        if (params.type) searchParams.append("type", params.type);
        if (params.sort) searchParams.append("sort", params.sort);
        if (params.order) searchParams.append("order", params.order);

        const queryString = searchParams.toString();
        const url = `api/superadmin/orders/coupons${queryString ? `?${queryString}` : ""}`;

        console.log("Coupons API: Fetching from", url, "with params:", params);
        return {
          url,
          method: "GET",
        };
      },
      transformResponse: (rawResult: unknown, _meta, arg) => {
        console.log("Coupons API: Raw response received:", rawResult);
        console.log("Coupons API: Request params (arg):", arg);

        // Handle different response structures
        const isRecord = (value: unknown): value is Record<string, unknown> =>
          typeof value === "object" && value !== null;

        if (!isRecord(rawResult)) {
          console.warn("Coupons API: Invalid response format", rawResult);
          return {
            data: [],
            pagination: { total: 0, page: 1, limit: 20, pages: 0 },
          };
        }

        const raw = rawResult as Record<string, unknown>;

        // Check if response has a 'data' wrapper
        const payload = (isRecord(raw.data) || Array.isArray(raw.data) ? raw.data : raw) as Record<
          string,
          unknown
        >;

        console.log("Coupons API: Normalized payload:", payload);

        // Extract coupons array and pagination
        const couponsArray = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.results)
            ? (payload.results as Coupon[])
            : Array.isArray(payload.data)
              ? (payload.data as Coupon[])
              : [];
        const rawTotal =
          typeof raw.count === "number"
            ? raw.count
            : isRecord(raw.pagination) && typeof raw.pagination.total === "number"
              ? raw.pagination.total
              : couponsArray.length;
        const total = typeof rawTotal === "number" ? rawTotal : 0;
        const rawPage =
          typeof raw.page === "number"
            ? raw.page
            : isRecord(raw.pagination) && typeof raw.pagination.page === "number"
              ? raw.pagination.page
              : arg?.page || 1;
        const page = typeof rawPage === "number" ? rawPage : 1;
        // Use request limit as primary fallback - this ensures pagination matches user's selection
        const rawLimit =
          arg?.limit ||
          (typeof raw.limit === "number"
            ? raw.limit
            : typeof raw.page_size === "number"
              ? raw.page_size
              : isRecord(raw.pagination) && typeof raw.pagination.limit === "number"
                ? raw.pagination.limit
                : 20);
        const limit = typeof rawLimit === "number" ? rawLimit : 20;

        // Defensive calculation: ensure limit is never 0 or negative
        // Ensure pages is at least 1 even if total is 0
        const safeLimit = Math.max(1, limit);
        const pages = Math.max(1, Math.ceil((total || 0) / safeLimit));

        const paginationData = {
          total,
          page: Math.max(1, page), // Ensure page is at least 1
          limit: safeLimit,
          pages,
        };

        console.log(
          "Coupons API: Calculated pagination - total:",
          total,
          "safeLimit:",
          safeLimit,
          "pages:",
          pages,
          "page:",
          paginationData.page,
        );

        return {
          data: couponsArray,
          pagination: paginationData,
        };
      },
      transformErrorResponse: (response) => {
        console.error("Coupons API: Error response", {
          status: response.status,
          data: response.data,
        });
        return response;
      },
    }),

    // Get single coupon by ID
    getCouponById: builder.query<Coupon, string>({
      query: (id) => {
        const url = `api/superadmin/orders/coupons/${id}`;
        console.log("Coupons API: Fetching coupon from", url);
        return {
          url,
          method: "GET",
        };
      },
    }),

    // Create new coupon
    createCoupon: builder.mutation<Coupon, FormData>({
      query: (payload) => ({
        url: "api/superadmin/orders/coupons",
        method: "POST",
        body: payload,
      }),
    }),

    // Update coupon
    updateCoupon: builder.mutation<Coupon, { id: string; payload: FormData }>({
      query: ({ id, payload }) => ({
        url: `api/superadmin/orders/coupons/${id}`,
        method: "PATCH",
        body: payload,
      }),
    }),

    // Delete coupon
    deleteCoupon: builder.mutation<void, string>({
      query: (id) => ({
        url: `api/superadmin/orders/coupons/${id}`,
        method: "DELETE",
      }),
    }),

    // Toggle coupon public/private status
    toggleCouponPublic: builder.mutation<Coupon, { id: string; isPublic: boolean }>({
      query: ({ id, isPublic }) => ({
        url: `api/superadmin/orders/coupons/${id}`,
        method: "PATCH",
        body: JSON.stringify({ is_public: isPublic }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // Duplicate coupon
    duplicateCoupon: builder.mutation<Coupon, string>({
      query: (id) => ({
        url: `api/superadmin/orders/coupons/${id}/duplicate`,
        method: "POST",
      }),
    }),

    // Export coupons to CSV
    exportCouponsToCSV: builder.query<Blob, CouponQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("page_size", params.limit.toString()); // Backend expects 'page_size'
        if (params.search) searchParams.append("search", params.search);
        if (params.status) searchParams.append("status", params.status);
        if (params.type) searchParams.append("type", params.type);

        const queryString = searchParams.toString();
        const url = `api/superadmin/orders/coupons/export/csv${queryString ? `?${queryString}` : ""}`;

        return {
          url,
          method: "GET",
          responseHandler: async (response) => await response.blob(),
        };
      },
    }),

    // Get coupon analytics
    getCouponAnalytics: builder.query<Record<string, unknown>, void>({
      query: () => ({
        url: "api/superadmin/orders/coupons/analytics",
        method: "GET",
      }),
    }),
  }),
});

// Export the auto-generated hooks
export const {
  useGetCouponsQuery,
  useGetCouponByIdQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useToggleCouponPublicMutation,
  useDuplicateCouponMutation,
  useExportCouponsToCSVQuery,
  useGetCouponAnalyticsQuery,
} = couponsApi;
