/**
 * features/auth/hooks/useAuth.ts
 *
 * A convenient hook to read auth state from Redux.
 *
 * Instead of writing useAppSelector((state) => state.auth.isLoggedIn)
 * everywhere, components just call: const { isLoggedIn, user } = useAuth()
 */

import { useAppSelector } from "@/hooks/useAppDispatch";

export function useAuth() {
  // Read the entire auth slice from the Redux store
  const auth = useAppSelector((state) => state.auth);

  return {
    isLoggedIn: auth.isLoggedIn,
    token: auth.token,
    user: auth.user,
  };
}
