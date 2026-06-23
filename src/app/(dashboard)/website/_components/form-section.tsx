"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  divider?: boolean;
}

export function FormSection({
  title,
  subtitle,
  actions,
  children,
  className,
  contentClassName,
  divider = false,
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "space-y-3",
        divider && "border-b border-[var(--vendor-border)] pb-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-[13px] font-black tracking-tight text-[var(--vendor-text)]">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-[12px] font-medium leading-5 text-[var(--vendor-text-muted)]">
              {subtitle}
            </p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>

      <div className={cn("space-y-3", contentClassName)}>{children}</div>
    </section>
  );
}
