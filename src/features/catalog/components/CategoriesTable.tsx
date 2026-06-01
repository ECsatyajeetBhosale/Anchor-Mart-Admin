import { Button } from "@/components/ui/button";
import type { Category } from "../types/category";
import { CategoryRow } from "./CategoryRow";

const skeletonRows = [
  "category-skeleton-1",
  "category-skeleton-2",
  "category-skeleton-3",
  "category-skeleton-4",
  "category-skeleton-5",
];

interface CategoriesTableProps {
  categories: Category[];
  isLoading?: boolean;
  isError?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onViewDetails: (category: Category) => void;
  onEdit: (category: Category) => void;
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
}

export function CategoriesTable({
  categories,
  isLoading = false,
  isError = false,
  error,
  onRetry,
  onViewDetails,
  onEdit,
  hasActiveFilters = false,
  onResetFilters,
}: CategoriesTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-muted border-b border-border sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Name</th>
              <th className="px-3 py-2 text-left font-semibold text-muted-foreground">
                Description
              </th>
              <th className="px-3 py-2 text-left font-semibold text-muted-foreground">
                Created At
              </th>
              <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Status</th>
              <th className="px-3 py-2 text-right font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skeletonRows.map((rowKey) => (
              <tr key={rowKey} className="border-b border-border">
                <td colSpan={5} className="px-3 py-2">
                  <div className="h-3 bg-muted rounded animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <p className="text-sm text-destructive mb-4">{error || "Failed to load categories"}</p>
        {onRetry && (
          <Button type="button" onClick={onRetry} size="sm" className="text-xs">
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <p className="text-sm text-muted-foreground mb-4">
          {hasActiveFilters ? "No categories match your filters" : "No categories found"}
        </p>
        {hasActiveFilters && onResetFilters && (
          <Button type="button" onClick={onResetFilters} size="sm" className="text-xs">
            Reset Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-xs border-collapse">
        <thead className="bg-muted border-b border-border sticky top-0">
          <tr>
            <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Name</th>
            <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Description</th>
            <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Created At</th>
            <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Status</th>
            <th className="px-3 py-2 text-right font-semibold text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              onEdit={onEdit}
              onViewDetails={onViewDetails}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
