/**
 * CouponActions Component
 * Dropdown menu for coupon actions
 */

import { Copy, Edit, Eye, EyeOff, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCopyToClipboard } from "../hooks/useCouponActions";
import type { Coupon } from "../types/coupon";

interface CouponActionsProps {
  coupon: Coupon;
  onEdit?: (coupon: Coupon) => void;
  onDelete?: (coupon: Coupon) => void;
  onTogglePublic?: (coupon: Coupon) => void;
  onDuplicate?: (coupon: Coupon) => void;
  onView?: (coupon: Coupon) => void;
}

export function CouponActions({
  coupon,
  onEdit,
  onDelete,
  onTogglePublic,
  onDuplicate,
  onView,
}: CouponActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isCopied, copyToClipboard } = useCopyToClipboard(coupon.id, 1500);

  const handleCopyCode = async () => {
    await copyToClipboard(coupon.code);
    setIsOpen(false);
  };

  const handleEdit = () => {
    onEdit?.(coupon);
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete?.(coupon);
    setIsOpen(false);
  };

  const handleTogglePublic = () => {
    onTogglePublic?.(coupon);
    setIsOpen(false);
  };

  const handleDuplicate = () => {
    onDuplicate?.(coupon);
    setIsOpen(false);
  };

  const handleView = () => {
    onView?.(coupon);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="More actions"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            {onView && (
              <button
                type="button"
                onClick={handleView}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={handleEdit}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyCode}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              {isCopied ? "Copied!" : "Copy Code"}
            </button>

            {onTogglePublic && (
              <button
                type="button"
                onClick={handleTogglePublic}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                {coupon.is_public ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Make Private
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Make Public
                  </>
                )}
              </button>
            )}

            {onDuplicate && (
              <button
                type="button"
                onClick={handleDuplicate}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Duplicate
              </button>
            )}

            {onDelete && (
              <>
                <div className="border-t border-gray-200 my-1" />
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsOpen(false);
          }}
          aria-label="Close menu"
        />
      )}
    </div>
  );
}
