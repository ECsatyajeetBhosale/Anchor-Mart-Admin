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
  // Always calculate pages accurately
  const calculatedPages = total > 0 ? Math.ceil(total / limit) : 1;
  const totalPages = pages > 0 && pages >= calculatedPages ? pages : calculatedPages;

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

  return (
    <div className="flex items-center justify-between px-4 py-3 border border-t-0 border-border bg-muted/20 text-xs shrink-0 rounded-b-lg">
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">
          {total === 0 ? (
            <span>No records</span>
          ) : (
            <>
              Showing <span className="font-medium text-foreground">{startItem}</span> to{" "}
              <span className="font-medium text-foreground">{endItem}</span> of{" "}
              <span className="font-medium text-foreground">{total}</span> coupons
            </>
          )}
        </div>

        {onLimitChange && (
          <select
            value={limit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            className="px-2 py-1 text-xs border border-input rounded-md hover:border-input focus:outline-none focus:ring-1 focus:ring-ring bg-background text-foreground"
            aria-label="Rows per page"
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
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            variant={pageNum === currentPage ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0"
          >
            {pageNum}
          </Button>
        ))}

        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
