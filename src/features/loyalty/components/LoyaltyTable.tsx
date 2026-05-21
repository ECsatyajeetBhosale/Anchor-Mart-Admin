import { AlertCircle, RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { SailorLoyalty } from "../types/loyalty";
import { LoyaltyRow } from "./LoyaltyRow";

interface LoyaltyTableProps {
  sailors: SailorLoyalty[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  onRetry: () => void;
  onViewDetails: (sailor: SailorLoyalty) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

const skeletonRows = [
  "loyalty-skeleton-1",
  "loyalty-skeleton-2",
  "loyalty-skeleton-3",
  "loyalty-skeleton-4",
  "loyalty-skeleton-5",
];

export function LoyaltyTable({
  sailors,
  isLoading,
  isError,
  error,
  onRetry,
  onViewDetails,
  hasActiveFilters,
  onResetFilters,
}: LoyaltyTableProps) {
  // Renders skeleton rows while loading
  if (isLoading) {
    return (
      <div className="overflow-x-auto w-full border border-t-0 border-border">
        <table className="w-full text-xs border-collapse">
          <thead className="bg-muted border-b border-border sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-muted-foreground w-[200px]">
                Sailor
              </th>
              <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Email</th>
              <th className="px-3 py-2 text-left font-semibold text-muted-foreground w-[120px]">
                Referral Points
              </th>
              <th className="px-3 py-2 text-left font-semibold text-muted-foreground w-[120px]">
                Loyalty Points
              </th>
              <th className="px-3 py-2 text-left font-semibold text-muted-foreground w-[100px]">
                Total Points
              </th>
              <th className="px-3 py-2 text-right font-semibold text-muted-foreground w-[100px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {skeletonRows.map((rowKey) => (
              <tr key={rowKey} className="border-b border-border">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-8 rounded-full shrink-0 animate-pulse" />
                    <Skeleton className="h-3 w-28 rounded animate-pulse" />
                  </div>
                </td>
                <td className="px-3 py-2">
                  <Skeleton className="h-3 w-40 rounded animate-pulse" />
                </td>
                <td className="px-3 py-2">
                  <Skeleton className="h-5 w-16 rounded-full animate-pulse" />
                </td>
                <td className="px-3 py-2">
                  <Skeleton className="h-5 w-16 rounded-full animate-pulse" />
                </td>
                <td className="px-3 py-2">
                  <Skeleton className="h-4 w-10 rounded animate-pulse" />
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Skeleton className="size-7 rounded animate-pulse" />
                    <Skeleton className="size-7 rounded animate-pulse" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Renders error state if query fails
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border border-t-0 border-border bg-card">
        <div className="rounded-full bg-destructive/10 p-3 mb-3 text-destructive">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-foreground mb-1">
          Failed to load Loyalty Points
        </h3>
        <p className="text-xs text-muted-foreground text-center max-w-xs mb-4">
          {error || "An unexpected error occurred while fetching sailor point records."}
        </p>
        <Button onClick={onRetry} variant="outline" size="sm" className="text-xs">
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          Try Again
        </Button>
      </div>
    );
  }

  // Renders empty state if data is empty
  if (sailors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border border-t-0 border-border bg-card">
        <div className="rounded-lg bg-muted p-2.5 mb-3 text-muted-foreground">
          <Users className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-foreground mb-1">No sailors found</h3>
        <p className="text-xs text-muted-foreground text-center max-w-sm mb-4">
          {hasActiveFilters
            ? "No sailors match your search term or filter parameters. Try resetting your search."
            : "No sailor loyalty point accounts found in the database."}
        </p>
        {hasActiveFilters && (
          <Button onClick={onResetFilters} variant="outline" size="xs" className="text-xs">
            Reset filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full border border-t-0 border-border bg-card rounded-b-lg">
      <table className="w-full text-xs border-collapse">
        <thead className="bg-muted/80 border-b border-border sticky top-0 z-10 backdrop-blur-xs">
          <tr>
            <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Sailor</th>
            <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Email</th>
            <th className="px-3 py-2 text-left font-semibold text-muted-foreground w-[120px]">
              Referral Points
            </th>
            <th className="px-3 py-2 text-left font-semibold text-muted-foreground w-[120px]">
              Loyalty Points
            </th>
            <th className="px-3 py-2 text-left font-semibold text-muted-foreground w-[100px]">
              Total Points
            </th>
            <th className="px-3 py-2 text-right font-semibold text-muted-foreground w-[100px]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sailors.map((sailor) => (
            <LoyaltyRow key={sailor.id} sailor={sailor} onViewDetails={onViewDetails} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
