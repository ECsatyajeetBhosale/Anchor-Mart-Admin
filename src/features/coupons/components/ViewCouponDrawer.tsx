import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Coupon } from "../types/coupon";
import { enrichCoupon, formatCurrency } from "../utils/couponHelpers";

interface ViewCouponDrawerProps {
  coupon: Coupon | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewCouponDrawer({ coupon, isOpen, onClose }: ViewCouponDrawerProps) {
  if (!coupon) return null;
  const enriched = enrichCoupon(coupon);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col h-full bg-card p-0">
        <SheetHeader className="p-6 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="font-bold text-lg">%</span>
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-sm font-semibold truncate leading-none">
                {coupon.code}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-1 truncate">
                {coupon.id}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          <div className="rounded-lg border border-border p-4 space-y-3 bg-muted/5">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Coupon Details
            </h4>
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              <span className="text-muted-foreground">ID:</span>
              <span className="font-mono text-right text-foreground">{coupon.id}</span>

              <span className="text-muted-foreground">Code:</span>
              <span className="font-semibold text-right text-foreground">{coupon.code}</span>

              <span className="text-muted-foreground">Discount Type:</span>
              <span className="text-right text-foreground">{coupon.discount_type}</span>

              <span className="text-muted-foreground">Discount Value:</span>
              <span className="text-right text-foreground">
                {coupon.discount_type === "percentage"
                  ? `${parseFloat(coupon.discount_value)}%`
                  : formatCurrency(coupon.discount_value)}
              </span>

              <span className="text-muted-foreground">Min Purchase:</span>
              <span className="text-right text-foreground">
                {formatCurrency(coupon.min_purchase_amount)}
              </span>

              <span className="text-muted-foreground">Max Discount:</span>
              <span className="text-right text-foreground">
                {formatCurrency(coupon.max_discount_amount)}
              </span>

              <span className="text-muted-foreground">Valid From:</span>
              <span className="text-right text-foreground">{coupon.valid_from}</span>

              <span className="text-muted-foreground">Valid To:</span>
              <span className="text-right text-foreground">{coupon.valid_to}</span>

              <span className="text-muted-foreground">Status:</span>
              <span className="text-right text-foreground">{enriched.status}</span>

              <span className="text-muted-foreground">Active:</span>
              <span className="text-right text-foreground">{coupon.is_active ? "Yes" : "No"}</span>

              <span className="text-muted-foreground">Usage Limit:</span>
              <span className="text-right text-foreground">{coupon.usage_limit ?? "-"}</span>

              <span className="text-muted-foreground">Times Used:</span>
              <span className="text-right text-foreground">{coupon.times_used}</span>

              <span className="text-muted-foreground">Visibility:</span>
              <span className="text-right text-foreground">
                {coupon.is_public ? "Public" : "Private"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-muted/20 shrink-0 flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="flex-1 text-xs">
            Close Panel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
