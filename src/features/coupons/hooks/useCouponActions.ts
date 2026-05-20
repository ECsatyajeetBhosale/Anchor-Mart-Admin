/**
 * useCouponActions Hook
 * Handles CRUD operations for coupons using RTK Query mutations
 */

import { useCallback, useState } from "react";
import {
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useDuplicateCouponMutation,
  useToggleCouponPublicMutation,
  useUpdateCouponMutation,
} from "../api/couponsApi";
import type { Coupon } from "../types/coupon";

interface UseCouponActionsReturn {
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  deleteAction: (id: string) => Promise<void>;
  togglePublicAction: (id: string, isPublic: boolean) => Promise<Coupon>;
  duplicateAction: (id: string) => Promise<Coupon>;
  createAction: (payload: FormData) => Promise<Coupon>;
  updateAction: (id: string, payload: FormData) => Promise<Coupon>;
  clearError: () => void;
}

/**
 * Extract error message from RTK Query error response
 */
function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }

  // Handle RTK Query FetchBaseQueryError
  if (typeof err === "object" && err !== null) {
    const error = err as Record<string, unknown>;

    // Check for API error response with detail message
    if (error.data && typeof error.data === "object") {
      const data = error.data as Record<string, unknown>;
      if (data.detail && typeof data.detail === "string") {
        return data.detail;
      }
      if (data.message && typeof data.message === "string") {
        return data.message;
      }
      if (data.error && typeof data.error === "string") {
        return data.error;
      }
    }

    // Check for HTTP status
    if (error.status && typeof error.status === "number") {
      const status = error.status as number;
      const statusMessages: Record<number, string> = {
        400: "Invalid request. Please check the data and try again.",
        401: "Unauthorized. Please log in again.",
        403: "You don't have permission to perform this action.",
        404: "Coupon not found.",
        500: "Server error. Please try again later.",
        503: "Service unavailable. Please try again later.",
      };
      return statusMessages[status] || `Error (${status}): Failed to complete the request.`;
    }

    if (error.originalStatus && typeof error.originalStatus === "number") {
      if (error.originalStatus >= 500) {
        return "Server error. Please try again later.";
      }

      return `Error (${error.originalStatus}): Failed to complete the request.`;
    }

    if (error.status === "PARSING_ERROR") {
      return "Server returned an invalid error response. Please try again later.";
    }
  }

  return "An unexpected error occurred. Please try again.";
}

/**
 * Hook for coupon CRUD actions using RTK Query mutations
 */
export function useCouponActions(): UseCouponActionsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deleteCouponMutation] = useDeleteCouponMutation();
  const [toggleCouponPublicMutation] = useToggleCouponPublicMutation();
  const [duplicateCouponMutation] = useDuplicateCouponMutation();
  const [createCouponMutation] = useCreateCouponMutation();
  const [updateCouponMutation] = useUpdateCouponMutation();

  const clearError = useCallback(() => {
    setError(null);
    setIsError(false);
  }, []);

  const deleteAction = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        setIsError(false);
        setError(null);
        await deleteCouponMutation(id).unwrap();
      } catch (err) {
        const errorMessage = extractErrorMessage(err);
        setIsError(true);
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [deleteCouponMutation],
  );

  const togglePublicAction = useCallback(
    async (id: string, isPublic: boolean) => {
      try {
        setIsLoading(true);
        setIsError(false);
        setError(null);
        const result = await toggleCouponPublicMutation({ id, isPublic }).unwrap();
        return result;
      } catch (err) {
        const errorMessage = extractErrorMessage(err);
        setIsError(true);
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [toggleCouponPublicMutation],
  );

  const duplicateAction = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        setIsError(false);
        setError(null);
        const result = await duplicateCouponMutation(id).unwrap();
        return result;
      } catch (err) {
        const errorMessage = extractErrorMessage(err);
        setIsError(true);
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [duplicateCouponMutation],
  );

  const createAction = useCallback(
    async (payload: FormData) => {
      try {
        setIsLoading(true);
        setIsError(false);
        setError(null);
        const result = await createCouponMutation(payload).unwrap();
        return result;
      } catch (err) {
        const errorMessage = extractErrorMessage(err);
        setIsError(true);
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [createCouponMutation],
  );

  const updateAction = useCallback(
    async (id: string, payload: FormData) => {
      try {
        setIsLoading(true);
        setIsError(false);
        setError(null);
        const result = await updateCouponMutation({ id, payload }).unwrap();
        return result;
      } catch (err) {
        const errorMessage = extractErrorMessage(err);
        setIsError(true);
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [updateCouponMutation],
  );

  return {
    isLoading,
    isError,
    error,
    deleteAction,
    togglePublicAction,
    duplicateAction,
    createAction,
    updateAction,
    clearError,
  };
}

/**
 * Hook for copy to clipboard
 */
export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  return { isCopied, copyToClipboard };
}

/**
 * Hook for confirmation dialog
 */
export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmData, setConfirmData] = useState<{
    title: string;
    description: string;
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    isDangerous?: boolean;
  } | null>(null);

  const openConfirmation = useCallback(
    (data: {
      title: string;
      description: string;
      onConfirm: () => void | Promise<void>;
      onCancel?: () => void;
      confirmText?: string;
      cancelText?: string;
      isDangerous?: boolean;
    }) => {
      setConfirmData(data);
      setIsOpen(true);
    },
    [],
  );

  const closeConfirmation = useCallback(() => {
    setIsOpen(false);
    setIsConfirming(false);
    setConfirmData(null);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!confirmData?.onConfirm || isConfirming) {
      return;
    }

    try {
      setIsConfirming(true);
      await confirmData.onConfirm();
      closeConfirmation();
    } catch (err) {
      console.error("Confirmation action failed:", err);
      setIsConfirming(false);
    }
  }, [confirmData, closeConfirmation, isConfirming]);

  const handleCancel = useCallback(() => {
    if (isConfirming) {
      return;
    }

    if (confirmData?.onCancel) {
      confirmData.onCancel();
    }
    closeConfirmation();
  }, [confirmData, closeConfirmation, isConfirming]);

  return {
    isOpen,
    isConfirming,
    confirmData,
    openConfirmation,
    closeConfirmation,
    handleConfirm,
    handleCancel,
  };
}
