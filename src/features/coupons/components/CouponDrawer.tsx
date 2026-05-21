import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Coupon } from "../types/coupon";

interface CouponDrawerProps {
  coupon: Coupon | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CouponDrawer({ coupon, isOpen, onClose }: CouponDrawerProps) {
  const discountDisplay = coupon
    ? coupon.discount_type === "percentage"
      ? `${parseFloat(coupon.discount_value)}%`
      : `$${parseFloat(coupon.discount_value).toFixed(2)}`
    : "";

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col h-full bg-card p-0">
        {coupon && (
          <>
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
              {/* Quick Stats Grid */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Discount Overview
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {/* Discount Value */}
                  <div className="rounded-lg border border-border p-3 text-center bg-muted/10">
                    <span className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                      Discount
                    </span>
                    <span className="text-lg font-bold text-foreground block">
                      {discountDisplay}
                    </span>
                    <span className="text-[9px] text-muted-foreground block mt-0.5">
                      {coupon.discount_type}
                    </span>
                  </div>
                  {/* Min Purchase */}
                  <div className="rounded-lg border border-border p-3 text-center bg-muted/10">
                    <span className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                      Min Purchase
                    </span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 block">
                      ${parseFloat(coupon.min_purchase_amount).toFixed(2)}
                    </span>
                    <span className="text-[9px] text-muted-foreground block mt-0.5">required</span>
                  </div>
                  {/* Usage */}
                  <div className="rounded-lg border border-border p-3 text-center bg-muted/10">
                    <span className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                      Usage
                    </span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400 block">
                      {coupon.times_used}/{coupon.usage_limit || "∞"}
                    </span>
                    <span className="text-[9px] text-muted-foreground block mt-0.5">used</span>
                  </div>
                </div>
              </div>

              {/* Coupon Details */}
              <div className="rounded-lg border border-border p-4 space-y-3 bg-muted/5">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Coupon Details
                </h4>
                <div className="grid grid-cols-2 gap-y-2 text-xs">
                  <span className="text-muted-foreground">Code:</span>
                  <span className="font-mono text-right text-foreground">{coupon.code}</span>

                  <span className="text-muted-foreground">Discount Type:</span>
                  <span className="text-right text-foreground capitalize">
                    {coupon.discount_type}
                  </span>

                  <span className="text-muted-foreground">Discount Value:</span>
                  <span className="text-right text-foreground">{discountDisplay}</span>

                  <span className="text-muted-foreground">Max Discount:</span>
                  <span className="text-right text-foreground">
                    ${parseFloat(coupon.max_discount_amount).toFixed(2)}
                  </span>

                  <span className="text-muted-foreground">Valid From:</span>
                  <span className="text-right text-foreground">{coupon.valid_from}</span>

                  <span className="text-muted-foreground">Valid To:</span>
                  <span className="text-right text-foreground">{coupon.valid_to}</span>

                  <span className="text-muted-foreground">Status:</span>
                  <span className="text-right text-foreground">
                    {coupon.is_active ? "Active" : "Inactive"}
                  </span>

                  <span className="text-muted-foreground">Visibility:</span>
                  <span className="text-right text-foreground">
                    {coupon.is_public ? "Public" : "Private"}
                  </span>

                  <span className="text-muted-foreground">Usage Limit:</span>
                  <span className="text-right text-foreground">
                    {coupon.usage_limit || "Unlimited"}
                  </span>

                  <span className="text-muted-foreground">Times Used:</span>
                  <span className="text-right text-foreground">{coupon.times_used}</span>

                  <span className="text-muted-foreground">Created:</span>
                  <span className="text-right text-foreground text-[9px]">{coupon.created_at}</span>

                  <span className="text-muted-foreground">Updated:</span>
                  <span className="text-right text-foreground text-[9px]">{coupon.updated_at}</span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-border bg-muted/20 shrink-0 flex gap-2">
              <Button variant="outline" size="sm" onClick={onClose} className="flex-1 text-xs">
                Close Panel
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
