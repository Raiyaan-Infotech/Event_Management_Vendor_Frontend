"use client";

import React, { useState, useRef } from "react";
import { MapPin, Plus, Trash2, Edit2, Upload, Download, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { DataTableSearch } from "@/components/common/DataTableSearch";
import { ColumnToggle } from "@/components/common/ColumnToggle";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface GalleryItem {
  id: string;
  eventName: string;
  city: string;
  image: string;
  createdAt: string;
}

interface GalleryListProps {
  galleryItems: GalleryItem[];
  onDelete: (id: string) => void;
  onEdit: (item: GalleryItem) => void;
  loading?: boolean;
}

export default function GalleryList({
  galleryItems,
  onDelete,
  onEdit,
  loading = false,
}: GalleryListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<string[]>(["preview", "eventName", "city", "createdAt", "actions"]);
  const [tempColumns, setTempColumns] = useState<string[]>(["preview", "eventName", "city", "createdAt"]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null); // ← new
  const importInputRef = useRef<HTMLInputElement>(null);

  const filteredData = galleryItems.filter(
    (item) =>
      item.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedIds.length === filteredData.length && filteredData.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map((item) => item.id));
    }
  };

  const handleSelect = (id: string | number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    onDelete(itemToDelete.id);
    setItemToDelete(null);
  };

  const handleExport = () => {
    if (galleryItems.length === 0) return toast.error("No data to export");
    const headers = ["ID", "Event Name", "City", "Created At"];
    const csvContent = [
      headers.join(","),
      ...galleryItems.map((item) =>
        [item.id, `"${item.eventName}"`, `"${item.city}"`, item.createdAt].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gallery_export_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("Gallery exported successfully!");
  };

  const galleryColumns: Column<GalleryItem>[] = [
    {
      key: "preview",
      label: "Preview",
      sortable: false,
      render: (item) => (
        <div className="relative w-24 h-16 rounded-xl overflow-hidden shadow-sm border border-slate-100 group-hover:scale-105 transition-transform duration-300">
          <Image src={item.image} alt={item.eventName} fill className="object-cover" />
        </div>
      ),
    },
    {
      key: "eventName",
      label: "Event Name",
      sortable: true,
      render: (item) => (
        <span className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
          {item.eventName}
        </span>
      ),
    },
    {
      key: "city",
      label: "City / Location",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2 text-slate-500 font-bold text-[12px] uppercase tracking-widest">
          <MapPin size={14} className="text-emerald-500" />
          {item.city}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Upload Date",
      sortable: true,
      render: (item) => (
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-800">
          {item.createdAt}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (item) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(item)}
            className="w-10 h-10 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 transition-all"
          >
            <Edit2 size={16} />
          </Button>
          <Button
            onClick={() => setItemToDelete(item)} // ← open dialog instead of direct delete
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-xl hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 transition-all"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden min-h-0 pt-8 pb-3 bg-[#F8FAFC] dark:bg-black/40">
      <PageHeader
        title="GALLERY"
        subtitle="Manage your visual history and event memories."
        total={galleryItems.length}
        rightContent={
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={importInputRef}
              onChange={() => toast.info("Import feature requires backend CSV processing.")}
              accept=".csv"
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => importInputRef.current?.click()}
              className="h-10 text-[12px] font-bold gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-wider"
            >
              <Upload size={15} strokeWidth={2.5} /> Import
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              className="h-10 text-[12px] font-bold gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-wider"
            >
              <Download size={15} strokeWidth={2.5} /> Export
            </Button>
            <Button
              onClick={() => router.push("gallery/add")}
              className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[12px] font-bold shadow-lg shadow-emerald-500/30 flex items-center gap-3 transition-all hover:-translate-y-0.5 active:scale-95 border-none uppercase"
            >
              <Plus size={16} strokeWidth={3} /> ADD GALLERY
            </Button>
          </div>
        }
      />

      <DataTableSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search gallery by event name or city..."
        isFiltered={false}
        filterContent={
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Location Filter</p>
              <Select defaultValue="All">
                <SelectTrigger className="h-10 rounded-xl text-[12px] font-bold border-gray-100 bg-gray-50/50 focus:ring-0">
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100 font-bold">
                  <SelectItem value="All">All Cities</SelectItem>
                  <SelectItem value="Tirunelveli">Tirunelveli</SelectItem>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        }
        columnContent={
          <ColumnToggle
            columns={galleryColumns.filter((c) => c.key !== "actions").map((c) => ({ key: c.key, label: c.label }))}
            tempColumns={tempColumns}
            onToggle={(key) =>
              setTempColumns((prev) =>
                prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
              )
            }
            onToggleAll={() =>
              setTempColumns(
                tempColumns.length === galleryColumns.filter((c) => c.key !== "actions").length
                  ? []
                  : galleryColumns.filter((c) => c.key !== "actions").map((c) => c.key)
              )
            }
            onSave={() => { setVisibleColumns([...tempColumns, "actions"]); toast.success("Columns updated"); }}
          />
        }
      />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <DataTable
          columns={galleryColumns}
          data={filteredData}
          visibleColumns={visibleColumns}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelect={handleSelect}
          rowIdKey="id"
          loading={loading}
        />
      </div>

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <DialogContent className="sm:max-w-[420px] rounded-[40px] p-0 overflow-hidden border-none shadow-2xl shadow-rose-900/10">
          <div className="bg-gradient-to-b from-rose-50 to-white dark:from-rose-500/10 dark:to-[#111827] p-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-white dark:bg-gray-800 flex items-center justify-center text-rose-500 shadow-[0_15px_30px_-10px_rgba(225,29,72,0.3)] mb-8 animate-in zoom-in duration-500">
              <Trash2 size={40} strokeWidth={2.5} />
            </div>
            <DialogTitle className="text-2xl font-black text-gray-800 dark:text-gray-100 uppercase tracking-tighter">
              Delete Gallery Item?
            </DialogTitle>
            <DialogDescription className="mt-4 text-gray-500 dark:text-gray-400 font-bold text-sm leading-relaxed max-w-[280px]">
              You are about to permanently delete{" "}
              <span className="text-rose-600 underline underline-offset-4 decoration-rose-200">
                {itemToDelete?.eventName}
              </span>{" "}
              and all associated records.
            </DialogDescription>
          </div>
          <DialogFooter className="p-8 bg-gray-50/50 dark:bg-gray-900 flex flex-row gap-4 border-t border-gray-50 dark:border-gray-800">
            <Button
              variant="ghost"
              onClick={() => setItemToDelete(null)}
              className="flex-1 h-12 rounded-2xl font-bold text-[12px] uppercase tracking-widest text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-[0_10px_20px_-5px_rgba(225,29,72,0.4)] hover:-translate-y-1 active:scale-95 transition-all"
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}