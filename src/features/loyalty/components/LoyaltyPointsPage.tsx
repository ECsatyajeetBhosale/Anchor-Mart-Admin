import { Download, RefreshCw } from "lucide-react";
import { useState } from "react";
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
import { useToast } from "@/components/ui/toast";
import { APP_ROUTES } from "@/lib/constants";
import { useLazyGetLoyaltyPointsQuery } from "../api/loyaltyApi";
import { useLoyalty, useLoyaltyFilters } from "../hooks/useLoyalty";
import type { SailorLoyalty } from "../types/loyalty";
import { LoyaltyDrawer } from "./LoyaltyDrawer";
import { LoyaltyFilters } from "./LoyaltyFilters";
import { LoyaltyPagination } from "./LoyaltyPagination";
import { LoyaltyStats } from "./LoyaltyStats";
import { LoyaltyTable } from "./LoyaltyTable";

const exportHeaders = [
  "User ID",
  "First Name",
  "Last Name",
  "Email",
  "Referral Points",
  "Loyalty Points",
  "Total Points",
];

function escapeCsvCell(value: string | number) {
  const stringValue = String(value ?? "");
  return `"${stringValue.replace(/"/g, '""')}"`;
}

function downloadLoyaltyCsv(sailors: SailorLoyalty[]) {
  const rows = sailors.map((sailor) => [
    sailor.user_id,
    sailor.first_name || "",
    sailor.last_name || "",
    sailor.user_email,
    sailor.referral_points,
    sailor.loyalty_points,
    sailor.total_points,
  ]);

  const csvContent = [
    exportHeaders.map(escapeCsvCell).join(","),
    ...rows.map((row) => row.map(escapeCsvCell).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const formattedDate = new Date().toISOString().split("T")[0];

  link.setAttribute("href", url);
  link.setAttribute("download", `loyalty-points-export-${formattedDate}.xlsx`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function LoyaltyPointsPage() {
  const { showToast } = useToast();
  const [fetchLoyaltyPoints, { isFetching: isExporting }] = useLazyGetLoyaltyPointsQuery();
  const [selectedSailor, setSelectedSailor] = useState<SailorLoyalty | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Hook states
  const { sailors, total, page, limit, pages, isLoading, isFetching, isError, error, refetch } =
    useLoyalty();

  const {
    search,
    ordering,
    setPage,
    setLimit,
    setSearch,
    setOrdering,
    resetFilters,
    hasActiveFilters,
  } = useLoyaltyFilters();

  const handleViewDetails = (sailor: SailorLoyalty) => {
    setSelectedSailor(sailor);
    setIsDrawerOpen(true);
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      showToast("Data refreshed successfully", "success", 2000);
    } catch {
      showToast("Failed to refresh data", "error", 2000);
    }
  };

  const handleExport = async () => {
    if (total === 0 && sailors.length === 0) {
      showToast("No data to export", "warning", 2000);
      return;
    }

    try {
      const exportResult = await fetchLoyaltyPoints({
        page: 1,
        limit: Math.max(total, limit),
        search: search || undefined,
        ordering: ordering || undefined,
      }).unwrap();

      const exportRows = exportResult.data.length > 0 ? exportResult.data : sailors;
      downloadLoyaltyCsv(exportRows);
      showToast("Export download started", "success", 2000);
    } catch {
      showToast("Failed to export loyalty points", "error", 3000);
    }
  };

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
                <BreadcrumbPage>Loyalty Points</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Top-Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="text-xs"
            disabled={isExporting}
          >
            <Download className={`w-3 h-3 ${isExporting ? "animate-pulse" : ""}`} />
            Export to Excel
          </Button>

          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="text-xs"
            disabled={isLoading || isFetching}
          >
            <RefreshCw className={`w-3 h-3 ${isFetching || isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <LoyaltyStats sailors={sailors} totalSailors={total} isLoading={isLoading} />

      {/* Filters & Content Section */}
      <div className="flex-1 flex flex-col min-h-0 px-4">
        <div className="rounded-t-lg border border-border bg-card">
          <LoyaltyFilters
            search={search}
            onSearchChange={setSearch}
            ordering={ordering}
            onOrderingChange={setOrdering}
            limit={limit}
            onLimitChange={setLimit}
            onReset={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Table Wrapper */}
        <div className="flex-1 min-h-[300px]">
          <LoyaltyTable
            sailors={sailors}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={refetch}
            onViewDetails={handleViewDetails}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={resetFilters}
          />
        </div>

        {/* Pagination Section */}
        {!isLoading && !isError && sailors.length > 0 && (
          <div className="mt-2">
            <LoyaltyPagination
              page={page}
              pages={pages}
              total={total}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          </div>
        )}
      </div>

      {/* Details Drawer */}
      <LoyaltyDrawer
        sailor={selectedSailor}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedSailor(null);
        }}
      />
    </div>
  );
}
export default LoyaltyPointsPage;
