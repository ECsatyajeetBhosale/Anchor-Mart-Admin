import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/lib/constants";
import { usePagination } from "../../catalog/hooks/useCategories";
import { useProductFilters, useProducts } from "../hooks/useProducts";
import type { Product } from "../types/product";
import { ProductDrawer } from "./ProductDrawer";
import { ProductsFilters } from "./ProductsFilters";
import { ProductsTable } from "./ProductsTable";

export function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { search, setSearch, resetFilters, hasActiveFilters } = useProductFilters();
  const { page, limit, goToPage, setPageSize } = usePagination(1, 10);

  const { products, total, pages, isLoading, isError, error, refetch } = useProducts({
    page,
    limit,
    search: search || undefined,
  });

  const handleViewDetails = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  }, []);

  const handleCreate = useCallback(() => {
    // TODO: implement create product
    console.log("Create product");
  }, []);

  const handleEdit = useCallback((product: Product) => {
    // TODO: implement edit product
    console.log("Edit product", product);
  }, []);

  const handleDelete = useCallback((product: Product) => {
    // TODO: implement delete product
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      console.log("Delete product", product);
    }
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-background space-y-4">
      {/* Title Header Section */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 py-3">
        <div className="min-w-0 flex-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={APP_ROUTES.DASHBOARD}>Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Products</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Button type="button" size="sm" className="text-xs" onClick={handleCreate}>
          <Plus className="size-3" />
          New Product
        </Button>
      </div>

      {/* Filters & Content Section */}
      <div className="flex-1 flex flex-col min-h-0 px-4">
        <div className="rounded-t-lg border border-border bg-card">
          <ProductsFilters
            search={search}
            onSearchChange={setSearch}
            hasActiveFilters={hasActiveFilters}
            onReset={resetFilters}
          />
        </div>

        {/* Table Wrapper */}
        <div className="flex-1 min-h-[300px]">
          <ProductsTable
            products={products}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={refetch}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={resetFilters}
            page={page}
            pages={pages}
            total={total}
            limit={limit}
            onPageChange={goToPage}
            onLimitChange={setPageSize}
          />
        </div>
      </div>

      {/* Product Details Drawer */}
      <ProductDrawer
        product={selectedProduct}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}
