import { useEffect, useState } from "react";
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
import { useAddCategoryMutation, useUpdateCategoryMutation } from "../api/categoryApi";
import type { Category, CategoryPayload } from "../types/category";

interface CategoryFormDrawerProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type CategoryFormState = {
  name: string;
  description: string;
  image: string;
  is_active: boolean;
};

const emptyForm: CategoryFormState = {
  name: "",
  description: "",
  image: "category_images/image.png",
  is_active: true,
};

function getFormState(category: Category | null): CategoryFormState {
  if (!category) return emptyForm;

  return {
    name: category.name || "",
    description: category.description || "",
    image: category.image || "category_images/image.png",
    is_active: category.is_active ?? true,
  };
}

export function CategoryFormDrawer({
  category,
  isOpen,
  onClose,
  onSuccess,
}: CategoryFormDrawerProps) {
  const { showToast } = useToast();
  const [form, setForm] = useState<CategoryFormState>(() => getFormState(category));
  const [addCategory, { isLoading: isCreating }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const isEditMode = Boolean(category);
  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (isOpen) {
      setForm(getFormState(category));
    }
  }, [category, isOpen]);

  const isValid = form.name.trim() && form.description.trim();

  const updateField = <K extends keyof CategoryFormState>(key: K, value: CategoryFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid) {
      showToast("Please fill all required fields", "warning", 2500);
      return;
    }

    try {
      if (isEditMode && category) {
        const updatePayload: CategoryPayload = {
          name: form.name.trim(),
          description: form.description.trim(),
          image: form.image.trim() || "category_images/image.png",
          is_active: form.is_active,
        };
        await updateCategory({ id: category.id, payload: updatePayload }).unwrap();
        showToast("Category updated successfully", "success", 2500);
      } else {
        const createPayload: CategoryPayload = {
          name: form.name.trim(),
          description: form.description.trim(),
          image: form.image.trim() || "category_images/image.png",
        };
        await addCategory(createPayload).unwrap();
        showToast("Category created successfully", "success", 2500);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Category operation error:", error);
      showToast(`Failed to ${isEditMode ? "update" : "create"} category`, "error", 3000);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg bg-card p-0">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <SheetHeader className="border-b border-border bg-muted/20 p-6">
            <SheetTitle className="text-sm font-semibold">
              {isEditMode ? "Edit Category" : "Create Category"}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              {isEditMode
                ? "Update category details and settings."
                : "Add a new product category to your catalog."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-5 overflow-y-auto p-6">
            <div className="space-y-1.5">
              <Label htmlFor="category-name" className="text-xs">
                Name
              </Label>
              <Input
                id="category-name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="e.g., Fitness"
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category-description" className="text-xs">
                Description
              </Label>
              <textarea
                id="category-description"
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Enter category description"
                className="h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category-image" className="text-xs">
                Image Path
              </Label>
              <Input
                id="category-image"
                value={form.image}
                onChange={(event) => updateField("image", event.target.value)}
                placeholder="category_images/image.png"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) => updateField("is_active", event.target.checked)}
                  className="size-3.5 rounded border-input"
                />
                Active category
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
              {isEditMode ? "Update Category" : "Create Category"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
