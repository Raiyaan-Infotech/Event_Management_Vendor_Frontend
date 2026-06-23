"use client";

import { Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export type PreviewDevice = "desktop" | "mobile";

interface DesktopMobileToggleProps {
  value: PreviewDevice;
  onChange: (value: PreviewDevice) => void;
  desktopLabel?: string;
  mobileLabel?: string;
  className?: string;
}

export function DesktopMobileToggle({
  value,
  onChange,
  desktopLabel = "Desktop",
  mobileLabel = "Mobile",
  className,
}: DesktopMobileToggleProps) {
  const options: Array<{ value: PreviewDevice; label: string; icon: typeof Monitor }> = [
    { value: "desktop", label: desktopLabel, icon: Monitor },
    { value: "mobile", label: mobileLabel, icon: Smartphone },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-1 shadow-xs",
        className,
      )}
      role="tablist"
      aria-label="Preview device"
    >
      {options.map((option) => {
        const Icon = option.icon;
        const active = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex h-9 items-center justify-center gap-2 rounded-[var(--vendor-radius-control)] px-4 text-[13px] font-black transition",
              active
                ? "bg-[var(--vendor-primary-btn)] text-[var(--vendor-primary-btn-text)] shadow-sm"
                : "text-[var(--vendor-text)] hover:bg-[var(--vendor-secondary-btn)] hover:text-[var(--vendor-secondary-btn-text)]",
            )}
          >
            <Icon className="h-4 w-4" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
