import { EditIcon, EyeIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AppTooltip } from "@/components/ui/app-tooltip";
import { Badge } from "@/components/ui/badge";
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      await deleteCategory(category.id).unwrap();
      showToast("Category deleted successfully", "success", 2500);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Delete category error:", error);
      showToast("Failed to delete category", "error", 3000);
    }
  };

  return (
    <>
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
          <Badge variant={category.is_active ? "default" : "destructive"}>
            {category.is_active ? "Active" : "Inactive"}
          </Badge>
        </td>
        <td className="px-3 py-2 text-right">
          <div className="flex items-center justify-end gap-1">
            <AppTooltip content="View details">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onViewDetails(category)}
              >
                <EyeIcon className="size-3.5" />
              </Button>
            </AppTooltip>
            <AppTooltip content="Edit category">
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => onEdit(category)}>
                <EditIcon className="size-3.5" />
              </Button>
            </AppTooltip>
            <AppTooltip content="Delete category">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
              >
                <TrashIcon className="size-3.5" />
              </Button>
            </AppTooltip>
          </div>
        </td>
      </tr>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{category.name}</strong>? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
