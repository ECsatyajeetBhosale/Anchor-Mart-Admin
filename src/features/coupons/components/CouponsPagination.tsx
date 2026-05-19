/**
 * CouponsPagination Component
 * Compact pagination controls with solid page calculation logic
 */

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CouponsPaginationProps {
  page: number;
  pages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function CouponsPagination({
  page,
  pages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: CouponsPaginationProps) {
  // Always calculate pages from total and limit for accuracy
  // This handles cases where API returns incorrect pages value
  const calculatedPages = total > 0 ? Math.ceil(total / limit) : 1;
  // If pages is 0, 1, or clearly wrong (less than calculated), use calculated
  const totalPages = pages > 0 && pages >= calculatedPages ? pages : calculatedPages;

  console.log(
    "[CouponsPagination] DEBUG: page=",
    page,
    "pages(API)=",
    pages,
    "calculatedPages=",
    calculatedPages,
    "totalPages(used)=",
    totalPages,
    "total=",
    total,
    "limit=",
    limit,
  );

  // Ensure current page is within valid range
  const currentPage = Math.min(Math.max(1, page), totalPages);

  // Calculate items shown on current page
  const startItem = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  // Generate page numbers to display (show up to 5 consecutive pages)
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  const pageNumbers = getPageNumbers();

  // Determine if navigation buttons should be disabled
  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/30 text-xs shrink-0">
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">
          {total === 0 ? (
            <span>No records</span>
          ) : (
            <>
              Showing <span className="font-medium text-foreground">{startItem}</span> to{" "}
              <span className="font-medium text-foreground">{endItem}</span> of{" "}
              <span className="font-medium text-foreground">{total}</span>
            </>
          )}
        </div>

        {onLimitChange && (
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="px-2 py-1 text-xs border border-input rounded-md hover:border-input focus:outline-none focus:ring-1 focus:ring-ring bg-background text-foreground"
          >
            <option value={10}>10/page</option>
            <option value={20}>20/page</option>
            <option value={50}>50/page</option>
            <option value={100}>100/page</option>
          </select>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={isPrevDisabled}
          variant="outline"
          size="icon-xs"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-3 h-3" />
        </Button>

        <div className="flex items-center gap-0.5">
          {pageNumbers.map((pageNum) => (
            <Button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="xs"
              className="h-6 w-6 px-0 text-xs"
              aria-label={`Go to page ${pageNum}`}
              aria-current={currentPage === pageNum ? "page" : undefined}
            >
              {pageNum}
            </Button>
          ))}
        </div>

        <Button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={isNextDisabled}
          variant="outline"
          size="icon-xs"
          aria-label="Next page"
        >
          <ChevronRight className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
