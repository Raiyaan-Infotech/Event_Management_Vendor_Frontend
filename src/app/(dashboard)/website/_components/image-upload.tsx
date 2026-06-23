"use client";

import * as React from "react";
import Image from "next/image";
import { CloudUpload, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string | null;
  label?: string;
  title?: string;
  browseText?: string;
  hint?: string;
  recommendedSize?: string;
  thumbnailAlt?: string;
  accept?: string;
  disabled?: boolean;
  compact?: boolean;
  className?: string;
  dropzoneClassName?: string;
  previewClassName?: string;
  inputId?: string;
  onFileSelect?: (file: File) => void;
  onRemove?: () => void;
}

export function ImageUpload({
  value,
  label,
  title = "Click to upload or drag and drop",
  browseText,
  hint = "PNG, JPG, SVG or WebP",
  recommendedSize,
  thumbnailAlt = "Uploaded image preview",
  accept = "image/png,image/jpeg,image/webp,image/svg+xml",
  disabled = false,
  compact = false,
  className,
  dropzoneClassName,
  previewClassName,
  inputId,
  onFileSelect,
  onRemove,
}: ImageUploadProps) {
  const generatedId = React.useId();
  const id = inputId ?? generatedId;
  const [isDragging, setIsDragging] = React.useState(false);
  const [localPreview, setLocalPreview] = React.useState<string | null>(null);
  const previewSrc = value ?? localPreview;

  React.useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const selectFile = (file: File | undefined) => {
    if (!file || disabled) return;
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(URL.createObjectURL(file));
    onFileSelect?.(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  const handleRemove = () => {
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(null);
    onRemove?.();
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-[12px] font-semibold text-[var(--vendor-text)]" htmlFor={id}>
          {label}
        </label>
      )}

      {previewSrc ? (
        // Preview state — unchanged
        <div className={cn(
          "relative overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)]",
          compact ? "h-24" : "h-36",   // ← smaller preview
          previewClassName
        )}>
          <Image src={previewSrc} alt={thumbnailAlt} fill className="object-cover" unoptimized />
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={handleRemove}
            disabled={disabled}
            className="absolute right-2 top-2 h-7 w-7 bg-white/90 text-rose-500 hover:bg-white"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        // ✅ FIXED dropzone — small, clean, like the mockup
        <label
          htmlFor={id}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[var(--vendor-radius-panel)] border-2 border-dashed transition-colors",
            compact ? "px-3 py-4" : "px-4 py-5",   // ← key fix: padding not fixed height
            isDragging
              ? "border-[var(--vendor-primary)] bg-[var(--vendor-primary)]/5"
              : "border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] hover:border-[var(--vendor-primary)] hover:bg-[var(--vendor-primary)]/5",
            disabled && "pointer-events-none opacity-50",
            dropzoneClassName,
          )}
        >
          <CloudUpload className="h-6 w-6 text-[var(--vendor-primary)]" />   {/* ← smaller icon */}

          <div className="text-center">
            <p className="text-[12px] font-medium text-[var(--vendor-primary)]">
              {title}
            </p>
            {browseText && (
              <p className="text-[11px] text-[var(--vendor-text-muted)]">{browseText}</p>
            )}
          </div>

          {/* hint + recommended on one line each, small */}
          <div className="text-center">
            {hint && (
              <p className="text-[10px] text-[var(--vendor-text-muted)]">{hint}</p>
            )}
            {recommendedSize && (
              <p className="text-[10px] text-[var(--vendor-text-muted)]">{recommendedSize}</p>
            )}
          </div>

          <input
            id={id}
            type="file"
            accept={accept}
            className="sr-only"
            disabled={disabled}
            onChange={(e) => selectFile(e.target.files?.[0])}
          />
        </label>
      )}
    </div>
  );
}

