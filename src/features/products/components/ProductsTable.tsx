import { EditIcon, EyeIcon, StarIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AppTooltip } from "@/components/ui/app-tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Column, DataTable } from "@/components/ui/data-table";
import { toast } from "@/lib/toast";
import { useDeleteProductMutation } from "../api/productApi";
import type { Product } from "../types/product";

interface ProductsTableProps {
  products: Product[];
  isLoading?: boolean;
  isError?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onViewDetails: (product: Product) => void;
  onEdit: (product: Product) => void;
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
  page?: number;
  pages?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function ProductsTable({
  products,
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
}: ProductsTableProps) {
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id).unwrap();
      toast.success("Product deleted successfully");
    } catch (err) {
      console.error("Delete product error:", err);
      toast.error("Failed to delete product");
    } finally {
      setProductToDelete(null);
    }
  };

  const columns: Column<Product>[] = [
    {
      id: "product",
      header: "Product",
      cell: (product) => {
        const imageUrl = product.images && product.images.length > 0 ? product.images[0].image : "";
        return (
          <div className="flex items-center gap-3">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-[50px] h-[50px] rounded object-cover shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect fill='%23e5e7eb' width='50' height='50'/%3E%3C/svg%3E";
              }}
            />
            <span className="font-medium text-foreground">{product.name}</span>
          </div>
        );
      },
    },
    {
      id: "category",
      header: "Category",
      cell: (product) => <span className="text-muted-foreground">{product.category_name}</span>,
    },
    {
      id: "price",
      header: "Price",
      cell: (product) => <span className="text-foreground">₹ {product.base_price}</span>,
    },
    {
      id: "rating",
      header: "Rating",
      cell: (product) => {
        const rating = Number(product.average_rating) || 0.0;
        return (
          <span className="flex items-center gap-1 text-muted-foreground">
            <StarIcon className="size-3.5 fill-yellow-400 text-yellow-400" />
            {rating.toFixed(1)}
          </span>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      cell: (product) => (
        <Badge
          variant={product.is_active ? "default" : "destructive"}
          className={
            product.is_active
              ? ""
              : "bg-red-100 text-red-600 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
          }
        >
          {product.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (product) => (
        <div className="flex items-center justify-end gap-1">
          <AppTooltip content="View details">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onViewDetails(product)}
            >
              <EyeIcon className="size-3.5" />
            </Button>
          </AppTooltip>
          <AppTooltip content="Edit product">
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => onEdit(product)}>
              <EditIcon className="size-3.5" />
            </Button>
          </AppTooltip>
          <AppTooltip content="Delete product">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setProductToDelete(product)}
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
    <>
      <DataTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={onRetry}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={onResetFilters}
        emptyMessage="No products found"
        filteredEmptyMessage="No products match your filters"
        page={page}
        pages={pages}
        total={total}
        limit={limit}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        showPagination={true}
        unrounded={true}
      />

      <AlertDialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                &quot;{productToDelete?.name}&quot;
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
