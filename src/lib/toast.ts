/**
 * toast.ts
 *
 * Centralized toast notification utilities using Sonner.
 * Import and use these functions anywhere in your app for consistent toast notifications.
 *
 * @example
 * import { toast } from '@/lib/toast';
 *
 * toast.success('Category created successfully!');
 * toast.error('Failed to delete category');
 * toast.promise(apiCall(), {
 *   loading: 'Saving...',
 *   success: 'Saved!',
 *   error: 'Failed to save'
 * });
 */

import { toast as sonnerToast } from "sonner";

export const toast = {
  /**
   * Show a success toast notification
   */
  success: (message: string, description?: string) => {
    return sonnerToast.success(message, {
      description,
      duration: 3000,
    });
  },

  /**
   * Show an error toast notification
   */
  error: (message: string, description?: string) => {
    return sonnerToast.error(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Show a warning toast notification
   */
  warning: (message: string, description?: string) => {
    return sonnerToast.warning(message, {
      description,
      duration: 3000,
    });
  },

  /**
   * Show an info toast notification
   */
  info: (message: string, description?: string) => {
    return sonnerToast.info(message, {
      description,
      duration: 3000,
    });
  },

  /**
   * Show a loading toast notification
   */
  loading: (message: string, description?: string) => {
    return sonnerToast.loading(message, {
      description,
    });
  },

  /**
   * Show a promise-based toast that updates based on promise state
   */
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
  ) => {
    return sonnerToast.promise(promise, options);
  },

  /**
   * Dismiss a specific toast by ID
   */
  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId);
  },

  /**
   * Show a custom toast with full control
   */
  custom: (message: string, options?: Parameters<typeof sonnerToast>[1]) => {
    return sonnerToast(message, options);
  },
};
