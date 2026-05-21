import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/toast";
import { useCreateCouponMutation, useUpdateCouponMutation } from "../api/couponsApi";
import type { Coupon, CouponPayload } from "../types/coupon";

interface CouponFormDrawerProps {
  coupon: Coupon | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type CouponFormState = {
  code: string;
  image: string;
  discount_type: CouponPayload["discount_type"];
  discount_value: string;
  min_purchase_amount: string;
  max_discount_amount: string;
  valid_from: string;
  valid_to: string;
  usage_limit: string;
  is_public: boolean;
  is_active: boolean;
};

const emptyForm: CouponFormState = {
  code: "",
  image: "coupon_images/image.png",
  discount_type: "percentage",
  discount_value: "",
  min_purchase_amount: "0",
  max_discount_amount: "",
  valid_from: "",
  valid_to: "",
  usage_limit: "",
  is_public: true,
  is_active: true,
};

function toDatetimeLocal(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

function toApiDatetime(value: string) {
  if (!value) return "";
  return new Date(value).toISOString();
}

function getFormState(coupon: Coupon | null): CouponFormState {
  if (!coupon) return emptyForm;

  return {
    code: coupon.code || "",
    image: "coupon_images/image.png",
    discount_type: coupon.discount_type || "percentage",
    discount_value: coupon.discount_value || "",
    min_purchase_amount: coupon.min_purchase_amount || "0",
    max_discount_amount: coupon.max_discount_amount || "",
    valid_from: toDatetimeLocal(coupon.valid_from),
    valid_to: toDatetimeLocal(coupon.valid_to),
    usage_limit: coupon.usage_limit === null ? "" : String(coupon.usage_limit),
    is_public: Boolean(coupon.is_public),
    is_active: Boolean(coupon.is_active),
  };
}

function toPayload(form: CouponFormState): CouponPayload {
  return {
    code: form.code.trim().toUpperCase(),
    image: form.image.trim() || "coupon_images/image.png",
    discount_type: form.discount_type,
    discount_value: Number(form.discount_value),
    min_purchase_amount: Number(form.min_purchase_amount || 0),
    max_discount_amount: form.max_discount_amount ? Number(form.max_discount_amount) : null,
    valid_from: toApiDatetime(form.valid_from),
    valid_to: toApiDatetime(form.valid_to),
    usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
    is_public: form.is_public,
    is_active: form.is_active,
  };
}

export function CouponFormDrawer({ coupon, isOpen, onClose, onSuccess }: CouponFormDrawerProps) {
  const { showToast } = useToast();
  const [form, setForm] = useState<CouponFormState>(() => getFormState(coupon));
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();

  const isEditMode = Boolean(coupon);
  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (isOpen) {
      setForm(getFormState(coupon));
    }
  }, [coupon, isOpen]);

  const isValid = useMemo(
    () =>
      form.code.trim() &&
      form.discount_value &&
      form.min_purchase_amount !== "" &&
      form.valid_from &&
      form.valid_to,
    [form],
  );

  const updateField = <K extends keyof CouponFormState>(key: K, value: CouponFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid) {
      showToast("Please fill all required coupon fields", "warning", 2500);
      return;
    }

    try {
      const payload = toPayload(form);
      if (isEditMode && coupon) {
        await updateCoupon({ id: coupon.id, payload }).unwrap();
        showToast("Coupon updated successfully", "success", 2500);
      } else {
        await createCoupon(payload).unwrap();
        showToast("Coupon created successfully", "success", 2500);
      }

      onSuccess();
      onClose();
    } catch {
      showToast(`Failed to ${isEditMode ? "update" : "create"} coupon`, "error", 3000);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg bg-card p-0">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <SheetHeader className="border-b border-border bg-muted/20 p-6">
            <SheetTitle className="text-sm font-semibold">
              {isEditMode ? "Edit Coupon" : "Create Coupon"}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Configure discount details and coupon visibility.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-5 overflow-y-auto p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="coupon-code" className="text-xs">
                  Code
                </Label>
                <Input
                  id="coupon-code"
                  value={form.code}
                  onChange={(event) => updateField("code", event.target.value)}
                  placeholder="FLAT400"
                  className="text-xs uppercase"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="coupon-image" className="text-xs">
                  Image Path
                </Label>
                <Input
                  id="coupon-image"
                  value={form.image}
                  onChange={(event) => updateField("image", event.target.value)}
                  placeholder="coupon_images/image.png"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="discount-type" className="text-xs">
                  Discount Type
                </Label>
                <select
                  id="discount-type"
                  value={form.discount_type}
                  onChange={(event) =>
                    updateField(
                      "discount_type",
                      event.target.value as CouponPayload["discount_type"],
                    )
                  }
                  className="h-8 w-full rounded-lg border border-input bg-background px-2.5 py-1 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="discount-value" className="text-xs">
                  Discount Value
                </Label>
                <Input
                  id="discount-value"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.discount_value}
                  onChange={(event) => updateField("discount_value", event.target.value)}
                  placeholder="20.00"
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="min-purchase" className="text-xs">
                  Min Purchase
                </Label>
                <Input
                  id="min-purchase"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.min_purchase_amount}
                  onChange={(event) => updateField("min_purchase_amount", event.target.value)}
                  placeholder="0.00"
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="max-discount" className="text-xs">
                  Max Discount
                </Label>
                <Input
                  id="max-discount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.max_discount_amount}
                  onChange={(event) => updateField("max_discount_amount", event.target.value)}
                  placeholder="Optional"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="valid-from" className="text-xs">
                  Valid From
                </Label>
                <Input
                  id="valid-from"
                  type="datetime-local"
                  value={form.valid_from}
                  onChange={(event) => updateField("valid_from", event.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="valid-to" className="text-xs">
                  Valid To
                </Label>
                <Input
                  id="valid-to"
                  type="datetime-local"
                  value={form.valid_to}
                  onChange={(event) => updateField("valid_to", event.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="usage-limit" className="text-xs">
                  Usage Limit
                </Label>
                <Input
                  id="usage-limit"
                  type="number"
                  min="0"
                  value={form.usage_limit}
                  onChange={(event) => updateField("usage_limit", event.target.value)}
                  placeholder="Blank for unlimited"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid gap-3 rounded-lg border border-border bg-muted/10 p-3 sm:grid-cols-2">
              <label className="flex items-center gap-2 text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={form.is_public}
                  onChange={(event) => updateField("is_public", event.target.checked)}
                  className="size-3.5 rounded border-input"
                />
                Public coupon
              </label>

              <label className="flex items-center gap-2 text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) => updateField("is_active", event.target.checked)}
                  className="size-3.5 rounded border-input"
                />
                Active coupon
              </label>
            </div>
          </div>

          <SheetFooter className="border-t border-border bg-muted/20 p-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting} className="text-xs">
              {isEditMode ? "Update Coupon" : "Create Coupon"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
