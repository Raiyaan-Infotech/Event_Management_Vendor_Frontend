"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useMemo } from "react";

const navLabels: Record<string, string> = {
  dashboard:                 "Dashboard",
  profile:                   "Profile",
  clients:                   "Clients",
  staff:                     "Staff",
  events:                    "Events",
  payments:                  "Payments",
  reports:                   "Reports",
  "activity-log":            "Activity Log",
  transactions:              "Transactions",
  "payment-management":      "Payment",
  communication:             "Communication",
  contact:                   "Contact",
  notification:              "Notification",
  chat:                      "Chat",
  settings:                  "Settings",
  config:                    "Configuration",
  currency:                  "Currency",
  timezone:                  "Timezone",
  help:                      "Help",
  // Website management
  website:                   "Website",
  header:                    "Header",
  footer:                    "Footer",
  menu:                      "Menu",
  "about-us":                "About Us",
  "contact-us":              "Contact Us",
  "contact-us-management":   "Contact Us",
  "contact-information":     "Contact Information",
  pages:                     "Pages",
  "home-slider":             "Home Slider",
  "advance-slider":          "Advance Slider",
  "simple-slider":           "Simple Slider",
  gallery:                   "Gallery",
  testimonial:               "Testimonial",
  "testimonial-management":  "Testimonials",
  portfolio:                 "Portfolio",
  "portfolio-management":    "Portfolio",
  "social-links":            "Social Links",
  appearance:                "Appearance",
  "home-setting":            "Home Blocks",
  theme:                     "Theme",
  themes:                    "Themes",
  "themes-option":           "Theme Options",
  "email-marketing":         "Email Marketing",
  "email-templates":         "Email Templates",
  templates:                 "Templates",
  category:                  "Category",
  newsletter:                "Newsletter",
  send:                      "Send",
  subscribers:               "Subscribers",
  unsubscribers:             "Unsubscribers",
  "mail-status":             "Mail Status",
  subscription:              "Subscription",
  "subscription-management": "Subscription",
  "events-management":       "Events",
  "email-template":          "Email Template",
  "terms-conditions":        "Terms & Conditions",
  "privacy-policy":          "Privacy Policy",
  "personal-info":           "Personal Info",
  mail:                      "Mail",
  compose:                   "Compose",
  contacts:                  "Contacts",
  // Roles & departments
  roles:                     "Roles",
  departments:               "Departments",
  department:                "Department",
  permissions:               "Permissions",
  modules:                   "Modules",
  // CRUD actions
  create:                    "Create",
  edit:                      "Edit",
  view:                      "View",
  add:                       "Add",
};

// Segments that are group labels with no real page — rendered as plain text
const NON_LINKABLE = new Set([
  "website",
  "communication",
  "settings",
  "appearance",
  "home-slider",
  "portfolio-management",
  "portfolio",
  "email-template",
  "email-marketing",
  "email-templates",
  "newsletter",
  "events",
]);

// Segments treated as the "main module" for sub-action label construction
const MAIN_MODULES = new Set([
  "staff", "clients", "events", "payments", "payment-management",
  "advance-slider", "simple-slider", "gallery", "testimonial",
  "portfolio", "pages", "social-links", "newsletter", "roles",
  "departments", "department", "templates", "category",
]);

const SUB_ACTIONS = new Set(["add", "edit", "view", "create"]);

// Routes that conceptually live under Settings but aren't physically nested.
// We inject a virtual non-linkable "settings" parent in the breadcrumb.
const SETTINGS_ROOTS = new Set(["roles", "modules", "activity-log", "departments", "permissions"]);

