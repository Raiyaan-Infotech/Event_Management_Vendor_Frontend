"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Edit, 
  Trash2, 
  UserPlus, 
  Send, 
  History,
  Users,
  Search,
  Upload,
  Download
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTableSearch } from "@/components/common/DataTableSearch";
import { DataTable, Column } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/PaginationControls";
import { ActionButton } from "@/components/common/ActionButton";
import { ColumnToggle } from "@/components/common/ColumnToggle";
import { 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Subscriber {
  id: number;
  name: string;
  membership: string;
  status: "Subscribed" | "UnSubscribed";
}

export default function NewsletterManagementContent() {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" | null }>({ key: "", order: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [filterMembership, setFilterMembership] = useState("All");

  useEffect(() => {
    const saved = localStorage.getItem("newsletter_subscribers");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Filter out original mock IDs to ensure they are gone for the user
      const filtered = parsed.filter((s: any) => s.id !== 1 && s.id !== 2);
      setSubscribers(filtered);
      if (parsed.length !== filtered.length) {
        localStorage.setItem("newsletter_subscribers", JSON.stringify(filtered));
      }
    } else {
      setSubscribers([]);
    }
    setLoading(false);
  }, []);

  const columns: Column<Subscriber>[] = [
    { 
      key: "s_no", 
      label: "S.No", 
      render: (_, index) => (
        <span className="text-[12px] font-bold text-gray-600 dark:text-gray-400">
          {(currentPage - 1) * itemsPerPage + (index + 1)}
        </span>
      ) 
    },
    { 
      key: "name", 
      label: "Name", 
      sortable: true,
      render: (item) => (
        <span className="text-[13px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
          {item.name}
        </span>
      )
    },
    { 
      key: "membership", 
      label: "Client Membership", 
      sortable: true,
      render: (item) => (
        <span className="text-[12px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-500/20">
          {item.membership}
        </span>
      )
    },
    { 
      key: "status", 
      label: "Status", 
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${item.status === "Subscribed" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"}`} />
          <span className={`text-[11px] font-black uppercase tracking-widest ${item.status === "Subscribed" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
            {item.status}
          </span>
        </div>
      )
    },
  ];

  const allColumnKeys = columns.map(c => c.key);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumnKeys);
  const [tempColumns, setTempColumns] = useState<string[]>(allColumnKeys);

  const filteredData = useMemo(() => {
    const dataToFilter = Array.isArray(subscribers) ? subscribers : [];
    let result = [...dataToFilter].filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.membership.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMembership = filterMembership === "All" || item.membership === filterMembership;
      return matchesSearch && matchesMembership;
    });

    if (sortConfig.key && sortConfig.order) {
      result.sort((a, b) => {
        const aVal = String(a[sortConfig.key as keyof Subscriber]).toLowerCase();
        const bVal = String(b[sortConfig.key as keyof Subscriber]).toLowerCase();
        if (aVal < bVal) return sortConfig.order === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.order === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [subscribers, searchQuery, sortConfig, filterMembership]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (subscribers.length === 0) return toast.error("No data to export");
    const headers = ["ID", "Name", "Membership", "Status"];
    const csvContent = [
      headers.join(","),
      ...subscribers.map(s => [s.id, `"${s.name}"`, `"${s.membership}"`, `"${s.status}"`].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Subscribers exported successfully");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`Importing ${file.name}...`);
      // Mock import delay
      setTimeout(() => {
        toast.info("Importing logic requires backend integration.");
      }, 1000);
    }
  };

  return (
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-3 bg-[#F8FAFC] dark:bg-black/40">
      <PageHeader 
        title="NEWSLETTER" 
        subtitle="Manage your audience, send updates and track mail delivery status."
        total={subscribers.length}
        rightContent={
          <div className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv" className="hidden" />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="h-10 text-[11px] font-black gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-widest bg-white">
              <Upload size={15} strokeWidth={2.5} /> Import
            </Button>
            <Button variant="outline" onClick={handleExport} className="h-10 text-[11px] font-black gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-widest bg-white">
              <Download size={15} strokeWidth={2.5} /> Export
            </Button>
            <Link href="/website/newsletter/add">
              <ActionButton 
                  label="ADD SUBSCRIBER" 
                  variant_type="Client" 
                  icon={UserPlus} 
              />
            </Link>
            <Link href="/website/newsletter/send">
              <Button variant="outline" className="h-10 text-[11px] font-black gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-widest bg-white font-bold">
                <Send size={15} strokeWidth={2.5} className="text-emerald-500" /> Send Mail
              </Button>
            </Link>
            <Link href="/website/newsletter/mail-status">
              <Button variant="outline" className="h-10 text-[11px] font-black gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-widest bg-white">
                <History size={15} strokeWidth={2.5} className="text-blue-500" /> Mail Status
              </Button>
            </Link>
          </div>
        }
      />

      <DataTableSearch 
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
        placeholder="Search by name or membership..."
        isFiltered={filterMembership !== "All"}
        filterContent={
          <div className="space-y-4">
             <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Membership Filter</p>
                <Select value={filterMembership} onValueChange={setFilterMembership}>
                   <SelectTrigger className="h-10 rounded-xl text-[12px] font-bold border-gray-100 bg-gray-50/50 focus:ring-0">
                      <SelectValue placeholder="All Memberships" />
                   </SelectTrigger>
                   <SelectContent className="rounded-xl border-gray-100 font-bold">
                      <SelectItem value="All">All Memberships</SelectItem>
                      <SelectItem value="Gold Plan">Gold Plan</SelectItem>
                      <SelectItem value="Silver Plan">Silver Plan</SelectItem>
                      <SelectItem value="Guest">Guest</SelectItem>
                   </SelectContent>
                </Select>
             </div>
             <Button variant="ghost" onClick={() => setFilterMembership("All")} className="w-full h-10 rounded-xl text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all font-bold">
                Reset Filters
             </Button>
          </div>
        }
        columnContent={
          <ColumnToggle 
            columns={columns.map(c => ({ key: c.key, label: c.label }))}
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
          columns={columns}
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
              <DropdownMenuItem onClick={() => toast.info("Edit functionality coming soon")} className="gap-2.5 rounded-lg py-2 cursor-pointer text-gray-600 font-bold">
                 <Edit size={15} className="text-emerald-500" /> <span className="text-[13px]">Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.error("Delete functionality is not implemented yet")} className="gap-2.5 rounded-lg py-2 cursor-pointer text-rose-500 focus:bg-rose-50 font-bold">
                 <Trash2 size={15} /> <span className="text-[13px]">Delete</span>
              </DropdownMenuItem>
            </>
          )}
          emptyContent={
            <div className="flex flex-col items-center justify-center space-y-5 animate-in fade-in duration-700">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                 <Users size={32} />
              </div>
              <h4 className="text-2xl font-bold text-gray-800">No subscribers found</h4>
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
    </div>
  );
}
