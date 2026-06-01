/**
 * features/auth/slice/authSlice.ts
 *
 * Redux slice for client-side auth state.
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

const initialState: AuthState = {
  isLoggedIn: Boolean(storedToken),
  token: storedToken,
  user: parseStoredUser(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    login: (state, action: PayloadAction<LoginResponse>) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.user = action.payload.user;

      localStorage.setItem("token", action.payload.token);
      if (action.payload.user) {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      } else {
        localStorage.removeItem("user");
      }
    },

    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.user = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
