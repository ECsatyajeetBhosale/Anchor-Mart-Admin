/**
 * components/common/Header.tsx
 *
 * Top navigation bar — shown on every page via the Layout component.
 *
 * Behaviour:
 *   - If logged in  → shows the user's name + a Logout button
 *   - If logged out → shows a Login link
 */

import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logout, useAuth } from "@/features/auth";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { APP_ROUTES } from "@/lib/constants";
import { APP_TEXT } from "@/lib/messages";

type HeaderProps = {
  leftSlot?: ReactNode;
};

export function Header({ leftSlot }: HeaderProps) {
  const { isLoggedIn, user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth state from Redux (and localStorage)
    dispatch(logout());
    // Redirect to login page
    navigate(APP_ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-10 h-16 border-b border-gray-200 bg-white/80 backdrop-blur-sm rounded-xl">
      <div className="flex h-full w-full items-center justify-between gap-4 px-2 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          {leftSlot}

          {/* App name / logo */}
          <Link
            to={APP_ROUTES.HOME}
            className="truncate text-xl font-bold text-gray-950 tracking-tight hover:text-gray-700 transition-colors"
          >
            {/* {APP_TEXT.BRAND_NAME} */}
          </Link>
        </div>

        {/* Right side — auth actions */}
        <nav className="flex shrink-0 items-center gap-4">
          {isLoggedIn ? (
            <>
              <span className="text-sm text-gray-600">
                {APP_TEXT.AUTH.HELLO},{" "}
                <strong>{user?.name ?? APP_TEXT.AUTH.ACCOUNT_FALLBACK}</strong>
              </span>
              <Button variant="secondary" onClick={handleLogout}>
                {APP_TEXT.AUTH.LOGOUT}
              </Button>
            </>
          ) : (
            <Link
              to={APP_ROUTES.LOGIN}
              className="text-sm font-medium text-gray-700 hover:text-gray-950 transition-colors"
            >
              {APP_TEXT.AUTH.SIGN_IN}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
