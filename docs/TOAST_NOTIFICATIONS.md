# Toast Notifications Guide

This project uses [Sonner](https://sonner.emilkowal.ski/) for toast notifications, configured to match the project's theme and design system.

## Quick Start

Import the toast utility and use it anywhere in your application:

```tsx
import { toast } from '@/lib/toast';

// Success notification
toast.success('Operation completed!');

// Error notification
toast.error('Something went wrong');

// Warning notification
toast.warning('Please check your input');

// Info notification
toast.info('New update available');
```

## API Reference

### Basic Notifications

#### `toast.success(message, description?)`
Show a success notification with a green checkmark icon.

```tsx
toast.success('Category created successfully');
toast.success('Category created', 'The new category has been added to your catalog.');
```

#### `toast.error(message, description?)`
Show an error notification with a red X icon.

```tsx
toast.error('Failed to save');
toast.error('Failed to save', 'Please check your connection and try again.');
```

#### `toast.warning(message, description?)`
Show a warning notification with a yellow warning icon.

```tsx
toast.warning('Please fill all required fields');
toast.warning('Unsaved changes', 'You have unsaved changes that will be lost.');
```

#### `toast.info(message, description?)`
Show an info notification with a blue info icon.

```tsx
toast.info('New features available');
toast.info('Update available', 'A new version of the app is ready to install.');
```

#### `toast.loading(message, description?)`
Show a loading notification with a spinner icon.

```tsx
const toastId = toast.loading('Saving changes...');
// Later dismiss it
toast.dismiss(toastId);
```

### Advanced Usage

#### Promise-based Toasts
Automatically update toast based on promise state:

```tsx
toast.promise(
  saveCategory(data),
  {
    loading: 'Saving category...',
    success: 'Category saved successfully!',
    error: 'Failed to save category',
  }
);

// With dynamic messages
toast.promise(
  fetchUser(id),
  {
    loading: 'Loading user...',
    success: (user) => `Welcome back, ${user.name}!`,
    error: (err) => `Error: ${err.message}`,
  }
);
```

#### Custom Toast
Full control over toast appearance and behavior:

```tsx
toast.custom('Custom message', {
  duration: 5000,
  position: 'top-center',
  className: 'my-custom-class',
});
```

#### Dismiss Toasts
```tsx
// Dismiss a specific toast
const toastId = toast.success('Saved!');
toast.dismiss(toastId);

// Dismiss all toasts
toast.dismiss();
```

## Configuration

### Global Setup

The Toaster component is already configured in `App.tsx`:

```tsx
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      <AppRouter />
      <Toaster />
    </>
  );
}
```

### Theme Integration

Toast notifications automatically adapt to your theme:
- Uses CSS variables from `index.css`
- Supports light and dark modes
- Matches your color scheme (primary, destructive, muted, etc.)
- Uses your project's font (Geist Variable)
- Respects your border radius settings

### Customization

To customize toast appearance, edit `/src/index.css`:

```css
/* Sonner Toast Styles */
[data-sonner-toast] {
  background: var(--popover) !important;
  border: 1px solid var(--border) !important;
  /* Add your custom styles */
}
```

## Best Practices

### 1. Use Appropriate Toast Types
- **Success**: Completed actions (saved, deleted, updated)
- **Error**: Failed operations, validation errors
- **Warning**: Cautionary messages, confirmations needed
- **Info**: General information, tips, updates

### 2. Keep Messages Concise
```tsx
// Good
toast.success('Category saved');

// Better with description
toast.success('Category saved', 'Your changes have been applied.');

// Avoid
toast.success('Your category has been successfully saved to the database and is now available in the system');
```

### 3. Use Promise Toasts for Async Operations
```tsx
// Instead of manual loading states
const handleSave = async () => {
  toast.promise(
    saveData(),
    {
      loading: 'Saving...',
      success: 'Saved!',
      error: 'Failed to save',
    }
  );
};
```

### 4. Provide Actionable Error Messages
```tsx
// Good
toast.error('Failed to save', 'Please check your connection and try again.');

// Avoid
toast.error('Error');
```

### 5. Don't Overuse Toasts
- Avoid showing toasts for every minor action
- Don't stack multiple toasts at once
- Use inline validation for form errors when possible

## Examples

### Form Submission
```tsx
const handleSubmit = async (data: FormData) => {
  try {
    await createCategory(data).unwrap();
    toast.success('Category created', 'The new category has been added.');
    onClose();
  } catch (error) {
    toast.error('Failed to create category', 'Please try again.');
  }
};
```

### Delete Confirmation
```tsx
const handleDelete = async (id: string) => {
  if (!confirm('Are you sure?')) return;
  
  try {
    await deleteCategory(id).unwrap();
    toast.success('Category deleted');
  } catch (error) {
    toast.error('Failed to delete category');
  }
};
```

### Bulk Operations
```tsx
const handleBulkUpdate = async (ids: string[]) => {
  toast.promise(
    updateMultiple(ids),
    {
      loading: `Updating ${ids.length} items...`,
      success: `Successfully updated ${ids.length} items`,
      error: 'Some items failed to update',
    }
  );
};
```

## Troubleshooting

### Toasts Not Appearing
1. Ensure `<Toaster />` is in your `App.tsx`
2. Check that you're importing from `@/lib/toast`
3. Verify no CSS is hiding the toasts

### Styling Issues
1. Check `index.css` for Sonner styles
2. Ensure CSS variables are defined in `:root`
3. Verify no conflicting z-index values

### TypeScript Errors
```tsx
// Ensure proper imports
import { toast } from '@/lib/toast';

// Not from sonner directly
// import { toast } from 'sonner'; // ❌
```

## Resources

- [Sonner Documentation](https://sonner.emilkowal.ski/)
- [Project Toast Utility](/src/lib/toast.ts)
- [Toast Component](/src/components/ui/sonner.tsx)
- [Theme Configuration](/src/index.css)
