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
  Newspaper,
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
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
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
import { useVendorHomeBlocks } from "@/hooks/use-vendor-home-blocks";

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
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    children: [
      { label: "Analytics", href: "/analytics", icon: LineChart },
    ],
  },
  { label: "Client",
    href: "/clients",
    icon: Users,
  },
  { label: "Staff",
    href: "/staff",
    icon: UserRound,
  },
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
  { label: "Transactions", href: "/transactions", icon: Receipt },
  {
    label: "Event",
    icon: Calendar,
    children: [
      { label: "Create an event", href: "/events/create", icon: Plus },
    ],
  },
  { label: "Payment", href: "/payment-management", icon: DollarSign },
  {
    label: "Settings",
    icon: Settings,
    children: [
      { label: "Roles",            href: "/roles",             icon: Layers      },
      { label: "Modules",          href: "/modules",           icon: ClipboardList },
      { label: "Payment Settings", href: "/settings/payments", icon: CreditCard  },
      { label: "Configuration",    href: "/settings/config",   icon: Sliders     },
      { label: "Currency",         href: "/settings/currency", icon: DollarSign  },
      { label: "Timezone",         href: "/settings/timezone", icon: Clock       },
      { label: "Activity Log",     href: "/activity-log",      icon: ClipboardList },
    ],
  },
  {
    label: "Appearance",
    icon: Settings,
    children: [
      { label: "Home Settings", href: "/appearance/home-settings", icon: Settings },
      { label: "Menu", href: "/appearance/menu", icon: LayoutDashboard },
    ],
  },
  { label: "Help", href: "/help", icon: HelpCircle },
  {
    label: "Website Management",
    icon: Globe,
    children: [
       { 
        label: "Appearance", 
        icon: Palette,
        children: [
          { label: "Themes Option", href: "/website/appearance/themes-option", icon: List },
        ]
      },
      { label: "Header",              href: "/website/header",              icon: Building2  },
      { label: "Contact Information", href: "/website/contact-information", icon: Contact    },
      { label: "Social Links",        href: "/website/social-links",        icon: Globe,     blockType: "social_media" },
      { label: "Pages",               href: "/website/pages",               icon: List       },
      { label: "Menu",                href: "/website/menu",                icon: List       },
      { label: "Home",                href: "/website/home",                icon: Home       },
      { label: "Theme",               href: "/website/theme",               icon: Palette    },
      { label: "Footer",              href: "/website/footer",              icon: Layers     },
      // ─── Block-gated items ───────────────────────────────────────────────────
      { label: "About-Us",    href: "/website/about-us",                  icon: Users,     blockType: "about_us"          },
      { label: "Gallery",     href: "/website/gallery",                   icon: Images,    blockType: "gallery"           },
      { label: "Subscription",href: "/website/subscription-management",   icon: CreditCard,blockType: "subscription"      },
      { label: "Testimonial", href: "/website/testimonial-management",    icon: Star,      blockType: "testimonial"       },
      { label: "Home Slider", icon: Sliders,
        children: [
          { label: "Simple Slider",  href: "/website/home-slider/simple-slider",  icon: List, blockType: "simple_slider"  },
          { label: "Advance Slider", href: "/website/home-slider/advance-slider", icon: List, blockType: "advance_slider" },
        ]
      },
      { label: "Portfolio", icon: Briefcase,
        children: [
          { label: "Clients",  href: "/website/portfolio-management/clients",  icon: Users,      blockType: "portfolio_clients"  },
          { label: "Sponsors", href: "/website/portfolio-management/sponsors", icon: Handshake,  blockType: "portfolio_sponsors" },
          { label: "Events",   href: "/website/portfolio-management/events",   icon: Briefcase,  blockType: "portfolio_events"   },
        ]
      },
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
  const { data: homeBlocks } = useVendorHomeBlocks();
  const activeBlockTypes = React.useMemo(
    () => new Set((homeBlocks ?? []).map((b) => b.block_type)),
    [homeBlocks],
  );

  const [openItems, setOpenItems] = React.useState<Set<string>>(() => {
    const initial = new Set<string>();
    NAV_ITEMS.forEach((item) => {
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

  const activeClass   = "text-primary-foreground dark:text-white font-bold bg-primary dark:bg-primary drop-shadow-sm";
  const inactiveClass = "bg-transparent text-sidebar-foreground/70 dark:text-gray-400 hover:bg-sidebar-accent dark:hover:bg-white/10 hover:text-sidebar-accent-foreground dark:hover:text-white";
  const btnBase       = "h-[34px] rounded-sm transition-all duration-200 !outline-none !ring-0 focus-visible:ring-0 active:bg-transparent";

  return (
    <Sidebar collapsible="icon" className="border-none bg-sidebar" {...props}>
      {/* Header / Logo */}
      <SidebarHeader
        className={`sticky top-0 z-50 min-h-[56px] border-none flex flex-col justify-center bg-sidebar/95 backdrop-blur-sm transition-all duration-300 ${
          isCollapsed ? "px-1.5 py-3" : "pl-3 pr-4 py-3"
        }`}
      >
        <Link
          href="/dashboard"
          className={`flex items-center no-underline relative w-full overflow-hidden ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
        >
          <div
            className={`h-9 w-9 shrink-0 rounded-sm shadow-[0_4px_12px_rgba(52,84,209,0.3)] transition-all duration-300 flex items-center justify-center bg-primary overflow-hidden relative
              ${isCollapsed
                ? "opacity-100 scale-100 translate-x-0 rotate-0"
                : "opacity-0 scale-50 -translate-x-10 -rotate-12 absolute"
              }`}
          >
            {vendor?.company_logo ? (
              <Image src={resolveMediaUrl(vendor.company_logo)} alt="Company Logo" fill priority className="object-contain" />
            ) : (
              <span className="text-[15px] font-extrabold text-primary-foreground leading-none">
                {vendor?.company_name ? vendor.company_name.charAt(0).toUpperCase() : "V"}
              </span>
            )}
          </div>
          <div
            className={`flex flex-col transition-all duration-300 justify-center items-center
              ${!isCollapsed ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 absolute pointer-events-none"}`}
          >
            {vendor?.company_logo ? (
              <div className="relative h-9 w-32">
                <Image src={resolveMediaUrl(vendor.company_logo)} alt="Company Logo" fill priority className="object-contain" />
              </div>
            ) : (
              <span className="text-[19px] font-extrabold tracking-tight text-sidebar-foreground dark:text-gray-100 leading-none">
                {vendor?.company_name ?? "Vendor Portal"}
              </span>
            )}
            {vendor?.company_name && (
              <p className="text-[10px] font-bold uppercase tracking-[1px] text-muted-foreground dark:text-gray-400 m-0 p-0 mt-1 truncate max-w-[140px]">
                {vendor.company_name}
              </p>
            )}
            {/* {vendor?.cityRef?.name && (
              <p className="text-[10px] font-bold uppercase tracking-[1px] text-muted-foreground dark:text-gray-400 m-0 p-0 mt-0.5 truncate max-w-[140px]">
                {vendor.cityRef.name}
              </p>
            )} */}
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
              const active      = isItemActive(item, pathname);
              const hasChildren = !!item.children?.length;
              const isOpen      = openItems.has(item.label);

              if (!hasChildren) {
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      className={`${btnBase} ${active ? activeClass : inactiveClass} ${
                        isCollapsed ? "px-0 justify-center" : "px-3.5"
                      }`}
                    >
                      <Link href={item.href!} className="flex items-center gap-2.5 w-full">
                        <div className={`flex items-center justify-center ${isCollapsed ? "w-full px-1" : "gap-0.5"}`}>
                          <item.icon
                            className={`size-3.5 transition-colors ${
                              active
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
                          className={`size-3.5 transition-colors ${
                            active
                              ? "text-primary-foreground dark:text-white"
                              : "text-sidebar-foreground/70 dark:text-gray-400 group-hover:text-sidebar-accent-foreground dark:group-hover:text-white"
                          }`}
                        />
                      </div>
                      <span className="text-[12px] font-semibold group-data-[collapsible=icon]:hidden flex-1 text-left">
                        {item.label}
                      </span>
                      <ChevronRight
                        className={`w-3 h-3 shrink-0 transition-transform duration-200 group-data-[collapsible=icon]:hidden ${
                          isOpen ? "rotate-90" : ""
                        } ${active ? "text-primary-foreground/70 dark:text-white/70" : "text-sidebar-foreground/30"}`}
                      />
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <CollapsibleContent>
                    <div className="mt-0.5 flex flex-col gap-1">
                      {filterChildren(item.children!).map((child) => {
                        const hasSubChildren = !!child.children?.length;
                        const isChildOpen    = openItems.has(child.label);
                        const childActive    = child.href
                          ? pathname === child.href || pathname.startsWith(child.href + "/")
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
                                      className={`size-3.5 transition-colors ${
                                        childActive
                                          ? "text-primary-foreground dark:text-white"
                                          : "text-sidebar-foreground/70 dark:text-gray-400 group-hover:text-sidebar-accent-foreground dark:group-hover:text-white"
                                      }`}
                                    />
                                  </div>
                                  <span className="text-[12px] font-semibold group-data-[collapsible=icon]:hidden">
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
                                    className={`size-3.5 transition-colors ${
                                      childActive
                                        ? "text-primary-foreground dark:text-white"
                                        : "text-sidebar-foreground/70 dark:text-gray-400 group-hover:text-sidebar-accent-foreground dark:group-hover:text-white"
                                    }`}
                                  />
                                </div>
                                <span className="text-[12px] font-semibold group-data-[collapsible=icon]:hidden flex-1 text-left">
                                  {child.label}
                                </span>
                                <ChevronRight
                                  className={`w-3 h-3 shrink-0 transition-transform duration-200 group-data-[collapsible=icon]:hidden ${
                                    isChildOpen ? "rotate-90" : ""
                                  } ${childActive ? "text-primary-foreground/70 dark:text-white/70" : "text-sidebar-foreground/30"}`}
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
                                                  ? "text-primary-foreground dark:text-white"
                                                  : "text-sidebar-foreground/70 dark:text-gray-400 group-hover:text-sidebar-accent-foreground dark:group-hover:text-white"
                                              }`}
                                            />
                                          </div>
                                          <span className="text-[12px] font-semibold">{sub.label}</span>
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
    </Sidebar>
  );
}
