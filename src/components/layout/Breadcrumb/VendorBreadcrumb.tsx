"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useMemo } from "react";

const navLabels: Record<string, string> = {
  dashboard:    "Dashboard",
  profile:      "Profile",
  clients:      "Clients",
  events:       "Events",
  payments:     "Payments",
  reports:      "Reports",
  "activity-log": "Activity Log",
  help:         "Help",
  create:       "Create",
  edit:         "Edit",
  view:         "View",
};

export default function VendorBreadcrumb() {
  const pathname = usePathname();

  const breadcrumbItems = useMemo(() => {
    const items: { label: string; url: string; isLast: boolean }[] = [
      { label: "Dashboard", url: "/dashboard", isLast: false },
    ];

    const segments = pathname
      .split("/")
      .filter(Boolean)
      .filter((s) => s !== "dashboard" && isNaN(Number(s)));

    segments.forEach((segment, index) => {
      const url = `/dashboard/${segments.slice(0, index + 1).join("/")}`;
      const label =
        navLabels[segment] ??
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
      items.push({ label, url, isLast: index === segments.length - 1 });
    });

    // Mark last item
    items.forEach((it, i) => (it.isLast = i === items.length - 1));

    return items;
  }, [pathname]);

  if (pathname === "/dashboard") return null;

  return (
    <div className="h-[30px] flex items-center bg-white dark:bg-[#09090b] border-b border-border dark:border-[#27272a] w-full px-2 md:px-4 min-w-0 overflow-hidden">
      <div className="flex-1 flex items-center min-w-0 text-[10px]">
        <div className="flex items-center gap-1 font-medium truncate min-w-0">
          {breadcrumbItems.map((item, index) => (
            <Fragment key={`${item.url}-${index}`}>
              {index > 0 && (
                <FontAwesomeIcon icon={faChevronRight} className="text-[#c8c8c8] dark:text-[#52525b] !size-2 mx-1" />
              )}
              {item.isLast ? (
                <span className="text-primary dark:text-[#60a5fa] font-bold truncate">{item.label}</span>
              ) : (
                <Link href={item.url} className="text-[#6c757d] dark:text-[#a1a1aa] hover:text-primary dark:hover:text-[#60a5fa] transition-colors">
                  {item.label}
                </Link>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
