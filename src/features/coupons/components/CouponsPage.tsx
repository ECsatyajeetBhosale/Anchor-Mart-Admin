/**
 * CouponsPage Component
 * Main page for coupon management with responsive, compact layout
 */

import { useCallback, useState } from "react";
import { useConfirmation, useCouponActions } from "../hooks/useCouponActions";
import { useCouponFilters } from "../hooks/useCouponFilters";
import { useCoupons, usePagination } from "../hooks/useCoupons";
import type { Coupon } from "../types/coupon";
import { CouponsFilters } from "./CouponsFilters";
import { CouponsHeader } from "./CouponsHeader";
import { CouponsPagination } from "./CouponsPagination";
import { CouponsTable } from "./CouponsTable";
import { EmptyState } from "./EmptyState";

export function CouponsPage() {
  const [_selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [_modalMode, setModalMode] = useState<"view" | "edit" | "create">("view");
  const [_isModalOpen, setIsModalOpen] = useState(false);

  // Hooks
  const {
    filters,
    updateSearch,
    updateStatus,
    updateType,
    updateVisibility,
    updateUsage,
    resetFilters,
    hasActiveFilters,
  } = useCouponFilters();
  const { page, limit, goToPage, setPageSize } = usePagination(1, 20);

  const { coupons, total, pages, isLoading, isError, error, refetch } = useCoupons({
    page,
    limit,
    search: filters.search,
    status: filters.status === "all" ? undefined : filters.status,
    type: filters.type === "all" ? undefined : filters.type,
  });
  const { deleteAction } = useCouponActions();
  const {
    isOpen: isConfirmOpen,
    confirmData,
    openConfirmation,
    handleConfirm,
    handleCancel,
  } = useConfirmation();

  // Handlers
  const handleCreateClick = useCallback(() => {
    setSelectedCoupon(null);
    setModalMode("create");
    setIsModalOpen(true);
  }, []);

  const handleViewClick = useCallback((coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setModalMode("view");
    setIsModalOpen(true);
  }, []);

  const handleEditClick = useCallback((coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setModalMode("edit");
    setIsModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback(
    (coupon: Coupon) => {
      openConfirmation({
        title: "Delete Coupon",
        description: `Are you sure you want to delete "${coupon.code}"? This cannot be undone.`,
        onConfirm: async () => {
          try {
            await deleteAction(coupon.id);
            await refetch();
          } catch (err) {
            console.error("Failed to delete coupon:", err);
          }
        },
        confirmText: "Delete",
        cancelText: "Cancel",
        isDangerous: true,
      });
    },
    [deleteAction, refetch, openConfirmation],
  );

  const handleExportClick = useCallback(() => {
    // TODO: Implement export functionality
    console.log("Export clicked");
  }, []);

  // Render
  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Header */}
      <CouponsHeader onCreateClick={handleCreateClick} onExportClick={handleExportClick} />

      {/* Filters */}
      <CouponsFilters
        filters={filters}
        onSearchChange={updateSearch}
        onStatusChange={updateStatus}
        onTypeChange={updateType}
        onVisibilityChange={updateVisibility}
        onUsageChange={updateUsage}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Content */}
      <div className="flex-1 overflow-auto w-full">
        {isError && (
          <div className="m-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md">
            <p className="text-xs text-destructive">
              {error || "Failed to load coupons. Please try again."}
            </p>
          </div>
        )}

        {coupons.length === 0 && !isLoading ? (
          <EmptyState isSearchEmpty={hasActiveFilters} onCreateClick={handleCreateClick} />
        ) : (
          <CouponsTable
            coupons={coupons}
            isLoading={isLoading}
            onView={handleViewClick}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}
      </div>

      {/* Pagination */}
      {coupons.length > 0 && (
        <CouponsPagination
          page={page}
          pages={pages}
          total={total}
          limit={limit}
          onPageChange={goToPage}
          onLimitChange={setPageSize}
        />
      )}

      {/* Confirmation Dialog */}
      {isConfirmOpen && confirmData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-lg max-w-sm w-full border border-border">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-foreground mb-1">{confirmData.title}</h2>
              <p className="text-xs text-muted-foreground mb-4">{confirmData.description}</p>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-xs font-medium bg-muted hover:bg-muted/80 text-foreground rounded-md transition-colors"
                >
                  {confirmData.cancelText || "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    confirmData.isDangerous
                      ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      : "bg-primary hover:bg-primary/90 text-primary-foreground"
                  }`}
                >
                  {confirmData.confirmText || "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TODO: Add Modal for Create/Edit/View */}
    </div>
  );
}
