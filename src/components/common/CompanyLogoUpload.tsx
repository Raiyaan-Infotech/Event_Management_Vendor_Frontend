"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Image as ImageIcon, Plus } from "lucide-react";
import { resolveMediaUrl } from "@/lib/utils";

interface CompanyLogoUploadProps {
  imageUrl?: string | null;
  disabled?: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CompanyLogoUpload({ imageUrl, disabled = false, onFileChange }: CompanyLogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const resolvedImageUrl = resolveMediaUrl(imageUrl || undefined);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full px-4">
      <div className="group relative w-full max-w-[400px] aspect-[4/1] md:aspect-[3/1] rounded-[var(--vendor-radius-panel)] overflow-hidden bg-white dark:bg-[#121212] border-2 border-dashed border-[var(--vendor-border)] dark:border-white/10 shadow-sm flex-grow select-none">
        {!resolvedImageUrl ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-50/50 dark:bg-white/2">
            <div className="w-10 h-10 rounded-[var(--vendor-radius-panel)] bg-white dark:bg-sidebar flex items-center justify-center text-[var(--vendor-text-muted)] dark:text-gray-500 shadow-sm border border-[var(--vendor-border)] dark:border-white/5">
              <ImageIcon size={20} />
            </div>
            <p className="text-[8px] text-[var(--vendor-text-muted)]/60 dark:text-gray-500/60">Recommended: 300 x 100 px</p>
          </div>
        ) : (
          <Image src={resolvedImageUrl} alt="Logo Preview" fill className="object-contain p-3" unoptimized />
        )}
      </div>

      <div
        onClick={() => !disabled && inputRef.current?.click()}
        className={`group relative w-full max-w-[400px] aspect-[4/1] md:aspect-[3/1] rounded-[var(--vendor-radius-panel)] overflow-hidden transition-all duration-500 bg-white dark:bg-[#121212] flex-grow ${
          disabled ? "cursor-default brightness-95" : "cursor-pointer"
        } border-2 border-dashed border-[var(--vendor-border)] dark:border-white/10 shadow-sm hover:border-primary/50`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-50/50 dark:bg-white/2 transition-colors group-hover:bg-primary/5">
          <div className="w-10 h-10 rounded-[var(--vendor-radius-panel)] bg-white dark:bg-sidebar flex items-center justify-center text-[var(--vendor-text-muted)] dark:text-gray-500 shadow-sm border border-[var(--vendor-border)] dark:border-white/5 transition-all duration-500 group-hover:scale-110 group-hover:text-primary group-hover:shadow-primary/20">
            {resolvedImageUrl ? <ImageIcon size={20} className="text-primary" /> : <Plus size={20} />}
          </div>
          <p className="text-[10px] font-black uppercase tracking-wide text-[var(--vendor-text-muted)] dark:text-gray-500">Upload Image</p>
          <p className="text-[8px] text-[var(--vendor-text-muted)]/60 dark:text-gray-500/60">Recommended: 300 x 100 px</p>
        </div>
        <input ref={inputRef} type="file" className="hidden" accept="image/*" onChange={onFileChange} />
      </div>
    </div>
  );
}
