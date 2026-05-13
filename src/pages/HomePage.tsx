/**
 * pages/HomePage.tsx
 *
 * The home page — shown at route "/"
 * Wrapped inside the Layout component (so it has the Header).
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth";
import { APP_ROUTES } from "@/lib/constants";
import { APP_TEXT } from "@/lib/messages";

export function HomePage() {
  const { isLoggedIn, user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{APP_TEXT.HOME.TITLE}</h1>

      <p className="text-lg text-gray-500 max-w-md mb-8">
        {isLoggedIn
          ? APP_TEXT.HOME.signedInDescription(user?.email)
          : APP_TEXT.HOME.SIGNED_OUT_DESCRIPTION}
      </p>

      {/* Show different CTA depending on auth state */}
      {!isLoggedIn && (
        <Link to={APP_ROUTES.LOGIN}>
          <Button>{APP_TEXT.HOME.GET_STARTED}</Button>
        </Link>
      )}

      {isLoggedIn && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-6 py-4 text-green-700 text-sm font-medium">
          {APP_TEXT.HOME.LOGGED_IN_BADGE}
        </div>
      )}
    </div>
  );
}
