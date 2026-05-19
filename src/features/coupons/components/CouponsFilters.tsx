/**
 * CouponsFilters Component
 * Compact search and filter controls
 */

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFilterOptions } from "../hooks/useCouponFilters";
import type { CouponFilters } from "../types/coupon";

interface CouponsFiltersProps {
  filters: CouponFilters;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: CouponFilters["status"]) => void;
  onTypeChange: (type: CouponFilters["type"]) => void;
  onVisibilityChange: (visibility: CouponFilters["visibility"]) => void;
  onUsageChange: (usage: CouponFilters["usage"]) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function CouponsFilters({
  filters,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onVisibilityChange,
  onUsageChange,
  onReset,
  hasActiveFilters,
}: CouponsFiltersProps) {
  const { statusOptions, typeOptions, visibilityOptions, usageOptions } = useFilterOptions();

  return (
    <div className="px-4 py-2.5 border-b border-border bg-card space-y-2 shrink-0">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by code..."
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-xs border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent bg-background text-foreground placeholder-muted-foreground"
        />
      </div>

      {/* Filter Controls - Responsive Grid */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}
      >
        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => onStatusChange(e.target.value as CouponFilters["status"])}
          className="px-2 py-1.5 border border-input rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent bg-background text-foreground"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Type Filter */}
        <select
          value={filters.type}
          onChange={(e) => onTypeChange(e.target.value as CouponFilters["type"])}
          className="px-2 py-1.5 border border-input rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent bg-background text-foreground"
        >
          {typeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Visibility Filter */}
        <select
          value={filters.visibility}
          onChange={(e) => onVisibilityChange(e.target.value as CouponFilters["visibility"])}
          className="px-2 py-1.5 border border-input rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent bg-background text-foreground"
        >
          {visibilityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Usage Filter */}
        <select
          value={filters.usage}
          onChange={(e) => onUsageChange(e.target.value as CouponFilters["usage"])}
          className="px-2 py-1.5 border border-input rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent bg-background text-foreground"
        >
          {usageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button onClick={onReset} variant="outline" size="xs" className="text-xs col-span-1">
            <X className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        )}
      </div>
    </div>
  );
}
