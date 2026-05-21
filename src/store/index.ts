/**
 * store/index.ts
 *
 * The central Redux store for the entire app.
 *
 * configureStore() wires together:
 *   - Regular Redux slices (authSlice → client state)
 *   - RTK Query reducers (authApi → server/API state + caching)
 *   - RTK Query middleware (required for caching, invalidation, polling)
 */

import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/features/auth/api/authApi";
import authReducer from "@/features/auth/slice/authSlice";
import { couponsApi } from "@/features/coupons/api/couponsApi";
import { dashboardApi } from "@/features/dashboard/api/dashboardApi";
import { loyaltyApi } from "@/features/loyalty/api/loyaltyApi";

export const store = configureStore({
  reducer: {
    // Client state — managed by Redux slices
    auth: authReducer,

    // Server state — managed by RTK Query
    // The key must match the `reducerPath` defined in createApi()
    [authApi.reducerPath]: authApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [couponsApi.reducerPath]: couponsApi.reducer,
    [loyaltyApi.reducerPath]: loyaltyApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    // RTK Query middleware enables caching, invalidation, and polling
    getDefaultMiddleware().concat(
      authApi.middleware,
      dashboardApi.middleware,
      couponsApi.middleware,
      loyaltyApi.middleware,
    ),
});

// ─── TypeScript helpers ───────────────────────────────────────────────────────
// These types are inferred from the store so they always stay up to date.
// Always use these types instead of writing `any` for Redux state/dispatch.

// The full type of the Redux state tree
export type RootState = ReturnType<typeof store.getState>;

// The type of the dispatch function
export type AppDispatch = typeof store.dispatch;
