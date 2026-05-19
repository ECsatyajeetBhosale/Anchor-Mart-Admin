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
        setIsError(true);
        setError(err instanceof Error ? err.message : "Failed to delete coupon");
        throw err;
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
        setIsError(true);
        setError(err instanceof Error ? err.message : "Failed to toggle coupon");
        throw err;
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
        setIsError(true);
        setError(err instanceof Error ? err.message : "Failed to duplicate coupon");
        throw err;
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
        setIsError(true);
        setError(err instanceof Error ? err.message : "Failed to create coupon");
        throw err;
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
        setIsError(true);
        setError(err instanceof Error ? err.message : "Failed to update coupon");
        throw err;
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
    setConfirmData(null);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (confirmData?.onConfirm) {
      await confirmData.onConfirm();
    }
    closeConfirmation();
  }, [confirmData, closeConfirmation]);

  const handleCancel = useCallback(() => {
    if (confirmData?.onCancel) {
      confirmData.onCancel();
    }
    closeConfirmation();
  }, [confirmData, closeConfirmation]);

  return {
    isOpen,
    confirmData,
    openConfirmation,
    closeConfirmation,
    handleConfirm,
    handleCancel,
  };
}
