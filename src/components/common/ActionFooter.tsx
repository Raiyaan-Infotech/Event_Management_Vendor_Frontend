"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionFooterProps {
  onSave?: (e: React.FormEvent) => void;
  onCancel?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  saveIcon?: LucideIcon;
  cancelIcon?: LucideIcon;
  isSubmitting?: boolean;
  className?: string;
}

export const ActionFooter = ({
  onSave,
  onCancel,
  saveLabel = "SAVE RECORD",
  cancelLabel = "CANCEL PROCESS",
  saveIcon: SaveIcon = Check,
  cancelIcon: CancelIcon = X,
  isSubmitting = false,
  className,
}: ActionFooterProps) => {
  return (
    <div className={cn("space-y-3 pt-4 w-full", className)}>
      <Button type="submit" disabled={isSubmitting} onClick={onSave} className="w-full h-12 gap-2 uppercase tracking-wide disabled:opacity-50">
        <SaveIcon size={18} strokeWidth={2.5} />
        {isSubmitting ? "Processing..." : saveLabel}
      </Button>

      <Button type="button" variant="outline" onClick={onCancel} className="w-full h-12 gap-2 uppercase tracking-wide border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
        <CancelIcon size={18} strokeWidth={2.5} /> {cancelLabel}
      </Button>
    </div>
  );
};