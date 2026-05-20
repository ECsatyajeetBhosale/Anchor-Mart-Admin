# Copy Feedback - Code Snippets & Examples

## Quick Reference: Hook Usage

### Basic Usage
```typescript
import { useCopyToClipboard } from "@/features/coupons/hooks/useCouponActions";

function MyCopyButton({ text, itemId }) {
  const { isCopied, copyToClipboard } = useCopyToClipboard(itemId, 1500);

  return (
    <button onClick={() => copyToClipboard(text)}>
      {isCopied ? "✓ Copied!" : "Copy"}
    </button>
  );
}
```

### Advanced Usage with Icon Animation
```typescript
import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "@/features/coupons/hooks/useCouponActions";

function AdvancedCopyButton({ code, couponId }) {
  const { isCopied, copyToClipboard } = useCopyToClipboard(couponId, 1500);

  const handleCopy = async (e) => {
    e.stopPropagation();
    await copyToClipboard(code);
  };

  return (
    <button
      onClick={handleCopy}
      disabled={isCopied}
      aria-label={isCopied ? "Copied" : "Copy coupon code"}
      className="p-2 rounded hover:bg-gray-100 transition-all"
    >
      <div className="relative w-4 h-4">
        {/* Copy Icon - Visible by default */}
        <Copy
          className={`absolute transition-all duration-200 ${
            isCopied ? "opacity-0 scale-0" : "opacity-100 scale-100"
          }`}
        />

        {/* Check Icon - Visible when copied */}
        <Check
          className={`absolute text-green-600 transition-all duration-200 ${
            isCopied ? "opacity-100 scale-100" : "opacity-0 scale-0"
          }`}
        />
      </div>
    </button>
  );
}
```

## Real Implementation Examples

### Example 1: Current Implementation (CouponRowActions.tsx)
```typescript
import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "../hooks/useCouponActions";

function CodeCell({ coupon }) {
  // Pass unique coupon ID for per-row state tracking
  // Pass 1500 for 1.5 second feedback duration
  const { isCopied, copyToClipboard } = useCopyToClipboard(coupon.id, 1500);

  const handleCopy = async (e) => {
    e.stopPropagation();
    await copyToClipboard(coupon.code);
  };

  return (
    <div className="flex items-center gap-2 group">
      <code className="font-mono text-foreground text-sm">{coupon.code}</code>

      <button
        type="button"
        onClick={handleCopy}
        className="p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-md hover:scale-110"
        aria-label={isCopied ? "Copied" : "Copy coupon code"}
        disabled={isCopied}  // Prevent multiple clicks during feedback
      >
        {/* Icon container with overlaid icons */}
        <div className="relative w-3.5 h-3.5">
          {/* Copy icon - fades out when copied */}
          <Copy
            className={`absolute inset-0 w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-all duration-200 ${
              isCopied ? "opacity-0 scale-0" : "opacity-100 scale-100"
            }`}
          />

          {/* Check icon - fades in when copied */}
          <Check
            className={`absolute inset-0 w-3.5 h-3.5 text-green-600 dark:text-green-500 transition-all duration-200 ${
              isCopied ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          />
        </div>
      </button>
    </div>
  );
}
```

### Example 2: Using with Tooltip (CouponRowActions.tsx - Full)
```typescript
import { Check, Copy } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCopyToClipboard } from "../hooks/useCouponActions";

function CodeCellWithTooltip({ coupon }) {
  const { isCopied, copyToClipboard } = useCopyToClipboard(coupon.id, 1500);

  const handleCopy = async (e) => {
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
              className="p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-md hover:scale-110"
              aria-label={isCopied ? "Copied" : "Copy coupon code"}
              disabled={isCopied}
            >
              <div className="relative w-3.5 h-3.5">
                <Copy
                  className={`absolute inset-0 w-3.5 h-3.5 text-muted-foreground transition-all duration-200 ${
                    isCopied ? "opacity-0 scale-0" : "opacity-100 scale-100"
                  }`}
                />
                <Check
                  className={`absolute inset-0 w-3.5 h-3.5 text-green-600 dark:text-green-500 transition-all duration-200 ${
                    isCopied ? "opacity-100 scale-100" : "opacity-0 scale-0"
                  }`}
                />
              </div>
            </button>
          </TooltipTrigger>
          {/* Tooltip text updates based on copy state */}
          <TooltipContent side="top" className="text-xs bg-slate-900 text-white">
            {isCopied ? "Copied!" : "Copy code"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
```

## Hook Implementation (useCouponActions.ts)
```typescript
import { useState, useCallback } from "react";

/**
 * Hook for copy-to-clipboard with per-item state tracking
 * Allows tracking copied state for multiple items independently
 * 
 * @param itemId - Optional unique identifier for the item being copied (e.g., coupon ID)
 * @param resetDelay - Time in ms before reverting to copy icon (default: 1500ms)
 * 
 * @returns Object with:
 *   - isCopied: Boolean - true if this specific item was just copied
 *   - copiedId: String | null - ID of the item that was copied
 *   - copyToClipboard: Function - async function to copy text and trigger feedback
 * 
 * @example
 * const { isCopied, copyToClipboard } = useCopyToClipboard("coupon-123", 1500);
 * await copyToClipboard("SAVE20");  // Copies text and sets isCopied = true for this coupon
 */
export function useCopyToClipboard(itemId?: string, resetDelay: number = 1500) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        // Use modern Clipboard API
        await navigator.clipboard.writeText(text);

        // Track which item was copied (for per-item state)
        const idToCopy = itemId || "default";
        setCopiedId(idToCopy);

        // Auto-revert after specified delay
        const timer = setTimeout(() => {
          setCopiedId(null);
        }, resetDelay);

        // Return cleanup function for proper memory management
        return () => clearTimeout(timer);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    },
    [itemId, resetDelay],
  );

  // For backward compatibility and simple boolean checks
  const isCopied = itemId ? copiedId === itemId : copiedId !== null;

  return { isCopied, copiedId, copyToClipboard };
}
```

## Tailwind CSS Classes Used

### Icon Animation Classes
```css
/* Copy Icon - Fade out and scale down */
opacity-0           /* 0% opacity when copied */
opacity-100         /* 100% opacity by default */
scale-0             /* 0% scale when copied */
scale-100           /* 100% scale by default */

