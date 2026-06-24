"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { resolveMediaUrl } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  LayoutDashboard,
  LineChart,
  Users,
  UserRound,
  MessagesSquare,
  Contact,

  Mail,
  MessageCircle,
  Bell,
  BarChart3,
  Receipt,
  Calendar,
  Plus,
  DollarSign,
  Settings,
  CreditCard,
  Sliders,
  Clock,
  ClipboardList,
  HelpCircle,
  Globe,
  Network,
  List,
  Home,
  Images,
  Briefcase,
  Layers,
  Star,
  Building2,
  type LucideIcon,
  Handshake,
  Palette,
  FileText,
  Shield,
  Puzzle,
  Link2,
} from "lucide-react";
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
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { useVendorMe } from "@/hooks/use-vendors";

interface SubChildItem {
  label: string;
  href: string;
  icon: LucideIcon;
  blockType?: string;
}

interface ChildItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  blockType?: string;
  children?: SubChildItem[];
}

interface NavItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  children?: ChildItem[];
  hidden?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "User Management",
    icon: Users,
    children: [
      { label: "Client",     href: "/clients",               icon: UserRound },
      { label: "Guest",      href: "/clients/guests",        icon: Users },
      { label: "Subscriber", href: "/clients/subscribers", icon: Mail },
    ],
  },
  { label: "Staff",
    href: "/staff",
    icon: UserRound,
  },
  { label: "Website Management", href: "/website-builder", icon: Globe },
  { label: "Sub Domain (Website)", href: "/sub-domain",   icon: Network },
  { label: "Templates",            href: "/templates",    icon: FileText },
  { label: "Invitations & Links",  href: "/invitations",  icon: Link2 },
  {
    label: "Communication",
    icon: MessagesSquare,
    children: [
      { label: "Contact",      href: "/communication/contact",      icon: Contact },
      { label: "Email",        href: "/communication/email",        icon: Mail },
      { label: "Chat",         href: "/communication/chat",         icon: MessageCircle },
      { label: "Notification", href: "/communication/notification", icon: Bell },
    ],
  },
  { label: "Reports",      href: "/reports",      icon: BarChart3 },
  {
    label: "Event",
    icon: Calendar,
    children: [
      { label: "Create an event", href: "/events/create", icon: Plus },
    ],
  },
  { label: "Payment",        href: "/payment-management", icon: DollarSign },
  { label: "Integrations",   href: "/integrations",       icon: Puzzle },
  { label: "Billing & Plan", href: "/billing",            icon: CreditCard },
  {
    label: "Settings",
    icon: Settings,
    children: [
      { label: "Roles",            href: "/roles",                      icon: Layers      },
      { label: "Modules",          href: "/modules",                    icon: ClipboardList },
      { label: "Department",       href: "/settings/department",        icon: Building2   },
      { label: "Payment Settings", href: "/settings/payments",          icon: CreditCard  },
      { label: "Configuration",    href: "/settings/config",            icon: Sliders     },
      { label: "Currency",         href: "/settings/currency",          icon: DollarSign  },
      { label: "Timezone",         href: "/settings/timezone",          icon: Clock       },
      { label: "Activity Log",     href: "/activity-log",               icon: ClipboardList },
    ],
  },
  {
    label: "Email Marketing",
    icon: Mail,
    children: [
      { label: "Email Template", icon: Mail,
        children: [
          { label: "Templates", href: "/newsletter/email-template", icon: Mail },
          { label: "Category",  href: "/newsletter/email-template/category", icon: List },
        ]
      },
      { label: "Newsletter", icon: Mail,
        children: [
          { label: "Email", href: "/newsletter/email", icon: List },
          { label: "Subscribers", href: "/newsletter/subscribers", icon: Users },
          { label: "Unsubscribers", href: "/newsletter/unsubscribers", icon: UserRound },
        ]
      },
    ]
  }
];

