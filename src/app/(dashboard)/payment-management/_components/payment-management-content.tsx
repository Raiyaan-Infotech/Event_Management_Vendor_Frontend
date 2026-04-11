"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Download, 
  Upload,
  CreditCard,
  FileText
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTableSearch } from "@/components/common/DataTableSearch";
import { DataTable, Column } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/PaginationControls";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ActionButton } from "@/components/common/ActionButton";
import { ColumnToggle } from "@/components/common/ColumnToggle";
import { MOCK_PAYMENTS } from "@/lib/data";

interface Payment {
  id: string;
  orderId: string;
  eventId: string;
  clientId: string;
  clientName: string;
  type: string;
  date: string;
  transactionId: string;
  status: string;
  paidAmount: number;
  vendorDiscount: number;
  referralDiscount: number;
}

export default function PaymentManagementContent() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" | null }>({ key: "", order: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  
  const paymentColumns: Column<Payment>[] = [
    { key: "orderId", label: "Order ID", sortable: true, render: (item) => <span className="text-[12px] font-black text-gray-800 dark:text-gray-200 tracking-tight">{item.orderId}</span> },
    { key: "eventId", label: "Event ID", sortable: true, render: (item) => <span className="text-[12px] font-bold text-gray-500 uppercase tracking-tighter">#{item.eventId}</span> },
    { key: "clientId", label: "Client ID", sortable: true, render: (item) => <Badge variant="outline" className="text-[10px] font-black border-gray-200/60 text-gray-400 bg-white dark:bg-gray-800">{item.clientId}</Badge> },
    { key: "clientName", label: "Client Name", sortable: true, render: (item) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center text-[11px] font-black uppercase">
           {item.clientName.charAt(0)}
        </div>
        <span className="text-[13px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">{item.clientName}</span>
      </div>
    )},
    { key: "type", label: "Type", sortable: true, render: (item) => (
      <div className="flex items-center gap-1.5 py-1 px-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg w-fit border border-gray-100 dark:border-gray-700">
         <CreditCard size={12} className="text-gray-400" />
         <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400">{item.type}</span>
      </div>
    )},
    { key: "date", label: "Date", sortable: true, render: (item) => <span className="text-[12px] font-black text-gray-500 tracking-tighter">{item.date}</span> },
    { key: "transactionId", label: "Transaction ID", sortable: true, render: (item) => <span className="text-[11px] font-bold text-blue-500 font-mono tracking-tighter">{item.transactionId}</span> },
    { key: "status", label: "Status", sortable: true, render: (item) => <StatusBadge status={item.status} /> },
    { key: "paidAmount", label: "Paid Amount", sortable: true, render: (item) => <span className="text-[14px] font-black text-emerald-600 tracking-tighter">₹{item.paidAmount?.toLocaleString()}</span> },
    { key: "vendorDiscount", label: "Vendor Discount", sortable: true, render: (item) => <span className="text-[13px] font-bold text-gray-400 tracking-tighter">₹{item.vendorDiscount?.toLocaleString()}</span> },
    { key: "referralDiscount", label: "Referral Discount", sortable: true, render: (item) => <span className="text-[13px] font-medium text-gray-400 tracking-tighter">₹{item.referralDiscount?.toLocaleString()}</span> },
  ];

  const allColumnKeys = paymentColumns.map(c => c.key);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumnKeys);
  const [tempColumns, setTempColumns] = useState<string[]>(allColumnKeys);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedData = localStorage.getItem("payments_data");
    const initialData = savedData ? JSON.parse(savedData) : MOCK_PAYMENTS;
    setPayments(initialData);
    if (!savedData) localStorage.setItem("payments_data", JSON.stringify(MOCK_PAYMENTS));
    
    const savedColumns = localStorage.getItem("payments_visible_columns");
    if (savedColumns) {
      try {
        const parsed = JSON.parse(savedColumns);
        setVisibleColumns(parsed);
        setTempColumns(parsed);
      } catch {
        /* invalid saved columns */
      }
    }
    setLoading(false);
  }, []);

  const filteredData = useMemo(() => {
    const result = [...payments].filter(item => {
      const matchesSearch = Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesStatus = filterStatus === "All" || item.status === filterStatus;
      const matchesType = filterType === "All" || item.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });

    if (sortConfig.key && sortConfig.order) {
      result.sort((a, b) => {
        const aVal = String(a[sortConfig.key as keyof Payment]).toLowerCase();
        const bVal = String(b[sortConfig.key as keyof Payment]).toLowerCase();
        if (aVal < bVal) return sortConfig.order === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.order === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [payments, searchQuery, filterStatus, filterType, sortConfig]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = () => toast.success("Payments exported successfully");
  const handleImport = () => toast.info("Import feature refactored.");

  return (
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-3">
      <PageHeader 
        title="PAYMENT" 
        subtitle="Monitor event orders, financial transactions, and payment status."
        total={payments.length}
        rightContent={
          <div className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv" className="hidden" />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="h-10 text-[12px] font-bold gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-wider">
              <Upload size={15} strokeWidth={2.5} /> Import
            </Button>
            <Button variant="outline" onClick={handleExport} className="h-10 text-[12px] font-bold gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-wider">
              <Download size={15} strokeWidth={2.5} /> Export
            </Button>
            <Link href="/payment-management/add">
              <ActionButton label="ADD PAYMENT" variant_type="Payment" />
            </Link>
          </div>
        }
      />

      <DataTableSearch 
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
        placeholder="Search by Order ID, Client, Transaction ID..."
        isFiltered={filterStatus !== "All" || filterType !== "All"}
        filterContent={
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Payment Status</p>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-10 rounded-xl text-[12px] font-bold border-gray-100 bg-gray-50/50 focus:ring-0">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100">
                  <SelectItem value="All" className="text-[12px] font-bold">All Status</SelectItem>
                  <SelectItem value="Paid" className="text-[12px] font-bold">Paid</SelectItem>
                  <SelectItem value="Pending" className="text-[12px] font-bold">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Payment Type</p>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-10 rounded-xl text-[12px] font-bold border-gray-100 bg-gray-50/50 focus:ring-0">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100">
                  <SelectItem value="All" className="text-[12px] font-bold">All Types</SelectItem>
                  <SelectItem value="Online" className="text-[12px] font-bold">Online</SelectItem>
                  <SelectItem value="Offline" className="text-[12px] font-bold">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" onClick={() => { setFilterStatus("All"); setFilterType("All"); }} className="w-full h-10 rounded-xl text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all">Reset Filters</Button>
          </div>
        }
        columnContent={
          <ColumnToggle 
            columns={paymentColumns.map(c => ({ key: c.key, label: c.label }))}
            tempColumns={tempColumns}
            onToggle={(key) => setTempColumns(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
            onToggleAll={() => setTempColumns(tempColumns.length === allColumnKeys.length ? [] : allColumnKeys)}
            onSave={() => { setVisibleColumns(tempColumns); localStorage.setItem("payments_visible_columns", JSON.stringify(tempColumns)); toast.success("Columns updated"); }}
          />
        }
      />

      <DataTable 
        data={paginatedData}
        columns={paymentColumns}
        visibleColumns={visibleColumns}
        selectedIds={selectedIds}
        rowIdKey="id"
        loading={loading}
        onSelect={(id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
        onSelectAll={() => setSelectedIds(selectedIds.length === paginatedData.length ? [] : paginatedData.map(d => d.id))}
        onSort={(key) => setSortConfig(prev => ({ key, order: prev.key === key && prev.order === "asc" ? "desc" : "asc" }))}
        sortConfig={sortConfig}
        actionContent={() => (
          <DropdownMenuItem className="gap-2.5 rounded-lg py-2 cursor-pointer text-gray-600">
             <Download size={15} className="text-blue-500" /> <span className="text-[13px] font-semibold">Receipt</span>
          </DropdownMenuItem>
        )}
        emptyContent={
          <div className="flex flex-col items-center justify-center space-y-5 animate-in fade-in duration-700">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
               <FileText size={32} />
            </div>
            <h4 className="text-2xl font-bold text-gray-800">No transactions found</h4>
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
