import { AppDrawer } from "@/components/ui/app-drawer";
import type { Category } from "../types/category";

interface CategoryDrawerProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryDrawer({ category, isOpen, onClose }: CategoryDrawerProps) {
  if (!category) return null;

  return (
    <AppDrawer
      open={isOpen}
      onClose={onClose}
      title={category.name}
      description="Category details and information"
      defaultWidth={512}
      bodyClassName="space-y-6"
    >
      {/* Image */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-foreground">Image</div>
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-48 rounded-lg object-cover border border-border"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e5e7eb' width='200' height='200'/%3E%3C/svg%3E";
          }}
        />
      </div>

      {/* Name */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-foreground">Name</div>
        <p className="text-sm text-muted-foreground">{category.name}</p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-foreground">Description</div>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{category.description}</p>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-foreground">Status</div>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            category.is_active
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
          }`}
        >
          {category.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Created At */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-foreground">Created At</div>
        <p className="text-sm text-muted-foreground">{category.created_at}</p>
      </div>

      {/* Updated At */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-foreground">Updated At</div>
        <p className="text-sm text-muted-foreground">{category.updated_at}</p>
      </div>
    </AppDrawer>
  );
}
