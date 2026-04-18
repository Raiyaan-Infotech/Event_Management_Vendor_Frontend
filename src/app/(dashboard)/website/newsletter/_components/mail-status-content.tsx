"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Trash2, 
  History,
  Search,
  ArrowLeft,
  Mail,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTableSearch } from "@/components/common/DataTableSearch";
import { DataTable, Column } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/PaginationControls";
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
import Link from "next/link";
import { useNewsletterSentLogs, MailStatus } from "@/hooks/use-newsletter";

export default function MailStatusContent() {
  const router = useRouter();
  const { data: logs = [], isLoading: loading } = useNewsletterSentLogs();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" | null }>({ key: "", order: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPlan, setFilterPlan] = useState("All");
  const [filterReadStatus, setFilterReadStatus] = useState("All");
  const [filterSubscription, setFilterSubscription] = useState("All");

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this log?")) {
      toast.success("Log deleted successfully");
    }
  };

  const columns: Column<MailStatus>[] = [
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
      key: "email", 
      label: "Email", 
      sortable: true,
      render: (item) => (
        <span className="text-[12px] font-medium text-gray-500 dark:text-gray-400">
          {item.email}
        </span>
      )
    },
    { 
      key: "membership", 
      label: "Membership", 
      sortable: true,
      render: (item) => (
        <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-500/20">
          {item.membership}
        </span>
      )
    },
    { 
      key: "template", 
      label: "Template", 
      sortable: true,
      render: (item) => (
        <span className="text-[12px] font-bold text-gray-700 dark:text-gray-300">
          {item.template}
        </span>
      )
    },
    { 
      key: "status", 
      label: "Status", 
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.status === "Success" ? (
            <>
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span className="text-[11px] font-black uppercase tracking-[0.1em] text-emerald-600">Success</span>
            </>
          ) : (
            <>
              <XCircle size={14} className="text-rose-500" />
              <span className="text-[11px] font-black uppercase tracking-[0.1em] text-rose-600">Failed</span>
            </>
          )}
        </div>
      )
    },
    { 
      key: "readStatus", 
      label: "Read / Unread", 
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.readStatus === "Read" ? (
             <Eye size={14} className="text-blue-500" />
          ) : (
             <EyeOff size={14} className="text-gray-400" />
          )}
          <span className={`text-[11px] font-bold uppercase tracking-widest ${item.readStatus === "Read" ? "text-blue-600" : "text-gray-500"}`}>
            {item.readStatus}
          </span>
        </div>
      )
    },
  ];

  const allColumnKeys = columns.map(c => c.key);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumnKeys);
  const [tempColumns, setTempColumns] = useState<string[]>(allColumnKeys);

  const filteredData = useMemo(() => {
    let result = [...logs].filter(item => {
      const matchesSearch = Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesStatus = filterStatus === "All" || item.status === filterStatus;
      const matchesPlan = filterPlan === "All" || (item.membership || "").toLowerCase() === filterPlan.toLowerCase();
      const matchesRead = filterReadStatus === "All" || item.readStatus === filterReadStatus;
      const matchesSubscription = filterSubscription === "All" || item.subscriptionStatus === filterSubscription;
      return matchesSearch && matchesStatus && matchesPlan && matchesRead && matchesSubscription;
    });

    if (sortConfig.key && sortConfig.order) {
      result.sort((a, b) => {
        const aVal = String(a[sortConfig.key as keyof MailStatus]).toLowerCase();
        const bVal = String(b[sortConfig.key as keyof MailStatus]).toLowerCase();
        if (aVal < bVal) return sortConfig.order === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.order === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [logs, searchQuery, sortConfig, filterStatus, filterPlan, filterReadStatus, filterSubscription]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-3 bg-[#F8FAFC] dark:bg-black/40">
      <PageHeader
        title="MAIL STATUS"
        subtitle="Track delivery and engagement metrics for your newsletter campaigns."
        total={logs.length}
        rightContent={
          <Link href="/website/newsletter">
            <Button variant="ghost" className="gap-2 text-gray-400 hover:text-gray-900 transition-all font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-transparent">
               <ArrowLeft size={16} className="text-blue-500" strokeWidth={3} /> Back to Newsletter
            </Button>
          </Link>
        }
      />

      <DataTableSearch 
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
        placeholder="Search logs..."
        isFiltered={filterStatus !== "All" || filterPlan !== "All" || filterReadStatus !== "All" || filterSubscription !== "All"}
        filterContent={
          <div className="space-y-4">
             <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Subscription</p>
                <Select value={filterSubscription} onValueChange={setFilterSubscription}>
                   <SelectTrigger className="h-10 rounded-xl text-[12px] font-bold border-gray-100 bg-gray-50/50">
                      <SelectValue placeholder="All" />
                   </SelectTrigger>
                   <SelectContent className="rounded-xl font-bold">
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Subscribed">Subscribers Only</SelectItem>
                      <SelectItem value="Unsubscribed">Unsubscribers Only</SelectItem>
                   </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Delivery Status</p>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                   <SelectTrigger className="h-10 rounded-xl text-[12px] font-bold border-gray-100 bg-gray-50/50">
                      <SelectValue placeholder="All Status" />
                   </SelectTrigger>
                   <SelectContent className="rounded-xl font-bold">
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="Success">Success Only</SelectItem>
                      <SelectItem value="Failed">Failed Only</SelectItem>
                   </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Plan / Membership</p>
                <Select value={filterPlan} onValueChange={setFilterPlan}>
                   <SelectTrigger className="h-10 rounded-xl text-[12px] font-bold border-gray-100 bg-gray-50/50">
                      <SelectValue placeholder="All Plans" />
                   </SelectTrigger>
                   <SelectContent className="rounded-xl font-bold">
                      <SelectItem value="All">All Plans</SelectItem>
                      <SelectItem value="Guest">Guest</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Platinum">Platinum</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                   </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Read Status</p>
                <Select value={filterReadStatus} onValueChange={setFilterReadStatus}>
                   <SelectTrigger className="h-10 rounded-xl text-[12px] font-bold border-gray-100 bg-gray-50/50">
                      <SelectValue placeholder="All" />
                   </SelectTrigger>
                   <SelectContent className="rounded-xl font-bold">
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Read">Read Only</SelectItem>
                      <SelectItem value="Unread">Unread Only</SelectItem>
                   </SelectContent>
                </Select>
             </div>
             <Button variant="ghost" onClick={() => { setFilterStatus("All"); setFilterPlan("All"); setFilterReadStatus("All"); setFilterSubscription("All"); }} className="w-full h-10 rounded-xl text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all font-bold">
                Reset
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
              <DropdownMenuItem onClick={() => handleDelete(item.id)} className="gap-2.5 rounded-lg py-2 cursor-pointer text-rose-500 focus:bg-rose-50 font-bold">
                 <Trash2 size={15} /> <span className="text-[13px]">Delete Log</span>
              </DropdownMenuItem>
          )}
          emptyContent={
            <div className="flex flex-col items-center justify-center space-y-5 animate-in fade-in duration-700">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                 <History size={32} />
              </div>
              <h4 className="text-2xl font-bold text-gray-800">No mail logs found</h4>
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
