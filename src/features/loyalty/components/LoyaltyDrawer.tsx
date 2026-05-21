import { Award, History, ShieldAlert, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { SailorLoyalty } from "../types/loyalty";

interface LoyaltyDrawerProps {
  sailor: SailorLoyalty | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LoyaltyDrawer({ sailor, isOpen, onClose }: LoyaltyDrawerProps) {
  if (!sailor) return null;

  const fullName =
    [sailor.first_name, sailor.last_name].filter(Boolean).join(" ").trim() || "Unnamed Sailor";

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col h-full bg-card p-0">
        <SheetHeader className="p-6 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-sm font-semibold truncate leading-none">
                {fullName}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-1 truncate">
                {sailor.user_email}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {/* Quick Stats Grid */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Points Overview
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {/* Total Points */}
              <div className="rounded-lg border border-border p-3 text-center bg-muted/10">
                <span className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                  Total
                </span>
                <span className="text-lg font-bold text-foreground block">
                  {sailor.total_points}
                </span>
                <span className="text-[9px] text-muted-foreground block mt-0.5">combined</span>
              </div>
              {/* Loyalty Points */}
              <div className="rounded-lg border border-border p-3 text-center bg-muted/10">
                <span className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                  Loyalty
                </span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 block">
                  {sailor.loyalty_points}
                </span>
                <span className="text-[9px] text-muted-foreground block mt-0.5">from shopping</span>
              </div>
              {/* Referral Points */}
              <div className="rounded-lg border border-border p-3 text-center bg-muted/10">
                <span className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                  Referrals
                </span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400 block">
                  {sailor.referral_points}
                </span>
                <span className="text-[9px] text-muted-foreground block mt-0.5">from invites</span>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="rounded-lg border border-border p-4 space-y-3 bg-muted/5">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Sailor Account Info
            </h4>
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              <span className="text-muted-foreground">User ID:</span>
              <span className="font-semibold text-right text-foreground">{sailor.user_id}</span>

              <span className="text-muted-foreground">Record ID:</span>
              <span className="font-mono text-right text-foreground">{sailor.id}</span>
            </div>
          </div>

          {/* Manual Adjustment Placeholder Section */}
          <div className="border border-border rounded-lg p-4 bg-muted/10 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Award className="size-4 text-purple-600" />
              <span>Manual Point Adjustment</span>
            </div>
            <p className="text-[10px] leading-relaxed text-muted-foreground">
              Adjust this sailor's referral or loyalty point balances manually. These changes will
              be logged in the transaction history.
            </p>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <Label htmlFor="adjustment-type" className="text-[10px] font-medium">
                  Adjustment Type
                </Label>
                <select
                  id="adjustment-type"
                  disabled
                  className="w-full px-2 py-1.5 border border-input rounded-md text-xs bg-muted text-muted-foreground cursor-not-allowed focus:outline-none"
                >
                  <option value="add">Add Points (+)</option>
                  <option value="deduct">Deduct Points (-)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="adjustment-points" className="text-[10px] font-medium">
                    Points Amount
                  </Label>
                  <Input
                    id="adjustment-points"
                    type="number"
                    placeholder="e.g. 100"
                    disabled
                    className="h-8 text-xs bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="adjustment-wallet" className="text-[10px] font-medium">
                    Wallet Type
                  </Label>
                  <select
                    id="adjustment-wallet"
                    disabled
                    className="w-full px-2 py-1.5 border border-input rounded-md text-xs bg-muted text-muted-foreground cursor-not-allowed focus:outline-none"
                  >
                    <option value="loyalty">Loyalty Wallet</option>
                    <option value="referral">Referral Wallet</option>
                  </select>
                </div>
              </div>

              <Button disabled size="sm" className="w-full text-xs h-8 bg-muted cursor-not-allowed">
                Apply Adjustment
              </Button>

              <div className="flex items-center gap-1.5 text-[9px] text-amber-600 dark:text-amber-500 bg-amber-500/10 rounded p-2">
                <ShieldAlert className="size-3 shrink-0" />
                <span>Adjustments require manager privileges and are currently read-only.</span>
              </div>
            </div>
          </div>

          {/* History Placeholder Section */}
          <div className="border border-dashed border-border rounded-lg p-4 text-center space-y-2 bg-muted/5">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <History className="size-4" />
              <span>Point Transaction History</span>
            </div>
            <p className="text-[10px] text-muted-foreground max-w-xs mx-auto leading-normal">
              A historical log of purchases, successful referrals, and point expirations for this
              sailor will appear here in a future update.
            </p>
            <div className="pt-2">
              <div className="flex flex-col gap-2">
                {/* Mock Item 1 */}
                <div className="flex items-center justify-between text-[10px] border-b border-border/40 pb-1.5 text-left">
                  <div>
                    <span className="font-medium text-foreground block">Order #1023 Purchase</span>
                    <span className="text-[9px] text-muted-foreground">
                      Earned 10% Loyalty Points
                    </span>
                  </div>
                  <span className="text-emerald-600 font-bold shrink-0">+35 pts</span>
                </div>
                {/* Mock Item 2 */}
                <div className="flex items-center justify-between text-[10px] border-b border-border/40 pb-1.5 text-left">
                  <div>
                    <span className="font-medium text-foreground block">
                      Friend Invite Code (S589)
                    </span>
                    <span className="text-[9px] text-muted-foreground">Referral Reward</span>
                  </div>
                  <span className="text-blue-600 font-bold shrink-0">+100 pts</span>
                </div>
              </div>
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
