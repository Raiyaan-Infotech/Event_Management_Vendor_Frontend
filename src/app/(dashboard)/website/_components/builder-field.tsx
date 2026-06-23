"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface BuilderLabelProps {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export function BuilderLabel({ children, required = false, className }: BuilderLabelProps) {
  return (
    <label className={cn("text-[10px] font-black uppercase tracking-wide text-slate-600", className)}>
      {children}
      {required ? <span className="ml-1 text-rose-500">*</span> : null}
    </label>
  );
}

interface CountedInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export function BuilderCountedInput({
  value,
  onChange,
  maxLength,
  label,
  required = false,
  placeholder,
  className,
  inputClassName,
}: CountedInputProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? <BuilderLabel required={required}>{label}</BuilderLabel> : null}
      <div className="relative">
        <Input
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={cn("h-9 pr-12 text-[11px] font-semibold", inputClassName)}
        />
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-500">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}

interface CountedTextareaProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  textareaClassName?: string;
}

export function BuilderCountedTextarea({
  value,
  onChange,
  maxLength,
  label,
  required = false,
  placeholder,
  className,
  textareaClassName,
}: CountedTextareaProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? <BuilderLabel required={required}>{label}</BuilderLabel> : null}
      <div className="relative">
        <Textarea
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={cn("min-h-16 pb-6 text-[11px] font-semibold leading-4", textareaClassName)}
        />
        <span className="pointer-events-none absolute bottom-1.5 right-2.5 text-[9px] font-black text-slate-500">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}

interface SegmentedOption<T extends string> {
  label: string;
  value: T;
}

interface BuilderSegmentedControlProps<T extends string> {
  value: T;
  options: Array<SegmentedOption<T>>;
  onChange: (value: T) => void;
  label?: string;
  className?: string;
}

export function BuilderSegmentedControl<T extends string>({
  value,
  options,
  onChange,
  label,
  className,
}: BuilderSegmentedControlProps<T>) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? <BuilderLabel>{label}</BuilderLabel> : null}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "inline-flex h-8 min-w-24 items-center justify-center rounded-[var(--vendor-radius-control)] border px-4 text-[11px] font-black transition",
                active
                  ? "border-[var(--vendor-primary-btn)] bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]"
                  : "border-[var(--vendor-border)] text-slate-600 hover:bg-slate-50",
              )}
            >
              <span className={cn("mr-2 h-3 w-3 rounded-full border", active ? "border-[var(--vendor-primary-btn)] bg-[var(--vendor-primary-btn)]" : "border-slate-300")} />
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
