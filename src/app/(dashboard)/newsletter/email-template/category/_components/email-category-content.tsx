"use client";

import React, { useState, useMemo } from "react";
import { Edit, Trash2, Plus, FolderOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTableSearch } from "@/components/common/DataTableSearch";
import { DataTable, Column } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/PaginationControls";
import { ActionButton } from "@/components/common/ActionButton";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  useEmailCategories,
  useDeleteEmailCategory,
  type EmailCategory,
} from "@/hooks/use-vendor-email-categories";

export default function EmailCategoryContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" | null }>({ key: "", order: null });

  const { data: response, isLoading } = useEmailCategories({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
  });
  const deleteCategory = useDeleteEmailCategory();

  const categories: EmailCategory[] = response?.data || [];
  const pagination = response?.pagination;

  const columns: Column<EmailCategory>[] = [
    {
      key: "s_no",
      label: "S.No",
      render: (_: EmailCategory, index: number) => (
        <span className="text-[12px] font-bold text-gray-600 dark:text-gray-400">
          {(currentPage - 1) * itemsPerPage + (index + 1)}
        </span>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (item) => (
        <span className="text-[13px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
          {item.name}
        </span>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (item) => (
        <div className="max-w-[400px] py-1">
          <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 italic">
            {item.description || "—"}
          </p>
        </div>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (item) => (
        <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${item.is_active ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
          {item.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const allColumnKeys = columns.map((c) => c.key);
  const [visibleColumns] = useState<string[]>(allColumnKeys);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategory.mutate(id);
    }
  };

  return (
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-3 bg-[#F8FAFC] dark:bg-black/40">
      <PageHeader
        title="EMAIL CATEGORIES"
        subtitle="Manage email template categories."
        total={pagination?.total || 0}
        rightContent={
          <Link href="/newsletter/email-template/category/add">
            <ActionButton label="ADD CATEGORY" variant_type="Client" />
          </Link>
        }
      />

      <DataTableSearch
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
        placeholder="Search categories..."
      />

      <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <DataTable
          data={categories}
          columns={columns}
          visibleColumns={visibleColumns}
          selectedIds={selectedIds}
          rowIdKey="id"
          loading={isLoading}
          onSelect={(id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])}
          onSelectAll={() => setSelectedIds(selectedIds.length === categories.length ? [] : categories.map((d) => d.id))}
          onSort={(key) => setSortConfig((prev) => ({ key, order: prev.key === key && prev.order === "asc" ? "desc" : "asc" }))}
          sortConfig={sortConfig}
          noCard={true}
          actionContent={(item) => (
            <>
              <DropdownMenuItem onClick={() => router.push(`/newsletter/email-template/category/edit/${item.id}`)} className="gap-2.5 rounded-lg py-2 cursor-pointer text-gray-600 font-bold">
                <Edit size={15} className="text-emerald-500" /> <span className="text-[13px]">Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(item.id)} className="gap-2.5 rounded-lg py-2 cursor-pointer text-rose-500 focus:bg-rose-50 font-bold">
                <Trash2 size={15} /> <span className="text-[13px]">Delete</span>
              </DropdownMenuItem>
            </>
          )}
          emptyContent={
            <div className="flex flex-col items-center justify-center space-y-5 animate-in fade-in duration-700">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                <FolderOpen size={32} />
              </div>
              <h4 className="text-2xl font-bold text-gray-800">No email categories found</h4>
            </div>
          }
        />

        <PaginationControls
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalResults={pagination?.total || 0}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
        />
      </div>
    </div>
  );
}