export default function VendorBreadcrumb() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // When the URL has ?edit=... the route is conceptually "Edit X" even if the
  // path segment is still /add — relabel the SUB_ACTION accordingly.
  const isEditQuery = !!searchParams?.get("edit");

  const items = useMemo(() => {
    let segments = pathname.split("/").filter(Boolean);

    // ── Virtual segment injections / expansions ─────────────────────────────
    // /newsletter/email-template/* is shown as
    // Email Marketing > Email Templates > Templates/Category.
    // Other /newsletter/* routes keep Newsletter as a non-linkable child.
    if (segments[0] === "newsletter" && segments[1] === "email-template") {
      segments = ["email-marketing", ...segments.slice(1)];
    } else if (segments[0] === "newsletter") {
      segments = ["email-marketing", ...segments];
    }

    // Terms and privacy are configured from Footer Settings, so show that
    // parent even though their physical routes are siblings of /website/footer.
    const hasVirtualFooterParent =
      segments[0] === "website" &&
      (segments[1] === "terms-conditions" || segments[1] === "privacy-policy");
    if (hasVirtualFooterParent) {
      segments = ["website", "footer", ...segments.slice(1)];
    }

    // /roles, /modules, /activity-log, /departments, /permissions
    // → prepend virtual "settings" parent
    if (segments[0] && SETTINGS_ROOTS.has(segments[0])) {
      segments = ["settings", ...segments];
    }

    // Replace "email-template" with "email-templates" and append "templates"
    // when the path is /newsletter/email-template[/add|/edit|/view|/:id]
    // (i.e. NOT followed by /category). For /category, just rename to "email-templates".
    const tplIdx = segments.indexOf("email-template");
    if (tplIdx >= 0) {
      const next = segments[tplIdx + 1];
      const isCategoryBranch = next === "category";
      if (isCategoryBranch) {
        segments = [
          ...segments.slice(0, tplIdx),
          "email-templates",
          ...segments.slice(tplIdx + 1),
        ];
      } else {
        segments = [
          ...segments.slice(0, tplIdx),
          "email-templates",
          "templates",
          ...segments.slice(tplIdx + 1),
        ];
      }
    }

    const result: { label: string; url: string; isLast: boolean; isLink: boolean }[] = [];

    let accPath = "";
    let moduleLabel = "";
    const realSegSet = new Set<string>(pathname.split("/").filter(Boolean));

    segments.forEach((seg) => {
      // Only accumulate URL when the segment actually exists in the real path
      if (realSegSet.has(seg)) accPath += `/${seg}`;
      if (!isNaN(Number(seg))) return; // skip numeric IDs but keep them in accPath

      // Override SUB_ACTION label when ?edit= query is present (e.g. /add?edit=12)
      const effectiveSeg = isEditQuery && seg === "add" ? "edit" : seg;
      let label =
        navLabels[effectiveSeg] ??
        effectiveSeg.charAt(0).toUpperCase() + effectiveSeg.slice(1).replace(/-/g, " ");

      if (MAIN_MODULES.has(seg)) moduleLabel = label;

      if (SUB_ACTIONS.has(effectiveSeg) && moduleLabel) {
        label = `${label} ${moduleLabel}`;
        if (effectiveSeg === "create" && moduleLabel === "Department") {
          label = "Add Department";
        }
      }

      result.push({
        label,
        url: hasVirtualFooterParent && seg === "footer" ? "/website/footer" : accPath,
        isLast: false,
        isLink: !NON_LINKABLE.has(seg) && !!accPath,
      });
    });

    if (result.length > 0) result[result.length - 1].isLast = true;
    return result;
  }, [pathname, isEditQuery]);

  if (pathname === "/dashboard") return null;

  return (
    <div className="h-[30px] flex items-center bg-card dark:bg-[#09090b] border-b border-border dark:border-[#27272a] w-full px-2 md:px-4 min-w-0 overflow-hidden sticky top-[56px] z-40">
      <div className="flex-1 flex items-center min-w-0 text-[10px]">
        <div className="flex items-center gap-1 font-medium truncate min-w-0">
          {items.map((item, i) => (
            <Fragment key={`${item.url}-${i}`}>
              {i > 0 && <ChevronRight className="text-[#c8c8c8] dark:text-[#52525b] size-2 mx-1" />}
              {item.isLast ? (
                <span className="text-primary dark:text-[#60a5fa] font-bold truncate">{item.label}</span>
              ) : item.isLink ? (
                <Link href={item.url} className="text-[#6c757d] dark:text-[#a1a1aa] hover:text-primary dark:hover:text-[#60a5fa] transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#6c757d] dark:text-[#a1a1aa]">{item.label}</span>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
