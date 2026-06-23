"use client";

import Image from "next/image";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LogoGridUploadItem {
  id: string | number;
  imageUrl: string;
  alt?: string;
}

interface LogoGridUploadProps {
  items: LogoGridUploadItem[];
  onAdd?: (file: File) => void;
  onRemove?: (item: LogoGridUploadItem) => void;
  maxItems?: number;
  hint?: string;
  accept?: string;
  disabled?: boolean;
  className?: string;
}

export function LogoGridUpload({
  items,
  onAdd,
  onRemove,
  maxItems = 30,
  hint,
  accept = "image/png,image/jpeg,image/webp,image/svg+xml",
  disabled = false,
  className,
}: LogoGridUploadProps) {
  const canAdd = items.length < maxItems && !!onAdd && !disabled;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative flex h-28 items-center justify-center overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-xs"
          >
            <Image
              src={item.imageUrl}
              alt={item.alt ?? "Uploaded logo"}
              width={160}
              height={90}
              className="max-h-full w-auto object-contain"
              unoptimized
            />
            {onRemove ? (
              <button
                type="button"
                onClick={() => onRemove(item)}
                disabled={disabled}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-[var(--vendor-border)] bg-white/90 text-[var(--vendor-text)] shadow-sm hover:text-rose-500 disabled:cursor-not-allowed"
                aria-label="Remove logo"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        ))}

        {canAdd ? (
          <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-[var(--vendor-radius-panel)] border border-dashed border-[var(--vendor-primary-btn)]/45 bg-[var(--vendor-panel-bg)] text-center text-[var(--vendor-primary-btn)] shadow-xs hover:bg-[var(--vendor-primary-btn)]/5">
            <Plus className="h-7 w-7" />
            <span className="mt-2 text-[12px] font-black">Add Logo</span>
            <input
              type="file"
              accept={accept}
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onAdd?.(file);
              }}
            />
          </label>
        ) : null}
      </div>
      <p className="text-[12px] font-medium text-[var(--vendor-text-muted)]">
        {hint ?? `You can upload up to ${maxItems} logos.`}
      </p>
    </div>
  );
}
