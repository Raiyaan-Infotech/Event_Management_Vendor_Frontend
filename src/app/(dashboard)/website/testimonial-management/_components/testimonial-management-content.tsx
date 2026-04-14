"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Download, 
  Upload,
  User,
  Quote,
  Edit,
  Trash2,
  FileText,
  Eye,
  MoreVertical,
  Plus,
  EyeOff
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
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
  DialogHeader, 
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
import { MOCK_TESTIMONIALS } from "@/lib/data";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  name: string;
  eventName: string;
  image: string;
  comment: string;
  status: boolean;
}

export default function TestimonialManagementContent() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" | null }>({ key: "", order: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");
  
  // State for deletion and viewing
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const [testimonialToView, setTestimonialToView] = useState<Testimonial | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const toggleStatus = (id: string) => {
    const updated = testimonials.map(t => t.id === id ? { ...t, status: !t.status } : t);
    setTestimonials(updated);
    localStorage.setItem("testimonials_data", JSON.stringify(updated));
    toast.success("Visibility status updated");
  };

  const testimonialColumns: Column<Testimonial>[] = [
    { key: "name", label: "Customer", sortable: true, render: (item) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 relative overflow-hidden flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-700">
           {item.image ? (
             <Image src={item.image} alt={item.name} fill className="object-cover" />
           ) : (
             <User size={18} className="text-gray-400" />
           )}
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">{item.name}</span>
          <span className="text-[10px] font-bold text-gray-400 tracking-tighter">ID: #{item.id}</span>
        </div>
      </div>
    )},
    { key: "eventName", label: "Event Name", sortable: true, render: (item) => (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-orange-500" />
        <span className="text-[12px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-tight">{item.eventName || "General Event"}</span>
      </div>
    )},
    { key: "comment", label: "Review Content", sortable: false, render: (item) => (
      <div className="flex gap-2 max-w-[400px]">
        <Quote size={14} className="text-gray-300 shrink-0 mt-1" />
        <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed italic">"{item.comment}"</p>
      </div>
    )},
    { key: "status", label: "Status", sortable: true, render: (item) => (
      <div className="flex items-center gap-3">
        <Switch 
          checked={item.status} 
          onCheckedChange={() => toggleStatus(item.id)}
        />
        <Badge variant="outline" className={cn(
          "text-[10px] uppercase font-black tracking-widest px-2 py-0 border-none transition-colors",
          item.status ? "text-emerald-500 bg-emerald-50" : "text-gray-400 bg-gray-50"
        )}>
          {item.status ? "Showing" : "Hidden"}
        </Badge>
      </div>
    )},
  ];

  const allColumnKeys = testimonialColumns.map(c => c.key);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumnKeys);
  const [tempColumns, setTempColumns] = useState<string[]>(allColumnKeys);

  useEffect(() => {
    const savedData = localStorage.getItem("testimonials_data");
    const initialData = savedData ? JSON.parse(savedData) : MOCK_TESTIMONIALS;
    setTestimonials(initialData);
    if (!savedData) localStorage.setItem("testimonials_data", JSON.stringify(MOCK_TESTIMONIALS));
    setLoading(false);
  }, []);

  const handleDelete = () => {
    if (!testimonialToDelete) return;
    const updated = testimonials.filter(t => t.id !== testimonialToDelete.id);
    setTestimonials(updated);
    localStorage.setItem("testimonials_data", JSON.stringify(updated));
    setTestimonialToDelete(null);
    toast.success("Testimonial deleted");
  };

  const handleExport = () => {
    if (testimonials.length === 0) return toast.error("No data to export");
    const headers = ["ID", "Name", "Event Name", "Status", "Comment"];
    const csvContent = [
      headers.join(","),
      ...testimonials.map((t) => [t.id, `"${t.name}"`, `"${t.eventName}"`, `"${t.status ? "Showing" : "Hidden"}"`, `"${t.comment.replace(/"/g, '""')}"`].join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `testimonials_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("Testimonials exported successfully");
  };

  const handleImport = () => {
    toast.info("Import feature requires backend CSV processing.");
  };

  const filteredData = useMemo(() => {
    let result = [...testimonials].filter(item => {
      const matchesSearch = Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesStatus = filterStatus === "All" || (filterStatus === "Showing" ? item.status : !item.status);
      return matchesSearch && matchesStatus;
    });

    if (sortConfig.key && sortConfig.order) {
      result.sort((a, b) => {
        const aVal = String(a[sortConfig.key as keyof Testimonial]).toLowerCase();
        const bVal = String(b[sortConfig.key as keyof Testimonial]).toLowerCase();
        if (aVal < bVal) return sortConfig.order === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.order === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [testimonials, searchQuery, sortConfig]);

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
            <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv" className="hidden" />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="h-10 text-[12px] font-bold gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-wider">
              <Upload size={15} strokeWidth={2.5} /> Import
            </Button>
            <Button variant="outline" onClick={handleExport} className="h-10 text-[12px] font-bold gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-wider">
              <Download size={15} strokeWidth={2.5} /> Export
            </Button>
            <Link href="/website/testimonial-management/add">
              <ActionButton label="ADD TESTIMONIAL" variant_type="Event" />
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
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Display Status</p>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-10 rounded-xl text-[12px] font-bold border-gray-100 bg-gray-50/50 focus:ring-0">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100">
                  <SelectItem value="All" className="text-[12px] font-bold">All Status</SelectItem>
                  <SelectItem value="Showing" className="text-[12px] font-bold">Showing</SelectItem>
                  <SelectItem value="Hidden" className="text-[12px] font-bold">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" onClick={() => setFilterStatus("All")} className="w-full h-10 rounded-xl text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all">
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
            onSave={() => { setVisibleColumns(tempColumns); toast.success("Columns updated"); }}
          />
        }
      />

      <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <DataTable 
          data={paginatedData}
          columns={testimonialColumns}
          visibleColumns={visibleColumns}
          selectedIds={selectedIds}
          rowIdKey="id"
          loading={loading}
          onSelect={(id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
          onSelectAll={() => setSelectedIds(selectedIds.length === paginatedData.length ? [] : paginatedData.map(d => d.id))}
          onSort={(key) => setSortConfig(prev => ({ key, order: prev.key === key && prev.order === "asc" ? "desc" : "asc" }))}
          sortConfig={sortConfig}
          noCard={true}
          actionContent={(item) => (
            <>
              <DropdownMenuItem onClick={() => setTestimonialToView(item)} className="gap-2.5 rounded-lg py-2 cursor-pointer text-gray-600">
                 <Eye size={15} className="text-blue-500" /> <span className="text-[13px] font-semibold">View</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/website/testimonial-management/edit/${item.id}`)} className="gap-2.5 rounded-lg py-2 cursor-pointer text-gray-600">
                 <Edit size={15} className="text-emerald-500" /> <span className="text-[13px] font-semibold">Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTestimonialToDelete(item)} className="gap-2.5 rounded-lg py-2 cursor-pointer text-rose-500 focus:bg-rose-50">
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
      <Dialog open={!!testimonialToView} onOpenChange={(o) => !o && setTestimonialToView(null)}>
        <DialogContent className="max-w-[600px] rounded-[2rem] p-8 border-none shadow-2xl overflow-hidden">
          {testimonialToView && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 border border-blue-500/10 relative">
                    {testimonialToView.image ? (
                      <Image src={testimonialToView.image} alt={testimonialToView.name} width={64} height={64} className="object-cover rounded-xl" />
                    ) : (
                      <User size={32} />
                    )}
                    {!testimonialToView.status && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white border-2 border-white">
                        <EyeOff size={10} />
                      </div>
                    )}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-black text-gray-900 dark:text-white font-poppins uppercase tracking-tight">{testimonialToView.name}</DialogTitle>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{testimonialToView.eventName || "General Event"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Status</p>
                  <Badge className={cn("rounded-full px-3", testimonialToView.status ? "bg-emerald-500" : "bg-gray-400")}>
                    {testimonialToView.status ? "SHOWING" : "HIDDEN"}
                  </Badge>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl relative">
                <Quote size={24} className="text-blue-500/20 absolute top-4 left-4" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 italic leading-relaxed pl-6 pt-2">
                  "{testimonialToView.comment}"
                </p>
              </div>
              <DialogFooter>
                <Button onClick={() => setTestimonialToView(null)} className="w-full h-12 rounded-2xl bg-[#001720] font-bold uppercase tracking-widest text-xs">Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!testimonialToDelete} onOpenChange={(o) => !o && setTestimonialToDelete(null)}>
        <DialogContent className="sm:max-w-[420px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-rose-50 p-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center text-rose-500 shadow-xl mb-6">
              <Trash2 size={40} />
            </div>
            <DialogTitle className="text-xl font-black text-gray-800 uppercase tracking-tight">Delete Testimonial?</DialogTitle>
            <DialogDescription className="mt-4 text-gray-500 font-bold text-xs leading-relaxed max-w-[250px]">
              This will permanently remove the feedback from <span className="text-rose-600">{testimonialToDelete?.name}</span>.
            </DialogDescription>
          </div>
          <DialogFooter className="p-8 bg-white flex flex-row gap-4">
            <Button variant="ghost" onClick={() => setTestimonialToDelete(null)} className="flex-1 h-12 rounded-2xl font-bold text-xs uppercase tracking-widest text-gray-400">Cancel</Button>
            <Button onClick={handleDelete} className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
