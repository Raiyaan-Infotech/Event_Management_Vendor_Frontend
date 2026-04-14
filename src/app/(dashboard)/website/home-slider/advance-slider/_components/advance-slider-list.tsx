"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Download,
  Upload,
  Search, 
  Image as ImageIcon,
  X,
  Edit2,
  Type,
  Layout,
  ExternalLink,
  Sliders
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTableSearch } from "@/components/common/DataTableSearch";
import { DataTable, Column } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/PaginationControls";
import { ActionButton } from "@/components/common/ActionButton";
import { ColumnToggle } from "@/components/common/ColumnToggle";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle 
} from "@/components/ui/dialog";

interface AdvanceSlider {
  id: string;
  title: string;
  titleColor: string;
  description: string;
  descriptionColor: string;
  buttonLabel: string;
  buttonUrl: string;
  buttonColor: string;
  alignment: "left" | "center" | "right";
  blur: number;
  brightness: number;
  overlayOpacity: number;
  image: string;
  status: string;
  isActive: boolean;
}

export default function AdvanceSliderList() {
  const router = useRouter();
  const [sliders, setSliders] = useState<AdvanceSlider[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" | null }>({ key: "id", order: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterAlignment, setFilterAlignment] = useState("All");
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<AdvanceSlider | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const advanceSliderColumns: Column<AdvanceSlider>[] = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      render: (item) => (
        <span className="text-[12px] font-black text-gray-400 group-hover:text-indigo-500 transition-colors tracking-tighter">
          #{item.id.slice(-4)}
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
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.titleColor }} />
              <span className="text-[14px] font-black tracking-tight">{item.title}</span>
           </div>
           <p className="text-[10px] text-gray-400 font-medium line-clamp-1 max-w-[240px] pl-4">{item.description}</p>
        </div>
      ),
    },
    {
      key: "image",
      label: "Visuals",
      render: (item) => (
        <div className="w-16 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative shadow-sm group-hover:scale-110 transition-transform">
           {item.image ? (
             <Image src={item.image} alt={item.title} fill className="object-cover" />
           ) : (
             <ImageIcon size={14} className="text-gray-300 absolute inset-0 m-auto" />
           )}
           <div className="absolute inset-0 bg-black/20" />
        </div>
      ),
    },
    {
      key: "alignment",
      label: "Alignment",
      sortable: true,
      render: (item) => (
        <span className="text-[12px] font-bold text-gray-500 uppercase tracking-tight capitalize">{item.alignment}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (item) => (
        <Badge className={cn(
           "text-[10px] font-bold px-3 py-0.5 rounded-full border-none shadow-sm",
           item.status === "Published" ? "bg-emerald-500 text-white" : "bg-gray-400 text-white"
        )}>
           {item.status.toUpperCase()}
        </Badge>
      ),
    },
  ];

  const allColumnKeys = advanceSliderColumns.map((c) => c.key);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumnKeys);
  const [tempColumns, setTempColumns] = useState<string[]>(allColumnKeys);

  useEffect(() => {
    const saved = localStorage.getItem("vendor_advance_sliders_data");
    if (saved) {
      setSliders(JSON.parse(saved));
    } else {
      const initial: AdvanceSlider[] = [
        { 
          id: "1", 
          title: "Luxury Event Management", 
          titleColor: "#ffffff",
          description: "Elevating your most precious moments with sophisticated design and flawless execution.", 
          descriptionColor: "#f1f5f9",
          buttonLabel: "Explore Services", 
          buttonUrl: "/events", 
          buttonColor: "#3b82f6", 
          alignment: "center",
          blur: 0,
          brightness: 100,
          overlayOpacity: 50,
          image: "", 
          status: "Published", 
          isActive: true 
        },
      ];
      setSliders(initial);
      localStorage.setItem("vendor_advance_sliders_data", JSON.stringify(initial));
    }
  }, []);

  const handleDelete = (id: string) => {
    const updated = sliders.filter(s => s.id !== id);
    setSliders(updated);
    localStorage.setItem("vendor_advance_sliders_data", JSON.stringify(updated));
    toast.success("Slider removed");
  };

  const handleExport = () => {
    if (sliders.length === 0) return toast.error("No data to export");
    const headers = ["ID", "Title", "Description", "Alignment", "Status"];
    const csvContent = [
      headers.join(","),
      ...sliders.map((s) => [s.id, `"${s.title}"`, `"${s.description}"`, `"${s.alignment}"`, `"${s.status}"`].join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `advance_sliders_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("Advance sliders exported successfully");
  };

  const handleImport = () => {
    toast.info("Import feature requires backend CSV processing.");
  };

  const filteredSliders = useMemo(() => {
    let result = sliders.filter(s => 
      (s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       s.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterStatus === "All" || s.status === filterStatus) &&
      (filterAlignment === "All" || s.alignment === filterAlignment)
    );

    if (sortConfig.key && sortConfig.order) {
       result.sort((a, b) => {
          const aValue = a[sortConfig.key as keyof AdvanceSlider];
          const bValue = b[sortConfig.key as keyof AdvanceSlider];
          if (aValue < bValue) return sortConfig.order === "asc" ? -1 : 1;
          if (aValue > bValue) return sortConfig.order === "asc" ? 1 : -1;
          return 0;
       });
    }

    return result;
  }, [sliders, searchQuery, sortConfig]);

  const paginatedSliders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSliders.slice(start, start + itemsPerPage);
  }, [filteredSliders, currentPage, itemsPerPage]);

  return (
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-3">
      <PageHeader
        title="Advance Slider"
        subtitle="Full-screen cinematic banners with custom overlays and typography."
        total={filteredSliders.length}
        rightContent={
          <div className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv" className="hidden" />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="h-10 text-[12px] font-bold gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-wider">
              <Upload size={15} strokeWidth={2.5} /> Import
            </Button>
            <Button variant="outline" onClick={handleExport} className="h-10 text-[12px] font-bold gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-wider">
              <Download size={15} strokeWidth={2.5} /> Export
            </Button>
            <Link href="/website/home-slider/advance-slider/add">
              <ActionButton label="ADD SLIDER" variant_type="Client" />
            </Link>
          </div>
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
            onSave={() => {
              setVisibleColumns(tempColumns);
              toast.success("Columns updated");
            }}
          />
        }
      />

      <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <DataTable
          data={paginatedSliders}
          columns={advanceSliderColumns}
          visibleColumns={visibleColumns}
          selectedIds={selectedIds}
          rowIdKey="id"
          loading={false}
          onSelect={(id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])}
          onSelectAll={() => setSelectedIds(selectedIds.length === paginatedSliders.length ? [] : paginatedSliders.map((s) => s.id))}
          onSort={(key) => setSortConfig((prev) => ({ key, order: prev.key === key && prev.order === "asc" ? "desc" : "asc" }))}
          sortConfig={sortConfig}
          noCard={true}
          actionContent={(item) => (
            <>
              <DropdownMenuItem
                onClick={() => router.push(`/website/home-slider/advance-slider/add?edit=${item.id}`)}
                className="gap-2.5 rounded-lg py-2 cursor-pointer text-gray-600"
              >
                <Edit size={15} className="text-emerald-500" /> <span className="text-[13px] font-semibold">Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(item.id)}
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
              <h4 className="text-2xl font-bold text-gray-800">No sliders found</h4>
            </div>
          }
        />
  
        <PaginationControls
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalResults={filteredSliders.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
        />
      </div>

      {/* Full Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[1200px] border-none shadow-2xl p-0 aspect-[16/9] overflow-hidden rounded-[3rem] bg-black">
          <DialogTitle className="sr-only">Advance Slider Preview</DialogTitle>
           {previewData && (
             <div className="relative w-full h-full flex flex-col justify-center">
                {previewData.image && (
                  <Image 
                    src={previewData.image} alt="Full" fill 
                    className="object-cover transition-all" 
                    style={{ 
                      filter: `blur(${previewData.blur}px) brightness(${previewData.brightness}%)` 
                    }} 
                  />
                )}
                <div 
                  className="absolute inset-0 bg-black"
                  style={{ opacity: previewData.overlayOpacity / 100 }}
                />

                <div className={cn(
                  "relative z-10 px-20 flex flex-col gap-6",
                  previewData.alignment === 'left' ? "items-start text-left" : previewData.alignment === 'right' ? "items-end text-right" : "items-center text-center"
                )}>
                   <h2 className="text-6xl font-black uppercase tracking-tighter drop-shadow-2xl animate-in slide-in-from-bottom-10 duration-1000" style={{ color: previewData.titleColor }}>{previewData.title}</h2>
                   <p className="max-w-3xl text-xl font-medium opacity-90 animate-in slide-in-from-bottom-6 duration-1000 delay-200" style={{ color: previewData.descriptionColor }}>{previewData.description}</p>
                   {previewData.buttonLabel && (
                      <Button style={{ backgroundColor: previewData.buttonColor }} className="h-16 px-16 rounded-full text-white font-black text-sm tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all animate-in zoom-in duration-1000 delay-500 uppercase">
                        {previewData.buttonLabel}
                      </Button>
                   )}
                </div>

                <Button onClick={() => setPreviewOpen(false)} variant="secondary" size="icon" className="absolute top-10 right-10 w-12 h-12 rounded-2xl bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-3xl border-none transition-all shadow-2xl z-50">
                   <X size={24} />
                </Button>
             </div>
           )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
