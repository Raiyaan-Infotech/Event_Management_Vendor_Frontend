"use client";

import React, { useState } from "react";
import { Trash2, Edit, Image as ImageIcon, Layout } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
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
  useVendorSliders,
  useDeleteVendorSlider,
  useUpdateVendorSliderStatus,
  VendorSlider,
} from "@/hooks/use-vendor-sliders";

export default function AdvanceSliderList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" | null }>({ key: "created_at", order: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterAlignment, setFilterAlignment] = useState("All");
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const { data, isLoading } = useVendorSliders({
    type: "advanced",
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery || undefined,
    sort_by: sortConfig.key,
    sort_order: sortConfig.order ?? "desc",
    ...(filterStatus !== "All" && { status: filterStatus.toLowerCase() as "published" | "draft" }),
  });

  const deleteMutation = useDeleteVendorSlider();
  const [sliderToDelete, setSliderToDelete] = useState<VendorSlider | null>(null);

  const handleDelete = async () => {
    if (!sliderToDelete) return;
    await deleteMutation.mutateAsync(sliderToDelete.id);
    setSliderToDelete(null);
  };

  const sliders = data?.data ?? [];
  const total = data?.pagination?.total ?? 0;

  const advanceSliderColumns: Column<VendorSlider>[] = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      render: (item) => (
        <span className="text-[12px] font-black text-gray-400 group-hover:text-indigo-500 transition-colors tracking-tighter">
          #{String(item.id).slice(-4)}
        </span>
      ),
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (item) => (
        <div className="flex flex-col gap-1 text-gray-700 font-bold">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.title_color ?? "#fff" }} />
            <span className="text-[14px] font-black tracking-tight">{item.title}</span>
          </div>
          <p className="text-[10px] text-gray-400 font-medium line-clamp-1 max-w-[240px] pl-4">{item.description ?? ""}</p>
        </div>
      ),
    },
    {
      key: "button_label",
      label: "Button",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-bold text-gray-600 dark:text-gray-400 leading-none">{item.button_label}</span>
          <span className="text-[10px] font-medium text-indigo-500/80 italic">{item.page?.name ?? "—"}</span>
        </div>
      ),
    },
    {
      key: "image_path",
      label: "Visuals",
      render: (item) => (
        <div className="w-16 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative shadow-sm group-hover:scale-110 transition-transform">
          {item.image_path ? (
            <Image src={resolveMediaUrl(item.image_path)} alt={item.title} fill className="object-cover" />
          ) : (
            <ImageIcon size={14} className="text-gray-300 absolute inset-0 m-auto" />
          )}
          <div className="absolute inset-0 bg-black/20" />
        </div>
      ),
    },
    {
      key: "content_alignment",
      label: "Alignment",
      sortable: true,
      render: (item) => (
        <span className="text-[12px] font-bold text-gray-500 uppercase tracking-tight capitalize">
          {item.content_alignment ?? "—"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (item) => (
        <Badge className={cn(
          "text-[10px] font-bold px-3 py-0.5 rounded-full border-none shadow-sm",
          item.status === "published" ? "bg-emerald-500 text-white" : "bg-gray-400 text-white"
        )}>
          {item.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: "is_active",
      label: "Active",
      render: (item) => (
        <Badge className={cn(
          "text-[10px] font-bold px-3 py-0.5 rounded-full border-none shadow-sm",
          item.is_active ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"
        )}>
          {item.is_active ? "YES" : "NO"}
        </Badge>
      ),
    },
  ];

  // Filter by alignment client-side (backend doesn't support it yet)
  const filteredSliders = filterAlignment === "All"
    ? sliders
    : sliders.filter((s) => s.content_alignment === filterAlignment);

  const allColumnKeys = advanceSliderColumns.map((c) => c.key);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumnKeys);
  const [tempColumns, setTempColumns] = useState<string[]>(allColumnKeys);

  return (
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-3">
      <PageHeader
        title="Advance Slider"
        subtitle="Full-screen cinematic banners with custom overlays and typography."
        total={total}
        rightContent={
          <Link href="/website/home-slider/advance-slider/add">
            <ActionButton label="ADD SLIDER" variant_type="Client" />
          </Link>
        }
      />

      <DataTableSearch
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
        placeholder="Search advance sliders..."
        isFiltered={filterStatus !== "All" || filterAlignment !== "All"}
        filterContent={
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Slider Status</p>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-10 rounded-xl text-[12px] font-bold border-gray-100 bg-gray-50/50 focus:ring-0">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100">
                  <SelectItem value="All" className="text-[12px] font-bold">All Status</SelectItem>
                  <SelectItem value="Published" className="text-[12px] font-bold">Published</SelectItem>
                  <SelectItem value="Draft" className="text-[12px] font-bold">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Content Alignment</p>
              <Select value={filterAlignment} onValueChange={setFilterAlignment}>
                <SelectTrigger className="h-10 rounded-xl text-[12px] font-bold border-gray-100 bg-gray-50/50 focus:ring-0">
                  <SelectValue placeholder="All Alignments" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100">
                  <SelectItem value="All" className="text-[12px] font-bold">All Alignments</SelectItem>
                  <SelectItem value="left" className="text-[12px] font-bold uppercase">Left</SelectItem>
                  <SelectItem value="center" className="text-[12px] font-bold uppercase">Center</SelectItem>
                  <SelectItem value="right" className="text-[12px] font-bold uppercase">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" onClick={() => { setFilterStatus("All"); setFilterAlignment("All"); }} className="w-full h-10 rounded-xl text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all">
              Reset Filters
            </Button>
          </div>
        }
        columnContent={
          <ColumnToggle
            columns={advanceSliderColumns.map((c) => ({ key: c.key, label: c.label }))}
            tempColumns={tempColumns}
            onToggle={(key) => setTempColumns((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key])}
            onToggleAll={() => setTempColumns(tempColumns.length === allColumnKeys.length ? [] : allColumnKeys)}
            onSave={() => { setVisibleColumns(tempColumns); toast.success("Columns updated"); }}
          />
        }
      />

      <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <DataTable
          data={filteredSliders}
          columns={advanceSliderColumns}
          visibleColumns={visibleColumns}
          selectedIds={selectedIds}
          rowIdKey="id"
          loading={isLoading}
          onSelect={(id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])}
          onSelectAll={() => setSelectedIds(selectedIds.length === filteredSliders.length ? [] : filteredSliders.map((s) => s.id))}
          onSort={(key) => setSortConfig((prev) => ({ key, order: prev.key === key && prev.order === "asc" ? "desc" : "asc" }))}
          sortConfig={sortConfig}
          noCard={true}
          actionContent={(item) => (
            <>
              <DropdownMenuItem
                onClick={() => router.push(`/website/home-slider/advance-slider/add?edit=${item.id}`)}
                className="gap-2.5 rounded-lg py-2 cursor-pointer text-gray-600"
              >
                <Edit size={15} className="text-emerald-500" />
                <span className="text-[13px] font-semibold">Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSliderToDelete(item)}
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
                <Layout size={32} />
              </div>
              <h4 className="text-2xl font-bold text-gray-800">No sliders found</h4>
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

      <Dialog open={!!sliderToDelete} onOpenChange={(open) => !open && setSliderToDelete(null)}>
        <DialogContent className="sm:max-w-[420px] rounded-[40px] p-0 overflow-hidden border-none shadow-2xl shadow-rose-900/10">
          <div className="bg-gradient-to-b from-rose-50 to-white dark:from-rose-500/10 dark:to-[#111827] p-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-white dark:bg-gray-800 flex items-center justify-center text-rose-500 shadow-[0_15px_30px_-10px_rgba(225,29,72,0.3)] mb-8 animate-in zoom-in duration-500">
              <Trash2 size={40} strokeWidth={2.5} />
            </div>
            <DialogTitle className="text-2xl font-black text-gray-800 dark:text-gray-100 uppercase tracking-tighter">Delete Slider?</DialogTitle>
            <DialogDescription className="mt-4 text-gray-500 dark:text-gray-400 font-bold text-sm leading-relaxed max-w-[280px]">
              You are about to permanently delete{" "}
              <span className="text-rose-600 underline underline-offset-4 decoration-rose-200">{sliderToDelete?.title}</span>{" "}
              and all associated records.
            </DialogDescription>
          </div>
          <DialogFooter className="p-8 bg-gray-50/50 dark:bg-gray-900 flex flex-row gap-4 border-t border-gray-50 dark:border-gray-800">
            <Button
              variant="ghost"
              onClick={() => setSliderToDelete(null)}
              className="flex-1 h-12 rounded-2xl font-bold text-[12px] uppercase tracking-widest text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-[0_10px_20px_-5px_rgba(225,29,72,0.4)] hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-70"
            >
              {deleteMutation.isPending ? "Removing..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
