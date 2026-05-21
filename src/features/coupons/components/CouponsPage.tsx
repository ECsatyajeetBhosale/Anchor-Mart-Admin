/**
 * CouponsPage Component
 * Main page for coupon management with responsive, compact layout
 */

import { AlertTriangle } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useConfirmation, useCouponActions } from "../hooks/useCouponActions";
import { useCouponFilters } from "../hooks/useCouponFilters";
import { useCoupons, usePagination } from "../hooks/useCoupons";
import type { Coupon } from "../types/coupon";
import { CouponsFilters } from "./CouponsFilters";
import { CouponsHeader } from "./CouponsHeader";
import { CouponsPagination } from "./CouponsPagination";
import { CouponsTable } from "./CouponsTable";
import { CreateCouponModal } from "./CreateCouponModal";
import { EmptyState } from "./EmptyState";
import { ViewCouponDrawer } from "./ViewCouponDrawer";

export function CouponsPage() {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);

  // Hooks
  const { showToast } = useToast();
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
  const { page, limit, goToPage, setPageSize } = usePagination(1, 10);

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
    isConfirming,
    confirmData,
    openConfirmation,
    handleConfirm,
    handleCancel,
  } = useConfirmation();

  // Handlers
  const handleCreateClick = useCallback(() => {
    setSelectedCoupon(null);
    setIsCreateModalOpen(true);
  }, []);

  const handleViewClick = useCallback((coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsViewDrawerOpen(true);
  }, []);

  const handleEditClick = useCallback((coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsEditModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback(
    (coupon: Coupon) => {
      openConfirmation({
        title: "Delete Coupon",
        description: `Are you sure you want to delete "${coupon.code}"? This action cannot be undone.`,
        onConfirm: async () => {
          try {
            await deleteAction(coupon.id);

            showToast(`Coupon "${coupon.code}" deleted successfully`, "success", 3000);
            await refetch();
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to delete coupon";
            showToast(errorMessage, "error", 4000);
            console.error("Failed to delete coupon:", err);
            throw err;
          }
        },
        confirmText: "Delete",
        cancelText: "Cancel",
        isDangerous: true,
      });
    },
    [deleteAction, refetch, openConfirmation, showToast],
  );

  const handleExportClick = useCallback(() => {
    // TODO: Implement export functionality
    console.log("Export clicked");
  }, []);

  // Render
  return (
    <>
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
        <div className="flex-1 overflow-auto w-full scrollbar-hide">
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
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            aria-modal="true"
            role="dialog"
            aria-labelledby="delete-coupon-title"
            aria-describedby="delete-coupon-description"
          >
            <div className="w-full max-w-sm rounded-lg border border-border bg-card shadow-xl">
              <div className="p-5">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <AlertTriangle className="size-4" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 id="delete-coupon-title" className="text-sm font-semibold text-foreground">
                      {confirmData.title}
                    </h2>
                    <p
                      id="delete-coupon-description"
                      className="mt-1 text-xs leading-5 text-muted-foreground"
                    >
                      {confirmData.description}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                    disabled={isConfirming}
                  >
                    {confirmData.cancelText || "Cancel"}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleConfirm}
                    variant={confirmData.isDangerous ? "destructive" : "default"}
                    size="sm"
                    isLoading={isConfirming}
                    disabled={isConfirming}
                  >
                    {isConfirming ? "Deleting..." : confirmData.confirmText || "Confirm"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* View Coupon Drawer and Modals outside main layout */}
      <ViewCouponDrawer
        coupon={selectedCoupon}
        isOpen={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
      />
      <CreateCouponModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          refetch();
        }}
      />
      <CreateCouponModal
        isOpen={isEditModalOpen}
        mode="edit"
        coupon={selectedCoupon}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCoupon(null);
        }}
        onSuccess={() => {
          refetch();
        }}
      />
    </>
  );
}
