/**
 * types/index.ts
 *
 * Global TypeScript types shared across the whole app.
 * Feature-specific types belong in features/<feature>/types/.
 */

// A generic API error shape — useful when reading error messages from RTK Query
export interface ApiError {
  status: number;
  data: {
    message: string;
  };
}
