import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoriesPaginationProps {
  page: number;
  pages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function CategoriesPagination({
  page,
  pages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: CategoriesPaginationProps) {
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

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
              <span className="font-medium text-foreground">{total}</span> categories
            </>
          )}
        </div>

        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="px-2 py-1 text-xs border border-input rounded-md hover:border-input focus:outline-none focus:ring-1 focus:ring-ring bg-background text-foreground"
          aria-label="Rows per page"
        >
          <option value={10}>10/page</option>
          <option value={20}>20/page</option>
          <option value={50}>50/page</option>
          <option value={100}>100/page</option>
        </select>
      </div>

      <div className="flex items-center gap-1">
        <Button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {Array.from({ length: Math.min(5, pages) }, (_, i) => {
          let pageNum: number;
          if (pages <= 5) {
            pageNum = i + 1;
          } else if (page <= 3) {
            pageNum = i + 1;
          } else if (page >= pages - 2) {
            pageNum = pages - 4 + i;
          } else {
            pageNum = page - 2 + i;
          }

          return (
            <Button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              variant={pageNum === page ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 p-0"
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
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
