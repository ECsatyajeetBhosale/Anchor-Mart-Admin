import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "@/lib/constants";
import { APP_TEXT } from "@/lib/messages";

const navItems = [
  {
    label: "Dashboard",
    href: APP_ROUTES.HOME,
    icon: DashboardIcon,
    active: true,
  },
  { label: "Orders", href: "#", icon: OrdersIcon, active: false },
  { label: "Products", href: "#", icon: BoxIcon, active: false },
  { label: "Customers", href: "#", icon: UsersIcon, active: false },
  { label: "Reports", href: "#", icon: ChartIcon, active: false },
] as const;

export function AppSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setIsMobileOpen((open) => !open);
      return;
    }

    setIsExpanded((expanded) => !expanded);
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [toggleSidebar]);

  return (
    <>
      <button
        type="button"
        aria-label="Toggle sidebar"
        aria-expanded={isMobileOpen || isExpanded}
        onClick={toggleSidebar}
        className="fixed left-4 top-4 z-40 inline-flex size-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 md:hidden"
      >
        <MenuIcon />
      </button>

      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-gray-950/20 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex border-r border-gray-200 bg-white transition-[width,transform] duration-300 ease-in-out",
          "md:sticky md:top-0 md:z-20 md:h-screen md:translate-x-0",
          isExpanded ? "md:w-64" : "md:w-[4.5rem]",
          isMobileOpen ? "translate-x-0 w-72 shadow-xl" : "-translate-x-full w-72 md:shadow-none",
        ].join(" ")}
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-16 items-center gap-3 border-b border-gray-100 px-3">
            <Link
              to={APP_ROUTES.HOME}
              className="flex min-w-0 items-center gap-3 rounded-md px-2 py-1.5 text-gray-900 transition hover:bg-gray-50"
              onClick={() => setIsMobileOpen(false)}
            >
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-950 text-sm font-semibold text-white">
                AM
              </span>
              <span
                className={[
                  "truncate text-sm font-semibold tracking-tight transition-opacity duration-200",
                  isExpanded ? "md:opacity-100" : "md:pointer-events-none md:opacity-0",
                ].join(" ")}
              >
                {APP_TEXT.BRAND_NAME}
              </span>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <SidebarGroup title="Workspace" isExpanded={isExpanded}>
              {navItems.map((item) => (
                <SidebarLink
                  key={item.label}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={item.active}
                  isExpanded={isExpanded}
                  onNavigate={() => setIsMobileOpen(false)}
                />
              ))}
            </SidebarGroup>
          </nav>

          <div className="border-t border-gray-100 p-3">
            <SidebarLink
              href="#"
              label="Settings"
              icon={SettingsIcon}
              isExpanded={isExpanded}
              onNavigate={() => setIsMobileOpen(false)}
            />
          </div>
        </div>

        <button
          type="button"
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 hidden h-9 w-6 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 md:flex"
        >
          <ChevronIcon className={isExpanded ? "rotate-180" : ""} />
        </button>
      </aside>
    </>
  );
}

function SidebarGroup({
  title,
  isExpanded,
  children,
}: {
  title: string;
  isExpanded: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div
        className={[
          "px-2 pb-2 text-xs font-medium uppercase tracking-wide text-gray-400 transition-opacity duration-200",
          isExpanded ? "md:opacity-100" : "md:opacity-0",
        ].join(" ")}
      >
        {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SidebarLink({
  href,
  label,
  icon: Icon,
  active = false,
  isExpanded,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: IconComponent;
  active?: boolean;
  isExpanded: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      to={href}
      title={isExpanded ? undefined : label}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={[
        "group flex h-10 items-center gap-3 rounded-md px-2 text-sm font-medium transition-colors",
        active ? "bg-gray-100 text-gray-950" : "text-gray-600 hover:bg-gray-50 hover:text-gray-950",
      ].join(" ")}
    >
      <Icon className="size-5 shrink-0" />
      <span
        className={[
          "truncate transition-opacity duration-200",
          isExpanded ? "md:opacity-100" : "md:pointer-events-none md:opacity-0",
        ].join(" ")}
      >
        {label}
      </span>
    </Link>
  );
}

type IconComponent = (props: { className?: string }) => React.ReactNode;

function MenuIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`size-4 transition-transform duration-300 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m9 18 6-6-6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashboardIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5.5A1.5 1.5 0 0 1 5.5 4h4A1.5 1.5 0 0 1 11 5.5v4A1.5 1.5 0 0 1 9.5 11h-4A1.5 1.5 0 0 1 4 9.5v-4ZM13 5.5A1.5 1.5 0 0 1 14.5 4h4A1.5 1.5 0 0 1 20 5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4A1.5 1.5 0 0 1 13 9.5v-4ZM4 14.5A1.5 1.5 0 0 1 5.5 13h4a1.5 1.5 0 0 1 1.5 1.5v4A1.5 1.5 0 0 1 9.5 20h-4A1.5 1.5 0 0 1 4 18.5v-4ZM13 14.5a1.5 1.5 0 0 1 1.5-1.5h4a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a1.5 1.5 0 0 1-1.5-1.5v-4Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function OrdersIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 8h10M7 12h10M7 16h6M5.5 3.5h13A1.5 1.5 0 0 1 20 5v14l-3-1.5-2.5 1.5L12 17.5 9.5 19 7 17.5 4 19V5a1.5 1.5 0 0 1 1.5-1.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BoxIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3ZM4.5 8 12 12.3 19.5 8M12 21v-8.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UsersIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16 20v-1.5c0-1.7-1.8-3-4-3s-4 1.3-4 3V20M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.5 20v-1.2c0-1.3-1-2.4-2.5-2.9M17 6.3a2.5 2.5 0 0 1 0 4.9M4.5 20v-1.2c0-1.3 1-2.4 2.5-2.9M7 6.3a2.5 2.5 0 0 0 0 4.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChartIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 19.5h16M7 16v-5M12 16V6M17 16v-8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SettingsIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM19.4 13.5a7.8 7.8 0 0 0 .1-1.5 7.8 7.8 0 0 0-.1-1.5l2-1.5-2-3.5-2.4 1a8 8 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.5A8 8 0 0 0 7 6.5l-2.4-1-2 3.5 2 1.5a7.8 7.8 0 0 0-.1 1.5c0 .5 0 1 .1 1.5l-2 1.5 2 3.5 2.4-1a8 8 0 0 0 2.6 1.5l.4 2.5h4l.4-2.5a8 8 0 0 0 2.6-1.5l2.4 1 2-3.5-2-1.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
