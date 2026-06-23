"use client";

import Image from "next/image";
import { Edit2, GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface SliderManagementRow {
  id: string | number;
  title: string;
  buttonLabel?: string;
  imageUrl?: string | null;
  enabled: boolean;
}

interface SliderManagementTableProps {
  rows: SliderManagementRow[];
  title?: string;
  subtitle?: string;
  addLabel?: string;
  onAdd?: () => void;
  onEdit?: (row: SliderManagementRow) => void;
  onDelete?: (row: SliderManagementRow) => void;
  onStatusChange?: (row: SliderManagementRow, enabled: boolean) => void;
  className?: string;
}

export function SliderManagementTable({
  rows,
  title = "Slider Management",
  subtitle = "Add, reorder, or remove slides.",
  addLabel = "Add New Slide",
  onAdd,
  onEdit,
  onDelete,
  onStatusChange,
  className,
}: SliderManagementTableProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-black text-[var(--vendor-text)]">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-[13px] font-medium text-[var(--vendor-text-muted)]">
              {subtitle}
            </p>
          ) : null}
        </div>
        {onAdd ? (
          <Button type="button" onClick={onAdd}>
            <Plus className="h-4 w-4" />
            {addLabel}
          </Button>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12" />
              <TableHead className="w-16">#</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Button</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>
                  <GripVertical className="h-4 w-4 cursor-grab text-[var(--vendor-text-muted)]" />
                </TableCell>
                <TableCell className="font-bold">{index + 1}</TableCell>
                <TableCell>
                  <div className="relative h-12 w-20 overflow-hidden rounded-[var(--vendor-radius-control)] bg-[var(--vendor-secondary-btn)]">
                    {row.imageUrl ? (
                      <Image src={row.imageUrl} alt={row.title} fill className="object-cover" unoptimized />
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="font-bold text-[var(--vendor-text)]">{row.title}</TableCell>
                <TableCell>{row.buttonLabel ?? "-"}</TableCell>
                <TableCell>
                  <Switch
                    checked={row.enabled}
                    onCheckedChange={(checked) => onStatusChange?.(row, checked)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-2">
                    {onEdit ? (
                      <Button type="button" variant="outline" size="icon-sm" onClick={() => onEdit(row)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    ) : null}
                    {onDelete ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() => onDelete(row)}
                        className="text-rose-500 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
