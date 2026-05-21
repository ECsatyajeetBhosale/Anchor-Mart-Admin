import { Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Coupon } from "../types/coupon";

interface CouponRowProps {
  coupon: Coupon;
  onViewDetails: (coupon: Coupon) => void;
  onEdit: (coupon: Coupon) => void;
}

function formatCurrency(value: string) {
  const amount = Number.parseFloat(value);
  return Number.isFinite(amount) ? `$${amount.toFixed(2)}` : "$0.00";
}

function formatDiscount(coupon: Coupon) {
  const amount = Number.parseFloat(coupon.discount_value);
  if (!Number.isFinite(amount)) return "0";
  return coupon.discount_type === "percentage" ? `${amount}%` : `$${amount.toFixed(2)}`;
}

export function CouponRow({ coupon, onEdit, onViewDetails }: CouponRowProps) {
  return (
    <tr className="border-b border-border text-xs transition-colors hover:bg-muted/50">
      <td className="px-3 py-2 font-medium text-foreground">
        <span className="font-mono">{coupon.code}</span>
      </td>
      <td className="px-3 py-2 text-foreground">{formatDiscount(coupon)}</td>
      <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
        {formatCurrency(coupon.min_purchase_amount)}
      </td>
      <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
        {coupon.times_used} / {coupon.usage_limit || "Unlimited"}
      </td>
      <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{coupon.valid_to}</td>
      <td className="px-3 py-2">
        <span
          className={
            coupon.is_active
              ? "font-medium text-emerald-600 dark:text-emerald-400"
              : "font-medium text-red-600 dark:text-red-400"
          }
        >
          {coupon.is_active ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-3 py-2">
        <span className="text-muted-foreground">{coupon.is_public ? "Public" : "Private"}</span>
      </td>
      <td className="px-3 py-2 text-right">
        <div className="flex justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => onViewDetails(coupon)}
            aria-label="View coupon details"
          >
            <Eye className="size-3.5 text-muted-foreground hover:text-foreground" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => onEdit(coupon)}
            aria-label="Edit coupon"
          >
            <Edit className="size-3.5 text-muted-foreground hover:text-foreground" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
