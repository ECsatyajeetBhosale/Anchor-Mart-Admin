import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Coupon, CouponPayload, CouponQueryParams, CouponsResponse } from "../types/coupon";

export const couponsApi = createApi({
  reducerPath: "couponsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.MODE === "development" ? "" : import.meta.env.VITE_API_BASE_URL,

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      console.log("Coupons API: Auth token present:", !!token);
      if (token) {
        headers.set("Authorization", `Token ${token}`);
      }
      headers.set("ngrok-skip-browser-warning", "true");
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getCoupons: builder.query<CouponsResponse, CouponQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        searchParams.append("page", (params.page || 1).toString());
        searchParams.append("page_size", (params.limit || 10).toString());

        if (params.search) {
          searchParams.append("search", params.search);
        }
        if (params.status) {
          searchParams.append("status", params.status);
        }
        if (params.type) {
          searchParams.append("type", params.type);
        }

        const queryString = searchParams.toString();
        const url = `/api/superadmin/orders/coupons/${queryString ? `?${queryString}` : ""}`;

        console.log("Coupons API: Fetching from", url, "with params:", params);
        return {
          url,
          method: "GET",
        };
      },
      transformResponse: (rawResult: unknown, _meta, arg) => {
        console.log("Coupons API: Raw response received:", rawResult);

        const isRecord = (value: unknown): value is Record<string, unknown> =>
          typeof value === "object" && value !== null;

        if (!isRecord(rawResult)) {
          console.warn("Coupons API: Invalid response format", rawResult);
          return {
            data: [],
            pagination: { total: 0, page: 1, limit: 10, pages: 0 },
          };
        }

        const raw = rawResult as Record<string, unknown>;

        const payload = (isRecord(raw.data) || Array.isArray(raw.data) ? raw.data : raw) as Record<
          string,
          unknown
        >;

        const resultsArray = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.results)
            ? (payload.results as Coupon[])
            : Array.isArray(payload.data)
              ? (payload.data as Coupon[])
              : [];

        const total =
          typeof payload.count === "number"
            ? payload.count
            : typeof raw.count === "number"
              ? raw.count
              : isRecord(raw.pagination) && typeof raw.pagination.total === "number"
                ? raw.pagination.total
                : resultsArray.length;

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
      transformErrorResponse: (response) => {
        console.error("Coupons API: Error response", {
          status: response.status,
          data: response.data,
        });
        return response;
      },
    }),

    getCouponById: builder.query<Coupon, string>({
      query: (id) => {
        const url = `/api/superadmin/orders/coupons/${id}`;
        console.log("Coupons API: Fetching coupon from", url);
        return {
          url,
          method: "GET",
        };
      },
    }),

    createCoupon: builder.mutation<Coupon, CouponPayload>({
      query: (payload) => ({
        url: "/api/superadmin/orders/coupons/add/",
        method: "POST",
        body: payload,
      }),
    }),

    updateCoupon: builder.mutation<Coupon, { id: string; payload: CouponPayload }>({
      query: ({ id, payload }) => ({
        url: `/api/superadmin/orders/coupons/update/${id}/`,
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const {
  useCreateCouponMutation,
  useGetCouponByIdQuery,
  useGetCouponsQuery,
  useLazyGetCouponsQuery,
  useUpdateCouponMutation,
} = couponsApi;
