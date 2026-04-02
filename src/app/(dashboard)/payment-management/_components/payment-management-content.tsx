"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  CreditCard,
  History,
  TrendingDown,
  Percent,
  Wallet,
  Plus,
  Upload,
  Columns
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface Payment {
  id: string;
  orderId: string;
  eventId: string;
  clientId: string;
  clientName: string;
  paymentType: string;
  paymentDate: string;
  transactionId: string;
  status: string;
  paidAmount: number;
  vendorDiscount: number;
  referralDiscount: number;
  taxGst: number;
  subscriptionAmount: number;
}

const statusStyles: Record<string, string> = {
  Paid: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20",
  Pending: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20",
  Unpaid: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20",
};

const statusIcons: Record<string, React.ReactNode> = {
  Paid: <CheckCircle2 size={12} className="mr-1.5" />,
  Pending: <Clock size={12} className="mr-1.5" />,
  Unpaid: <XCircle size={12} className="mr-1.5" />,
};

type SortKeys = keyof Payment;
type SortOrder = "asc" | "desc" | null;

export default function PaymentManagementContent() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [sortConfig, setSortConfig] = useState<{ key: SortKeys | ""; order: SortOrder }>({ key: "", order: null });
  
  // Column Visibility State
  const paymentColumns = [
    { key: "orderId", label: "Order ID" },
    { key: "eventId", label: "Event ID" },
    { key: "clientId", label: "Client ID" },
    { key: "clientName", label: "Client Name" },
    { key: "paymentType", label: "Type" },
    { key: "paymentDate", label: "Date" },
    { key: "transactionId", label: "Transaction ID" },
    { key: "status", label: "Status" },
    { key: "paidAmount", label: "Paid Amount" },
    { key: "vendorDiscount", label: "Vendor Discount" },
    { key: "referralDiscount", label: "Referral Discount" },
    { key: "taxGst", label: "GST" },
    { key: "subscriptionAmount", label: "Total Amount" },
  ];

  const [visibleColumns, setVisibleColumns] = useState<string[]>(paymentColumns.map(c => c.key));
  const [tempColumns, setTempColumns] = useState<string[]>(paymentColumns.map(c => c.key));
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Load data and column preferences from localStorage on mount
  React.useEffect(() => {
    const savedData = localStorage.getItem("payments_data");
    if (savedData) {
      setPayments(JSON.parse(savedData));
    }
    
    // Load column preferences
    const savedColumns = localStorage.getItem("payments_visible_columns");
    if (savedColumns) {
      try {
        const parsed = JSON.parse(savedColumns);
        setVisibleColumns(parsed);
        setTempColumns(parsed);
      } catch (e) {
        console.error("Failed to load column preferences");
      }
    }
    setLoading(false);
  }, []);

  const saveColumnChanges = () => {
    setVisibleColumns(tempColumns);
    localStorage.setItem("payments_visible_columns", JSON.stringify(tempColumns));
    setIsColumnDropdownOpen(false);
    toast.success("Column visibility updated");
  };

  const handleToggleAllColumns = () => {
    if (tempColumns.length === paymentColumns.length) {
      setTempColumns([]);
    } else {
      setTempColumns(paymentColumns.map(c => c.key));
    }
  };

  const toggleColumn = (key: string) => {
    setTempColumns(prev => 
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    );
  };

  const handleSort = (key: SortKeys) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key && prev.order === "asc" ? "desc" : "asc"
    }));
  };

  const handleExport = () => {
    if (payments.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["Order ID", "Event ID", "Client ID", "Client Name", "Type", "Date", "Transaction ID", "Status", "Paid Amount", "GST", "Total"];
    const csvContent = [
      headers.join(","),
      ...payments.map(p => [
        `"${p.orderId}"`,
        `"${p.eventId}"`,
        `"${p.clientId}"`,
        `"${p.clientName}"`,
        `"${p.paymentType}"`,
        `"${p.paymentDate}"`,
        `"${p.transactionId}"`,
        `"${p.status}"`,
        p.paidAmount,
        p.taxGst,
        p.subscriptionAmount
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `payments_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Payments exported successfully");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast.error("Please upload a valid CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split("\n").filter(line => line.trim());
        if (lines.length <= 1) {
          toast.error("CSV file is empty or missing data rows");
          return;
        }

        const newPayments: Payment[] = lines.slice(1).map((line, index) => {
          const values = line.split(",").map(v => v.replace(/^"|"$/g, "").trim());
          return {
            id: (Date.now() + index).toString(),
            orderId: values[0] || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            eventId: values[1] || "101",
            clientId: values[2] || "CLI-001",
            clientName: values[3] || "Unknown Client",
            paymentType: (values[4] || "Online"),
            paymentDate: values[5] || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            transactionId: values[6] || `TXN${Math.floor(Math.random() * 1000000)}`,
            status: (values[7] || "Paid") as any,
            paidAmount: Number(values[8]) || 0,
            vendorDiscount: 0,
            referralDiscount: 0,
            taxGst: Number(values[9]) || 0,
            subscriptionAmount: Number(values[10]) || Number(values[8]) || 0
          };
        });

        const mergedPayments = [...payments];
        newPayments.forEach(newP => {
          const existingIndex = mergedPayments.findIndex(p => p.orderId === newP.orderId);
          if (existingIndex > -1) {
             mergedPayments[existingIndex] = newP;
          } else {
             mergedPayments.push(newP);
          }
        });

        localStorage.setItem("payments_data", JSON.stringify(mergedPayments));
        setPayments(mergedPayments);
        toast.success(`${newPayments.length} transactions imported successfully`);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (error) {
        toast.error("Failed to parse CSV file");
      }
    };
    reader.readAsText(file);
  };

  const filteredAndSortedPayments = useMemo(() => {
    let result = [...payments].filter(p => {
      const matchesSearch = 
        p.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === "All" || p.status === filterStatus;
      const matchesType = filterType === "All" || p.paymentType === filterType;

      return matchesSearch && matchesStatus && matchesType;
    });

    if (sortConfig.key && sortConfig.order) {
      result.sort((a, b) => {
        const aValue = (a[sortConfig.key as keyof Payment] || "").toString().toLowerCase();
        const bValue = (b[sortConfig.key as keyof Payment] || "").toString().toLowerCase();
        if (aValue < bValue) return sortConfig.order === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.order === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [payments, searchQuery, sortConfig]);

  const paginatedPayments = filteredAndSortedPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAndSortedPayments.length / itemsPerPage);

  return (
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-3">
      {/* Header Section */}
      <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 uppercase tracking-tight flex items-center gap-2">
            Payment
            <Badge variant="outline" className="text-[11px] font-extrabold border-blue-200 text-blue-600 bg-blue-50/50 px-2.5 py-0.5 ml-1">
              {payments.length > 0 ? `${payments.length} TRANSACTIONS` : "NO DATA"}
            </Badge>
          </h1>
          <p className="text-sm font-medium text-gray-400 mt-1 italic tracking-tight">Monitor event orders, financial transactions, and payment status.</p>
        </div>
        <div className="flex items-center gap-2">
           <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            accept=".csv" 
            className="hidden" 
          />
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
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
           <Link href="/payment-management/add">
             <Button className="h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[12px] font-bold gap-2 transition-all shadow-lg shadow-blue-500/20 rounded-xl hover:-translate-y-0.5 active:scale-[0.98] uppercase tracking-wider">
               <Plus size={16} strokeWidth={3} /> ADD PAYMENT
             </Button>
           </Link>
         </div>
      </div>


      {/* Filter Card */}
      <div className="shrink-0 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full md:w-auto group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-500">
            <Search size={18} />
          </div>
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Client, Transaction ID..." 
            className="h-12 w-full pl-12 border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/10 rounded-2xl focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={`h-12 px-6 border-gray-100 dark:border-gray-700 transition-all rounded-2xl gap-2 font-black text-[11px] uppercase tracking-widest ${filterStatus !== "All" || filterType !== "All" ? "text-blue-500 border-blue-500/20 bg-blue-50/50" : "text-gray-400 hover:bg-gray-100"}`}>
                <Filter size={16} /> Filters {(filterStatus !== "All" || filterType !== "All") && "•"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-3 border-gray-100 shadow-2xl">
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
                      <SelectItem value="Unpaid" className="text-[12px] font-bold">Unpaid</SelectItem>
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
                <Button 
                  variant="ghost" 
                  onClick={() => { setFilterStatus("All"); setFilterType("All"); }}
                  className="w-full h-10 rounded-xl text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100"
                >
                  Reset Filters
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu open={isColumnDropdownOpen} onOpenChange={setIsColumnDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 px-6 border-gray-100 dark:border-gray-800 transition-all rounded-2xl gap-2 font-bold text-[11px] uppercase tracking-widest text-gray-400 hover:bg-gray-100">
                <Columns size={16} /> Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-2xl p-3 border-gray-100 shadow-2xl overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-2 py-1 mb-2 border-b border-gray-50 pb-3">
                  <span className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Select Columns</span>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      onClick={handleToggleAllColumns}
                      className="h-7 px-2 text-[9px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50"
                    >
                      Select All
                    </Button>
                  </div>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto px-1 space-y-1 py-1">
                  {paymentColumns.map((col) => (
                    <div 
                      key={col.key} 
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${tempColumns.includes(col.key) ? 'bg-blue-50/50 text-blue-700' : 'hover:bg-gray-50 text-gray-600'}`}
                      onClick={() => toggleColumn(col.key)}
                    >
                      <Checkbox 
                        checked={tempColumns.includes(col.key)} 
                        onCheckedChange={() => {}}
                        className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 pointer-events-none"
                        id={`col-${col.key}`}
                      />
                      <span className="text-[12px] font-black uppercase tracking-tight cursor-pointer flex-1">
                        {col.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50 p-1">
                  <Button 
                    onClick={saveColumnChanges}
                    className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 min-h-0 bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col mb-4">
        <div className="flex-1 overflow-auto custom-scrollbar relative">
          <table className="w-full text-left border-separate border-spacing-0 min-w-[1400px]">
            <thead className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-sm">
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                {[
                  { key: "orderId", label: "Order ID" },
                  { key: "eventId", label: "Event ID" },
                  { key: "clientId", label: "Client ID" },
                  { key: "clientName", label: "Client Name" },
                  { key: "paymentType", label: "Type" },
                  { key: "paymentDate", label: "Date" },
                  { key: "transactionId", label: "Transaction ID" },
                  { key: "status", label: "Status" },
                  { key: "paidAmount", label: "Paid Amount" },
                  { key: "vendorDiscount", label: "Vendor Discount" },
                  { key: "referralDiscount", label: "Referral Discount" },
                  { key: "taxGst", label: "GST" },
                  { key: "subscriptionAmount", label: "Total Amount" },
                ].filter(h => visibleColumns.includes(h.key)).map((header) => (
                  <th 
                    key={header.key} 
                    onClick={() => handleSort(header.key as SortKeys)}
                    className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer group active:opacity-70 select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-2 transition-colors group-hover:text-gray-600">
                      {header.label}
                      <ArrowUpDown size={12} className={`transition-all ${sortConfig.key === header.key ? "text-blue-500 opacity-100" : "opacity-30 group-hover:opacity-60"}`} />
                    </div>
                  </th>
                ))}
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Download Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/30">
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map((p) => (
                  <tr key={p.id} className="group hover:bg-blue-50/20 transition-all duration-200">
                    {visibleColumns.includes("orderId") && (
                      <td className="px-6 py-5">
                        <span className="text-[12px] font-black text-gray-800 dark:text-gray-200 tracking-tight">{p.orderId}</span>
                      </td>
                    )}
                    {visibleColumns.includes("eventId") && (
                      <td className="px-6 py-5">
                        <span className="text-[12px] font-bold text-gray-500 uppercase tracking-tighter">#{p.eventId}</span>
                      </td>
                    )}
                    {visibleColumns.includes("clientId") && (
                      <td className="px-6 py-5">
                        <Badge variant="outline" className="text-[10px] font-black border-gray-200/60 text-gray-400 bg-white dark:bg-gray-800">
                          {p.clientId}
                        </Badge>
                      </td>
                    )}
                    {visibleColumns.includes("clientName") && (
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center text-[11px] font-black">
                              {p.clientName.charAt(0)}
                           </div>
                           <span className="text-[13px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">{p.clientName}</span>
                        </div>
                      </td>
                    )}
                    {visibleColumns.includes("paymentType") && (
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5 py-1 px-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg w-fit border border-gray-100 dark:border-gray-700">
                           <CreditCard size={12} className="text-gray-400" />
                           <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400">{p.paymentType}</span>
                        </div>
                      </td>
                    )}
                    {visibleColumns.includes("paymentDate") && (
                      <td className="px-6 py-5">
                        <span className="text-[12px] font-black text-gray-500 tracking-tighter">{p.paymentDate}</span>
                      </td>
                    )}
                    {visibleColumns.includes("transactionId") && (
                      <td className="px-6 py-5">
                        <span className="text-[11px] font-bold text-blue-500 font-mono tracking-tighter">{p.transactionId}</span>
                      </td>
                    )}
                    {visibleColumns.includes("status") && (
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest transition-all ${statusStyles[p.status]}`}>
                          {statusIcons[p.status]}
                          {p.status}
                        </div>
                      </td>
                    )}
                    {visibleColumns.includes("paidAmount") && (
                      <td className="px-6 py-5">
                        <span className="text-[14px] font-black text-emerald-600 tracking-tighter">₹{p.paidAmount.toLocaleString()}</span>
                      </td>
                    )}
                    {visibleColumns.includes("vendorDiscount") && (
                      <td className="px-6 py-5">
                        <span className="text-[13px] font-bold text-gray-400 tracking-tighter">₹{p.vendorDiscount.toLocaleString()}</span>
                      </td>
                    )}
                    {visibleColumns.includes("referralDiscount") && (
                      <td className="px-6 py-5">
                        <span className="text-[13px] font-medium text-gray-400 tracking-tighter">₹{p.referralDiscount.toLocaleString()}</span>
                      </td>
                    )}
                    {visibleColumns.includes("taxGst") && (
                      <td className="px-6 py-5">
                        <span className="text-[13px] font-bold text-rose-500 tracking-tighter">₹{p.taxGst.toLocaleString()}</span>
                      </td>
                    )}
                    {visibleColumns.includes("subscriptionAmount") && (
                      <td className="px-6 py-5">
                        <span className="text-[15px] font-black text-gray-800 dark:text-gray-100 tracking-tighter">₹{p.subscriptionAmount.toLocaleString()}</span>
                      </td>
                    )}
                    <td className="px-6 py-5 text-center">
                      <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100">
                         <Download size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={visibleColumns.length + 1} className="px-6 py-32 text-center">
                     <div className="flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                           <FileText size={32} />
                        </div>
                        <p className="text-xl font-black text-gray-800 uppercase tracking-tight">No data added yet</p>
                        <p className="text-sm font-medium text-gray-400 italic">Financial transactions will appear here once recorded.</p>
                        <Link href="/payment-management/add" className="mt-4">
                           <Button className="h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[12px] font-bold gap-2 transition-all shadow-lg shadow-blue-500/20 rounded-xl hover:-translate-y-0.5 active:scale-[0.98] uppercase tracking-wider">
                              <Plus size={16} strokeWidth={3} /> ADD PAYMENT
                           </Button>
                        </Link>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - shrink-0 to keep it fixed at the bottom */}
        <div className="shrink-0 px-8 py-5 bg-white dark:bg-gray-800/10 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <p className="text-[11px] text-gray-400 font-black uppercase tracking-wider">Records per page:</p>
              <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(Number(v))}>
                 <SelectTrigger className="h-9 w-[70px] rounded-xl text-[11px] font-black border-gray-100 dark:border-gray-700">
                    <SelectValue placeholder={itemsPerPage} />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl border-gray-100">
                    {[5, 10, 15, 20].map(v => (
                       <SelectItem key={v} value={v.toString()} className="text-[11px] font-bold">{v}</SelectItem>
                    ))}
                 </SelectContent>
              </Select>
           </div>
           
           <p className="text-[11px] text-gray-400 font-black uppercase tracking-wider">
              Showing <span className="text-blue-600">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredAndSortedPayments.length)}</span> of {filteredAndSortedPayments.length} results
           </p>

           <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="icon" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="h-9 w-9 rounded-xl border-gray-100 dark:border-gray-700"
              >
                 <ChevronLeft size={16} />
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                 <Button 
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`h-9 w-9 rounded-xl text-[11px] font-black transition-all ${currentPage === i + 1 ? "bg-blue-600 shadow-lg shadow-blue-500/20 border-none" : "border-gray-100 dark:border-gray-700"}`}
                 >
                    {i + 1}
                 </Button>
              ))}
              <Button 
                variant="outline" 
                size="icon" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="h-9 w-9 rounded-xl border-gray-100 dark:border-gray-700"
              >
                 <ChevronRight size={16} />
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
