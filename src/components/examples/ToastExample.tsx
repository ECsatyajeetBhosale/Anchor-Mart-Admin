/**
 * ToastExample.tsx
 *
 * Example component demonstrating all toast notification types.
 * This is for reference only - not used in production.
 */

import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";

export function ToastExample() {
  const handleSuccess = () => {
    toast.success("Operation successful", "Your changes have been saved.");
  };

  const handleError = () => {
    toast.error("Operation failed", "An error occurred. Please try again.");
  };

  const handleWarning = () => {
    toast.warning("Warning message", "Please review your input before continuing.");
  };

  const handleInfo = () => {
    toast.info("Information", "New features are now available.");
  };

  const handleLoading = () => {
    const toastId = toast.loading("Processing...", "Please wait while we complete your request.");

    // Simulate async operation
    setTimeout(() => {
      toast.dismiss(toastId);
      toast.success("Complete!", "The operation finished successfully.");
    }, 3000);
  };

  const handlePromise = () => {
    const mockApiCall = () =>
      new Promise((resolve) => {
        setTimeout(() => resolve({ name: "John Doe" }), 2000);
      });

    toast.promise(mockApiCall(), {
      loading: "Loading data...",
      success: "Data loaded successfully!",
      error: "Failed to load data",
    });
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Toast Notification Examples</h2>

      <div className="grid grid-cols-2 gap-4 max-w-md">
        <Button onClick={handleSuccess} variant="default">
          Success Toast
        </Button>

        <Button onClick={handleError} variant="destructive">
          Error Toast
        </Button>

        <Button onClick={handleWarning} variant="outline">
          Warning Toast
        </Button>

        <Button onClick={handleInfo} variant="secondary">
          Info Toast
        </Button>

        <Button onClick={handleLoading} variant="outline">
          Loading Toast
        </Button>

        <Button onClick={handlePromise} variant="default">
          Promise Toast
        </Button>
      </div>
    </div>
  );
}
