import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
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
    <div className="flex flex-col gap-3 rounded-b-lg border border-t-0 border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-xs text-muted-foreground">
        Showing {startItem} to {endItem} of {total} categories
      </div>

      <div className="flex items-center gap-2">
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="h-8 rounded-lg border border-input bg-background px-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
        >
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="text-xs"
          >
            <ChevronLeftIcon className="size-3.5" />
          </Button>

          <div className="flex items-center gap-1 px-2">
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
                  type="button"
                  variant={pageNum === page ? "default" : "outline"}
                  size="icon-sm"
                  onClick={() => onPageChange(pageNum)}
                  className="text-xs"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === pages}
            className="text-xs"
          >
            <ChevronRightIcon className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
