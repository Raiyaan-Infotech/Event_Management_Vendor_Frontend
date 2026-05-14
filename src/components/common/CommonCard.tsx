"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { vendorUi } from "@/lib/vendor-ui";

interface CommonCardProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColorClass?: string;
  iconBgClass?: string;
  children: React.ReactNode;
  className?: string;
  isView?: boolean;
}

export const CommonCard = ({
  title,
  subtitle,
  icon: Icon,
  iconColorClass = "text-[var(--vendor-primary-btn)]",
  iconBgClass = "bg-primary/10",
  children,
  className,
  isView = false,
}: CommonCardProps) => {
  return (
    <div className={cn(isView ? "bg-transparent p-0" : cn(vendorUi.panel.base, vendorUi.panel.padded), className)}>
      {title && (
        <div className={cn("flex items-center gap-4", vendorUi.panel.header)}>
          {Icon && (
            <div className={cn("h-8 w-8 rounded-[var(--vendor-radius-control)] flex items-center justify-center", iconBgClass, iconColorClass)}>
              <Icon size={16} />
            </div>
          )}
          <div>
            <h3 className={vendorUi.form.sectionTitle}>{title}</h3>
            {subtitle && <p className={vendorUi.form.sectionSubtitle}>{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};
