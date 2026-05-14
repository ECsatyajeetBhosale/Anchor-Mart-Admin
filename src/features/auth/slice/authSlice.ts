/**
 * features/auth/slice/authSlice.ts
 *
 * Redux slice for client-side auth state.
 *
 * Important distinction:
 *   - authApi (RTK Query) → handles the LOGIN API call and caching
 *   - authSlice (this file) → stores whether the user IS logged in
 *
 * After a successful login, we call the `login` action from this slice
 * to save the token and user info in Redux.
 */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, LoginResponse } from "../types/auth.types";

const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

const parseStoredUser = (): AuthState["user"] => {
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthState["user"];
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

// The initial state — user is logged out by default
const initialState: AuthState = {
  isLoggedIn: Boolean(storedToken),
  token: storedToken,
  user: parseStoredUser(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    // Called after a successful login API response
    // Saves the token + user info and marks the user as logged in
    login: (state, action: PayloadAction<LoginResponse>) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.user = action.payload.user;

      // Also persist the token in localStorage so it survives page refresh
      localStorage.setItem("token", action.payload.token);
      if (action.payload.user) {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      } else {
        localStorage.removeItem("user");
      }
    },

    // Called when the user clicks "Logout"
    // Clears all auth data from Redux and localStorage
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.user = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

// Export the action creators so components can dispatch them
export const { login, logout } = authSlice.actions;

// Export the reducer so the Redux store can register it
export default authSlice.reducer;