function isItemActive(item: NavItem, pathname: string): boolean {
  if (item.href && (pathname === item.href || pathname.startsWith(item.href + "/"))) return true;
  if (item.children) {
    return item.children.some((c) => {
      if (c.href && (pathname === c.href || pathname.startsWith(c.href + "/"))) return true;
      if (c.children) {
        return c.children.some(
          (sub) => pathname === sub.href || pathname.startsWith(sub.href + "/"),
        );
      }
      return false;
    });
  }
  return false;
}

export function VendorSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname    = usePathname();
  const router      = useRouter();
  const { state }   = useSidebar();
  const isCollapsed = state === "collapsed";
  const [mounted, setMounted] = React.useState(false);
  const { data: vendor } = useVendorMe();
  const activeBlockTypes = React.useMemo(() => new Set<string>(), []);

  const [openItems, setOpenItems] = React.useState<Set<string>>(() => {
    const initial = new Set<string>();
    NAV_ITEMS.filter((item) => !item.hidden).forEach((item) => {
      if (item.children && isItemActive(item, pathname)) {
        initial.add(item.label);
        item.children.forEach((child) => {
          if (
            child.children &&
            child.children.some(
              (sub) => pathname === sub.href || pathname.startsWith(sub.href + "/"),
            )
          ) {
            initial.add(child.label);
          }
        });
      }
    });
    return initial;
  });

  React.useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const toggleOpen = (label: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  // Filter a child list — remove block-gated items whose blockType isn't active.
  // For groups with sub-children, filter the sub-children and hide the group if all hidden.
  const filterChildren = (children: ChildItem[]): ChildItem[] =>
    children
      .map((child) => {
        if (child.children) {
          const filtered = child.children.filter(
            (sub) => !sub.blockType || activeBlockTypes.has(sub.blockType),
          );
          return { ...child, children: filtered };
        }
        return child;
      })
      .filter((child) => {
        if (child.blockType) return activeBlockTypes.has(child.blockType);
        if (child.children) return child.children.length > 0;
        return true;
      });

  const activeClass   = "bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)] font-semibold";
  const inactiveClass = "bg-transparent text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white";
  const btnBase       = "h-10 rounded-[var(--vendor-radius-control)] text-[var(--vendor-nav-text)] transition-all duration-200 !outline-none !ring-0 focus-visible:ring-0 active:bg-transparent";

  return (
    <Sidebar collapsible="icon" className="border-none bg-sidebar top-14 h-[calc(100svh-3.5rem)]" {...props}>
      {/* Brand card */}
      <SidebarHeader
        className={`border-none bg-sidebar transition-all duration-300 ${
          isCollapsed ? "px-1.5 py-3" : "px-3 pt-4 pb-2"
        }`}
      >
        {(() => {
          const vendorName = vendor?.name || vendor?.company_name || "Vendor";
          const vendorEmail = vendor?.email || "";
          const initials = vendorName
            .split(" ")
            .map((w) => w[0])
            .filter(Boolean)
            .slice(0, 2)
            .join("")
            .toUpperCase() || "V";
          const photo = resolveMediaUrl(vendor?.profile || undefined);

          if (isCollapsed) {
            return (
              <Link href="/profile" className="flex justify-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--vendor-primary-btn)] text-[13px] font-extrabold text-white overflow-hidden relative">
                  {photo ? (
                    <Image src={photo} alt="" fill className="object-cover" />
                  ) : initials}
                </span>
              </Link>
            );
          }

          return (
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-[var(--vendor-radius-panel)] border border-slate-200 bg-white p-3 no-underline transition-colors hover:border-[var(--vendor-primary-btn)]/30"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--vendor-primary-btn)] text-[14px] font-extrabold text-white overflow-hidden relative">
                {photo ? (
                  <Image src={photo} alt="" fill className="object-cover" />
                ) : initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-bold text-slate-800">{vendorName}</p>
                <p className="truncate text-[11px] text-slate-400">{vendorEmail}</p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-600">
                Active
              </span>
            </Link>
          );
        })()}
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent
        className={`py-4 bg-sidebar transition-all duration-300 ${isCollapsed ? "px-1" : "px-4"}`}
      >
        <SidebarGroup className="p-0">
          <SidebarMenu className="gap-1">
            {NAV_ITEMS.filter((item) => !item.hidden).map((item) => {
              const active      = isItemActive(item, pathname);
              const hasChildren = !!item.children?.length;
              const isOpen      = openItems.has(item.label);

              if (!hasChildren) {
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      className={`${btnBase}  ${active ? activeClass : inactiveClass} ${
                        isCollapsed ? "px-0 justify-center" : "px-3.5"
                      }`}
                    >
                      <Link href={item.href!} className="flex items-center gap-2.5 w-full">
                        <div className={`flex items-center justify-center ${isCollapsed ? "w-full px-1" : "gap-0.5"}`}>
                          <item.icon
                            className={`size-[18px] transition-colors ${
                              active
                                ? "text-current"
                                : "text-slate-500 dark:text-gray-400"
                            }`}
                          />
                        </div>
                        <span className="font-semibold text-[14px] group-data-[collapsible=icon]:hidden">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }

              return (
                <Collapsible
                  key={item.label}
                  open={isOpen}
                  onOpenChange={() => toggleOpen(item.label)}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip={item.label}
                      onClick={() => {
                        if (item.href) router.push(item.href);
                        toggleOpen(item.label);
                      }}
                      className={`${btnBase} ${active ? activeClass : inactiveClass} ${
                        isCollapsed ? "px-0 justify-center" : "px-3.5"
                      }`}
                    >
                      <div className={`flex items-center justify-center ${isCollapsed ? "w-full px-1" : "gap-0.5"}`}>
                        <item.icon
                          className={`size-[18px] transition-colors ${
                            active
                              ? "text-current"
                              : "text-slate-500 dark:text-gray-400"
                          }`}
                        />
                      </div>
                      <span className="font-semibold text-[14px] group-data-[collapsible=icon]:hidden flex-1 text-left">
                        {item.label}
                      </span>
                      <ChevronRight
                        className={`w-3 h-3 shrink-0 transition-transform duration-200 group-data-[collapsible=icon]:hidden ${
                          isOpen ? "rotate-90" : ""
                        } ${active ? "text-[var(--vendor-primary-btn)]" : "text-slate-400"}`}
                      />
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <CollapsibleContent>
                    <div className="mt-0.5 flex flex-col gap-1">
                      {filterChildren(item.children!).map((child) => {
                        const hasSubChildren = !!child.children?.length;
                        const isChildOpen    = openItems.has(child.label);
                        // A child whose href is a prefix of a sibling's href
                        // (e.g. /clients vs /clients/guests) must not stay active
                        // when the more specific sibling is the current route —
                        // only the longest matching sibling wins.
                        const childHrefMatches = (href?: string) =>
                          !!href && (pathname === href || pathname.startsWith(href + "/"));
                        const moreSpecificSiblingMatches =
                          !!child.href &&
                          (item.children ?? []).some(
                            (sib) =>
                              sib.href &&
                              sib.href !== child.href &&
                              sib.href.startsWith(child.href + "/") &&
                              childHrefMatches(sib.href),
                          );
                        const childActive    = child.href
                          ? childHrefMatches(child.href) && !moreSpecificSiblingMatches
                          : (child.children?.some(
                              (sub) => pathname === sub.href || pathname.startsWith(sub.href + "/"),
                            ) ?? false);

                        if (!hasSubChildren) {
                          return (
                            <SidebarMenuItem key={child.label}>
                              <SidebarMenuButton
                                asChild
                                tooltip={child.label}
                                className={`${btnBase} ${childActive ? activeClass : inactiveClass} ${
                                  isCollapsed ? "px-0 justify-center" : "px-3.5 pl-8"
                                }`}
                              >
                                <Link href={child.href!} className="flex items-center gap-2.5 w-full">
                                  <div className={`flex items-center justify-center ${isCollapsed ? "w-full px-1" : "gap-0.5"}`}>
                                    <child.icon
                                      className={`size-[18px] transition-colors ${
                                        childActive
                                          ? "text-current"
                                          : "text-slate-500 dark:text-gray-400"
                                      }`}
                                    />
                                  </div>
                                  <span className="font-semibold text-[14px] group-data-[collapsible=icon]:hidden">
                                    {child.label}
                                  </span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        }

                        return (
                          <Collapsible
                            key={child.label}
                            open={isChildOpen}
                            onOpenChange={() => toggleOpen(child.label)}
                          >
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                tooltip={child.label}
                                onClick={() => {
                                  if (child.href) router.push(child.href);
                                  toggleOpen(child.label);
                                }}
                                className={`${btnBase} ${childActive ? activeClass : inactiveClass} ${
                                  isCollapsed ? "px-0 justify-center" : "px-3.5 pl-8"
                                }`}
                              >
                                <div className={`flex items-center justify-center ${isCollapsed ? "w-full px-1" : "gap-0.5"}`}>
                                  <child.icon
                                    className={`size-[18px] transition-colors ${
                                      childActive
                                        ? "text-current"
                                        : "text-slate-500 dark:text-gray-400"
                                    }`}
                                  />
                                </div>
                                <span className="font-semibold text-[14px] group-data-[collapsible=icon]:hidden flex-1 text-left">
                                  {child.label}
                                </span>
                                <ChevronRight
                                  className={`w-3 h-3 shrink-0 transition-transform duration-200 group-data-[collapsible=icon]:hidden ${
                                    isChildOpen ? "rotate-90" : ""
                                  } ${childActive ? "text-[var(--vendor-primary-btn)]" : "text-slate-400"}`}
                                />
                              </SidebarMenuButton>
                            </SidebarMenuItem>

                            <CollapsibleContent>
                              <div className="mt-0.5 flex flex-col gap-1">
                                {child.children!.map((sub) => {
                                  const subActive = pathname === sub.href || pathname.startsWith(sub.href + "/");
                                  return (
                                    <SidebarMenuItem key={sub.label}>
                                      <SidebarMenuButton
                                        asChild
                                        tooltip={sub.label}
                                        className={`${btnBase} ${subActive ? activeClass : inactiveClass} ${
                                          isCollapsed ? "px-0 justify-center hidden" : "px-3.5 pl-12"
                                        }`}
                                      >
                                        <Link href={sub.href} className="flex items-center gap-2.5 w-full">
                                          <div className="flex items-center justify-center gap-0.5">
                                            <sub.icon
                                              className={`size-3 transition-colors ${
                                                subActive
                                                  ? "text-current"
                                                  : "text-slate-500 dark:text-gray-400"
                                              }`}
                                            />
                                          </div>
                                          <span className="font-semibold text-[14px]">{sub.label}</span>
                                        </Link>
                                      </SidebarMenuButton>
                                    </SidebarMenuItem>
                                  );
                                })}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Quick Actions */}
      {!isCollapsed && (
        <SidebarFooter className="border-t border-slate-200 bg-sidebar px-3 py-4">
          <p className="px-1 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Quick Actions
          </p>
          <div className="space-y-1.5">
            <Link
              href="/events/create"
              className="flex items-center gap-2 rounded-[var(--vendor-radius-control)] bg-[var(--vendor-primary-btn)] px-3 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[var(--vendor-primary-btn-hover)]"
            >
              <Plus className="size-4" /> Create New Event
            </Link>
            <Link
              href="/clients/add"
              className="flex items-center gap-2 rounded-[var(--vendor-radius-control)] px-3 py-2 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              <UserRound className="size-4 text-slate-400" /> Add New Client
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-[var(--vendor-radius-control)] px-3 py-2 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              <Globe className="size-4 text-slate-400" /> Create Sub Domain
            </Link>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
