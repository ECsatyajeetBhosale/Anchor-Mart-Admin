import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import type {
  CategoriesResponse,
  CategoryPayload,
  CategoryQueryParams,
  CategoryResponse,
} from "../types/category";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  tagTypes: ["Categories"],

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
    getCategories: builder.query<CategoriesResponse, CategoryQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        searchParams.append("page", (params.page || 1).toString());
        searchParams.append("page_size", (params.limit || 10).toString());

        if (params.search) {
          searchParams.append("search", params.search);
        }

        const queryString = searchParams.toString();

        return {
          url: `${API_ENDPOINTS.CATALOG.GET_CATEGORIES}${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result, _error, _arg) => {
        const tags: Array<"Categories" | { type: "Categories"; id: string }> = ["Categories"];
        if (result?.data) {
          result.data.forEach((category) => {
            tags.push({ type: "Categories", id: category.id });
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

    addCategory: builder.mutation<CategoryResponse, CategoryPayload>({
      query: (payload) => ({
        url: API_ENDPOINTS.CATALOG.ADD_CATEGORY,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Categories"],
    }),

    updateCategory: builder.mutation<CategoryResponse, { id: string; payload: CategoryPayload }>({
      query: ({ id, payload }) => ({
        url: API_ENDPOINTS.CATALOG.UPDATE_CATEGORY(id),
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => ["Categories", { type: "Categories", id }],
    }),

    deleteCategory: builder.mutation<CategoryResponse, string>({
      query: (id) => ({
        url: API_ENDPOINTS.CATALOG.DELETE_CATEGORY(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
