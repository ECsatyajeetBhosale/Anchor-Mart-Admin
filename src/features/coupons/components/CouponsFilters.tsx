import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CouponsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  hasActiveFilters: boolean;
  onReset: () => void;
}

export function CouponsFilters({
  search,
  onSearchChange,
  hasActiveFilters,
  onReset,
}: CouponsFiltersProps) {
  return (
    <div className="px-4 py-3 border-b border-border bg-card space-y-3">
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search coupons by code..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 text-xs"
        />
        {hasActiveFilters && (
          <Button onClick={onReset} variant="outline" size="sm" className="text-xs h-8 gap-1">
            <X className="size-3" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
