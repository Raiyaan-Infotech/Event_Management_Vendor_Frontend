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
import { vendorUi } from "@/lib/vendor-ui";
import { useVendorClients, useDeleteVendorClient, useToggleVendorClientLoginAccess, useUpdateVendorClientStatus, VendorClient } from "@/hooks/use-vendor-clients";
import { useVendorSubscription } from "@/hooks/use-vendor-subscription";

const getClientPlanLabel = (item: VendorClient) => {
  const type = String((item as any).registration_type || "").toLowerCase();
  if (type === "guest") return "Guest";
  return item.plan || "No Plan";
};
const statusLabels: Record<string, string> = {
  "1": "Active",
  "0": "Inactive",
  "2": "Blocked",
};

export default function ClientsListContent() {
  const router = useRouter();
  const { data: subscriptionData } = useVendorSubscription();
  const plans = subscriptionData?.all_plans ?? subscriptionData?.plans ?? [];
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
        <span className={vendorUi.table.textTiny}>
          #{item.id.toString().padStart(2, "0")}
        </span>
      ),
    },
    {
      key: "client_id",
      label: "Client ID",
      sortable: true,
      render: (item) => (
        <Badge variant="outline" className={vendorUi.table.codeBadge}>
          {item.client_id}
        </Badge>
      ),
    },
    {
      key: "name",
      label: "Client Name",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3 whitespace-nowrap">
          {item.profile_pic ? (
            <div className="w-8 h-8 shrink-0 rounded-full overflow-hidden border border-[var(--vendor-border)] relative">
              <SafeImage
                src={item.profile_pic}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 shrink-0 rounded-full bg-[var(--vendor-primary-btn)] flex items-center justify-center text-[var(--vendor-primary-btn-text)] text-[var(--vendor-control-text)] font-semibold uppercase">
              {item.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className={`${vendorUi.table.textStrong} max-w-[240px] truncate leading-5 uppercase`}>
              {item.name}
            </p>
            {(() => {
              const isGuest = String((item as VendorClient & { registration_type?: string }).registration_type || "").toLowerCase() === "guest";
              const planLabel = getClientPlanLabel(item);
              return (
                <Badge
                  variant="outline"
                  className="h-5 text-[var(--vendor-caption-text)] font-bold uppercase tracking-wide px-2 py-0 rounded-[var(--vendor-radius-pill)]"
                  style={isGuest
                    ? { backgroundColor: '#f3f4f6', color: '#6b7280', borderColor: '#d1d5db' }
                    : { backgroundColor: '#eff6ff', color: '#2563eb', borderColor: '#bfdbfe' }}
                >
                  {planLabel}
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
      render: (item) => <p className={vendorUi.table.textStrong}>{item.mobile}</p>,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (item) => <p className={`${vendorUi.table.textMuted} transition-colors group-hover:text-[var(--vendor-primary-btn)]`}>{item.email}</p>,
    },
    {
      key: "city",
      label: "City",
      sortable: true,
      render: (item) => <p className={vendorUi.table.textStrong}>{item.city}</p>,
    },
    {
      key: "login_access",
      label: "Login Access",
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-3 whitespace-nowrap">
          <Switch
            checked={!!item.login_access}
            onCheckedChange={() => toggleLoginAccess.mutate({ id: item.id, login_access: item.login_access ? 0 : 1 })}
            disabled={toggleLoginAccess.isPending}
            className="transition-all"
          />
          <span className={vendorUi.table.textTiny}>
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
        <div className="flex items-center gap-3 whitespace-nowrap">
          <Switch
            checked={item.is_active === 1}
            onCheckedChange={() => updateStatusMutation.mutate({ id: item.id, is_active: item.is_active === 1 ? 0 : 1 })}
            disabled={updateStatusMutation.isPending}
            className="transition-all"
          />
          <span className={vendorUi.table.textTiny}>
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
        [c.id, `"${c.client_id}"`, `"${c.name}"`, `"${c.mobile}"`, `"${c.email}"`, `"${c.city}"`, `"${getClientPlanLabel(c)}"`, `"${c.is_active}"`].join(",")
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
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="h-8 px-3 gap-1.5 text-[10px] font-bold uppercase tracking-wide">
              <Upload size={13} strokeWidth={2.5} /> Import
            </Button>
            <Button variant="outline" onClick={handleExport} className="h-8 px-3 gap-1.5 text-[10px] font-bold uppercase tracking-wide">
              <Download size={13} strokeWidth={2.5} /> Export
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
              <p className="text-[var(--vendor-form-label-text)] font-semibold uppercase text-[var(--vendor-text-muted)] tracking-wide ml-1">Subscription Plan</p>
              <Select value={filterPlan} onValueChange={setFilterPlan}>
                <SelectTrigger className="h-10 rounded-[var(--vendor-radius-control)] text-[var(--vendor-control-text)] font-semibold border-[var(--vendor-border)] bg-gray-50/50 focus:ring-0">
                  <SelectValue placeholder="All Plans" />
                </SelectTrigger>
                <SelectContent className="rounded-[var(--vendor-radius-control)] border-[var(--vendor-border)]">
                  <SelectItem value="All" className="text-[var(--vendor-control-text)] font-semibold">All Plans</SelectItem>
                  {plans.map(p => (
                    <SelectItem key={p.id} value={p.name} className="text-[var(--vendor-control-text)] font-semibold">{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-[var(--vendor-form-label-text)] font-semibold uppercase text-[var(--vendor-text-muted)] tracking-wide ml-1">Account Status</p>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-10 rounded-[var(--vendor-radius-control)] text-[var(--vendor-control-text)] font-semibold border-[var(--vendor-border)] bg-gray-50/50 focus:ring-0">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="rounded-[var(--vendor-radius-control)] border-[var(--vendor-border)]">
                  <SelectItem value="All" className="text-[var(--vendor-control-text)] font-semibold">All Status</SelectItem>
                  <SelectItem value="1"   className="text-[var(--vendor-control-text)] font-semibold">Active</SelectItem>
                  <SelectItem value="0"   className="text-[var(--vendor-control-text)] font-semibold">Inactive</SelectItem>
                  <SelectItem value="2"   className="text-[var(--vendor-control-text)] font-semibold">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" onClick={() => { setFilterPlan("All"); setFilterStatus("All"); }} className="w-full h-8 rounded-[var(--vendor-radius-control)] text-[10px] font-semibold uppercase tracking-wide text-rose-500 hover:bg-rose-50 transition-all">
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
            <DropdownMenuItem onClick={() => router.push(`/clients/view/${item.id}`)} className="gap-2.5 rounded-[var(--vendor-radius-control)] py-2 cursor-pointer text-gray-600">
              <Eye size={15} className="text-[var(--vendor-primary-btn)]" /> <span className="text-[13px] font-semibold">View</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/clients/edit/${item.id}`)} className="gap-2.5 rounded-[var(--vendor-radius-control)] py-2 cursor-pointer text-gray-600">
              <Edit2 size={15} className="text-emerald-500" /> <span className="text-[13px] font-semibold">Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setClientToDelete(item)} className="gap-2.5 rounded-[var(--vendor-radius-control)] py-2 cursor-pointer text-rose-500 focus:bg-rose-50">
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
        <DialogContent className="sm:max-w-[420px] rounded-[var(--vendor-radius-panel)] p-0 overflow-hidden border-none shadow-2xl shadow-rose-900/10">
          <div className="bg-gradient-to-b from-rose-50 to-white dark:from-rose-500/10 dark:to-[#111827] p-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-[var(--vendor-radius-panel)] bg-[var(--vendor-panel-bg)] flex items-center justify-center text-rose-500 shadow-[0_15px_30px_-10px_rgba(225,29,72,0.3)] mb-8 animate-in zoom-in duration-500">
              <Trash2 size={40} strokeWidth={2.5} />
            </div>
            <DialogTitle className="text-[var(--vendor-title-text)] font-bold text-[var(--vendor-text)] uppercase tracking-tighter">Discard Client?</DialogTitle>
            <DialogDescription className="mt-4 text-[var(--vendor-text-muted)] font-bold text-sm leading-relaxed max-w-[280px]">
              You are about to permanently remove{" "}
              <span className="text-rose-600 underline underline-offset-4 decoration-rose-200">{clientToDelete?.name}</span>{" "}
              and all associated records.
            </DialogDescription>
          </div>
          <DialogFooter className="p-8 bg-gray-50/50 dark:bg-gray-900 flex flex-row gap-4 border-t border-[var(--vendor-border)]">
            <Button
              variant="ghost"
              onClick={() => setClientToDelete(null)}
              className="flex-1 h-12 rounded-[var(--vendor-radius-panel)] font-bold text-[12px] uppercase tracking-wide text-[var(--vendor-text-muted)] hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-[var(--vendor-radius-panel)] font-black text-[12px] uppercase tracking-wide shadow-[0_10px_20px_-5px_rgba(225,29,72,0.4)] hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-70"
            >
              {deleteMutation.isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
