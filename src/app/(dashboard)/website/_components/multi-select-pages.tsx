"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectPagesProps {
  value: string[];
  options: MultiSelectOption[];
  onChange: (value: string[]) => void;
  label?: string;
  description?: string;
  placeholder?: string;
  allowCustomValues?: boolean;
  customPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  tagClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export function MultiSelectPages({
  value,
  options,
  onChange,
  label,
  description,
  placeholder = "Add item",
  allowCustomValues = false,
  customPlaceholder = "Enter keyword",
  disabled = false,
  className,
  tagClassName,
  triggerClassName,
  contentClassName,
}: MultiSelectPagesProps) {
  const [customValue, setCustomValue] = React.useState("");
  const availableOptions = options.filter((option) => !value.includes(option.value));
  const selectedOptions = value.map((item) => {
    return options.find((option) => option.value === item) ?? { label: item, value: item };
  });

  const addValue = (nextValue: string) => {
    const normalized = nextValue.trim();
    if (!normalized || value.includes(normalized)) return;
    onChange([...value, normalized]);
  };

  const removeValue = (nextValue: string) => {
    onChange(value.filter((item) => item !== nextValue));
  };

  const addCustomValue = () => {
    addValue(customValue);
    setCustomValue("");
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <label className="text-[12px] font-black text-[var(--vendor-text)]">{label}</label>
      ) : null}
      <div className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-2 shadow-xs">
        <div className="flex min-h-9 flex-wrap items-center gap-1.5">
          {selectedOptions.map((option) => (
            <span
              key={option.value}
              className={cn(
                "inline-flex h-7 items-center gap-1 rounded-[var(--vendor-radius-control)] bg-[var(--vendor-primary-btn)]/10 px-2.5 text-[11px] font-black text-[var(--vendor-primary-btn)]",
                tagClassName,
              )}
            >
              {option.label}
              <button
                type="button"
                onClick={() => removeValue(option.value)}
                disabled={disabled}
                className="rounded p-0.5 hover:bg-[var(--vendor-primary-btn)]/10 disabled:cursor-not-allowed"
                aria-label={`Remove ${option.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {availableOptions.length ? (
            <Select disabled={disabled} onValueChange={addValue}>
              <SelectTrigger
                className={cn("h-7 w-auto min-w-28 border-dashed px-2 text-[11px]", triggerClassName)}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent className={cn("min-w-32 text-[12px]", contentClassName)}>
                {availableOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="py-1.5 text-[12px]">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
        </div>

        {allowCustomValues ? (
          <div className="mt-2 flex gap-2">
            <Input
              value={customValue}
              disabled={disabled}
              placeholder={customPlaceholder}
              className="h-9"
              onChange={(event) => setCustomValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addCustomValue();
                }
              }}
            />
            <Button type="button" size="sm" onClick={addCustomValue} disabled={disabled || !customValue.trim()}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        ) : null}
      </div>
      {description ? (
        <p className="text-[12px] font-medium leading-5 text-[var(--vendor-text-muted)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
