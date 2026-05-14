import React from "react";
import { Search, Filter, Columns } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { vendorUi } from "@/lib/vendor-ui";

interface DataTableSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder: string;
  filterContent?: React.ReactNode;
  columnContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  isFiltered?: boolean;
}

export function DataTableSearch({
  searchQuery,
  onSearchChange,
  placeholder,
  filterContent,
  columnContent,
  rightContent,
  isFiltered = false,
}: DataTableSearchProps) {
  return (
    <div className={cn("shrink-0 flex flex-col md:flex-row gap-3 items-center", vendorUi.panel.base, "p-3")}>
      <div className="relative flex-1 w-full md:w-auto group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--vendor-text-muted)] transition-colors group-focus-within:text-[var(--vendor-primary-btn)]">
          <Search size={18} />
        </div>
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="h-9 w-full pl-10 bg-[var(--vendor-page-bg)] transition-all text-[12px] font-medium"
        />
      </div>
      <div className="flex items-center gap-2">
        {filterContent && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-9 px-3 gap-2 text-[10px] uppercase tracking-wide",
                  isFiltered && "text-[var(--vendor-primary-btn)] border-[var(--vendor-primary-btn)] bg-[var(--vendor-table-row-hover)]"
                )}
              >
                <Filter size={16} /> Filters {isFiltered && "*"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-[var(--vendor-radius-panel)] p-3 border-[var(--vendor-border)] shadow-[var(--vendor-shadow-panel)]">
              {filterContent}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {columnContent && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 px-3 gap-2 text-[10px] uppercase tracking-wide">
                <Columns size={16} /> Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-[var(--vendor-radius-panel)] p-3 border-[var(--vendor-border)] shadow-[var(--vendor-shadow-panel)] overflow-hidden">
              {columnContent}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {rightContent}
      </div>
    </div>
  );
}