"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faUsers,
  faCalendarAlt,
  faCreditCard,
  faChartBar,
  faClipboardList,
  faCircleQuestion,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useVendorMe } from "@/hooks/use-vendors";
import { resolveMediaUrl } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard",    href: "/dashboard",     icon: faChartPie },
  { label: "Clients",      href: "/clients",       icon: faUsers },
  { label: "Events",       href: "/events",        icon: faCalendarAlt },
  { label: "Payments",     href: "/payments",      icon: faCreditCard },
  { label: "Reports",      href: "/reports",       icon: faChartBar },
  { label: "Activity Log", href: "/activity-log",  icon: faClipboardList },
  { label: "Help",         href: "/help",          icon: faCircleQuestion },
  { label: "Profile",      href: "/profile",       icon: faUser },
];

export function VendorSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [mounted, setMounted] = React.useState(false);
  const { data: vendor } = useVendorMe();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Sidebar collapsible="icon" className="border-none bg-sidebar" {...props}>
      {/* Header / Logo */}
      <SidebarHeader
        className={`sticky top-0 z-50 h-[56px] border-none flex flex-col justify-center bg-sidebar/95 backdrop-blur-sm transition-all duration-300 ${
          isCollapsed ? "px-1.5" : "pl-3 pr-4"
        }`}
      >
        <Link
          href="/dashboard"
          className={`flex items-center no-underline relative w-full h-10 overflow-hidden ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
        >
          {/* Icon logo (collapsed) */}
          <div
            className={`h-9 w-9 shrink-0 border-none rounded-sm overflow-hidden shadow-[0_4px_12px_rgba(52,84,209,0.3)] relative transition-all duration-300 flex items-center justify-center
              ${isCollapsed
                ? "opacity-100 scale-100 translate-x-0 rotate-0"
                : "opacity-0 scale-50 -translate-x-10 -rotate-12 absolute"
              }`}
          >
            <Image src="/ra_logo.png" alt="Logo" fill priority className="object-cover rounded-none" />
          </div>

          {/* Text (expanded) */}
          <div
            className={`flex flex-col transition-all duration-300 h-full justify-center whitespace-nowrap
              ${!isCollapsed ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 absolute pointer-events-none"}`}
          >
            <h1 className="text-[19px] font-extrabold tracking-tight text-sidebar-foreground dark:text-gray-100 m-0 p-0 leading-none">
              Vendor Portal
            </h1>
            {vendor?.company_name && (
              <p className="text-[10px] font-bold uppercase tracking-[1px] text-muted-foreground dark:text-gray-400 m-0 p-0 mt-1 truncate max-w-[140px]">
                {vendor.company_name}
              </p>
            )}
          </div>
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent
        className={`py-4 bg-sidebar transition-all duration-300 ${isCollapsed ? "px-1" : "px-4"}`}
      >
        <SidebarGroup className="p-0">
          <SidebarMenu className="gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.label}
                    className={`h-[34px] rounded-sm transition-all duration-200 !outline-none !ring-0 focus-visible:ring-0 active:bg-transparent ${
                      isActive
                        ? "text-primary-foreground dark:text-white font-bold bg-primary dark:bg-primary drop-shadow-sm"
                        : "bg-transparent text-sidebar-foreground/70 dark:text-gray-400 hover:bg-sidebar-accent dark:hover:bg-white/10 hover:text-sidebar-accent-foreground dark:hover:text-white"
                    } ${isCollapsed ? "px-0 justify-center" : "px-3.5"}`}
                  >
                    <Link href={item.href} className="flex items-center gap-2.5 w-full">
                      <div className={`flex items-center justify-center ${isCollapsed ? "w-full px-1" : "gap-0.5"}`}>
                        <FontAwesomeIcon
                          icon={item.icon}
                          className={`!size-[14px] transition-colors ${
                            isActive
                              ? "text-primary-foreground dark:text-white"
                              : "text-sidebar-foreground/70 dark:text-gray-400 group-hover:text-sidebar-accent-foreground dark:group-hover:text-white"
                          }`}
                        />
                      </div>
                      <span className="text-[12px] font-semibold group-data-[collapsible=icon]:hidden">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
