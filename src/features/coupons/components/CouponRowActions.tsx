/**
 * CouponRowActions Component
 * Modern SaaS-style inline action buttons with direct icon access
 * Follows industry standards: minimal clicks, high visibility actions
 */

import { Copy, Edit, Eye, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCopyToClipboard } from "../hooks/useCouponActions";
import type { Coupon } from "../types/coupon";

interface CouponRowActionsProps {
  coupon: Coupon;
  onEdit?: (coupon: Coupon) => void;
  onDelete?: (coupon: Coupon) => void;
  onView?: (coupon: Coupon) => void;
}

/**
 * Code Cell with Copy Icon
 * Displays coupon code with a subtle copy icon that appears on hover
 * Follows modern UX: icon visible on hover, tooltip on interaction
 */
function CodeCell({ coupon }: { coupon: Coupon }) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await copyToClipboard(coupon.code);
  };

  return (
    <div className="flex items-center gap-2 group">
      <code className="font-mono text-foreground text-sm">{coupon.code}</code>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0 hover:bg-muted rounded-md hover:scale-110"
              aria-label="Copy coupon code"
            >
              <Copy className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs bg-slate-900 text-white">
            {isCopied ? "✓ Copied!" : "Copy code"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

/**
 * Action Buttons
 * Direct inline action icons following SaaS admin panel standards
 * - View (neutral): Eye icon in muted color
 * - Edit (primary): Pencil icon in primary color
 * - Delete (danger): Trash icon in red/destructive color
 *
 * Spacing: 8px gap between buttons for clear separation
 * Hover: Subtle background color change + scale effect
 * Accessibility: Full keyboard support + ARIA labels + tooltips
 */
function ActionButtons({ coupon, onEdit, onDelete, onView }: CouponRowActionsProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(coupon);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onView?.(coupon);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(coupon);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {/* View Details Button - Neutral */}
      {onView && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleView}
                className="p-1.5 rounded-md transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300"
                aria-label="View coupon details"
              >
                <Eye className="w-4 h-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs bg-slate-900 text-white">
              View Details
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Edit Button - Primary */}
      {onEdit && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleEdit}
                className="p-1.5 rounded-md transition-all duration-200 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                aria-label="Edit coupon"
              >
                <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs bg-slate-900 text-white">
              Edit
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Delete Button - Danger */}
      {onDelete && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleDelete}
                className="p-1.5 rounded-md transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/30 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300"
                aria-label="Delete coupon"
              >
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs bg-slate-900 text-white">
              Delete
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

/**
 * Export as namespace for cleaner usage
 * Usage: <CouponRowActions.CodeCell coupon={coupon} />
 *        <CouponRowActions coupon={coupon} onEdit={...} />
 */
export const CouponRowActions = Object.assign(ActionButtons, {
  CodeCell,
});
