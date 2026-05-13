/**
 * features/auth/index.ts
 *
 * Public API for the auth feature.
 *
 * Rule: Other parts of the app must ONLY import from here,
 * never from deep internal paths like "../auth/slice/authSlice".
 * This keeps the feature self-contained and easy to refactor.
 */

// RTK Query hooks
export { useLoginMutation } from "./api/authApi";
// Components
export { LoginForm } from "./components/LoginForm";
// Hooks
export { useAuth } from "./hooks/useAuth";
// Slice actions
export { login, logout } from "./slice/authSlice";

// Types
export type { AuthState, LoginRequest, LoginResponse } from "./types/auth.types";
