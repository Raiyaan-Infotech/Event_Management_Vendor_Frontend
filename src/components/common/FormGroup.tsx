"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { AlertCircle, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { vendorUi } from "@/lib/vendor-ui";

interface FormGroupProps {
  label: string;
  icon?: LucideIcon;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  isView?: boolean;
  iconTop?: boolean;
}

export const FormGroup = ({
  label,
  icon: Icon,
  error,
  required,
  children,
  className,
  isView = false,
  iconTop = false,
}: FormGroupProps) => {
  return (
    <div className={cn("space-y-2 group w-full", className)}>
      <Label className={cn(vendorUi.form.label, "translate-x-1")}>
        {label} {!isView && required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon
            className={cn(
              "absolute left-4 transition-colors z-10",
              iconTop ? "top-4" : "top-1/2 -translate-y-1/2",
              isView
                ? "text-[var(--vendor-border)]"
                : error
                  ? "text-rose-400"
                  : "text-[var(--vendor-text-muted)] group-focus-within:text-[var(--vendor-primary-btn)]",
            )}
            size={18}
          />
        )}
        {children}
      </div>
      {error && !isView && (
        <div className="flex items-center gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1 duration-300">
          <AlertCircle size={12} className="text-rose-500" />
          <span className="text-[var(--vendor-form-help-text)] font-semibold text-rose-500 uppercase tracking-wide">
            {error}
          </span>
        </div>
      )}
    </div>
  );
};