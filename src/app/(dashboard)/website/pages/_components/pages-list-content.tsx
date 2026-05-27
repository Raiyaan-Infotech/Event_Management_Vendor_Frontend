"use client";

import React, { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Eye, Layout } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { DataTableSearch } from "@/components/common/DataTableSearch";
import { PaginationControls } from "@/components/common/PaginationControls";
import { ActionButton } from "@/components/common/ActionButton";
import { ColumnToggle } from "@/components/common/ColumnToggle";
import { TableImportExportActions } from "@/components/common/TableImportExportActions";
import { useVendorPages, useDeleteVendorPage, VendorPage } from "@/hooks/use-vendor-pages";

interface PageRow {
  id: number;
  name: string;
  created_at: string;
}

export default function PagesListContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" | null }>({ key: "id", order: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const { data: pagesData, isLoading } = useVendorPages({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery || undefined,
    sort_by: sortConfig.key || undefined,
    sort_order: sortConfig.order || undefined,
  });

  const { mutate: deletePage, isPending: isDeleting } = useDeleteVendorPage();
  const [pageToDelete, setPageToDelete] = useState<PageRow | null>(null);

  const confirmDelete = () => {
    if (!pageToDelete) return;
    deletePage(pageToDelete.id, {
      onSuccess: () => setPageToDelete(null),
    });
  };

  const pages: PageRow[] = useMemo(() => {
    return (pagesData?.data ?? []).map((p: VendorPage) => ({
      id: p.id,
      name: p.name,
      created_at: new Date(p.createdAt).toLocaleDateString("en-GB"),
    }));
  }, [pagesData]);

  const total = pagesData?.pagination?.total ?? 0;

  const pageColumns: Column<PageRow>[] = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      render: (item) => (
        <span className="text-[12px] font-black text-[var(--vendor-text-muted)] group-hover:text-[var(--vendor-primary-btn)] transition-colors tracking-tighter">
          #{item.id.toString().padStart(2, '0')}
        </span>
      ),
    },
    {
      key: "name",
      label: "NAME",
      sortable: true,
      render: (item) => (
        <p className="text-[14px] font-bold text-[var(--vendor-text)] group-hover:text-[var(--vendor-primary-btn)] transition-colors tracking-tight">
          {item.name}
        </p>
      ),
    },
    {
      key: "created_at",
      label: "CREATED AT",
      sortable: true,
      render: (item) => (
        <p className="text-[13px] font-medium text-gray-500 dark:text-gray-500 tracking-tight">
          {item.created_at}
        </p>
      ),
    },
  ];

  const allColumnKeys = pageColumns.map(c => c.key);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumnKeys);
  const [tempColumns, setTempColumns] = useState<string[]>(allColumnKeys);

  const handleExport = () => {
    toast.info("Export feature needs backend implementation.");
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value = "";
    toast.info("Import feature needs backend implementation.");
  };

  return (
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-3">
      <PageHeader
        title="PAGES"
        subtitle="View and manage all your website's static and dynamic pages in one place."
        total={total}
        rightContent={
          <div className="flex items-center gap-2">
            <TableImportExportActions
              onImport={handleImport}
              onExport={handleExport}
              buttonClassName="h-10 text-[var(--vendor-control-text)] font-semibold gap-2 border-slate-200 dark:border-[var(--vendor-border)] text-slate-600 hover:bg-slate-50 transition-all rounded-[var(--vendor-radius-control)] shadow-sm uppercase tracking-wider"
            />
            <Link href="/website/pages/create">
              <ActionButton label="CREATE" variant_type="Client" icon={Plus} />
            </Link>
          </div>
        }
      />

      <DataTableSearch
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
        placeholder="Search pages by name..."
        isFiltered={false}
        columnContent={
          <ColumnToggle
            columns={pageColumns.map(c => ({ key: c.key, label: c.label }))}
            tempColumns={tempColumns}
            onToggle={(key) => setTempColumns(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
            onToggleAll={() => setTempColumns(tempColumns.length === allColumnKeys.length ? [] : allColumnKeys)}
            onSave={() => { setVisibleColumns(tempColumns); toast.success("Columns updated"); }}
          />
        }
      />

      <div className="flex-1 min-h-0 flex flex-col bg-[var(--vendor-panel-bg)] rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <DataTable
          data={pages}
          columns={pageColumns}
          visibleColumns={visibleColumns}
          selectedIds={selectedIds}
          rowIdKey="id"
          loading={isLoading}
          onSelect={(id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
          onSelectAll={() => setSelectedIds(selectedIds.length === pages.length ? [] : pages.map(d => d.id))}
          onSort={(key) => setSortConfig(prev => ({ key, order: prev.key === key && prev.order === "asc" ? "desc" : "asc" }))}
          sortConfig={sortConfig}
          noCard={true}
          actionContent={(item) => (
            <>
              <DropdownMenuItem
                onClick={() => router.push(`/website/pages/view/${item.id}`)}
                className="gap-2.5 rounded-[var(--vendor-radius-control)] py-2 cursor-pointer text-gray-700"
              >
                <Eye size={15} className="text-violet-500" /> <span className="text-[13px] font-semibold">View</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/website/pages/edit/${item.id}`)}
                className="gap-2.5 rounded-[var(--vendor-radius-control)] py-2 cursor-pointer"
              >
                <Edit2 size={15} className="text-[var(--vendor-primary-btn)]" /> <span className="text-[13px] font-semibold text-gray-600">Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setPageToDelete(item)}
                className="gap-2.5 rounded-[var(--vendor-radius-control)] py-2 cursor-pointer text-rose-500 focus:bg-rose-50"
              >
                <Trash2 size={15} /> <span className="text-[13px] font-semibold">Delete</span>
              </DropdownMenuItem>
            </>
          )}
          emptyContent={
            <div className="flex flex-col items-center justify-center space-y-5 animate-in fade-in duration-700">
               <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                  <Layout size={32} />
               </div>
               <h4 className="text-2xl font-bold text-gray-800">No pages found</h4>
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

      <Dialog open={!!pageToDelete} onOpenChange={(open) => !open && setPageToDelete(null)}>
        <DialogContent className="sm:max-w-[420px] rounded-[var(--vendor-radius-panel)] p-0 overflow-hidden border-none shadow-2xl shadow-rose-900/10">
          <div className="bg-gradient-to-b from-rose-50 to-white dark:from-rose-500/10 dark:to-[#111827] p-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-[var(--vendor-radius-panel)] bg-[var(--vendor-panel-bg)] flex items-center justify-center text-rose-500 shadow-[0_15px_30px_-10px_rgba(225,29,72,0.3)] mb-8">
              <Trash2 size={40} strokeWidth={2.5} />
            </div>
            <DialogTitle className="text-[var(--vendor-title-text)] font-bold text-[var(--vendor-text)] uppercase tracking-tighter">Delete Page?</DialogTitle>
            <DialogDescription className="mt-4 text-[var(--vendor-text-muted)] font-bold text-sm leading-relaxed max-w-[280px]">
              You are about to permanently delete{" "}
              <span className="text-rose-600 underline underline-offset-4 decoration-rose-200">{pageToDelete?.name}</span>.
              This will also remove it from any menus that reference it.
            </DialogDescription>
          </div>
          <DialogFooter className="p-8 bg-gray-50/50 dark:bg-gray-900 flex flex-row gap-4 border-t border-[var(--vendor-border)]">
            <Button
              variant="ghost"
              onClick={() => setPageToDelete(null)}
              className="flex-1 h-12 rounded-[var(--vendor-radius-panel)] font-bold text-[12px] uppercase tracking-wide text-[var(--vendor-text-muted)] hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-[var(--vendor-radius-panel)] font-black text-[12px] uppercase tracking-wide shadow-[0_10px_20px_-5px_rgba(225,29,72,0.4)] hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-70"
            >
              {isDeleting ? "Removing..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
