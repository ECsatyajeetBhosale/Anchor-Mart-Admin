/**
 * store/index.ts
 *
 * The central Redux store for the entire app.
 */

import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/features/auth/api/authApi";
import authReducer from "@/features/auth/slice/authSlice";
import { categoryApi } from "@/features/catalog/api/categoryApi";
import { couponsApi } from "@/features/coupons/api/couponsApi";
import { dashboardApi } from "@/features/dashboard/api/dashboardApi";
import { loyaltyApi } from "@/features/loyalty/api/loyaltyApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [couponsApi.reducerPath]: couponsApi.reducer,
    [loyaltyApi.reducerPath]: loyaltyApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      dashboardApi.middleware,
      categoryApi.middleware,
      couponsApi.middleware,
      loyaltyApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
