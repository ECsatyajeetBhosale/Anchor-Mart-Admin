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
import { useCategories, useCategoryFilters, usePagination } from "../hooks/useCategories";
import type { Category } from "../types/category";
import { CategoriesFilters } from "./CategoriesFilters";
import { CategoriesTable } from "./CategoriesTable";
import { CategoryDrawer } from "./CategoryDrawer";
import { CategoryFormDrawer } from "./CategoryFormDrawer";

export function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { search, setSearch, resetFilters, hasActiveFilters } = useCategoryFilters();
  const { page, limit, goToPage, setPageSize } = usePagination(1, 10);

  const { categories, total, pages, isLoading, isError, error, refetch } = useCategories({
    page,
    limit,
    search: search || undefined,
  });

  const handleViewDetails = useCallback((category: Category) => {
    setSelectedCategory(category);
    setIsDrawerOpen(true);
  }, []);

  const handleCreate = useCallback(() => {
    setEditingCategory(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
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
                <BreadcrumbPage>Categories</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Button type="button" size="sm" className="text-xs" onClick={handleCreate}>
          <Plus className="size-3" />
          New Category
        </Button>
      </div>

      {/* Filters & Content Section */}
      <div className="flex-1 flex flex-col min-h-0 px-4">
        <div className="rounded-t-lg border border-border bg-card">
          <CategoriesFilters
            search={search}
            onSearchChange={setSearch}
            hasActiveFilters={hasActiveFilters}
            onReset={resetFilters}
          />
        </div>

        {/* Table Wrapper */}
        <div className="flex-1 min-h-[300px]">
          <CategoriesTable
            categories={categories}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={refetch}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
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

      {/* Details Drawer */}
      <CategoryDrawer
        category={selectedCategory}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedCategory(null);
        }}
      />

      {/* Form Drawer */}
      <CategoryFormDrawer
        category={editingCategory}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCategory(null);
        }}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
}

export default CategoriesPage;
