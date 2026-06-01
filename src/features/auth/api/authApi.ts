/**
 * features/auth/api/authApi.ts
 *
 * RTK Query API slice for authentication.
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { APP_TEXT } from "@/lib/messages";
import type { LoginRequest, LoginResponse } from "../types/auth.types";

type RawLoginUser = {
  id?: number | string | null;
  email?: string;
  name?: string;
  username?: string;
};

type RawLoginResponse = {
  token?: string;
  access?: string;
  accessToken?: string;
  access_token?: string;
  refresh?: string;
  refreshToken?: string;
  refresh_token?: string;
  user?: RawLoginUser | null;
  admin?: RawLoginUser | null;
  data?: RawLoginResponse;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const toRawLoginResponse = (value: unknown): RawLoginResponse => {
  if (!isRecord(value)) {
    return {};
  }

  return value as RawLoginResponse;
};

const firstString = (...values: unknown[]) =>
  values.find((value): value is string => typeof value === "string" && value.length > 0);

const normalizeLoginResponse = (rawResult: unknown, request: LoginRequest): LoginResponse => {
  const raw = toRawLoginResponse(rawResult);
  const payload = raw.data ?? raw;
  const token = firstString(
    payload.token,
    payload.access,
    payload.accessToken,
    payload.access_token,
  );

  if (!token) {
    throw new Error(APP_TEXT.AUTH.MISSING_TOKEN_ERROR);
  }

  const rawUser = payload.user ?? payload.admin ?? null;
  const user = rawUser
    ? {
        id: rawUser.id ?? null,
        email: rawUser.email ?? request.email,
        name: rawUser.name ?? rawUser.username ?? request.email,
      }
    : null;

  return {
    token,
    refreshToken: firstString(payload.refreshToken, payload.refresh, payload.refresh_token),
    user,
  };
};

export const authApi = createApi({
  // A unique key — RTK Query uses this to store data in Redux
  reducerPath: "authApi",

  // fetchBaseQuery is a small wrapper around the native fetch()
  // It reads the base URL from the .env file
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        // Backend expects "Token" scheme (not "Bearer")
        headers.set("Authorization", `Token ${token}`);
      }
      headers.set("ngrok-skip-browser-warning", "true");
      return headers;
    },
  }),

  // All API endpoints for the auth feature
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: "POST",
        body: credentials,
      }),

      transformResponse: (rawResult, _meta, arg) => normalizeLoginResponse(rawResult, arg),
    }),
  }),
});

export const { useLoginMutation } = authApi;
