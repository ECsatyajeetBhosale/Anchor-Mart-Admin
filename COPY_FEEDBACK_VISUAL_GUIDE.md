# Copy Feedback - Visual Implementation Guide

## Component Architecture

```
CouponRow
├── CouponRowActions
│   ├── CodeCell
│   │   └── Copy Button (with dual-icon animation)
│   │       ├── useCopyToClipboard(coupon.id, 1500)
│   │       └── Icon Transition:
│   │           ├── Copy Icon (default)
│   │           └── Check Icon (on copied, 1.5s)
│   └── ActionButtons
│       ├── View Button
│       ├── Edit Button
│       └── Delete Button
```

## State Flow Diagram

```
INITIAL STATE
    ↓
User hovers over row
    ↓
Copy icon appears (opacity: 0 → 100)
    ↓
User clicks copy icon
    ↓
useCopyToClipboard(coupon.id) triggered
    ├─ Copies code to clipboard
    ├─ Sets isCopied = true for this coupon ID
    └─ Sets timer for 1500ms
    ↓
Icon Animation (200ms):
    ├─ Copy icon: opacity 100 → 0, scale 100 → 0
    └─ Check icon: opacity 0 → 100, scale 0 → 100
    ↓
Feedback State (1500ms):
    ├─ Green check icon visible
    ├─ Tooltip shows "Copied!"
    ├─ Button is disabled
    └─ Other rows unaffected
    ↓
Timer expires
    ├─ Sets isCopied = false
    └─ Triggers revert animation
    ↓
Icon Animation (200ms):
    ├─ Check icon: opacity 100 → 0, scale 100 → 0
    └─ Copy icon: opacity 0 → 100, scale 0 → 100
    ↓
BACK TO INITIAL STATE
    └─ Button re-enabled, ready for next interaction
```

## CSS Animation Details

### Copy Icon (Fade Out + Scale Down)
```css
opacity: 100 → 0
scale: 100 → 0
duration: 200ms
transition: all ease
```

### Check Icon (Fade In + Scale Up)
```css
opacity: 0 → 100
scale: 0 → 100
duration: 200ms
transition: all ease
color: text-green-600 (light) / text-green-500 (dark)
```

## Hook Implementation Detail

### Before (Global State - Bug)
```typescript
// ❌ All rows affected
const [isCopied, setIsCopied] = useState(false);

// When row 1 copies, ALL rows show copied state
await copyToClipboard("CODE123");  // Affects all rows
```

### After (Per-Item State - Fixed)
```typescript
// ✅ Each row has independent state
const [copiedId, setCopiedId] = useState<string | null>(null);

// When row 1 copies (id='row1'), only row 1 shows copied state
await copyToClipboard("CODE123", "row1");  // Only affects row 1
// copiedId === "row1" ? show check icon : show copy icon
```

## Usage Example

```tsx
// In CodeCell component
function CodeCell({ coupon }: { coupon: Coupon }) {
  // Pass unique identifier (coupon.id) for per-item tracking
  // Second parameter: reset delay in milliseconds (default: 1500)
  const { isCopied, copyToClipboard } = useCopyToClipboard(coupon.id, 1500);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await copyToClipboard(coupon.code);
    // State automatically managed by hook
    // isCopied will be true for 1.5 seconds
  };

  return (
    <div className="flex items-center gap-2 group">
      <code>{coupon.code}</code>
      <button
        onClick={handleCopy}
        disabled={isCopied}  // Prevent multiple clicks
        aria-label={isCopied ? "Copied" : "Copy coupon code"}
      >
        <div className="relative">
          {/* Copy icon fades out when copied */}
          <Copy className={isCopied ? "opacity-0 scale-0" : "opacity-100 scale-100"} />
          
          {/* Check icon fades in when copied */}
          <Check className={isCopied ? "opacity-100 scale-100" : "opacity-0 scale-0"} />
        </div>
      </button>
    </div>
  );
}
```

## Multi-Row Interaction Example

### Scenario: User clicks copy in Row 1, then Row 2 while Row 1 still showing checkmark

```
Timeline:
t=0ms:     Row 1 copy clicked
           Row 1: isCopied = true, shows checkmark ✓
           Row 2: isCopied = false, shows copy icon

t=750ms:   Row 2 copy clicked (Row 1 timer still running)
           Row 1: isCopied = true, shows checkmark ✓ (independent timer)
           Row 2: isCopied = true, shows checkmark ✓ (new timer starts)

t=1500ms:  Row 1 timer expires
           Row 1: isCopied = false, reverts to copy icon
           Row 2: isCopied = true, still shows checkmark ✓ (750ms remaining)

t=2250ms:  Row 2 timer expires
           Row 1: isCopied = false, shows copy icon
           Row 2: isCopied = false, reverts to copy icon
```

## Dark Mode Support

```tsx
<Check
  className={`
    text-green-600        // Light mode: bright green
    dark:text-green-500   // Dark mode: slightly lighter green for better contrast
    transition-all duration-200
    ${isCopied ? "opacity-100 scale-100" : "opacity-0 scale-0"}
  `}
/>
```

## Accessibility Features

1. **Semantic HTML**
   - Uses `<button>` element (not `<div>`)
   - Proper `type="button"` attribute

2. **ARIA Attributes**
   - Dynamic `aria-label`: Updates based on state
   - Tooltip via `TooltipContent` component

3. **Keyboard Support**
   - Full keyboard navigation (Tab key)
   - Activate with Enter/Space (native browser behavior)
   - Focus visible with outline/ring

4. **Button States**
   - `disabled={isCopied}` - Prevents multiple rapid clicks
   - Visual feedback through color and icon change
   - Tooltip text changes

5. **Motion Preferences** (Recommended Future Addition)
   ```tsx
   const prefersReducedMotion = window.matchMedia(
     "(prefers-reduced-motion: reduce)"
   ).matches;
   
   const duration = prefersReducedMotion ? "0" : "200";
   ```

## Browser Compatibility

- ✅ Chrome 66+
- ✅ Firefox 63+
- ✅ Safari 13.1+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Uses `navigator.clipboard.writeText()` with error handling for graceful degradation.

## Performance Considerations

- ✅ Zero additional API calls
- ✅ Lightweight hook (simple useState + useCallback)
- ✅ No unnecessary re-renders due to per-item state
- ✅ CSS animations run on GPU (transform + opacity)
- ✅ No memory leaks (timer properly cleared)

## Common Issues & Solutions

### Issue: All rows show checkmark at the same time
**Cause:** Using `useCopyToClipboard()` without `coupon.id`
**Solution:** Pass coupon ID: `useCopyToClipboard(coupon.id, 1500)`

### Issue: Checkmark doesn't disappear
**Cause:** Timer not being set correctly
**Solution:** Verify `resetDelay` parameter is passed and valid

### Issue: Animation is jerky
**Cause:** Using `left`/`top` for positioning instead of absolute
**Solution:** Use `absolute inset-0` positioning for GPU acceleration

### Issue: Check icon color invisible on certain backgrounds
**Cause:** Color not providing enough contrast
**Solution:** Use `text-green-600` (light) and `text-green-500` (dark)

