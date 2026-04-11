"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DataTable, Column } from "@/components/common/DataTable";
import { DataTableSearch } from "@/components/common/DataTableSearch";
import { PaginationControls } from "@/components/common/PaginationControls";
import { ActionButton } from "@/components/common/ActionButton";
import { ColumnToggle } from "@/components/common/ColumnToggle";
import { WEBSITE_CONTENT_PAGES } from "@/lib/data";
import { toast } from "sonner";

interface PageData {
  id: number;
  name: string;
  createdAt: string;
}

export default function PagesListContent() {
  const router = useRouter();
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" | null }>({ key: "", order: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const pageColumns: Column<PageData>[] = [
    { 
      key: "id", 
      label: "ID", 
      sortable: true, 
      render: (item) => <span className="text-[12px] font-black text-gray-400 group-hover:text-blue-500 transition-colors tracking-tighter">#{item.id.toString().padStart(2, '0')}</span> 
    },
    { 
      key: "name", 
      label: "NAME", 
      sortable: true, 
      render: (item) => <p className="text-[14px] font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 transition-colors tracking-tight">{item.name}</p> 
    },
    { 
      key: "createdAt", 
      label: "CREATED AT", 
      sortable: true, 
      render: (item) => <p className="text-[13px] font-medium text-gray-500 dark:text-gray-500 tracking-tight">{item.createdAt}</p> 
    },
  ];

  const allColumnKeys = pageColumns.map(c => c.key);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumnKeys);
  const [tempColumns, setTempColumns] = useState<string[]>(allColumnKeys);

  useEffect(() => {
    setPages(WEBSITE_CONTENT_PAGES);
    setLoading(false);
  }, []);

  const filteredData = useMemo(() => {
    const result = [...pages].filter(item => {
      const matchesSearch = Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
      return matchesSearch;
    });

    if (sortConfig.key && sortConfig.order) {
      result.sort((a, b) => {
        const aVal = String(a[sortConfig.key as keyof PageData]).toLowerCase();
        const bVal = String(b[sortConfig.key as keyof PageData]).toLowerCase();
        if (aVal < bVal) return sortConfig.order === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.order === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [pages, searchQuery, sortConfig]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            onSave={() => { setVisibleColumns(tempColumns); toast.success("Columns updated"); }}
          />
        }
      />

      <DataTable 
        data={paginatedData}
        columns={pageColumns}
        visibleColumns={visibleColumns}
        selectedIds={selectedIds}
        rowIdKey="id"
        loading={loading}
        onSelect={(id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
        onSelectAll={() => setSelectedIds(selectedIds.length === paginatedData.length ? [] : paginatedData.map(d => d.id))}
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
              onClick={() => {
                setPages((prev) => prev.filter((page) => page.id !== item.id));
                toast.success(`Deleted "${item.name}" page`);
              }}
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
        totalResults={filteredData.length}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
      />
    </div>
  );
}
