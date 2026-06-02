import { EditIcon, EyeIcon, TrashIcon } from "lucide-react";
import { AppTooltip } from "@/components/ui/app-tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Column, DataTable } from "@/components/ui/data-table";
import { toast } from "@/lib/toast";
import { useDeleteCategoryMutation } from "../api/categoryApi";
import type { Category } from "../types/category";

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
  page?: number;
  pages?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
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
  page = 1,
  pages = 1,
  total = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
}: CategoriesTableProps) {
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const handleDelete = async (category: Category) => {
    if (!window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return;
    }

    try {
      await deleteCategory(category.id).unwrap();
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Delete category error:", error);
      toast.error("Failed to delete category");
    }
  };

  const columns: Column<Category>[] = [
    {
      id: "name",
      header: "Name",
      cell: (category) => (
        <div className="flex items-center gap-2">
          <img
            src={category.image}
            alt={category.name}
            className="w-8 h-8 rounded object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect fill='%23e5e7eb' width='32' height='32'/%3E%3C/svg%3E";
            }}
          />
          <span className="font-medium text-foreground">{category.name}</span>
        </div>
      ),
    },
    {
      id: "description",
      header: "Description",
      cell: (category) => (
        <span className="text-muted-foreground">
          {category.description.length > 50
            ? `${category.description.substring(0, 50)}...`
            : category.description}
        </span>
      ),
    },
    {
      id: "created_at",
      header: "Created At",
      cell: (category) => <span className="text-muted-foreground">{category.created_at}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (category) => (
        <Badge
          variant={category.is_active ? "default" : "destructive"}
          className={
            category.is_active
              ? ""
              : "bg-red-100 text-red-600 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
          }
        >
          {category.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (category) => (
        <div className="flex items-center justify-end gap-1">
          <AppTooltip content="View details">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onViewDetails(category)}
            >
              <EyeIcon className="size-3.5" />
            </Button>
          </AppTooltip>
          <AppTooltip content="Edit category">
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => onEdit(category)}>
              <EditIcon className="size-3.5" />
            </Button>
          </AppTooltip>
          <AppTooltip content="Delete category">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => handleDelete(category)}
              disabled={isDeleting}
            >
              <TrashIcon className="size-3.5" />
            </Button>
          </AppTooltip>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={categories}
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={onRetry}
      hasActiveFilters={hasActiveFilters}
      onResetFilters={onResetFilters}
      emptyMessage="No categories found"
      filteredEmptyMessage="No categories match your filters"
      page={page}
      pages={pages}
      total={total}
      limit={limit}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      showPagination={true}
      unrounded={true}
    />
  );
}
