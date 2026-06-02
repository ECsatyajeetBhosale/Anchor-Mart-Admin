import { SearchInput } from "@/components/ui/search-input";

interface ProductsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  hasActiveFilters: boolean;
  onReset: () => void;
}

export function ProductsFilters({
  search,
  onSearchChange,
  hasActiveFilters,
  onReset,
}: ProductsFiltersProps) {
  return (
    <SearchInput
      value={search}
      onChange={onSearchChange}
      placeholder="Search products by name..."
      showClear={hasActiveFilters}
      onClear={onReset}
      className="p-4"
    />
  );
}
