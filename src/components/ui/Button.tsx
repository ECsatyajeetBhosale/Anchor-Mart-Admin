/**
 * components/ui/Button.tsx
 *
 * A reusable Button component.
 *
 * Props:
 *   - All standard HTML button attributes (type, onClick, disabled, etc.)
 *   - `isLoading` → shows a spinner and disables the button during API calls
 *   - `variant`   → "primary" (default blue) | "secondary" (outline)
 *   - `className` → lets you add extra Tailwind classes from the parent
 */

import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary";
}

export function Button({
  children,
  isLoading = false,
  variant = "primary",
  className = "",
  disabled,
  ...rest
}: Props) {
  // Base styles that all button variants share
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Styles specific to each variant
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
    secondary:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-400",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {/* Show a spinner when loading */}
      {isLoading && (
        <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      )}
      {children}
    </button>
  );
}
