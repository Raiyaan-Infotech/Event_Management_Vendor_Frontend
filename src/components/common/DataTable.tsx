import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { vendorUi } from "@/lib/vendor-ui";
import { DashboardTableSkeleton } from "@/components/boneyard/dashboard-table-skeleton";

export interface Column<T> {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  visibleColumns: string[];
  selectedIds?: (string | number)[];
  onSelectAll?: () => void;
  onSelect?: (id: string | number) => void;
  onSort?: (key: string) => void;
  sortConfig?: { key: string; order: "asc" | "desc" | null };
  actionContent?: (item: T) => React.ReactNode;
  loading?: boolean;
  emptyContent?: React.ReactNode;
  rowIdKey: keyof T;
  noCard?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  visibleColumns,
  selectedIds = [],
  onSelectAll = () => {},
  onSelect = () => {},
  onSort,
  sortConfig,
  actionContent,
  loading = false,
  emptyContent,
  rowIdKey,
  noCard = false,
}: DataTableProps<T>) {
  const filteredColumns = columns.filter((col) => visibleColumns.includes(col.key));

  if (loading) {
    return <DashboardTableSkeleton />;
  }

  return (
    <div className={cn("vendor-data-table flex-1 min-h-0 flex flex-col", !noCard && vendorUi.table.wrapper, !noCard && "mb-4")}>
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        <table className={cn(vendorUi.table.table, "vendor-data-table")}>
          <thead className={vendorUi.table.head}>
            <tr className={vendorUi.table.headRow}>
              <th className={cn(vendorUi.table.headCell, "w-10 min-w-10")}>
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={selectedIds.length === data.length && data.length > 0}
                    onCheckedChange={onSelectAll}
                    className="border-[var(--vendor-border)] data-[state=checked]:bg-[var(--vendor-primary-btn)] data-[state=checked]:border-[var(--vendor-primary-btn)]"
                  />
                </div>
              </th>
              {filteredColumns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && onSort?.(col.key)}
                  className={cn(
                    vendorUi.table.headCell,
                    "cursor-pointer group active:opacity-70 select-none",
                    col.align === "center" && "text-center",
                    !col.sortable && "cursor-default"
                  )}
                >
                  <div className={cn("flex items-center gap-1.5 leading-3 transition-colors group-hover:text-[var(--vendor-text)]", col.align === "center" && "justify-center")}>
                    {col.label}
                    {col.sortable && (
                      <ArrowUpDown
                        size={8}
                        className={cn(
                          "transition-all",
                          sortConfig?.key === col.key ? "text-[var(--vendor-text)] opacity-100" : "opacity-30 group-hover:opacity-60"
                        )}
                      />
                    )}
                  </div>
                </th>
              ))}
              {actionContent && <th className={cn(vendorUi.table.headCell, "text-center")}>Action</th>}
            </tr>
          </thead>
          <tbody className={vendorUi.table.body}>
            {data.length > 0 ? (
              data.map((item, index) => {
                const id = item[rowIdKey] as string | number;
                return (
                  <tr key={id} className={cn(vendorUi.table.row, selectedIds.includes(id) && vendorUi.table.rowSelected)}>
                    <td className={cn(vendorUi.table.cell, "w-10 min-w-10")}>
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={selectedIds.includes(id)}
                          onCheckedChange={() => onSelect(id)}
                          className="border-[var(--vendor-border)] data-[state=checked]:bg-[var(--vendor-primary-btn)] data-[state=checked]:border-[var(--vendor-primary-btn)]"
                        />
                      </div>
                    </td>
                    {filteredColumns.map((col) => (
                      <td key={col.key} className={cn(vendorUi.table.cell, col.align === "center" && "text-center")}>
                        {col.render ? col.render(item, index) : (item[col.key as keyof T] as React.ReactNode)}
                      </td>
                    ))}
                    {actionContent && (
                      <td className={cn(vendorUi.table.cell, "text-center")}>
                        <div className="flex items-center justify-center gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[var(--vendor-radius-control)] hover:bg-[var(--vendor-table-row-hover)]">
                                <MoreVertical size={16} className="text-[var(--vendor-text-muted)]" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-[var(--vendor-radius-panel)] border-[var(--vendor-border)] p-1.5 shadow-[var(--vendor-shadow-panel)]">
                              {actionContent(item)}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={filteredColumns.length + (actionContent ? 2 : 1)} className="px-6 py-24 text-center bg-[var(--vendor-table-row-alt)] text-[var(--vendor-text-muted)]">
                  {emptyContent}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
