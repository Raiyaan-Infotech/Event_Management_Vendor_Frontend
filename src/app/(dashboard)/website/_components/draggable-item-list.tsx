"use client";

import type { LucideIcon } from "lucide-react";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DraggableItemListItem {
  id: string | number;
  label: string;
  icon?: LucideIcon;
  description?: string;
  rightContent?: React.ReactNode;
}

interface DraggableItemListProps {
  items: DraggableItemListItem[];
  onDelete?: (item: DraggableItemListItem) => void;
  onReorder?: (items: DraggableItemListItem[]) => void;
  emptyText?: string;
  className?: string;
}

export function DraggableItemList({
  items,
  onDelete,
  emptyText = "No items added.",
  className,
}: DraggableItemListProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {items.length ? (
        items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] px-3 py-2.5 shadow-xs"
            >
              <button
                type="button"
                className="cursor-grab text-[var(--vendor-text-muted)] active:cursor-grabbing"
                aria-label={`Drag ${item.label}`}
              >
                <GripVertical className="h-4 w-4" />
              </button>

              {Icon ? (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--vendor-radius-control)] bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]">
                  <Icon className="h-4 w-4" />
                </span>
              ) : null}

              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-black text-[var(--vendor-text)]">
                  {item.label}
                </p>
                {item.description ? (
                  <p className="truncate text-[11px] font-medium text-[var(--vendor-text-muted)]">
                    {item.description}
                  </p>
                ) : null}
              </div>

              {item.rightContent}

              {onDelete ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => onDelete(item)}
                  className="text-rose-500 hover:text-rose-600"
                  aria-label={`Delete ${item.label}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          );
        })
      ) : (
        <div className="rounded-[var(--vendor-radius-panel)] border border-dashed border-[var(--vendor-border)] p-6 text-center text-[13px] font-semibold text-[var(--vendor-text-muted)]">
          {emptyText}
        </div>
      )}
    </div>
  );
}
