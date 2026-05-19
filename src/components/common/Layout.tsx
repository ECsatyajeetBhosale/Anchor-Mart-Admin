/**
 * components/common/Layout.tsx
 *
 * The main page wrapper — wraps every page with the Header and a
 * centred content area.
 *
 * Usage in AppRouter.tsx:
 *   <Route element={<Layout />}>
 *     <Route path="/" element={<HomePage />} />
 *   </Route>
 *
 * React Router's <Outlet /> is where the child page gets rendered.
 */

import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "./Header";

export function Layout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          {/* Persistent top navigation */}
          <Header leftSlot={<SidebarTrigger className="-ml-1" />} />

          {/* Page content — React Router renders the matching child route here */}
          <main className="mx-auto w-full flex-1 px-2 py-4">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
