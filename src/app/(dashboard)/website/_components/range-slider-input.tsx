"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface RangeSliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  valueFormatter?: (value: number) => string;
}

export function RangeSliderInput({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  suffix = "%",
  description,
  disabled = false,
  className,
  valueFormatter,
}: RangeSliderInputProps) {
  const displayValue = valueFormatter ? valueFormatter(value) : `${value}${suffix}`;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <label className="text-[12px] font-black text-[var(--vendor-text)]">{label}</label>
          {description ? (
            <p className="mt-1 text-[11px] font-medium text-[var(--vendor-text-muted)]">
              {description}
            </p>
          ) : null}
        </div>
        <span className="min-w-12 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] px-2 py-1 text-center text-[12px] font-black text-[var(--vendor-text)]">
          {displayValue}
        </span>
      </div>
      <Input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        className="h-2 cursor-pointer appearance-none p-0 accent-[var(--vendor-primary-btn)] disabled:cursor-not-allowed"
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
