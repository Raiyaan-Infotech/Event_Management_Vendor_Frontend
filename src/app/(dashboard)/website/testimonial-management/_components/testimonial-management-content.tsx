"use client";

import React, { useState, useMemo } from "react";
import {
  User,
  Quote,
  Edit,
  Trash2,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTableSearch } from "@/components/common/DataTableSearch";
import { DataTable, Column } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/PaginationControls";
import { ActionButton } from "@/components/common/ActionButton";
import { ColumnToggle } from "@/components/common/ColumnToggle";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Testimonial,
  useTestimonials,
  useToggleTestimonialStatus,
  useDeleteTestimonial,
} from "@/hooks/use-testimonials";

export default function TestimonialManagementContent() {
  const router = useRouter();
  const { data: testimonials = [], isLoading } = useTestimonials();
  const toggleStatus = useToggleTestimonialStatus();
  const deleteItem  = useDeleteTestimonial();

  const [searchQuery, setSearchQuery]   = useState("");
  const [sortConfig, setSortConfig]     = useState<{ key: string; order: "asc" | "desc" | null }>({ key: "", order: null });
  const [currentPage, setCurrentPage]   = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds]   = useState<(string | number)[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const [itemToDelete, setItemToDelete] = useState<Testimonial | null>(null);
  const [itemToView,   setItemToView]   = useState<Testimonial | null>(null);

  const testimonialColumns: Column<Testimonial>[] = [
    { key: "customer_name", label: "Customer", sortable: true, render: (item) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-[var(--vendor-radius-control)] bg-gray-100 dark:bg-gray-800 relative overflow-hidden flex items-center justify-center shrink-0 border border-[var(--vendor-border)]">
          {item.customer_portrait ? (
            <Image src={item.customer_portrait} alt={item.customer_name} fill className="object-cover" />
          ) : (
            <User size={18} className="text-[var(--vendor-text-muted)]" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">{item.customer_name}</span>
          <span className="text-[10px] font-bold text-[var(--vendor-text-muted)] tracking-tighter">ID: #{item.id}</span>
        </div>
      </div>
    )},
    { key: "event_name", label: "Event Name", sortable: true, render: (item) => (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-orange-500" />
        <span className="text-[var(--vendor-control-text)] font-semibold text-gray-600 dark:text-[var(--vendor-text-muted)] uppercase tracking-tight">{item.event_name || "General Event"}</span>
      </div>
    )},
    { key: "client_feedback", label: "Review Content", sortable: false, render: (item) => (
      <div className="flex gap-2 max-w-[400px]">
        <Quote size={14} className="text-gray-300 shrink-0 mt-1" />
        <p
          className="text-[12px] font-medium text-[var(--vendor-text-muted)] line-clamp-2 leading-relaxed italic"
          dangerouslySetInnerHTML={{ __html: item.client_feedback ? `"${item.client_feedback}"` : '—' }}
        />
      </div>
    )},
    { key: "is_active", label: "Status", sortable: true, render: (item) => (
      <div className="flex items-center gap-3">
        <Switch
          checked={!!item.is_active}
          onCheckedChange={() => toggleStatus.mutate(item.id)}
          disabled={toggleStatus.isPending}
        />
        <Badge variant="outline" className={cn(
          "text-[10px] uppercase font-black tracking-wide px-2 py-0 border-none transition-colors",
          item.is_active ? "text-emerald-500 bg-emerald-50" : "text-[var(--vendor-text-muted)] bg-gray-50"
        )}>
          {item.is_active ? "Showing" : "Hidden"}
        </Badge>
      </div>
    )},
  ];

  const allColumnKeys = testimonialColumns.map(c => c.key);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumnKeys);
  const [tempColumns,    setTempColumns]    = useState<string[]>(allColumnKeys);

  const handleDelete = () => {
    if (!itemToDelete) return;
    deleteItem.mutate(itemToDelete.id, { onSuccess: () => setItemToDelete(null) });
  };

  const filteredData = useMemo(() => {
    let result = [...testimonials].filter(item => {
      const matchesSearch = [item.customer_name, item.event_name, item.client_feedback]
        .some(v => String(v ?? '').toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus =
        filterStatus === "All" ||
        (filterStatus === "Showing" ? !!item.is_active : !item.is_active);
      return matchesSearch && matchesStatus;
    });

    if (sortConfig.key && sortConfig.order) {
      result.sort((a, b) => {
        const aVal = String((a as Record<string,unknown>)[sortConfig.key] ?? '').toLowerCase();
        const bVal = String((b as Record<string,unknown>)[sortConfig.key] ?? '').toLowerCase();
        if (aVal < bVal) return sortConfig.order === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.order === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [testimonials, searchQuery, sortConfig, filterStatus]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-3">
      <PageHeader
        title="TESTIMONIAL"
        subtitle="Manage client feedback for your website."
        total={testimonials.length}
        rightContent={
          <div className="flex items-center gap-2">
            <Link href="/website/testimonial-management/add">
              <ActionButton label="ADD TESTIMONIAL" variant_type="Client" />
            </Link>
          </div>
        }
      />

      <DataTableSearch
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
        placeholder="Search by customer name, event, or review content..."
        isFiltered={filterStatus !== "All"}
        filterContent={
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-[var(--vendor-form-label-text)] font-semibold uppercase text-[var(--vendor-text-muted)] tracking-wide ml-1">Display Status</p>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-10 rounded-[var(--vendor-radius-control)] text-[var(--vendor-control-text)] font-semibold border-[var(--vendor-border)] bg-gray-50/50 focus:ring-0">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="rounded-[var(--vendor-radius-control)] border-[var(--vendor-border)]">
                  <SelectItem value="All" className="text-[var(--vendor-control-text)] font-semibold">All Status</SelectItem>
                  <SelectItem value="Showing" className="text-[var(--vendor-control-text)] font-semibold">Showing</SelectItem>
                  <SelectItem value="Hidden" className="text-[var(--vendor-control-text)] font-semibold">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" onClick={() => setFilterStatus("All")} className="w-full h-10 rounded-[var(--vendor-radius-control)] text-[var(--vendor-control-text)] font-semibold uppercase tracking-wide text-rose-500 hover:bg-rose-50 transition-all">
              Reset Filters
            </Button>
          </div>
        }
        columnContent={
          <ColumnToggle
            columns={testimonialColumns.map(c => ({ key: c.key, label: c.label }))}
            tempColumns={tempColumns}
            onToggle={(key) => setTempColumns(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
            onToggleAll={() => setTempColumns(tempColumns.length === allColumnKeys.length ? [] : allColumnKeys)}
            onSave={() => setVisibleColumns(tempColumns)}
          />
        }
      />

      <div className="flex-1 min-h-0 flex flex-col bg-[var(--vendor-panel-bg)] rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <DataTable
          data={paginatedData}
          columns={testimonialColumns}
          visibleColumns={visibleColumns}
          selectedIds={selectedIds}
          rowIdKey="id"
          loading={isLoading}
          onSelect={(id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
          onSelectAll={() => setSelectedIds(selectedIds.length === paginatedData.length ? [] : paginatedData.map(d => d.id))}
          onSort={(key) => setSortConfig(prev => ({ key, order: prev.key === key && prev.order === "asc" ? "desc" : "asc" }))}
          sortConfig={sortConfig}
          noCard={true}
          actionContent={(item) => (
            <>
              <DropdownMenuItem onClick={() => setItemToView(item)} className="gap-2.5 rounded-[var(--vendor-radius-control)] py-2 cursor-pointer text-gray-600">
                <Eye size={15} className="text-[var(--vendor-primary-btn)]" /> <span className="text-[13px] font-semibold">View</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/website/testimonial-management/edit/${item.id}`)} className="gap-2.5 rounded-[var(--vendor-radius-control)] py-2 cursor-pointer text-gray-600">
                <Edit size={15} className="text-emerald-500" /> <span className="text-[13px] font-semibold">Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setItemToDelete(item)} className="gap-2.5 rounded-[var(--vendor-radius-control)] py-2 cursor-pointer text-rose-500 focus:bg-rose-50">
                <Trash2 size={15} /> <span className="text-[13px] font-semibold">Delete</span>
              </DropdownMenuItem>
            </>
          )}
          emptyContent={
            <div className="flex flex-col items-center justify-center space-y-5 animate-in fade-in duration-700">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                <FileText size={32} />
              </div>
              <h4 className="text-2xl font-bold text-gray-800">No testimonials found</h4>
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

      {/* View Modal */}
      <Dialog open={!!itemToView} onOpenChange={(o) => !o && setItemToView(null)}>
        <DialogContent className="max-w-[600px] rounded-[2rem] p-8 border-none shadow-2xl overflow-hidden">
          {itemToView && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-[var(--vendor-radius-panel)] bg-blue-500/10 flex items-center justify-center text-[var(--vendor-primary-btn)] border border-[var(--vendor-primary-btn)]/10 relative">
                    {itemToView.customer_portrait ? (
                      <Image src={itemToView.customer_portrait} alt={itemToView.customer_name} width={64} height={64} className="object-cover rounded-[var(--vendor-radius-control)]" />
                    ) : (
                      <User size={32} />
                    )}
                    {!itemToView.is_active && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white border-2 border-white">
                        <EyeOff size={10} />
                      </div>
                    )}
                  </div>
                  <div>
                    <DialogTitle className="text-[var(--vendor-title-text)] font-bold text-[var(--vendor-text)] font-poppins uppercase tracking-tight">{itemToView.customer_name}</DialogTitle>
                    <p className="text-[10px] font-bold text-[var(--vendor-text-muted)] uppercase tracking-wide">{itemToView.event_name || "General Event"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[var(--vendor-form-label-text)] font-semibold uppercase text-[var(--vendor-text-muted)] mb-1">Status</p>
                  <Badge className={cn("rounded-full px-3", itemToView.is_active ? "bg-emerald-500" : "bg-gray-400")}>
                    {itemToView.is_active ? "SHOWING" : "HIDDEN"}
                  </Badge>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-[var(--vendor-radius-panel)] relative">
                <Quote size={24} className="text-[var(--vendor-primary-btn)]/20 absolute top-4 left-4" />
                <div
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 italic leading-relaxed pl-6 pt-2"
                  dangerouslySetInnerHTML={{ __html: itemToView.client_feedback ?? '' }}
                />
              </div>
              <DialogFooter>
                <Button onClick={() => setItemToView(null)} className="w-full h-12 rounded-[var(--vendor-radius-panel)] bg-[#001720] font-bold uppercase tracking-wide text-xs">Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!itemToDelete} onOpenChange={(o) => !o && setItemToDelete(null)}>
        <DialogContent className="sm:max-w-[420px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-rose-50 p-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-[var(--vendor-radius-panel)] bg-white flex items-center justify-center text-rose-500 shadow-xl mb-6">
              <Trash2 size={40} />
            </div>
            <DialogTitle className="text-xl font-black text-gray-800 uppercase tracking-tight">Delete Testimonial?</DialogTitle>
            <DialogDescription className="mt-4 text-gray-500 font-bold text-xs leading-relaxed max-w-[250px]">
              This will permanently remove the feedback from <span className="text-rose-600">{itemToDelete?.customer_name}</span>.
            </DialogDescription>
          </div>
          <DialogFooter className="p-8 bg-white flex flex-row gap-4">
            <Button variant="ghost" onClick={() => setItemToDelete(null)} className="flex-1 h-12 rounded-[var(--vendor-radius-panel)] font-bold text-xs uppercase tracking-wide text-[var(--vendor-text-muted)]">Cancel</Button>
            <Button onClick={handleDelete} disabled={deleteItem.isPending} className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-[var(--vendor-radius-panel)] font-black text-xs uppercase tracking-wide">
              {deleteItem.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
