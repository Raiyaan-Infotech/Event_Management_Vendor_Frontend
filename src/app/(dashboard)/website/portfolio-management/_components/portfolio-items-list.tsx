"use client";

import React, { useState } from "react";
import { Trash2, Pencil, Users, Award } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { resolveMediaUrl } from "@/lib/utils";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTableSearch } from "@/components/common/DataTableSearch";
import { DataTable, Column } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/PaginationControls";
import { ActionButton } from "@/components/common/ActionButton";
import { ColumnToggle } from "@/components/common/ColumnToggle";
import {
  usePortfolioItems,
  useTogglePortfolioItemStatus,
  useDeletePortfolioItem,
  PortfolioItem,
} from "@/hooks/use-vendor-portfolio";

interface Props {
  type: "client" | "sponsor";
}

export default function PortfolioItemsList({ type }: Props) {
  const isClient = type === "client";
  const label = isClient ? "Client" : "Sponsor";
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" | null }>({ key: "id", order: "desc" });
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [itemToDelete, setItemToDelete] = useState<PortfolioItem | null>(null);

  const { data: allItems = [], isLoading } = usePortfolioItems(type);
  const toggleStatus = useTogglePortfolioItemStatus(type);
  const deleteMutation = useDeletePortfolioItem(type);

  // client-side search + pagination (simple list, no server pagination needed)
  const filtered = allItems.filter((_, i) => true); // no text search since there's no name
  const total = filtered.length;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    await deleteMutation.mutateAsync(itemToDelete.id);
    setItemToDelete(null);
  };

  const columns: Column<PortfolioItem>[] = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      render: (item) => (
        <span className="text-[12px] font-black text-gray-400 group-hover:text-blue-500 transition-colors tracking-tighter">
          #{String(item.id).padStart(3, "0")}
        </span>
      ),
    },
    {
      key: "image_path",
      label: "LOGO",
      render: (item) => (
        <div className="w-16 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative shadow-sm group-hover:scale-110 transition-transform">
          <Image
            src={resolveMediaUrl(item.image_path)}
            alt={`${label} logo`}
            fill
            className="object-contain p-1"
          />
        </div>
      ),
    },
    {
      key: "is_active",
      label: "STATUS",
      sortable: true,
      render: (item) => (
        <button onClick={() => toggleStatus.mutate(item.id)}>
          <Badge className={cn(
            "text-[10px] font-bold px-3 py-0.5 rounded-full border-none shadow-sm cursor-pointer hover:opacity-80 transition-opacity",
            item.is_active ? "bg-emerald-500 text-white" : "bg-gray-300 text-gray-600"
          )}>
            {item.is_active ? "ACTIVE" : "INACTIVE"}
          </Badge>
        </button>
      ),
    },
    {
      key: "createdAt",
      label: "ADDED",
      sortable: true,
      render: (item) => (
        <span className="text-[12px] font-medium text-gray-500">
          {new Date(item.createdAt).toLocaleDateString("en-GB")}
        </span>
      ),
    },
  ];

  const allColumnKeys = columns.map((c) => c.key);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumnKeys);
  const [tempColumns, setTempColumns] = useState<string[]>(allColumnKeys);

  return (
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-3">
      <PageHeader
        title={`Portfolio ${label}s`}
        subtitle={`Manage ${label.toLowerCase()} logos displayed on your website.`}
        total={total}
        rightContent={
          <Link href={`/website/portfolio-management/${type}s/add`}>
            <ActionButton label={`ADD ${label.toUpperCase()}`} variant_type="Client" />
          </Link>
        }
      />

      <DataTableSearch
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
        placeholder={`Search ${label.toLowerCase()}s...`}
        isFiltered={false}
        columnContent={
          <ColumnToggle
            columns={columns.map((c) => ({ key: c.key, label: c.label }))}
            tempColumns={tempColumns}
            onToggle={(key) => setTempColumns((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key])}
            onToggleAll={() => setTempColumns(tempColumns.length === allColumnKeys.length ? [] : allColumnKeys)}
            onSave={() => { setVisibleColumns(tempColumns); toast.success("Columns updated"); }}
          />
        }
      />

      <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <DataTable
          data={paginated}
          columns={columns}
          visibleColumns={visibleColumns}
          selectedIds={selectedIds}
          rowIdKey="id"
          loading={isLoading}
          onSelect={(id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])}
          onSelectAll={() => setSelectedIds(selectedIds.length === paginated.length ? [] : paginated.map((s) => s.id))}
          onSort={(key) => setSortConfig((prev) => ({ key, order: prev.key === key && prev.order === "asc" ? "desc" : "asc" }))}
          sortConfig={sortConfig}
          noCard={true}
          actionContent={(item) => (
            <>
              <DropdownMenuItem
                onClick={() => router.push(`/website/portfolio-management/${type}s/edit/${item.id}`)}
                className="gap-2.5 rounded-lg py-2 cursor-pointer text-blue-500 focus:bg-blue-50"
              >
                <Pencil size={15} />
                <span className="text-[13px] font-semibold">Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setItemToDelete(item)}
                className="gap-2.5 rounded-lg py-2 cursor-pointer text-rose-500 focus:bg-rose-50"
              >
                <Trash2 size={15} />
                <span className="text-[13px] font-semibold">Delete</span>
              </DropdownMenuItem>
            </>
          )}
          emptyContent={
            <div className="flex flex-col items-center justify-center space-y-5 animate-in fade-in duration-700">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                {isClient ? <Users size={32} /> : <Award size={32} />}
              </div>
              <h4 className="text-2xl font-bold text-gray-800">No {label.toLowerCase()}s found</h4>
            </div>
          }
        />
        <PaginationControls
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalResults={total}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
        />
      </div>

      {/* Delete confirmation */}
      <Dialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <DialogContent className="sm:max-w-[420px] rounded-[40px] p-0 overflow-hidden border-none shadow-2xl shadow-rose-900/10">
          <div className="bg-gradient-to-b from-rose-50 to-white dark:from-rose-500/10 dark:to-[#111827] p-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-white dark:bg-gray-800 flex items-center justify-center text-rose-500 shadow-[0_15px_30px_-10px_rgba(225,29,72,0.3)] mb-8 animate-in zoom-in duration-500">
              <Trash2 size={40} strokeWidth={2.5} />
            </div>
            <DialogTitle className="text-2xl font-black text-gray-800 dark:text-gray-100 uppercase tracking-tighter">Remove {label}?</DialogTitle>
            <DialogDescription className="mt-4 text-gray-500 dark:text-gray-400 font-bold text-sm leading-relaxed">
              This logo will be permanently removed from your portfolio.
            </DialogDescription>
          </div>
          <DialogFooter className="p-8 bg-gray-50/50 dark:bg-gray-900 flex flex-row gap-4 border-t border-gray-50 dark:border-gray-800">
            <Button variant="ghost" onClick={() => setItemToDelete(null)} className="flex-1 h-12 rounded-2xl font-bold text-[12px] uppercase tracking-widest text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} disabled={deleteMutation.isPending} className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-[0_10px_20px_-5px_rgba(225,29,72,0.4)] hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-70">
              {deleteMutation.isPending ? "Removing..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
