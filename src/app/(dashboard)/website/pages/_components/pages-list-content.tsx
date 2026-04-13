"use client";

import React, { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" | null }>({ key: "", order: null });
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
      created_at: new Date(p.createdAt).toLocaleDateString(),
    }));
  }, [pagesData]);

  const total = pagesData?.pagination?.total ?? 0;

  const pageColumns: Column<PageRow>[] = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      render: (item) => <span className="text-[12px] font-black text-gray-400 group-hover:text-blue-500 transition-colors tracking-tighter">#{item.id.toString().padStart(2, '0')}</span>,
    },
    {
      key: "name",
      label: "NAME",
      sortable: true,
      render: (item) => <p className="text-[14px] font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 transition-colors tracking-tight">{item.name}</p>,
    },
    {
      key: "created_at",
      label: "CREATED AT",
      sortable: true,
      render: (item) => <p className="text-[13px] font-medium text-gray-500 dark:text-gray-500 tracking-tight">{item.created_at}</p>,
    },
  ];

  const allColumnKeys = pageColumns.map(c => c.key);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumnKeys);
  const [tempColumns, setTempColumns] = useState<string[]>(allColumnKeys);

  return (
    <div className="flex flex-col space-y-4 pt-4 pb-10">
      <DataTableSearch
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
        placeholder="Search pages by name..."
        isFiltered={false}
        rightContent={
          <div className="flex items-center gap-2">
            <ActionButton
              label="CREATE"
              variant_type="Client"
              icon={Plus}
              onClick={() => router.push("/website/pages/create")}
            />
          </div>
        }
        columnContent={
          <ColumnToggle
            columns={pageColumns.map(c => ({ key: c.key, label: c.label }))}
            tempColumns={tempColumns}
            onToggle={(key) => setTempColumns(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
            onToggleAll={() => setTempColumns(tempColumns.length === allColumnKeys.length ? [] : allColumnKeys)}
            onSave={() => setVisibleColumns(tempColumns)}
          />
        }
      />

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
          <div className="flex flex-col items-center justify-center space-y-3">
            <h4 className="text-xl font-bold text-gray-800">No pages found</h4>
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
  );
}
