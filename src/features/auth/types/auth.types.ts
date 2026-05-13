/**
 * features/auth/types/auth.types.ts
 *
 * TypeScript types specific to the auth feature.
 * These describe the shape of data coming from/going to the API.
 */

// Data we send to the login API
export interface LoginRequest {
  email: string;
  password: string;
}

// Data we receive back from the login API
export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: {
    id: number | string | null;
    email: string;
    name: string;
  } | null;
}

// Shape of the auth state in the Redux store
export interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  user: LoginResponse["user"] | null;
}