/* Transition */
transition-all      /* Smooth all property transitions */
duration-200        /* 200ms animation duration */

/* Check Icon - Fade in and scale up */
text-green-600      /* Light mode color */
dark:text-green-500 /* Dark mode color */
```

### Button State Classes
```css
/* Hover effect */
group-hover:opacity-100  /* Show icon on parent hover */
opacity-0                /* Hide by default */
hover:scale-110          /* Slightly enlarge on hover */
hover:bg-muted          /* Background color on hover */
rounded-md              /* Border radius */
transition-all duration-200  /* Smooth transitions */

/* Disabled state */
disabled              /* Browser handles disabled styling */
```

## State Flow Diagram (Code)

```typescript
// Initial state
const [copiedId, setCopiedId] = useState<string | null>(null);
// copiedId = null

// User clicks copy on coupon-123
copyToClipboard("SAVE20");
// setCopiedId("coupon-123")
// copiedId = "coupon-123"

// isCopied calculation for coupon-123
const isCopied = "coupon-123" === "coupon-123"  // true

// isCopied calculation for coupon-456
const isCopied = "coupon-456" === "coupon-123"  // false

// After 1500ms timeout
setTimeout(() => setCopiedId(null), 1500);
// copiedId = null
```

## Testing Examples

### Test Case 1: Single Row Copy
```typescript
test("should show checkmark when copy clicked", async () => {
  render(<CodeCell coupon={{ id: "123", code: "SAVE20" }} />);
  
  const button = screen.getByRole("button");
  fireEvent.click(button);
  
  // Check icon should be visible
  expect(screen.getByTestId("check-icon")).toHaveClass("opacity-100");
  
  // Copy icon should be hidden
  expect(screen.getByTestId("copy-icon")).toHaveClass("opacity-0");
});
```

### Test Case 2: Per-Row Isolation
```typescript
test("should not affect other rows when copying", async () => {
  render(
    <>
      <CodeCell coupon={{ id: "123", code: "SAVE20" }} />
      <CodeCell coupon={{ id: "456", code: "SAVE30" }} />
    </>
  );
  
  const buttons = screen.getAllByRole("button");
  fireEvent.click(buttons[0]);  // Click first row
  
  // First row shows checkmark
  expect(screen.getAllByTestId("check-icon")[0]).toHaveClass("opacity-100");
  
  // Second row shows copy icon
  expect(screen.getAllByTestId("copy-icon")[1]).toHaveClass("opacity-100");
});
```

### Test Case 3: Auto-Revert
```typescript
test("should revert to copy icon after delay", async () => {
  jest.useFakeTimers();
  render(<CodeCell coupon={{ id: "123", code: "SAVE20" }} />);
  
  const button = screen.getByRole("button");
  fireEvent.click(button);
  
  // Check icon visible immediately
  expect(screen.getByTestId("check-icon")).toHaveClass("opacity-100");
  
  // Advance timer
  jest.advanceTimersByTime(1500);
  
  // Copy icon visible after delay
  expect(screen.getByTestId("copy-icon")).toHaveClass("opacity-100");
  
  jest.useRealTimers();
});
```

## CSS Animation Explanation

### Smooth Scale Transition
```css
scale: 0;           /* Start: 0% size (invisible, centered) */
scale: 100;         /* End: 100% size (visible, normal) */
transition: 200ms;  /* Smooth animation over 200ms */
```

### Smooth Opacity Transition
```css
opacity: 0;         /* Start: 0% opacity (transparent) */
opacity: 100;       /* End: 100% opacity (visible) */
transition: 200ms;  /* Smooth animation over 200ms */
```

### Combined Effect
```css
opacity: 0 → 100;   /* Fade in */
scale: 0 → 100;     /* Grow */
= Smooth appearance effect (like content "popping in")
```

---

## Ready to Use!

Copy these snippets into your own components. Just remember:

✅ **Always pass `itemId`** for per-row state tracking
✅ **Use `coupon.id`** as the item identifier
✅ **Set appropriate `resetDelay`** (1500ms recommended)
✅ **Update `aria-label`** based on `isCopied`
✅ **Disable button** during feedback state
✅ **Update tooltip** to show "Copied!"

