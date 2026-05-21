import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoyaltyFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  ordering: string;
  onOrderingChange: (ordering: string) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function LoyaltyFilters({
  search,
  onSearchChange,
  ordering,
  onOrderingChange,
  limit,
  onLimitChange,
  onReset,
  hasActiveFilters,
}: LoyaltyFiltersProps) {
  const sortOptions = [
    { value: "-total_points", label: "Highest Points" },
    { value: "total_points", label: "Lowest Points" },
    { value: "-referral_points", label: "Referral Points" },
    { value: "-loyalty_points", label: "Loyalty Points" },
  ];

  return (
    <div className="px-4 py-2.5 border-b border-border bg-card space-y-2 shrink-0">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by sailor name or email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent bg-background text-foreground placeholder-muted-foreground"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sorting */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground hidden md:inline">Sort By</span>
            <select
              value={ordering}
              onChange={(e) => onOrderingChange(e.target.value)}
              className="px-2 py-1.5 border border-input rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent bg-background text-foreground cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rows Limit */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground hidden md:inline">Show</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="px-2 py-1.5 border border-input rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent bg-background text-foreground cursor-pointer"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button onClick={onReset} variant="outline" size="xs" className="text-xs">
              <X className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
