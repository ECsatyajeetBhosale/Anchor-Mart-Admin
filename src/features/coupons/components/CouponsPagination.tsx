import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CouponsPaginationProps {
  page: number;
  pages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function CouponsPagination({
  page,
  pages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: CouponsPaginationProps) {
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="px-4 py-3 border-t border-border bg-card flex items-center justify-between">
      <div className="text-xs text-muted-foreground">
        Showing {startItem} to {endItem} of {total} coupons
      </div>

      <div className="flex items-center gap-2">
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="h-8 px-2 border border-input rounded-md text-xs bg-background"
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>

        <div className="flex items-center gap-1">
          <Button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            variant="outline"
            size="icon-xs"
            className="h-8 w-8"
          >
            <ChevronLeft className="size-3" />
          </Button>

          <span className="text-xs text-muted-foreground px-2">
            Page {page} of {pages}
          </span>

          <Button
            onClick={() => onPageChange(page + 1)}
            disabled={page === pages}
            variant="outline"
            size="icon-xs"
            className="h-8 w-8"
          >
            <ChevronRight className="size-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
