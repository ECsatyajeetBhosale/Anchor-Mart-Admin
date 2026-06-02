import { StarIcon } from "lucide-react";
import { AppDrawer } from "@/components/ui/app-drawer";
import { Badge } from "@/components/ui/badge";
import type { Product } from "../types/product";

interface ProductDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDrawer({ product, isOpen, onClose }: ProductDrawerProps) {
  if (!product) return null;

  const imageUrl = product.images && product.images.length > 0 ? product.images[0].image : "";

  const rating = Number(product.average_rating) || 0.0;

  return (
    <AppDrawer
      open={isOpen}
      onClose={onClose}
      title={product.name}
      description="Product details and information"
      defaultWidth={512}
      bodyClassName="space-y-6"
    >
      {/* Product Image */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-foreground">Image</div>
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-48 rounded-lg object-cover border border-border"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e5e7eb' width='200' height='200'/%3E%3C/svg%3E";
          }}
        />
      </div>

      {/* Name */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-foreground">Product Name</div>
        <p className="text-sm text-muted-foreground">{product.name}</p>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-foreground">Category</div>
        <p className="text-sm text-muted-foreground">{product.category_name}</p>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-foreground">Price</div>
        <p className="text-sm text-foreground font-medium">₹ {product.base_price}</p>
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-foreground">Rating</div>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <StarIcon className="size-3.5 fill-yellow-400 text-yellow-400" />
          {rating.toFixed(1)}
        </p>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-foreground">Status</div>
        <Badge
          variant={product.is_active ? "default" : "destructive"}
          className={
            product.is_active
              ? ""
              : "bg-red-100 text-red-600 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
          }
        >
          {product.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* All Images */}
      {product.images && product.images.length > 1 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-foreground">
            All Images ({product.images.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {product.images.map((img, index) => (
              <img
                key={img.id ?? index}
                src={img.image}
                alt={img.alt_text || `${product.name} image ${index + 1}`}
                className="w-16 h-16 rounded object-cover border border-border"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23e5e7eb' width='64' height='64'/%3E%3C/svg%3E";
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Created At */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-foreground">Created At</div>
        <p className="text-sm text-muted-foreground">{product.created_at}</p>
      </div>
    </AppDrawer>
  );
}
