/**
 * EmptyState Component
 * Displays when no coupons are found
 */

import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onCreateClick?: () => void;
  isSearchEmpty?: boolean;
}

export function EmptyState({
  title = "No coupons found",
  description = "Get started by creating your first coupon",
  onCreateClick,
  isSearchEmpty = false,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="rounded-lg bg-muted p-2.5 mb-3">
        <Package className="w-6 h-6 text-muted-foreground" />
      </div>

      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>

      <p className="text-xs text-muted-foreground text-center max-w-xs mb-4">
        {isSearchEmpty
          ? "No coupons match your search criteria. Try adjusting your filters."
          : description}
      </p>

      {onCreateClick && !isSearchEmpty && (
        <Button onClick={onCreateClick} variant="default" size="sm" className="text-xs">
          Create First Coupon
        </Button>
      )}

      {isSearchEmpty && (
        <Button onClick={onCreateClick} variant="link" size="sm" className="text-xs">
          Clear filters
        </Button>
      )}
    </div>
  );
}
