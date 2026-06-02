import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../@/components/ui/table";
import { Pagination } from "./pagination";

export interface Column<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  sortId?: string; // Unique identifier for skeleton rendering
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  isError?: boolean;
  error?: string | null;
  onRetry?: () => void;
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
  emptyMessage?: string;
  filteredEmptyMessage?: string;
  page?: number;
  pages?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  showPagination?: boolean;
  skeletonRowCount?: number;
  unrounded?: boolean; // Remove rounded corners from table container
}

export function DataTable<T extends { id?: string }>({
  columns,
  data,
  isLoading = false,
  isError = false,
  error,
  onRetry,
  hasActiveFilters = false,
  onResetFilters,
  emptyMessage = "No records found",
  filteredEmptyMessage = "No records match your filters",
  page = 1,
  pages = 1,
  total = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
  showPagination = true,
  skeletonRowCount = 5,
  unrounded = false,
}: DataTableProps<T>) {
  // Loading state
  if (isLoading) {
    return (
      <div
        className={`border border-border overflow-hidden flex flex-col ${unrounded ? "" : "rounded-lg"}`}
      >
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className={column.headerClassName}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton rows are transient and order doesn't change
              <TableRow key={`skeleton-${rowIndex}`}>
                {columns.map((column) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton rows are transient and order doesn't change
                  <TableCell key={`${column.id}-row-${rowIndex}`}>
                    <div className="h-3 bg-muted rounded animate-pulse" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className={`border border-border bg-card p-8 ${unrounded ? "" : "rounded-lg"}`}>
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <p className="text-sm text-destructive mb-4">{error || "Failed to load data"}</p>
          {onRetry && (
            <Button type="button" onClick={onRetry} size="sm" className="text-xs">
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className={`border border-border bg-card p-8 ${unrounded ? "" : "rounded-lg"}`}>
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <p className="text-sm text-muted-foreground mb-4">
            {hasActiveFilters ? filteredEmptyMessage : emptyMessage}
          </p>
          {hasActiveFilters && onResetFilters && (
            <Button type="button" onClick={onResetFilters} size="sm" className="text-xs">
              Reset Filters
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Data state
  return (
    <div
      className={`border border-border overflow-hidden flex flex-col ${unrounded ? "" : "rounded-lg"}`}
    >
      <div className="overflow-x-auto flex-1">
        <Table>
          <TableHeader className="bg-muted sticky top-0">
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className={column.headerClassName}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                  <TableCell key={`${column.id}-${row.id}`} className={column.className}>
                    {column.cell
                      ? column.cell(row)
                      : String(column.accessorKey ? row[column.accessorKey] : "")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && pages > 1 && onPageChange && (
        <Pagination
          page={page}
          pages={pages}
          total={total}
          limit={limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  );
}
