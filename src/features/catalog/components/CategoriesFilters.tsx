import { SearchInput } from "@/components/ui/search-input";

interface CategoriesFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  hasActiveFilters: boolean;
  onReset: () => void;
}

export function CategoriesFilters({
  search,
  onSearchChange,
  hasActiveFilters,
  onReset,
}: CategoriesFiltersProps) {
  return (
    <SearchInput
      value={search}
      onChange={onSearchChange}
      placeholder="Search categories by name..."
      showClear={hasActiveFilters}
      onClear={onReset}
      className="p-4"
    />
  );
}
