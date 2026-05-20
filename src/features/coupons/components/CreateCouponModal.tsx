/**
 * CreateCouponModal Component
 * Modal form for creating new coupons with image upload preview
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useToast } from "../../../components/ui/toast";
import { useCouponActions } from "../hooks/useCouponActions";
import type { Coupon, DiscountType } from "../types/coupon";

interface CreateCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: "create" | "edit";
  coupon?: Coupon | null;
}

interface FormErrors {
  code?: string;
  discount_type?: string;
  discount_value?: string;
  min_purchase_amount?: string;
  valid_from?: string;
  valid_to?: string;
  usage_limit?: string;
  image?: string;
  general?: string;
}

interface FormData {
  code: string;
  discount_type: DiscountType;
  discount_value: string;
  min_purchase_amount: string;
  max_discount_amount: string;
  valid_from: string;
  valid_to: string;
  usage_limit: string;
  is_public: boolean;
  is_active: boolean;
  image: File | null;
}

const emptyFormData: FormData = {
  code: "",
  discount_type: "percentage",
  discount_value: "",
  min_purchase_amount: "0",
  max_discount_amount: "",
  valid_from: "",
  valid_to: "",
  usage_limit: "",
  is_public: false,
  is_active: true,
  image: null,
};

function toDatetimeLocal(value?: string): string {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function getInitialFormData(coupon?: Coupon | null): FormData {
  if (!coupon) return emptyFormData;

  return {
    code: coupon.code || "",
    discount_type: coupon.discount_type || "percentage",
    discount_value: coupon.discount_value || "",
    min_purchase_amount: coupon.min_purchase_amount || "0",
    max_discount_amount: coupon.max_discount_amount || "",
    valid_from: toDatetimeLocal(coupon.valid_from),
    valid_to: toDatetimeLocal(coupon.valid_to),
    usage_limit: coupon.usage_limit === null ? "" : String(coupon.usage_limit),
    is_public: Boolean(coupon.is_public),
    is_active: Boolean(coupon.is_active),
    image: null,
  };
}

export function CreateCouponModal({
  isOpen,
  onClose,
  onSuccess,
  mode = "create",
  coupon,
}: CreateCouponModalProps) {
  const { createAction, updateAction } = useCouponActions();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = mode === "edit" && Boolean(coupon);

  const [formData, setFormData] = useState<FormData>(() => getInitialFormData(coupon));

  // Reset form when modal opens/closes or selected coupon changes
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(coupon));
      setImagePreview(coupon?.image || null);
    } else {
      setFormData(emptyFormData);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }

    setErrors({});
  }, [isOpen, coupon]);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = "Code is required";
    }

    if (!formData.discount_value) {
      newErrors.discount_value = "Discount value is required";
    } else if (
      Number.isNaN(parseFloat(formData.discount_value)) ||
      parseFloat(formData.discount_value) < 0
    ) {
      newErrors.discount_value = "Discount value must be a positive number";
    }

    if (formData.min_purchase_amount && Number.isNaN(parseFloat(formData.min_purchase_amount))) {
      newErrors.min_purchase_amount = "Minimum purchase amount must be a valid number";
    }

    if (!formData.valid_from) {
      newErrors.valid_from = "Valid from date is required";
    }

    if (!formData.valid_to) {
      newErrors.valid_to = "Valid to date is required";
    }

    if (formData.valid_from && formData.valid_to) {
      const from = new Date(formData.valid_from);
      const to = new Date(formData.valid_to);
      if (from >= to) {
        newErrors.valid_to = "Valid to date must be after valid from date";
      }
    }

    if (formData.usage_limit && Number.isNaN(parseInt(formData.usage_limit, 10))) {
      newErrors.usage_limit = "Usage limit must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;

      if (type === "checkbox") {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData((prev) => ({
          ...prev,
          [name]: checked,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }

      // Clear error for this field
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    },
    [errors],
  );

  // Handle image selection
  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file",
        }));
        console.log("Image validation failed: Invalid file type", file.type);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size must be less than 5MB",
        }));
        console.log("Image validation failed: File too large", file.size);
        return;
      }

      console.log("Image validation passed, setting file:", file.name);

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Clear error
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.image;
        console.log("Cleared image error, errors now:", newErrors);
        return newErrors;
      });
    }
  }, []);

  // Handle image removal
  const handleRemoveImage = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Clear image error when removing image
    setErrors((prev) => ({
      ...prev,
      image: undefined,
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        // Create FormData for API
        const payload = new FormData();
        payload.append("code", formData.code);
        payload.append("discount_type", formData.discount_type);
        payload.append("discount_value", formData.discount_value);
        payload.append("min_purchase_amount", formData.min_purchase_amount || "0");

        // Only add max_discount_amount if it has a value
        if (formData.max_discount_amount) {
          payload.append("max_discount_amount", formData.max_discount_amount);
        }

        payload.append("valid_from", formData.valid_from);
        payload.append("valid_to", formData.valid_to);

        // Only add usage_limit if it has a value
        if (formData.usage_limit) {
          payload.append("usage_limit", formData.usage_limit);
        }

        payload.append("is_public", formData.is_public ? "true" : "false");
        payload.append("is_active", formData.is_active ? "true" : "false");

        if (formData.image) {
          payload.append("image", formData.image);
        } else if (!isEditMode) {
          payload.append("image", "coupon_images/image.png");
        }

        // Log the payload for debugging
        console.log(
          `${isEditMode ? "Edit" : "Create"}CouponModal: Submitting payload with fields:`,
        );
        for (const [key, value] of payload.entries()) {
          console.log(`  ${key}:`, value instanceof File ? `File(${value.name})` : value);
        }

        if (isEditMode && coupon) {
          await updateAction(coupon.id, payload);
        } else {
          await createAction(payload);
        }

        showToast(`Coupon ${isEditMode ? "updated" : "created"} successfully`, "success", 3000);

        // Close modal and trigger refresh
        onSuccess();
        onClose();
      } catch (err) {
        console.error(
          `${isEditMode ? "Edit" : "Create"}CouponModal: Error submitting coupon:`,
          err,
        );
        const errorMessage =
          err instanceof Error
            ? err.message
            : `Failed to ${isEditMode ? "update" : "create"} coupon`;

        // Handle backend validation errors
        if (typeof err === "object" && err !== null && "data" in err) {
          const errorData = (err as Record<string, unknown>).data;
          if (typeof errorData === "object" && errorData !== null) {
            const backendErrors = errorData as Record<string, unknown>;
            const newErrors: FormErrors = {};

            for (const [key, value] of Object.entries(backendErrors)) {
              if (Array.isArray(value) && value.length > 0) {
                newErrors[key as keyof FormErrors] = value[0] as string;
              }
            }

            if (Object.keys(newErrors).length > 0) {
              setErrors(newErrors);
              return;
            }
          }
        }

        setErrors({
          general: errorMessage,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      formData,
      validateForm,
      isEditMode,
      coupon,
      createAction,
      updateAction,
      onSuccess,
      onClose,
      showToast,
    ],
  );

  if (!isOpen) return null;

  // Check if all required fields are filled and no errors exist
  const hasValidCode = formData.code.trim() !== "";
  const hasValidDiscountValue =
    formData.discount_value !== "" &&
    !Number.isNaN(parseFloat(formData.discount_value)) &&
    parseFloat(formData.discount_value) > 0;

  // Validate dates - handle datetime-local format properly
  let hasValidDates = false;
  if (formData.valid_from && formData.valid_to) {
    try {
      const fromDate = new Date(formData.valid_from);
      const toDate = new Date(formData.valid_to);
      // Check if dates are valid and from < to
      hasValidDates =
        !Number.isNaN(fromDate.getTime()) && !Number.isNaN(toDate.getTime()) && fromDate < toDate;
    } catch {
      hasValidDates = false;
    }
  }

  const hasNoErrors = Object.keys(errors).length === 0;

  const isFormValid = hasValidCode && hasValidDiscountValue && hasValidDates && hasNoErrors;

  // Debug logging
  if (import.meta.env.DEV) {
    console.log("Form validation:", {
      hasValidCode,
      hasValidDiscountValue,
      hasValidDates,
      hasNoErrors,
      isFormValid,
      code: formData.code,
      discount_value: formData.discount_value,
      valid_from: formData.valid_from,
      valid_to: formData.valid_to,
      errors,
      formData,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full border border-border max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {isEditMode ? "Edit Coupon" : "Create New Coupon"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md">
              <p className="text-xs text-destructive">{errors.general}</p>
            </div>
          )}

          {/* Code Field */}
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium">
              Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="e.g., VIP809CD5"
              value={formData.code}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="text-sm"
            />
            {errors.code && <p className="text-xs text-destructive">{errors.code}</p>}
          </div>

          {/* Discount Type and Value */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount_type" className="text-sm font-medium">
                Discount Type <span className="text-destructive">*</span>
              </Label>
              <select
                id="discount_type"
                name="discount_type"
                value={formData.discount_type}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount</option>
                <option value="flat">Flat Amount</option>
              </select>
              {errors.discount_type && (
                <p className="text-xs text-destructive">{errors.discount_type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount_value" className="text-sm font-medium">
                Discount Value <span className="text-destructive">*</span>
              </Label>
              <Input
                id="discount_value"
                name="discount_value"
                type="number"
                placeholder="e.g., 50"
                step="0.01"
                min="0"
                value={formData.discount_value}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="text-sm"
              />
              {errors.discount_value && (
                <p className="text-xs text-destructive">{errors.discount_value}</p>
              )}
            </div>
          </div>

          {/* Min Purchase Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_purchase_amount" className="text-sm font-medium">
                Minimum Purchase Amount (Optional)
              </Label>
              <Input
                id="min_purchase_amount"
                name="min_purchase_amount"
                type="number"
                placeholder="e.g., 100"
                step="0.01"
                min="0"
                value={formData.min_purchase_amount}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="text-sm"
              />
              {errors.min_purchase_amount && (
                <p className="text-xs text-destructive">{errors.min_purchase_amount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_discount_amount" className="text-sm font-medium">
                Maximum Discount Amount (Optional)
              </Label>
              <Input
                id="max_discount_amount"
                name="max_discount_amount"
                type="number"
                placeholder="e.g., 50"
                step="0.01"
                min="0"
                value={formData.max_discount_amount}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="text-sm"
              />
            </div>
          </div>

          {/* Valid From and Valid To */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valid_from" className="text-sm font-medium">
                Valid From <span className="text-destructive">*</span>
              </Label>
              <Input
                id="valid_from"
                name="valid_from"
                type="datetime-local"
                value={formData.valid_from}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="text-sm"
              />
              {errors.valid_from && <p className="text-xs text-destructive">{errors.valid_from}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valid_to" className="text-sm font-medium">
                Valid To <span className="text-destructive">*</span>
              </Label>
              <Input
                id="valid_to"
                name="valid_to"
                type="datetime-local"
                value={formData.valid_to}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="text-sm"
              />
              {errors.valid_to && <p className="text-xs text-destructive">{errors.valid_to}</p>}
            </div>
          </div>

          {/* Usage Limit */}
          <div className="space-y-2">
            <Label htmlFor="usage_limit" className="text-sm font-medium">
              Usage Limit (Optional - leave empty for unlimited)
            </Label>
            <Input
              id="usage_limit"
              name="usage_limit"
              type="number"
              placeholder="e.g., 100"
              min="1"
              value={formData.usage_limit}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="text-sm"
            />
            {errors.usage_limit && <p className="text-xs text-destructive">{errors.usage_limit}</p>}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Coupon Image (Optional)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              {imagePreview ? (
                <div className="space-y-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md mx-auto"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isSubmitting}
                    className="text-xs text-destructive hover:text-destructive/80 transition-colors disabled:opacity-50"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                    className="text-xs text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                  >
                    Select Image
                  </button>
                </div>
              )}
            </div>
            {errors.image && <p className="text-xs text-destructive">{errors.image}</p>}
          </div>

          {/* Is Public Toggle */}
          <div className="flex items-center gap-3">
            <input
              id="is_public"
              name="is_public"
              type="checkbox"
              checked={formData.is_public}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-4 h-4 rounded border-input cursor-pointer"
            />
            <Label htmlFor="is_public" className="text-sm font-medium cursor-pointer">
              Make this coupon public (visible to all customers)
            </Label>
          </div>

          {/* Is Active Toggle */}
          <div className="flex items-center gap-3">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-4 h-4 rounded border-input cursor-pointer"
            />
            <Label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
              Keep this coupon active
            </Label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              variant="outline"
              className="text-sm"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !isFormValid} className="text-sm">
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Coupon"
                  : "Create Coupon"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
