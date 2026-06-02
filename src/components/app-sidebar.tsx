"use client";

import {
  BarChart3Icon,
  BoxesIcon,
  HomeIcon,
  ShoppingCartIcon,
  StoreIcon,
  TagsIcon,
  UsersIcon,
} from "lucide-react";
import type * as React from "react";
import { Link } from "react-router-dom";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/features/auth";
import { APP_ROUTES } from "@/lib/constants";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: APP_ROUTES.DASHBOARD,
      icon: <HomeIcon />,
      isActive: true,
    },
    {
      title: "Orders",
      url: "#",
      icon: <ShoppingCartIcon />,
      items: [
        {
          title: "All Orders",
          url: "#",
        },
        {
          title: "Pending",
          url: "#",
        },
        {
          title: "Returns",
          url: "#",
        },
      ],
    },
    {
      title: "Categories",
      url: APP_ROUTES.CATEGORIES,
      icon: <BoxesIcon />,
    },
  ],
  navSecondary: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={APP_ROUTES.HOME}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <StoreIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Anchor Mart</span>
                  <span className="truncate text-xs">Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name ?? "Admin",
            email: user?.email ?? "admin@anchormart.com",
            avatar: "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
