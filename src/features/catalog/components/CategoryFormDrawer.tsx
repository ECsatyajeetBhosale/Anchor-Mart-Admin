import { useEffect, useState } from "react";
import { AppFormDrawer } from "@/components/ui/app-drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/lib/toast";
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
      toast.warning("Please fill all required fields");
      return;
    }

    try {
      if (isEditMode && category) {
        const updatePayload: CategoryPayload = {
          name: form.name.trim(),
          description: form.description.trim(),
          image: "category_images/image.png",
          is_active: form.is_active,
        };
        await updateCategory({ id: category.id, payload: updatePayload }).unwrap();
        toast.success("Category updated successfully");
      } else {
        const createPayload: CategoryPayload = {
          name: form.name.trim(),
          description: form.description.trim(),
          image: "category_images/image.png",
        };
        await addCategory(createPayload).unwrap();
        toast.success("Category created successfully");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Category operation error:", error);
      toast.error(`Failed to ${isEditMode ? "update" : "create"} category`);
    }
  };

  return (
    <AppFormDrawer
      open={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={isEditMode ? "Edit Category" : "Create Category"}
      description={
        isEditMode
          ? "Update category details and settings."
          : "Add a new product category to your catalog."
      }
      defaultWidth={512}
      bodyClassName="space-y-5"
      footer={
        <>
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
        </>
      }
    >
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

      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="category-active" className="text-xs font-normal cursor-pointer">
          Active category
        </Label>
        <Switch
          id="category-active"
          checked={form.is_active}
          onCheckedChange={(checked) => updateField("is_active", checked)}
        />
      </div>
    </AppFormDrawer>
  );
}
