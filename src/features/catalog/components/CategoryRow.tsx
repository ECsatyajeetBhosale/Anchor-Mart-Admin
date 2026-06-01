import { EditIcon, EyeIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useDeleteCategoryMutation } from "../api/categoryApi";
import type { Category } from "../types/category";

interface CategoryRowProps {
  category: Category;
  onViewDetails: (category: Category) => void;
  onEdit: (category: Category) => void;
}

export function CategoryRow({ category, onViewDetails, onEdit }: CategoryRowProps) {
  const { showToast } = useToast();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return;
    }

    try {
      await deleteCategory(category.id).unwrap();
      showToast("Category deleted successfully", "success", 2500);
    } catch (error) {
      console.error("Delete category error:", error);
      showToast("Failed to delete category", "error", 3000);
    }
  };
  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          <img
            src={category.image}
            alt={category.name}
            className="w-8 h-8 rounded object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect fill='%23e5e7eb' width='32' height='32'/%3E%3C/svg%3E";
            }}
          />
          <span className="font-medium text-foreground">{category.name}</span>
        </div>
      </td>
      <td className="px-3 py-2 text-muted-foreground">
        {category.description.length > 50
          ? `${category.description.substring(0, 50)}...`
          : category.description}
      </td>
      <td className="px-3 py-2 text-muted-foreground">{category.created_at}</td>
      <td className="px-3 py-2">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            category.is_active
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
          }`}
        >
          {category.is_active ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-3 py-2 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onViewDetails(category)}
            title="View details"
          >
            <EyeIcon className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(category)}
            title="Edit category"
          >
            <EditIcon className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete category"
          >
            <TrashIcon className="size-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
