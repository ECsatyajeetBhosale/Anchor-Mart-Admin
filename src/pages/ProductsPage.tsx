import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { APP_ROUTES } from "@/lib/constants";

export function ProductsPage() {
  return (
    <div className="flex h-full w-full flex-col space-y-4 bg-background">
      <div className="px-4 py-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={APP_ROUTES.DASHBOARD}>Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex-1 px-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <h1 className="text-sm font-semibold text-foreground">Products</h1>
          <p className="mt-2 text-xs text-muted-foreground">Product management page coming soon.</p>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
