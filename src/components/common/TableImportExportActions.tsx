"use client";

import React, { useRef } from "react";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableImportExportActionsProps {
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
  accept?: string;
  buttonClassName?: string;
}

export function TableImportExportActions({
  onImport,
  onExport,
  accept = ".csv",
  buttonClassName = "h-8 px-3 gap-1.5 text-[10px] font-bold uppercase tracking-wide",
}: TableImportExportActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input type="file" ref={fileInputRef} onChange={onImport} accept={accept} className="hidden" />
      <Button variant="outline" onClick={() => fileInputRef.current?.click()} className={buttonClassName}>
        <ArrowDownToLine size={13} strokeWidth={2.5} /> Import
      </Button>
      <Button variant="outline" onClick={onExport} className={buttonClassName}>
        <ArrowUpFromLine size={13} strokeWidth={2.5} /> Export
      </Button>
    </>
  );
}
