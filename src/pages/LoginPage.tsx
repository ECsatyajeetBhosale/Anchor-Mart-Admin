/**
 * pages/LoginPage.tsx
 *
 * The login page — shown at route "/login"
 * This is a standalone page (not wrapped in Layout) so it has no Header.
 * It uses a centred card layout common in login screens.
 */

import { Navigate } from "react-router-dom";
import { LoginForm, useAuth } from "@/features/auth";
import { APP_ROUTES } from "@/lib/constants";

export function LoginPage() {
  const { isLoggedIn } = useAuth();

  // If the user is already logged in, send them straight to Home
  if (isLoggedIn) {
    return <Navigate to={APP_ROUTES.HOME} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Login card */}
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <LoginForm />
      </div>
    </div>
  );
}
