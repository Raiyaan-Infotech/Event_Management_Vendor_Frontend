"use client";

import React, { useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  Download, 
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Upload,
  Settings2,
  Columns
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface Client {
  id: number;
  clientId: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  plan: string;
  status: string;
  events: number;
  profilePic?: string;
}

import { useVendorClients, useDeleteVendorClient, VendorClient } from "@/hooks/use-vendor-clients";

const statusStyles: Record<string, string> = {
  "1": "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20",
  "0": "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20",
  "2": "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20",
};

const statusLabels: Record<string, string> = {
  "1": "Active",
  "0": "Inactive",
  "2": "Blocked",
};

const statusIcons: Record<string, React.ReactNode> = {
  "1": <CheckCircle2 size={12} className="mr-1.5" />,
  "0": <Clock size={12} className="mr-1.5" />,
  "2": <XCircle size={12} className="mr-1.5" />,
};

const planStyles: Record<string, string> = {
  "silver": "bg-slate-100 text-slate-600 border-slate-200",
  "gold": "bg-amber-50 text-amber-600 border-amber-200",
  "platinum": "bg-purple-50 text-purple-600 border-purple-200",
  "standard": "bg-gray-100 text-gray-600 border-gray-200",
  "not_subscribed": "bg-rose-50 text-rose-600 border-rose-200",
};

const planLabels: Record<string, string> = {
  "silver": "Silver Plan",
  "gold": "Gold Plan",
  "platinum": "Platinum Plan",
  "standard": "Standard",
  "not_subscribed": "Not Subscribed",
};

type SortKeys = keyof VendorClient;
type SortOrder = "ASC" | "DESC" | null;

export default function ClientsListContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; order: SortOrder }>({ key: "created_at", order: "DESC" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterPlan, setFilterPlan] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  
  // Column Visibility State
  const clientColumns = [
    { key: "id", label: "ID" },
    { key: "client_id", label: "Client ID" },
    { key: "name", label: "Name" },
    { key: "mobile", label: "Mobile" },
    { key: "email", label: "Email" },
    { key: "city", label: "City" },
    { key: "status", label: "Status" },
  ];

  const [visibleColumns, setVisibleColumns] = useState<string[]>(clientColumns.map(c => c.key));
  const [tempColumns, setTempColumns] = useState<string[]>(clientColumns.map(c => c.key));
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Modals state
  const [clientToDelete, setClientToDelete] = useState<VendorClient | null>(null);

  // Fetch data via hook
  const { data: clientsRes, isLoading: loading } = useVendorClients({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
    status: filterStatus === "All" ? undefined : Number(filterStatus),
    plan: filterPlan === "All" ? undefined : filterPlan,
    sort_by: sortConfig.key || "created_at",
    sort_order: sortConfig.order || "DESC"
  });

  const deleteMutation = useDeleteVendorClient();

  const clients = clientsRes?.data || [];
  const totalRecords = clientsRes?.pagination?.total || 0;
  const totalPages = clientsRes?.pagination?.totalPages || 0;

  React.useEffect(() => {
    // Load column preferences
    const savedColumns = localStorage.getItem("clients_visible_columns");
    if (savedColumns) {
      try {
        const parsed = JSON.parse(savedColumns);
        setVisibleColumns(parsed);
        setTempColumns(parsed);
      } catch (e) {
        console.error("Failed to load column preferences");
      }
    }
  }, []);

  const saveColumnChanges = () => {
    setVisibleColumns(tempColumns);
    localStorage.setItem("clients_visible_columns", JSON.stringify(tempColumns));
    setIsColumnDropdownOpen(false);
    toast.success("Column visibility updated");
  };

  const handleToggleAllColumns = () => {
    if (tempColumns.length === clientColumns.length) {
      setTempColumns([]);
    } else {
      setTempColumns(clientColumns.map(c => c.key));
    }
  };

  const toggleColumn = (key: string) => {
    setTempColumns(prev => 
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    );
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key && prev.order === "ASC" ? "DESC" : "ASC"
    }));
  };

  const handleExport = () => {
    if (clients.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["ID", "Client ID", "Name", "Mobile", "Email", "City", "Plan", "Status"];
    const csvContent = [
      headers.join(","),
      ...clients.map(c => [
        c.id,
        `"${c.client_id}"`,
        `"${c.name}"`,
        `"${c.mobile}"`,
        `"${c.email}"`,
        `"${c.city}"`,
        `"${c.plan}"`,
        `"${c.is_active}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `clients_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Clients exported successfully");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    toast.info("Import feature needs backend implementation for CSV processing.");
  };

  const handleDelete = async () => {
    if (!clientToDelete) return;
    
    await deleteMutation.mutateAsync(clientToDelete.id);
    setClientToDelete(null);
  };

  const handleEdit = (id: number) => {
    router.push(`/clients/edit/${id}`);
  };

  const handleView = (client: VendorClient) => {
    router.push(`/clients/view/${client.id}`);
  };

  return (
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-3">
      {/* Header & Stats Strip */}
      <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 uppercase tracking-tight flex items-center gap-2">
            Client
            <Badge variant="outline" className="text-[11px] font-extrabold border-blue-200 text-blue-600 bg-blue-50/50 px-2.5 py-0.5 ml-1">
              {!loading ? clients.length : "..."} TOTAL
            </Badge>
          </h1>
          <p className="text-sm text-gray-400 mt-1 italic tracking-tight font-medium">View and manage all registered clients and their account details.</p>
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
          <Link href="/clients/add">
            <Button className="h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[12px] font-bold gap-2 transition-all shadow-lg shadow-blue-500/20 rounded-xl hover:-translate-y-0.5 active:scale-[0.98] uppercase tracking-wider">
              <Plus size={16} strokeWidth={3} /> ADD CLIENT
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter & Search Card */}
      <div className="shrink-0 bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full md:w-auto group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-500">
            <Search size={18} />
          </div>
          <Input 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search clients by name, ID, email or city..." 
            className="h-12 w-full pl-12 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={`h-12 px-6 border-gray-100 dark:border-gray-800 transition-all rounded-2xl gap-2 font-bold text-[11px] uppercase tracking-widest ${filterPlan !== "All" || filterStatus !== "All" ? "text-blue-500 border-blue-500/20 bg-blue-50/50" : "text-gray-400 hover:bg-gray-100"}`}>
                <Filter size={16} /> Filters {(filterPlan !== "All" || filterStatus !== "All") && "•"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-3 border-gray-100 shadow-2xl">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Subscription Plan</p>
                  <Select value={filterPlan} onValueChange={setFilterPlan}>
                    <SelectTrigger className="h-10 rounded-xl text-[12px] font-bold border-gray-100 bg-gray-50/50 focus:ring-0">
                      <SelectValue placeholder="All Plans" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-100">
                      <SelectItem value="All" className="text-[12px] font-bold">All Plans</SelectItem>
                      <SelectItem value="Silver Plan" className="text-[12px] font-bold">Silver Plan</SelectItem>
                      <SelectItem value="Gold Plan" className="text-[12px] font-bold">Gold Plan</SelectItem>
                      <SelectItem value="Platinum Plan" className="text-[12px] font-bold">Platinum Plan</SelectItem>
                      <SelectItem value="Not Subscribed" className="text-[12px] font-bold">Not Subscribed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Account Status</p>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="h-10 rounded-xl text-[12px] font-bold border-gray-100 bg-gray-50/50 focus:ring-0">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-100">
                      <SelectItem value="All" className="text-[12px] font-bold">All Status</SelectItem>
                      <SelectItem value="Active" className="text-[12px] font-bold">Active</SelectItem>
                      <SelectItem value="Inactive" className="text-[12px] font-bold">Inactive</SelectItem>
                      <SelectItem value="Blocked" className="text-[12px] font-bold">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => { setFilterPlan("All"); setFilterStatus("All"); }}
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
                  {clientColumns.map((col) => (
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

      {/* Table Card */}
      <div className="flex-1 min-h-0 bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col mb-4">
        <div className="flex-1 overflow-auto custom-scrollbar relative">
          <table className="w-full text-left border-separate border-spacing-0 min-w-[1100px]">
            <thead className="sticky top-0 z-20 bg-white dark:bg-[#1f2937] shadow-sm">
              <tr className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100/50 dark:border-gray-800">
                {[
                  { key: "id", label: "ID"},
                  { key: "clientId", label: "Client ID"},
                  { key: "name", label: "Name"},
                  { key: "mobile", label: "Mobile"},
                  { key: "email", label: "Email"},
                  { key: "city", label: "City"},
                  { key: "events", label: "Events", align: "center" },
                  { key: "status", label: "Status"},
                ].filter(h => visibleColumns.includes(h.key)).map((header) => (
                  <th 
                    key={header.key} 
                    onClick={() => handleSort(header.key as SortKeys)}
                    className={`px-6 py-5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest cursor-pointer group active:opacity-70 select-none ${header.align === "center" ? "text-center" : ""}`}
                  >
                    <div className={`flex items-center gap-2 transition-colors group-hover:text-gray-600 ${header.align === "center" ? "justify-center" : ""}`}>
                      {header.label}
                      <ArrowUpDown size={12} className={`transition-all ${sortConfig.key === header.key ? "text-gray-600 opacity-100" : "opacity-30 group-hover:opacity-60"}`} />
                    </div>
                  </th>
                ))}
                <th className="px-6 py-5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/30">
              {loading ? (
                <tr>
                   <td colSpan={10} className="px-6 py-20 text-center text-gray-400 font-medium italic">
                      Loading data...
                   </td>
                </tr>
              ) : clients.length > 0 ? (
                clients.map((client) => (
                  <tr key={client.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-500/[0.03] transition-all relative overflow-hidden">
                    {visibleColumns.includes("id") && (
                      <td className="px-6 py-5">
                        <span className="text-[12px] font-black text-gray-400 group-hover:text-blue-500 transition-colors tracking-tighter">#{client.id.toString().padStart(2, '0')}</span>
                      </td>
                    )}
                    {visibleColumns.includes("client_id") && (
                      <td className="px-6 py-5">
                        <Badge variant="outline" className="font-mono text-[10px] font-bold border-gray-200/60 dark:border-gray-800 text-gray-500 bg-white dark:bg-gray-800/50 py-0.5">
                          {client.client_id}
                        </Badge>
                      </td>
                    )}
                    {visibleColumns.includes("name") && (
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          {client.profile_pic ? (
                            <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform duration-300 border border-gray-100 dark:border-gray-800">
                              <img
                                src={client.profile_pic}
                                alt={client.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.svg'; }}
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[14px] font-bold shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                               {client.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-[14px] font-black text-gray-800 dark:text-gray-100 leading-none mb-2 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{client.name}</p>
                            <Badge 
                              variant="outline" 
                              className={`text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0 border-none rounded-full ${planStyles[client.plan] || planStyles["standard"]}`}
                            >
                               {planLabels[client.plan] || client.plan}
                            </Badge>
                          </div>
                        </div>
                      </td>
                    )}
                    {visibleColumns.includes("mobile") && (
                      <td className="px-6 py-5">
                        <p className="text-[13px] font-black text-gray-700 dark:text-gray-300 tracking-tight">{client.mobile}</p>
                      </td>
                    )}
                    {visibleColumns.includes("email") && (
                      <td className="px-6 py-5">
                        <p className="text-[13px] font-bold text-gray-500 dark:text-gray-400 transition-colors group-hover:text-blue-400">{client.email}</p>
                      </td>
                    )}
                    {visibleColumns.includes("city") && (
                      <td className="px-6 py-5">
                        <p className="text-[13px] font-black text-gray-700 dark:text-gray-300 tracking-tight">{client.city}</p>
                      </td>
                    )}
                    {visibleColumns.includes("status") && (
                      <td className="px-6 py-5">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${statusStyles[client.is_active.toString()] || statusStyles["1"]}`}>
                          {statusIcons[client.is_active.toString()] || statusIcons["1"]}
                          {statusLabels[client.is_active.toString()] || "Active"}
                        </div>
                      </td>
                    )}

                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-1 transition-all duration-300">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-blue-50 rounded-xl transition-all">
                                  <MoreVertical size={16} className="text-gray-400" />
                               </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-xl border-gray-100 p-1.5 shadow-xl">
                               <DropdownMenuItem 
                                  onClick={() => handleView(client)}
                                  className="gap-2.5 rounded-lg py-2 cursor-pointer text-gray-600"
                               >
                                  <Eye size={15} className="text-blue-500" /> 
                                  <span className="text-[13px] font-semibold">View</span>
                               </DropdownMenuItem>
                               <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(client.id);
                                  }}
                                  className="gap-2.5 rounded-lg py-2 cursor-pointer text-gray-600"
                               >
                                  <Edit2 size={15} className="text-emerald-500" /> 
                                  <span className="text-[13px] font-semibold">Edit</span>
                               </DropdownMenuItem>
                               <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setClientToDelete(client);
                                  }}
                                  className="gap-2.5 rounded-lg py-2 cursor-pointer text-rose-500 focus:bg-rose-50 focus:text-rose-600"
                                >
                                  <Trash2 size={15} /> 
                                  <span className="text-[13px] font-semibold">Delete</span>
                               </DropdownMenuItem>
                            </DropdownMenuContent>
                         </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={visibleColumns.length + 1} className="px-6 py-32 text-center bg-gray-50/20">
                    <div className="flex flex-col items-center justify-center space-y-5 animate-in fade-in duration-700">

                      <div className="max-w-xs mx-auto">
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                          {searchQuery ? "No matching clients" : "Your client list is empty"}
                        </p>
                        <p className="text-sm text-gray-400 mt-2 font-medium tracking-tight px-4 leading-relaxed">
                          {searchQuery 
                            ? `We searched everywhere but couldn't find any results for "${searchQuery}".` 
                            : "It looks like you haven't added any clients yet. Let's get started with your first registration!"}
                        </p>
                      </div>
                      {searchQuery ? (
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSearchQuery("");
                            setFilterPlan("All");
                            setFilterStatus("All");
                          }} 
                          className="mt-2 h-11 rounded-2xl font-bold text-[11px] uppercase tracking-widest px-8 border-gray-200 hover:bg-gray-100 shadow-sm"
                        >
                          Clear Filters
                        </Button>
                      ) : (
                        <Link href="/clients/add">
                          <Button className="mt-2 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-10 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                            Add Your First Client
                          </Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Strip - shrink-0 to keep fixed at bottom */}
        <div className="shrink-0 px-8 py-5 bg-white dark:bg-gray-800/10 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">
                Records per page:
              </p>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-[70px] rounded-xl text-[11px] font-bold border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 focus:ring-0 focus:ring-offset-0 transition-all hover:bg-gray-100">
                  <SelectValue placeholder={itemsPerPage.toString()} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100 min-w-[70px] shadow-xl">
                  {[5, 10, 15, 20, 25].map((value) => (
                    <SelectItem 
                      key={value} 
                      value={value.toString()}
                      className="text-[11px] font-bold rounded-lg cursor-pointer focus:bg-blue-50 focus:text-blue-600 transition-colors"
                    >
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider hidden sm:block">
              Showing <span className="text-blue-600">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalRecords)}</span> of <span className="text-gray-600 dark:text-gray-200">{totalRecords}</span> results
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(prev => prev - 1)}
              variant="outline" 
              className="h-9 w-9 p-0 rounded-xl border-gray-100 dark:border-gray-800 transition-all hover:bg-gray-50 disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button 
                key={page}
                onClick={() => setCurrentPage(page)}
                variant={currentPage === page ? "default" : "outline"} 
                className={`h-9 w-9 p-0 rounded-xl text-[12px] font-bold transition-all duration-300 ${
                  currentPage === page 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 border-none scale-105" 
                    : "border-gray-100 dark:border-gray-800 text-gray-400 hover:bg-gray-50"
                }`}
              >
                {page}
              </Button>
            ))}
            
            <Button 
              disabled={currentPage === totalPages || totalPages === 0} 
              onClick={() => setCurrentPage(prev => prev + 1)}
              variant="outline" 
              className="h-9 w-9 p-0 rounded-xl border-gray-100 dark:border-gray-800 transition-all hover:bg-gray-50 disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!clientToDelete} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <DialogContent className="sm:max-w-[420px] rounded-[40px] p-0 overflow-hidden border-none shadow-2xl shadow-rose-900/10">
          <div className="bg-gradient-to-b from-rose-50 to-white dark:from-rose-500/10 dark:to-[#111827] p-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-white dark:bg-gray-800 flex items-center justify-center text-rose-500 shadow-[0_15px_30px_-10px_rgba(225,29,72,0.3)] mb-8 animate-in zoom-in duration-500">
              <Trash2 size={40} strokeWidth={2.5} />
            </div>
            <DialogTitle className="text-2xl font-black text-gray-800 dark:text-gray-100 uppercase tracking-tighter">Discard Client?</DialogTitle>
            <DialogDescription className="mt-4 text-gray-500 dark:text-gray-400 font-bold text-sm leading-relaxed max-w-[280px]">
              You are about to permanently remove <span className="text-rose-600 underline underline-offset-4 decoration-rose-200">{clientToDelete?.name}</span> and all associated records.
            </DialogDescription>
          </div>
          <DialogFooter className="p-8 bg-gray-50/50 dark:bg-gray-900 flex flex-row gap-4 border-t border-gray-50 dark:border-gray-800">
            <Button 
              variant="ghost" 
              onClick={() => setClientToDelete(null)} 
              className="flex-1 h-12 rounded-2xl font-bold text-[12px] uppercase tracking-widest text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDelete}
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
