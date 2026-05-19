/**
 * CouponsHeader Component
 * Compact header with title and action buttons
 */

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CouponsHeaderProps {
  onCreateClick?: () => void;
  onExportClick?: () => void;
}

export function CouponsHeader({ onCreateClick, onExportClick }: CouponsHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0">
      <div className="min-w-0 flex-1">
        <h1 className="text-lg font-semibold text-foreground">Coupons</h1>
        <p className="text-xs text-muted-foreground">Manage and track discount codes</p>
      </div>

      <div className="flex items-center gap-2 ml-4 shrink-0">
        {onExportClick && (
          <Button onClick={onExportClick} variant="outline" size="sm" className="text-xs">
            Export
          </Button>
        )}

        {onCreateClick && (
          <Button onClick={onCreateClick} variant="default" size="sm" className="text-xs">
            <Plus className="w-3 h-3" />
            <span className="hidden sm:inline">New</span>
          </Button>
        )}
      </div>
    </div>
  );
}
