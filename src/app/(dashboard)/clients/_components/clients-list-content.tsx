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
  MoreVertical
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Client {
  id: number;
  clientId: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  plan: "Premium" | "Standard" | "Basic";
  status: "Active" | "Inactive" | "Blocked";
  events: number;
}

const clientsData: Client[] = [];

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20",
  Inactive: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20",
  Blocked: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20",
};

const statusIcons = {
  Active: <CheckCircle2 size={12} className="mr-1.5" />,
  Inactive: <Clock size={12} className="mr-1.5" />,
  Blocked: <XCircle size={12} className="mr-1.5" />,
};

type SortKeys = keyof Client;
type SortOrder = "asc" | "desc" | null;

export default function ClientsListContent() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: SortKeys | ""; order: SortOrder }>({ key: "", order: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Load data from localStorage on mount
  React.useEffect(() => {
    const savedData = localStorage.getItem("clients_data");
    if (savedData) {
      setClients(JSON.parse(savedData));
    }
    setLoading(false);
  }, []);

  const handleSort = (key: SortKeys) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key && prev.order === "asc" ? "desc" : "asc"
    }));
  };

  const filteredAndSortedClients = useMemo(() => {
    let result = [...clients].filter(client => 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.clientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortConfig.key && sortConfig.order) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Client];
        const bValue = b[sortConfig.key as keyof Client];
        
        if (aValue < bValue) return sortConfig.order === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.order === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [clients, searchQuery, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedClients.length / itemsPerPage);
  const paginatedClients = filteredAndSortedClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header & Stats Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 uppercase tracking-tight flex items-center gap-2">
            Clients Management
            <Badge variant="outline" className="text-[11px] font-extrabold border-blue-200 text-blue-600 bg-blue-50/50 px-2.5 py-0.5 ml-1">
              {!loading ? clients.length : "..."} TOTAL
            </Badge>
          </h1>
          <p className="text-sm text-gray-400 mt-1 italic tracking-tight font-medium">View and manage all registered clients and their account details.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 text-[12px] font-bold gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-wider">
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
      <div className="bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row gap-4 items-center">
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
        <Button variant="outline" className="h-12 px-6 border-gray-100 dark:border-gray-800 text-gray-400 hover:bg-gray-100 transition-all rounded-2xl gap-2 font-bold text-[11px] uppercase tracking-widest">
          <Filter size={16} /> Advanced Filters
        </Button>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100/50 dark:border-gray-800">
                {[
                  { key: "id", label: "ID"},
                  { key: "clientId", label: "Client ID"},
                  { key: "name", label: "Name"},
                  { key: "mobile", label: "Mobile"},
                  { key: "email", label: "Email"},
                  { key: "city", label: "City"},
                  { key: "plan", label: "Plan"},
                  { key: "status", label: "Status"},
                  { key: "events", label: "Events", align: "center" },
                ].map((header) => (
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
              ) : paginatedClients.length > 0 ? (
                paginatedClients.map((client) => (
                  <tr key={client.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-500/[0.03] transition-all cursor-pointer relative overflow-hidden">
                    <td className="px-6 py-5">
                      <span className="text-[12px] font-bold text-gray-400 group-hover:text-blue-500 transition-colors">#{client.id.toString().padStart(2, '0')}</span>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="outline" className="font-mono text-[10px] font-bold border-gray-200/60 dark:border-gray-800 text-gray-500 bg-white dark:bg-gray-800/50 py-0.5">
                        {client.clientId}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[14px] font-bold shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-gray-800 dark:text-gray-100 leading-none mb-1 group-hover:text-blue-600 transition-colors">{client.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-tighter font-semibold">Registered Client</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[13px] font-bold text-gray-600 dark:text-gray-300">{client.mobile}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400">{client.email}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[13px] font-bold text-gray-600 dark:text-gray-400">{client.city}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-lg border ${
                        client.plan === "Premium" ? "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10" : 
                        client.plan === "Standard" ? "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10" :
                        "bg-gray-50 text-gray-500 border-gray-100 dark:bg-gray-800"
                      }`}>
                        {client.plan}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${statusStyles[client.status]}`}>
                        {statusIcons[client.status]}
                        {client.status}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 text-[12px] font-bold">
                        {client.events}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-blue-50 rounded-xl transition-all">
                                  <MoreVertical size={16} className="text-gray-400" />
                               </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-xl border-gray-100 p-1.5 shadow-xl">
                               <DropdownMenuItem className="gap-2.5 rounded-lg py-2 cursor-pointer text-gray-600">
                                  <Eye size={15} className="text-blue-500" /> 
                                  <span className="text-[13px] font-semibold">View Stats</span>
                               </DropdownMenuItem>
                               <DropdownMenuItem className="gap-2.5 rounded-lg py-2 cursor-pointer text-gray-600">
                                  <Edit2 size={15} className="text-emerald-500" /> 
                                  <span className="text-[13px] font-semibold">Edit Record</span>
                               </DropdownMenuItem>
                               <DropdownMenuItem className="gap-2.5 rounded-lg py-2 cursor-pointer text-rose-500 focus:bg-rose-50 focus:text-rose-600">
                                  <Trash2 size={15} /> 
                                  <span className="text-[13px] font-semibold">Terminate</span>
                               </DropdownMenuItem>
                            </DropdownMenuContent>
                         </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-32 text-center bg-gray-50/20">
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
                          onClick={() => setSearchQuery("")} 
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
        
        {/* Pagination Strip */}
        <div className="px-8 py-5 bg-white dark:bg-gray-800/10 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
              Showing <span className="text-blue-600">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredAndSortedClients.length)}</span> of <span className="text-gray-600 dark:text-gray-200">{filteredAndSortedClients.length}</span> results
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
    </div>
  );
}
