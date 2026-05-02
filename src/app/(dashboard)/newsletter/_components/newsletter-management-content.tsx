"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Download
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTableSearch } from "@/components/common/DataTableSearch";
import { DataTable, Column } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/PaginationControls";
import { ColumnToggle } from "@/components/common/ColumnToggle";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  useNewsletterSubscribers,
  useNewsletterUnsubscribers,
  useBulkUpdateClientType,
  useBulkUpdateByIds,
  useToggleClientType,
  getPlanLabel,
  NewsletterClient,
} from "@/hooks/use-newsletter";
import { useVendorSubscription } from "@/hooks/use-vendor-subscription";

interface Props {
  type: "subscribers" | "unsubscribers";
}

interface Row {
  id: number;
  name: string;
  email: string;
  membership: string;
  rawPlan: string | null;
  status: "Subscribed" | "UnSubscribed";
}

function mapToRow(c: NewsletterClient): Row {
  return {
    id:         c.id,
    name:       c.name,
    email:      c.email,
    membership: getPlanLabel(c.plan, c.registration_type),
    rawPlan:    c.plan,
    status:     c.client_type === 'subscribed' ? "Subscribed" : "UnSubscribed",
  };
}

export default function NewsletterManagementContent({ type }: Props) {
  const isSubscribers = type === "subscribers";

  const subscribersQuery   = useNewsletterSubscribers();
  const unsubscribersQuery = useNewsletterUnsubscribers();

  const rawData: NewsletterClient[] = (isSubscribers ? subscribersQuery.data : unsubscribersQuery.data) ?? [];
  const isLoading = isSubscribers ? subscribersQuery.isLoading : unsubscribersQuery.isLoading;

  const { data: subscriptionData } = useVendorSubscription();
  const plans = subscriptionData?.plans ?? [];

  const bulkUpdate      = useBulkUpdateClientType();
  const bulkUpdateIds   = useBulkUpdateByIds();
  const toggleStatus    = useToggleClientType();

  const rows: Row[] = rawData.map(mapToRow);

  const [searchQuery,      setSearchQuery]      = useState("");
  const [sortConfig,       setSortConfig]        = useState<{ key: string; order: "asc" | "desc" | null }>({ key: "", order: null });
  const [currentPage,      setCurrentPage]       = useState(1);
  const [itemsPerPage,     setItemsPerPage]      = useState(10);
  const [selectedIds,      setSelectedIds]       = useState<(string | number)[]>([]);
  const [filterMembership, setFilterMembership]  = useState("All");

  const [confirmAction, setConfirmAction] = useState<{ label: string; onConfirm: () => void } | null>(null);

  const columns: Column<Row>[] = [
    {
      key: "s_no",
      label: "S.No",
      render: (_, index) => (
        <span className="text-[12px] font-bold text-gray-600 dark:text-gray-400">
          {(currentPage - 1) * itemsPerPage + (index + 1)}
        </span>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (item) => (
        <span className="text-[13px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
          {item.name}
        </span>
      ),
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (item) => (
        <span className="text-[12px] text-gray-600 dark:text-gray-400">{item.email}</span>
      ),
    },
    {
      key: "membership",
      label: "Client Membership",
      sortable: true,
      render: (item) => {
        const planColor = plans.find(p => p.name === item.rawPlan)?.label_color;
        return (
          <span
            className="text-[12px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
            style={planColor
              ? { backgroundColor: planColor + '22', color: planColor, borderColor: planColor + '44' }
              : { backgroundColor: '#eff6ff', color: '#2563eb', borderColor: '#bfdbfe' }}
          >
            {item.membership}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (item) => {
        const isSubscribed = item.status === "Subscribed";
        return (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setConfirmAction({
                label: isSubscribed ? `Unsubscribe ${item.name}?` : `Subscribe ${item.name}?`,
                onConfirm: () => toggleStatus.mutate(item.id),
              })}
              disabled={toggleStatus.isPending}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-60 ${isSubscribed ? "bg-emerald-500" : "bg-rose-500"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${isSubscribed ? "translate-x-6" : "translate-x-1"}`} />
            </button>
            <span className={`text-[11px] font-black uppercase tracking-widest ${isSubscribed ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {item.status}
            </span>
          </div>
        );
      },
    },
  ];

  const allColumnKeys = columns.map(c => c.key);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumnKeys);
  const [tempColumns,    setTempColumns]    = useState<string[]>(allColumnKeys);

  const filteredData = useMemo(() => {
    let result = [...rows].filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.membership.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMembership = filterMembership === "All" || item.membership === filterMembership;
      return matchesSearch && matchesMembership;
    });

    if (sortConfig.key && sortConfig.order) {
      result.sort((a, b) => {
        const aVal = String(a[sortConfig.key as keyof Row]).toLowerCase();
        const bVal = String(b[sortConfig.key as keyof Row]).toLowerCase();
        if (aVal < bVal) return sortConfig.order === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.order === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [rows, searchQuery, sortConfig, filterMembership]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = () => {
    if (rows.length === 0) return toast.error("No data to export");
    const headers = ["ID", "Name", "Email", "Membership", "Status"];
    const csvContent = [
      headers.join(","),
      ...rows.map(s => [s.id, `"${s.name}"`, `"${s.email}"`, `"${s.membership}"`, `"${s.status}"`].join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `newsletter_${type}_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported successfully");
  };

  const title = isSubscribers ? "SUBSCRIBERS" : "UNSUBSCRIBERS";
  const subtitle = isSubscribers
    ? "Clients with an active plan who receive your newsletter."
    : "Clients with no active plan — not receiving newsletter.";

  return (
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-3 bg-[#F8FAFC] dark:bg-black/40">
      <PageHeader
        title={title}
        subtitle={subtitle}
        total={rows.length}
        rightContent={
          <Button variant="outline" onClick={handleExport} className="h-10 text-[11px] font-black gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-widest bg-white">
            <Download size={15} strokeWidth={2.5} /> Export
          </Button>
        }
      />

      <DataTableSearch
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
        placeholder="Search by name, email or membership..."
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
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Guest">Guest</SelectItem>
                  {plans.map(p => (
                    <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                  ))}
                  <SelectItem value="—">No Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" onClick={() => setFilterMembership("All")} className="w-full h-10 rounded-xl text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all">
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

      <div className="flex justify-end">
        {isSubscribers ? (
          <Button
            onClick={() => setConfirmAction({
              label: selectedIds.length > 0
                ? `Unsubscribe ${selectedIds.length} selected client(s)?`
                : `Unsubscribe all ${rows.length} client(s)?`,
              onConfirm: () => selectedIds.length > 0
                ? bulkUpdateIds.mutate({ ids: selectedIds as number[], client_type: 'unsubscribed' }, { onSuccess: () => setSelectedIds([]) })
                : bulkUpdate.mutate({ from: 'subscribed', to: 'unsubscribed' }),
            })}
            disabled={bulkUpdate.isPending || bulkUpdateIds.isPending || rows.length === 0}
            className="h-10 text-[11px] font-black gap-2 uppercase tracking-widest bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-sm border-none disabled:opacity-60"
          >
            <Users size={15} strokeWidth={2.5} />
            {bulkUpdate.isPending || bulkUpdateIds.isPending ? 'Updating...' : selectedIds.length > 0 ? `Unsubscribe (${selectedIds.length})` : 'Unsubscribers'}
          </Button>
        ) : (
          <Button
            onClick={() => setConfirmAction({
              label: selectedIds.length > 0
                ? `Subscribe ${selectedIds.length} selected client(s)?`
                : `Subscribe all ${rows.length} client(s)?`,
              onConfirm: () => selectedIds.length > 0
                ? bulkUpdateIds.mutate({ ids: selectedIds as number[], client_type: 'subscribed' }, { onSuccess: () => setSelectedIds([]) })
                : bulkUpdate.mutate({ from: 'unsubscribed', to: 'subscribed' }),
            })}
            disabled={bulkUpdate.isPending || bulkUpdateIds.isPending || rows.length === 0}
            className="h-10 text-[11px] font-black gap-2 uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-sm border-none disabled:opacity-60"
          >
            <Users size={15} strokeWidth={2.5} />
            {bulkUpdate.isPending || bulkUpdateIds.isPending ? 'Updating...' : selectedIds.length > 0 ? `Subscribe (${selectedIds.length})` : 'Subscribers'}
          </Button>
        )}
      </div>

      <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <DataTable
          data={paginatedData}
          columns={columns}
          visibleColumns={visibleColumns}
          selectedIds={selectedIds}
          rowIdKey="id"
          loading={isLoading}
          onSelect={(id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
          onSelectAll={() => setSelectedIds(selectedIds.length === paginatedData.length ? [] : paginatedData.map(d => d.id))}
          onSort={(key) => setSortConfig(prev => ({ key, order: prev.key === key && prev.order === "asc" ? "desc" : "asc" }))}
          sortConfig={sortConfig}
          noCard={true}
          actionContent={() => (
            <>
              <DropdownMenuItem onClick={() => toast.info("Update plan from the Clients module")} className="gap-2.5 rounded-lg py-2 cursor-pointer text-gray-600 font-bold">
                <Users size={15} className="text-blue-500" /> <span className="text-[13px]">View Client</span>
              </DropdownMenuItem>
            </>
          )}
          emptyContent={
            <div className="flex flex-col items-center justify-center space-y-5 animate-in fade-in duration-700">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                <Users size={32} />
              </div>
              <h4 className="text-2xl font-bold text-gray-800">
                No {isSubscribers ? "subscribers" : "unsubscribers"} found
              </h4>
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

      <Dialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <DialogContent className="sm:max-w-[400px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/60 dark:to-[#111827] p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-blue-500 shadow-lg mb-6">
              <Users size={28} strokeWidth={2.5} />
            </div>
            <DialogTitle className="text-xl font-black text-gray-800 dark:text-gray-100 uppercase tracking-tight">
              Confirm Action
            </DialogTitle>
            <DialogDescription className="mt-3 text-gray-500 dark:text-gray-400 font-bold text-sm leading-relaxed">
              {confirmAction?.label}
            </DialogDescription>
          </div>
          <DialogFooter className="p-6 bg-gray-50/50 dark:bg-gray-900 flex flex-row gap-3 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="ghost"
              onClick={() => setConfirmAction(null)}
              className="flex-1 h-11 rounded-2xl font-black text-[11px] uppercase tracking-widest text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              Cancel
            </Button>
            <Button
              onClick={() => { confirmAction?.onConfirm(); setConfirmAction(null); }}
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg transition-all"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
