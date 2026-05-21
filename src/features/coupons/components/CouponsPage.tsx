import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/lib/constants";
import { useCouponFilters, useCoupons, usePagination } from "../hooks/useCoupons";
import type { Coupon } from "../types/coupon";
import { CouponDrawer } from "./CouponDrawer";
import { CouponFormDrawer } from "./CouponFormDrawer";
import { CouponsFilters } from "./CouponsFilters";
import { CouponsPagination } from "./CouponsPagination";
import { CouponsTable } from "./CouponsTable";

export function CouponsPage() {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { search, setSearch, resetFilters, hasActiveFilters } = useCouponFilters();
  const { page, limit, goToPage, setPageSize } = usePagination(1, 10);

  const { coupons, total, pages, isLoading, isError, error, refetch } = useCoupons({
    page,
    limit,
    search: search || undefined,
  });

  const handleViewDetails = useCallback((coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsDrawerOpen(true);
  }, []);

  const handleCreate = useCallback(() => {
    setEditingCoupon(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((coupon: Coupon) => {
    setEditingCoupon(coupon);
    setIsFormOpen(true);
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-background space-y-4">
      {/* Title Header Section */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 py-3">
        <div className="min-w-0 flex-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={APP_ROUTES.DASHBOARD}>Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Coupons</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Button type="button" size="sm" className="text-xs" onClick={handleCreate}>
          <Plus className="size-3" />
          New Coupon
        </Button>
      </div>

      {/* Filters & Content Section */}
      <div className="flex-1 flex flex-col min-h-0 px-4">
        <div className="rounded-t-lg border border-border bg-card">
          <CouponsFilters
            search={search}
            onSearchChange={setSearch}
            hasActiveFilters={hasActiveFilters}
            onReset={resetFilters}
          />
        </div>

        {/* Table Wrapper */}
        <div className="flex-1 min-h-[300px]">
          <CouponsTable
            coupons={coupons}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={refetch}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={resetFilters}
          />
        </div>

        {/* Pagination Section */}
        {!isLoading && !isError && coupons.length > 0 && (
          <div className="mt-2">
            <CouponsPagination
              page={page}
              pages={pages}
              total={total}
              limit={limit}
              onPageChange={goToPage}
              onLimitChange={setPageSize}
            />
          </div>
        )}
      </div>

      {/* Details Drawer */}
      <CouponDrawer
        coupon={selectedCoupon}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedCoupon(null);
        }}
      />

      <CouponFormDrawer
        coupon={editingCoupon}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCoupon(null);
        }}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
}

export default CouponsPage;
