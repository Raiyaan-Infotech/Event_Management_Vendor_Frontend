"use client";

import React, { useState, useEffect } from "react";
import {
  Edit2,
  Trash2,
  Eye,
  Download,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTableSearch } from "@/components/common/DataTableSearch";
import { DataTable, Column } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/PaginationControls";
import { ActionButton } from "@/components/common/ActionButton";
import { ColumnToggle } from "@/components/common/ColumnToggle";
import { SafeImage } from "@/components/ui/safe-image";
import { useVendorClients, useDeleteVendorClient, useToggleVendorClientLoginAccess, useUpdateVendorClientStatus, VendorClient } from "@/hooks/use-vendor-clients";
import { useVendorSubscription } from "@/hooks/use-vendor-subscription";

const statusLabels: Record<string, string> = {
  "1": "Active",
  "0": "Inactive",
  "2": "Blocked",
};

export default function ClientsListContent() {
  const router = useRouter();
  const { data: subscriptionData } = useVendorSubscription();
  const plans = subscriptionData?.plans ?? [];
  const [searchQuery, setSearchQuery]     = useState("");
  const [sortConfig, setSortConfig]       = useState<{ key: string; order: "asc" | "desc" | null }>({ key: "created_at", order: "desc" });
  const [currentPage, setCurrentPage]     = useState(1);
  const [itemsPerPage, setItemsPerPage]   = useState(10);
  const [filterPlan, setFilterPlan]       = useState("All");
  const [filterStatus, setFilterStatus]   = useState("All");
  const [selectedIds, setSelectedIds]     = useState<(string | number)[]>([]);
  const [clientToDelete, setClientToDelete] = useState<VendorClient | null>(null);

  const clientColumns: Column<VendorClient>[] = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      render: (item) => (
        <span className="text-[12px] font-black text-gray-400 group-hover:text-blue-500 transition-colors tracking-tighter">
          #{item.id.toString().padStart(2, "0")}
        </span>
      ),
    },
    {
      key: "client_id",
      label: "Client ID",
      sortable: true,
      render: (item) => (
        <Badge variant="outline" className="font-mono text-[10px] font-bold border-gray-200/60 dark:border-gray-800 text-gray-500 bg-white dark:bg-gray-800/50 py-0.5">
          {item.client_id}
        </Badge>
      ),
    },
    {
      key: "name",
      label: "Client Name",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.profile_pic ? (
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform duration-300 border border-gray-100 dark:border-gray-800 relative">
              <SafeImage
                src={item.profile_pic}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[14px] font-bold shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300 uppercase">
              {item.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-[14px] font-black text-gray-800 dark:text-gray-100 leading-none mb-2 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
              {item.name}
            </p>
            {(() => {
              const planColor = plans.find(p => p.name === item.plan)?.label_color;
              return (
                <Badge
                  variant="outline"
                  className="text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0 rounded-full"
                  style={planColor
                    ? { backgroundColor: planColor + '22', color: planColor, borderColor: planColor + '44' }
                    : { backgroundColor: '#eff6ff', color: '#2563eb', borderColor: '#bfdbfe' }}
                >
                  {item.plan || "—"}
                </Badge>
              );
            })()}
          </div>
        </div>
      ),
    },
    {
      key: "mobile",
      label: "Mobile",
      sortable: true,
      render: (item) => <p className="text-[13px] font-black text-gray-700 dark:text-gray-300 tracking-tight">{item.mobile}</p>,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (item) => <p className="text-[13px] font-bold text-gray-500 dark:text-gray-400 transition-colors group-hover:text-blue-400">{item.email}</p>,
    },
    {
      key: "city",
      label: "City",
      sortable: true,
      render: (item) => <p className="text-[13px] font-black text-gray-700 dark:text-gray-300 tracking-tight">{item.city}</p>,
    },
    {
      key: "login_access",
      label: "Login Access",
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-3">
          <Switch
            checked={!!item.login_access}
            onCheckedChange={() => toggleLoginAccess.mutate({ id: item.id, login_access: item.login_access ? 0 : 1 })}
            disabled={toggleLoginAccess.isPending}
            className="transition-all"
          />
          <span className="text-[12px] font-semibold text-gray-600 dark:text-gray-400">
            {item.login_access ? "Allowed" : "Denied"}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <Switch
            checked={item.is_active === 1}
            onCheckedChange={() => updateStatusMutation.mutate({ id: item.id, is_active: item.is_active === 1 ? 0 : 1 })}
            disabled={updateStatusMutation.isPending}
            className="transition-all"
          />
          <span className="text-[12px] font-semibold text-gray-600 dark:text-gray-400">
            {statusLabels[item.is_active.toString()] || "Active"}
          </span>
        </div>
      ),
    },
  ];

  const allColumnKeys = clientColumns.map((c) => c.key);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumnKeys);
  const [tempColumns, setTempColumns]       = useState<string[]>(allColumnKeys);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch data via hook
  const { data: clientsRes, isLoading: loading } = useVendorClients({
    page:       currentPage,
    limit:      itemsPerPage,
    search:     searchQuery,
    status:     filterStatus === "All" ? undefined : Number(filterStatus),
    plan:       filterPlan === "All" ? undefined : filterPlan,
    sort_by:    sortConfig.key || "created_at",
    sort_order: (sortConfig.order?.toUpperCase() as "ASC" | "DESC") || "DESC",
  });

  const deleteMutation          = useDeleteVendorClient();
  const toggleLoginAccess       = useToggleVendorClientLoginAccess();
  const updateStatusMutation    = useUpdateVendorClientStatus();

  const clients      = clientsRes?.data || [];
  const totalRecords = clientsRes?.pagination?.total || 0;

  useEffect(() => {
    const savedColumns = localStorage.getItem("clients_visible_columns");
    if (savedColumns) {
      try {
        const parsed = JSON.parse(savedColumns);
        setVisibleColumns(parsed);
        setTempColumns(parsed);
      } catch { }
    }
  }, []);

  const handleDelete = async () => {
    if (!clientToDelete) return;
    await deleteMutation.mutateAsync(clientToDelete.id);
    setClientToDelete(null);
  };

  const handleExport = () => {
    if (clients.length === 0) return toast.error("No data to export");

    const headers = ["ID", "Client ID", "Name", "Mobile", "Email", "City", "Plan", "Status"];
    const csvContent = [
      headers.join(","),
      ...clients.map((c) =>
        [c.id, `"${c.client_id}"`, `"${c.name}"`, `"${c.mobile}"`, `"${c.email}"`, `"${c.city}"`, `"${c.plan}"`, `"${c.is_active}"`].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `clients_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Clients exported successfully");
  };

  const handleImport = () => {
    toast.info("Import feature needs backend implementation for CSV processing.");
  };

  return (
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-3">
      <PageHeader
        title="CLIENT"
        subtitle="View and manage all registered clients and their account details."
        total={totalRecords}
        rightContent={
          <div className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv" className="hidden" />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="h-10 text-[12px] font-bold gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-wider">
              <Upload size={15} strokeWidth={2.5} /> Import
            </Button>
            <Button variant="outline" onClick={handleExport} className="h-10 text-[12px] font-bold gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-wider">
              <Download size={15} strokeWidth={2.5} /> Export
            </Button>
            <Link href="/clients/add">
              <ActionButton label="ADD CLIENT" variant_type="Client" />
            </Link>
          </div>
        }
      />

      <DataTableSearch
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
        placeholder="Search clients by name, ID, email or city..."
        isFiltered={filterPlan !== "All" || filterStatus !== "All"}
        filterContent={
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Subscription Plan</p>
              <Select value={filterPlan} onValueChange={setFilterPlan}>
                <SelectTrigger className="h-10 rounded-xl text-[12px] font-bold border-gray-100 bg-gray-50/50 focus:ring-0">
                  <SelectValue placeholder="All Plans" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100">
                  <SelectItem value="All" className="text-[12px] font-bold">All Plans</SelectItem>
                  {plans.map(p => (
                    <SelectItem key={p.id} value={p.name} className="text-[12px] font-bold">{p.name}</SelectItem>
                  ))}
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
                  <SelectItem value="1"   className="text-[12px] font-bold">Active</SelectItem>
                  <SelectItem value="0"   className="text-[12px] font-bold">Inactive</SelectItem>
                  <SelectItem value="2"   className="text-[12px] font-bold">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" onClick={() => { setFilterPlan("All"); setFilterStatus("All"); }} className="w-full h-10 rounded-xl text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all">
              Reset Filters
            </Button>
          </div>
        }
        columnContent={
          <ColumnToggle
            columns={clientColumns.map((c) => ({ key: c.key, label: c.label }))}
            tempColumns={tempColumns}
            onToggle={(key) => setTempColumns((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key])}
            onToggleAll={() => setTempColumns(tempColumns.length === allColumnKeys.length ? [] : allColumnKeys)}
            onSave={() => {
              setVisibleColumns(tempColumns);
              localStorage.setItem("clients_visible_columns", JSON.stringify(tempColumns));
              toast.success("Columns updated");
            }}
          />
        }
      />

      <DataTable
        data={clients}
        columns={clientColumns}
        visibleColumns={visibleColumns}
        selectedIds={selectedIds}
        rowIdKey="id"
        loading={loading}
        onSelect={(id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])}
        onSelectAll={() => setSelectedIds(selectedIds.length === clients.length ? [] : clients.map((d) => d.id))}
        onSort={(key) => setSortConfig((prev) => ({ key, order: prev.key === key && prev.order === "asc" ? "desc" : "asc" }))}
        sortConfig={sortConfig}
        actionContent={(item) => (
          <>
            <DropdownMenuItem onClick={() => router.push(`/clients/view/${item.id}`)} className="gap-2.5 rounded-lg py-2 cursor-pointer text-gray-600">
              <Eye size={15} className="text-blue-500" /> <span className="text-[13px] font-semibold">View</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/clients/edit/${item.id}`)} className="gap-2.5 rounded-lg py-2 cursor-pointer text-gray-600">
              <Edit2 size={15} className="text-emerald-500" /> <span className="text-[13px] font-semibold">Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setClientToDelete(item)} className="gap-2.5 rounded-lg py-2 cursor-pointer text-rose-500 focus:bg-rose-50">
              <Trash2 size={15} /> <span className="text-[13px] font-semibold">Delete</span>
            </DropdownMenuItem>
          </>
        )}
        emptyContent={
          <div className="flex flex-col items-center justify-center space-y-5 animate-in fade-in duration-700">
            <h4 className="text-2xl font-bold text-gray-800">No clients found</h4>
            {searchQuery && <Button variant="outline" onClick={() => setSearchQuery("")}>Clear Search</Button>}
          </div>
        }
      />

      <PaginationControls
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalResults={totalRecords}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!clientToDelete} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <DialogContent className="sm:max-w-[420px] rounded-[40px] p-0 overflow-hidden border-none shadow-2xl shadow-rose-900/10">
          <div className="bg-gradient-to-b from-rose-50 to-white dark:from-rose-500/10 dark:to-[#111827] p-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-white dark:bg-gray-800 flex items-center justify-center text-rose-500 shadow-[0_15px_30px_-10px_rgba(225,29,72,0.3)] mb-8 animate-in zoom-in duration-500">
              <Trash2 size={40} strokeWidth={2.5} />
            </div>
            <DialogTitle className="text-2xl font-black text-gray-800 dark:text-gray-100 uppercase tracking-tighter">Discard Client?</DialogTitle>
            <DialogDescription className="mt-4 text-gray-500 dark:text-gray-400 font-bold text-sm leading-relaxed max-w-[280px]">
              You are about to permanently remove{" "}
              <span className="text-rose-600 underline underline-offset-4 decoration-rose-200">{clientToDelete?.name}</span>{" "}
              and all associated records.
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
              disabled={deleteMutation.isPending}
              className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-[0_10px_20px_-5px_rgba(225,29,72,0.4)] hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-70"
            >
              {deleteMutation.isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
