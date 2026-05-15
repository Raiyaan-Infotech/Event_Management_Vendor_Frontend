"use client";

import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface ListPageHeaderProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  search: string;
  onSearch: (v: string) => void;
  searchPlaceholder?: string;
  addLabel?: string;
  onAdd?: () => void;
  /** extra content placed after the Add button */
  extra?: React.ReactNode;
}

/**
 * Standard list-page card header — title + search input + Add button.
 * Replaces the copy-pasted <CardHeader> block on every list page.
 */
export function ListPageHeader({
  title, description, icon: Icon,
  search, onSearch, searchPlaceholder,
  addLabel, onAdd, extra,
}: ListPageHeaderProps) {
  return (
    <CardHeader>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder ?? `Search ${title.toLowerCase()}...`}
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          {onAdd && (
            <Button onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" />
              {addLabel ?? `Add ${title}`}
            </Button>
          )}
          {extra}
        </div>
      </div>
    </CardHeader>
  );
}
