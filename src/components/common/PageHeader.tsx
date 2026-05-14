"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { vendorUi } from "@/lib/vendor-ui";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  total?: number;
  rightContent?: React.ReactNode;
}

export function PageHeader({ title, subtitle, total, rightContent }: PageHeaderProps) {
  return (
    <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
      <div>
        <h1 className={`${vendorUi.type.pageTitle} flex items-center gap-2`}>
          {title}
          {total !== undefined && (
            <Badge variant="outline" className="text-[10px] font-bold border-[var(--vendor-primary-btn)]/20 text-[var(--vendor-primary-btn)] bg-[var(--vendor-table-row-hover)] px-2 py-0.5 ml-1">
              {total} TOTAL
            </Badge>
          )}
        </h1>
        <p className="mt-1 text-[13px] leading-5 font-medium text-[var(--vendor-text-muted)]">{subtitle}</p>
      </div>
      {rightContent && <div className="flex items-center gap-2">{rightContent}</div>}
    </div>
  );
}
