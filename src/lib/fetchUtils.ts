/**
 * fetchUtils.ts
 *
 * Custom fetch utilities to handle CORS issues in development
 * by proxying through Vite dev server.
 */

/**
 * Get the correct API URL based on environment
 * In development: use relative path /api/* to leverage Vite proxy
 * In production: use full URL from .env
 */
export function getApiBaseUrl(): string {
  if (import.meta.env.MODE === "development") {
    // In development, use relative URL to proxy through Vite
    return "";
  }
  // In production, use full URL from environment
  return import.meta.env.VITE_API_BASE_URL;
}

/**
 * Build the full API endpoint URL
 * Handles both development (proxied) and production scenarios
 */
export function buildApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl();
  const fullUrl = baseUrl + endpoint;

  console.log("🔗 API URL:", {
    mode: import.meta.env.MODE,
    baseUrl,
    endpoint,
    fullUrl,
    isDevelopment: import.meta.env.MODE === "development",
  });

  return fullUrl;
}
