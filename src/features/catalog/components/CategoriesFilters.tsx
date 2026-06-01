import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 min-w-0">
        <Input
          placeholder="Search categories by name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="text-xs"
        />
      </div>

      {hasActiveFilters && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
          className="text-xs whitespace-nowrap"
        >
          <XIcon className="size-3 mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
