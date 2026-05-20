# Coupon Creation Form - Complete Guide

## Issue Summary
The "Create Coupon" button was being disabled after uploading an image due to:
1. **Image error state not being cleared** when removing images
2. **Unnecessary fields being sent** to the backend causing 500 errors
3. **Validation logic issues** with date comparison

## Fixes Applied

### 1. Image Removal Error Clearing ✅
**File:** `src/features/coupons/components/CreateCouponModal.tsx`

When you remove an image, the error state is now properly cleared:
```typescript
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
```

### 2. Simplified Payload Submission ✅
**File:** `src/features/coupons/components/CreateCouponModal.tsx`

The form now only sends fields that have values:
- `max_discount_amount` - Only sent if filled
- `usage_limit` - Only sent if filled
- `image` - Only sent if selected
- Removed hardcoded `"coupon_images/image.png"` that was causing issues

### 3. Enhanced Validation Status Panel ✅
**File:** `src/features/coupons/components/CreateCouponModal.tsx`

A blue debug panel shows real-time validation status:
- ✅ Code validation
- ✅ Discount Value validation
- ✅ Date validation
- ✅ Error object contents
- ✅ Button enabled/disabled status

## How to Use the Form

### Step 1: Fill Required Fields
| Field | Example | Notes |
|-------|---------|-------|
| **Code** | `SUMMER2026` | Unique coupon code |
| **Discount Type** | `Percentage (%)` | Select from dropdown |
| **Discount Value** | `20` | Must be positive number |
| **Valid From** | `2026-05-20 10:00` | Click to pick date/time |
| **Valid To** | `2026-06-20 10:00` | Must be AFTER Valid From |

### Step 2: Optional Fields
| Field | Example | Notes |
|-------|---------|-------|
| **Min Purchase Amount** | `100` | Leave empty for no minimum |
| **Max Discount Amount** | `50` | Leave empty if not needed |
| **Usage Limit** | `100` | Leave empty for unlimited |
| **Image** | Select file | Optional, max 5MB |
| **Make Public** | Checked/Unchecked | Toggle visibility |

### Step 3: Monitor Validation Panel
The blue panel at the top shows:
```
✓ Code: ✅ Valid - "SUMMER2026"
✓ Discount Value: ✅ Valid - "20"
✓ Valid From: ✅ Set - "2026-05-20T10:00"
✓ Valid To: ✅ Set - "2026-06-20T10:00"
✓ Dates Valid: ✅ Valid
✓ Image: ⭕ Not required
✓ Errors Object: {}
✓ No Errors: ✅ True
Button Enabled: ✅ YES
```

### Step 4: Submit Form
When all validations show ✅, the "Create Coupon" button will be **enabled**.

## Troubleshooting

### Button Still Disabled?
Check the validation panel for:
1. **Code:** Must not be empty
2. **Discount Value:** Must be a positive number
3. **Valid From:** Must be set
4. **Valid To:** Must be set AND after Valid From
5. **Errors Object:** Should be `{}`

### Image Upload Issues?
- File must be an image (PNG, JPG, GIF)
- File size must be less than 5MB
- After upload, check the validation panel for image errors

### 500 Error on Submit?
This means the backend rejected the request. Check:
1. Browser console for the exact error message
2. Network tab to see what was sent
3. Backend logs for validation errors

## Browser Console Debugging

When you submit the form, check the browser console (F12) for:

```
CreateCouponModal: Submitting payload with fields:
  code: SUMMER2026
  discount_type: percentage
  discount_value: 20
  min_purchase_amount: 100
  valid_from: 2026-05-20T10:00
  valid_to: 2026-06-20T10:00
  is_public: false
```

If you see a 500 error, the backend will log what went wrong.

## Form Validation Rules

### Code
- ✅ Required
- ✅ Must not be empty
- ✅ Any alphanumeric characters allowed

### Discount Value
- ✅ Required
- ✅ Must be a positive number
- ✅ Can be decimal (e.g., 20.50)

### Minimum Purchase Amount
- ⭕ Optional
- ✅ Must be a valid number if provided
- ✅ Default is 0

### Valid From & Valid To
- ✅ Both required
- ✅ Valid To must be AFTER Valid From
- ✅ Format: YYYY-MM-DDTHH:MM

### Usage Limit
- ⭕ Optional
- ✅ Must be a positive integer if provided
- ✅ Leave empty for unlimited

### Image
- ⭕ Optional
- ✅ Must be image file (PNG, JPG, GIF)
- ✅ Max size: 5MB

## What Changed in the Code

### Before (Broken)
```typescript
// Sent empty strings and hardcoded values
payload.append("max_discount_amount", formData.max_discount_amount || "0");
payload.append("usage_limit", formData.usage_limit || "");
payload.append("image", "coupon_images/image.png"); // ❌ Wrong!
```

### After (Fixed)
```typescript
// Only send if values exist
if (formData.max_discount_amount) {
  payload.append("max_discount_amount", formData.max_discount_amount);
}
if (formData.usage_limit) {
  payload.append("usage_limit", formData.usage_limit);
}
if (formData.image) {
  payload.append("image", formData.image);
}
```

## Testing Checklist

- [ ] Fill all required fields
- [ ] Verify validation panel shows all ✅
- [ ] Click "Create Coupon" button
- [ ] Button should be enabled (not grayed out)
- [ ] Form should submit successfully
- [ ] Success toast should appear
- [ ] Modal should close
- [ ] New coupon should appear in table

## Next Steps

If you still encounter issues:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try creating a coupon
4. Share the error message from the console
5. Check Network tab to see the API request/response

---

**Last Updated:** May 19, 2026
**Status:** ✅ Fixed and Ready to Use
