/**
 * User-facing strings live here so adding language support later is a small,
 * predictable change instead of a component-by-component search.
 */

export const APP_TEXT = {
  BRAND_NAME: "Anchor Mart",

  AUTH: {
    LOGIN_TITLE: "Sign in to your account",
    LOGIN_ERROR: "Login failed. Please check your credentials and try again.",
    EMAIL_LABEL: "Email address",
    EMAIL_PLACEHOLDER: "you@example.com",
    PASSWORD_LABEL: "Password",
    PASSWORD_PLACEHOLDER: "Enter your password",
    SIGN_IN: "Sign in",
    LOGOUT: "Logout",
    HELLO: "Hello",
    ACCOUNT_FALLBACK: "your account",
    MISSING_TOKEN_ERROR: "Login response did not include an auth token.",
  },

  HOME: {
    TITLE: "Welcome to Anchor Mart",
    SIGNED_OUT_DESCRIPTION:
      "A clean, scalable React + TypeScript starter kit with Redux Toolkit & RTK Query.",
    GET_STARTED: "Get started - Sign in",
    LOGGED_IN_BADGE: "You are logged in!",
    signedInDescription: (email?: string) =>
      `You are signed in as ${email ?? APP_TEXT.AUTH.ACCOUNT_FALLBACK}. Ready to build something great!`,
  },

  VALIDATION: {
    EMAIL_REQUIRED: "Email is required",
    EMAIL_INVALID: "Please enter a valid email address",
    PASSWORD_REQUIRED: "Password is required",
    PASSWORD_MIN_LENGTH: "Password must be at least 6 characters",
  },
} as const;
