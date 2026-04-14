"use client";

import React, { useState, useMemo, useRef } from "react";
import { Plus, Edit2, Trash2, Eye, Upload, Download, FileText, Search, Layout } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { DataTableSearch } from "@/components/common/DataTableSearch";
import { PaginationControls } from "@/components/common/PaginationControls";
import { ActionButton } from "@/components/common/ActionButton";
import { ColumnToggle } from "@/components/common/ColumnToggle";
import { useVendorPages, useDeleteVendorPage, VendorPage } from "@/hooks/use-vendor-pages";

interface PageRow {
  id: number;
  name: string;
  created_at: string;
}

export default function PagesListContent() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const { mutate: deletePage } = useDeleteVendorPage();

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
        <span className="text-[12px] font-black text-gray-400 group-hover:text-blue-500 transition-colors tracking-tighter">
          #{item.id.toString().padStart(2, '0')}
        </span>
      ),
    },
    {
      key: "name",
      label: "NAME",
      sortable: true,
      render: (item) => (
        <p className="text-[14px] font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 transition-colors tracking-tight">
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

  const handleImport = () => {
    toast.info("Import feature needs backend implementation.");
  };

  return (
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-3">
      <PageHeader
        title="PAGES MANAGEMENT"
        subtitle="View and manage all your website's static and dynamic pages in one place."
        total={total}
        rightContent={
          <div className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv" className="hidden" />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="h-10 text-[12px] font-bold gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-wider">
              <Upload size={15} strokeWidth={2.5} /> Import
            </Button>
            <Button variant="outline" onClick={handleExport} className="h-10 text-[12px] font-bold gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-wider">
              <Download size={15} strokeWidth={2.5} /> Export
            </Button>
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

      <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden">
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
                className="gap-2.5 rounded-lg py-2 cursor-pointer text-gray-700"
              >
                <Eye size={15} className="text-violet-500" /> <span className="text-[13px] font-semibold">View</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/website/pages/edit/${item.id}`)}
                className="gap-2.5 rounded-lg py-2 cursor-pointer"
              >
                <Edit2 size={15} className="text-blue-500" /> <span className="text-[13px] font-semibold text-gray-600">Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => deletePage(item.id)}
                className="gap-2.5 rounded-lg py-2 cursor-pointer text-rose-500 focus:bg-rose-50"
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
    </div>
  );
}
