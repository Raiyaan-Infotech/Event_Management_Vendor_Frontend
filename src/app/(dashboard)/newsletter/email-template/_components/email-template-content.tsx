"use client";

import React, { useState } from "react";
import {
  Edit,
  Trash2,
  Eye,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTableSearch } from "@/components/common/DataTableSearch";
import { DataTable, Column } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/PaginationControls";
import { ActionButton } from "@/components/common/ActionButton";
import { ColumnToggle } from "@/components/common/ColumnToggle";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useVendorEmailTemplates,
  useDeleteVendorEmailTemplate,
  type VendorEmailTemplate,
} from "@/hooks/use-vendor-email-templates";
import { useEmailCategories } from "@/hooks/use-vendor-email-categories";

export default function EmailTemplateManagementContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" | null }>({ key: "", order: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [filterCategoryId, setFilterCategoryId] = useState("All");

  const { data: response, isLoading } = useVendorEmailTemplates({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
    ...(filterCategoryId !== "All" ? { category_id: filterCategoryId } : {}),
  });
  const { data: categoriesRes } = useEmailCategories({ limit: 100 });
  const deleteTemplate = useDeleteVendorEmailTemplate();

  const templates: VendorEmailTemplate[] = response?.data || [];
  const pagination = response?.pagination;
  const categories = categoriesRes?.data || [];

  const columns: Column<VendorEmailTemplate>[] = [
    {
      key: "s_no",
      label: "S.No",
      render: (_: VendorEmailTemplate, index: number) => (
        <span className="text-[var(--vendor-control-text)] font-semibold text-gray-600 dark:text-[var(--vendor-text-muted)]">
          {(currentPage - 1) * itemsPerPage + (index + 1)}
        </span>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (item) => (
        <div className="max-w-[260px]">
          <p
            title={item.name}
            className="text-[13px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight break-all line-clamp-2"
          >
            {item.name}
          </p>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (item) => {
        const plain = (item.description || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
        const snippet = plain.length > 200 ? plain.substring(0, 200) + "..." : plain || "No content provided";
        return (
          <div className="max-w-[500px] py-1">
            <p
              title={plain}
              className="text-[12px] font-medium text-[var(--vendor-text-muted)] leading-relaxed line-clamp-2 break-all italic"
            >
              {snippet}
            </p>
          </div>
        );
      },
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          <span className="text-[var(--vendor-control-text)] font-semibold text-gray-600 dark:text-[var(--vendor-text-muted)] uppercase tracking-tight">
            {item.category?.name || "—"}
          </span>
        </div>
      ),
    },
  ];

  const allColumnKeys = columns.map((c) => c.key);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumnKeys);
  const [tempColumns, setTempColumns] = useState<string[]>(allColumnKeys);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this template?")) {
      deleteTemplate.mutate(id);
    }
  };

  return (
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-3 bg-[#F8FAFC] dark:bg-black/40">
      <PageHeader
        title="EMAIL TEMPLATE"
        subtitle="Manage email templates."
        total={pagination?.total || 0}
        rightContent={
          <div className="flex items-center gap-2">
            <Link href="/newsletter/email-template/add">
              <ActionButton label="ADD TEMPLATE" variant_type="Client" />
            </Link>
          </div>
        }
      />

      <DataTableSearch
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
        placeholder="Search templates..."
        isFiltered={filterCategoryId !== "All"}
        filterContent={
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-[var(--vendor-form-label-text)] font-semibold uppercase text-[var(--vendor-text-muted)] tracking-wide ml-1">Category Filter</p>
              <Select value={filterCategoryId} onValueChange={(val) => { setFilterCategoryId(val); setCurrentPage(1); }}>
                <SelectTrigger className="h-10 rounded-[var(--vendor-radius-control)] text-[var(--vendor-control-text)] font-semibold border-[var(--vendor-border)] bg-gray-50/50 focus:ring-0">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="rounded-[var(--vendor-radius-control)] border-[var(--vendor-border)] font-bold">
                  <SelectItem value="All">All Categories</SelectItem>
                  {categories.map((cat: { id: number; name: string }) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" onClick={() => { setFilterCategoryId("All"); setCurrentPage(1); }} className="w-full h-10 rounded-[var(--vendor-radius-control)] text-[var(--vendor-control-text)] font-semibold uppercase tracking-wide text-rose-500 hover:bg-rose-50 transition-all font-bold">
              Reset Filters
            </Button>
          </div>
        }
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

      <div className="flex-1 min-h-0 flex flex-col bg-[var(--vendor-panel-bg)] rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <DataTable
          data={templates}
          columns={columns}
          visibleColumns={visibleColumns}
          selectedIds={selectedIds}
          rowIdKey="id"
          loading={isLoading}
          onSelect={(id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])}
          onSelectAll={() => setSelectedIds(selectedIds.length === templates.length ? [] : templates.map((d) => d.id))}
          onSort={(key) => setSortConfig((prev) => ({ key, order: prev.key === key && prev.order === "asc" ? "desc" : "asc" }))}
          sortConfig={sortConfig}
          noCard={true}
          actionContent={(item) => (
            <>
              <DropdownMenuItem onClick={() => router.push(`/newsletter/email-template/view/${item.id}`)} className="gap-2.5 rounded-[var(--vendor-radius-control)] py-2 cursor-pointer text-gray-600 font-bold">
                <Eye size={15} className="text-[var(--vendor-primary-btn)]" /> <span className="text-[13px]">View</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/newsletter/email-template/edit/${item.id}`)} className="gap-2.5 rounded-[var(--vendor-radius-control)] py-2 cursor-pointer text-gray-600 font-bold">
                <Edit size={15} className="text-emerald-500" /> <span className="text-[13px]">Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(item.id)} className="gap-2.5 rounded-[var(--vendor-radius-control)] py-2 cursor-pointer text-rose-500 focus:bg-rose-50 font-bold">
                <Trash2 size={15} /> <span className="text-[13px]">Delete</span>
              </DropdownMenuItem>
            </>
          )}
          emptyContent={
            <div className="flex flex-col items-center justify-center space-y-5 animate-in fade-in duration-700">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                <Mail size={32} />
              </div>
              <h4 className="text-2xl font-bold text-gray-800">No email templates found</h4>
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
