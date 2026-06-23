"use client";

import React, { useState } from "react";
import { Edit2, Trash2, Plus, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
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
import { vendorUi } from "@/lib/vendor-ui";
import {
  useVendorSubscribers,
  useCreateVendorSubscriber,
  useUpdateVendorSubscriber,
  useDeleteVendorSubscriber,
  VendorSubscriber,
} from "@/hooks/use-vendor-subscribers";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SubscribersListContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" | null }>({ key: "created_at", order: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<VendorSubscriber | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [subToDelete, setSubToDelete] = useState<VendorSubscriber | null>(null);

  const { data: res, isLoading: loading } = useVendorSubscribers({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
    sort_by: sortConfig.key || "created_at",
    sort_order: (sortConfig.order?.toUpperCase() as "ASC" | "DESC") || "DESC",
  });

  const createMutation = useCreateVendorSubscriber();
  const updateMutation = useUpdateVendorSubscriber();
  const deleteMutation = useDeleteVendorSubscriber();

  const subscribers = res?.data || [];
  const totalRecords = res?.pagination?.total || 0;

  const openAdd = () => { setEditing(null); setEmailInput(""); setFormOpen(true); };
  const openEdit = (item: VendorSubscriber) => { setEditing(item); setEmailInput(item.email); setFormOpen(true); };

  const handleSubmit = async () => {
    const email = emailInput.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: { email } });
    } else {
      await createMutation.mutateAsync({ email });
    }
    setFormOpen(false);
  };

  const handleDelete = async () => {
    if (!subToDelete) return;
    await deleteMutation.mutateAsync(subToDelete.id);
    setSubToDelete(null);
  };

  const columns: Column<VendorSubscriber>[] = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      render: (item) => (
        <span className={vendorUi.table.textTiny}>#{item.id.toString().padStart(2, "0")}</span>
      ),
    },
    {
      key: "email",
      label: "Subscriber Email",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]">
            <Mail size={15} />
          </span>
          <span className={`${vendorUi.table.textStrong} max-w-[320px] truncate`} title={item.email}>
            {item.email}
          </span>
        </div>
      ),
    },
    {
      key: "is_active",
      label: "Active",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3 whitespace-nowrap">
          <Switch
            checked={item.is_active === 1}
            onCheckedChange={() =>
              updateMutation.mutate({ id: item.id, data: { is_active: item.is_active === 1 ? 0 : 1 } })
            }
            disabled={updateMutation.isPending}
          />
          <Badge
            variant="outline"
            className="h-5 px-2 py-0 text-[var(--vendor-caption-text)] font-bold uppercase tracking-wide rounded-[var(--vendor-radius-pill)]"
            style={item.is_active === 1
              ? { backgroundColor: "#ecfdf5", color: "#059669", borderColor: "#a7f3d0" }
              : { backgroundColor: "#f3f4f6", color: "#6b7280", borderColor: "#d1d5db" }}
          >
            {item.is_active === 1 ? "Active" : "Inactive"}
          </Badge>
        </div>
      ),
    },
  ];

  const visibleColumns = columns.map((c) => c.key);

  return (
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-3">
      <PageHeader
        title="SUBSCRIBER"
        subtitle="Emails collected from your website footer newsletter signup."
        total={totalRecords}
        rightContent={
          <div className="flex items-center gap-2" onClick={openAdd}>
            <ActionButton label="ADD SUBSCRIBER" variant_type="Client" />
          </div>
        }
      />

      <DataTableSearch
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
        placeholder="Search subscribers by email..."
      />

      <DataTable
        data={subscribers}
        columns={columns}
        visibleColumns={visibleColumns}
        selectedIds={selectedIds}
        rowIdKey="id"
        loading={loading}
        onSelect={(id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])}
        onSelectAll={() => setSelectedIds(selectedIds.length === subscribers.length ? [] : subscribers.map((d) => d.id))}
        onSort={(key) => setSortConfig((prev) => ({ key, order: prev.key === key && prev.order === "asc" ? "desc" : "asc" }))}
        sortConfig={sortConfig}
        actionContent={(item) => (
          <>
            <DropdownMenuItem onClick={() => openEdit(item)} className="gap-2.5 rounded-[var(--vendor-radius-control)] py-2 cursor-pointer text-gray-600">
              <Edit2 size={15} className="text-emerald-500" /> <span className="text-[13px] font-semibold">Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSubToDelete(item)} className="gap-2.5 rounded-[var(--vendor-radius-control)] py-2 cursor-pointer text-rose-500 focus:bg-rose-50">
              <Trash2 size={15} /> <span className="text-[13px] font-semibold">Delete</span>
            </DropdownMenuItem>
          </>
        )}
        emptyContent={
          <div className="flex flex-col items-center justify-center space-y-5 animate-in fade-in duration-700">
            <h4 className="text-2xl font-bold text-gray-800">No subscribers found</h4>
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

      {/* Add / Edit Subscriber Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-[var(--vendor-radius-panel)] p-0 overflow-hidden border-none shadow-2xl">
          <div className="p-8">
            <DialogTitle className="text-[var(--vendor-title-text)] font-bold text-[var(--vendor-text)] uppercase tracking-tight">
              {editing ? "Edit Subscriber" : "Add Subscriber"}
            </DialogTitle>
            <DialogDescription className="mt-2 text-[var(--vendor-text-muted)] text-sm">
              {editing ? "Update the subscriber's email address." : "Add an email to your newsletter subscriber list."}
            </DialogDescription>
            <div className="mt-6 space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--vendor-text-muted)]">
                Subscriber Email
              </label>
              <Input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@example.com"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="p-6 bg-gray-50/50 dark:bg-gray-900 flex flex-row gap-3 border-t border-[var(--vendor-border)]">
            <Button
              variant="ghost"
              onClick={() => setFormOpen(false)}
              className="flex-1 h-11 rounded-[var(--vendor-radius-panel)] font-bold text-[11px] uppercase tracking-wide text-[var(--vendor-text-muted)] hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-1 h-11 bg-[var(--vendor-primary-btn)] hover:bg-[var(--vendor-primary-btn-hover)] text-white rounded-[var(--vendor-radius-panel)] font-black text-[11px] uppercase tracking-wide disabled:opacity-70"
            >
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : editing ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!subToDelete} onOpenChange={(open) => !open && setSubToDelete(null)}>
        <DialogContent className="sm:max-w-[420px] rounded-[var(--vendor-radius-panel)] p-0 overflow-hidden border-none shadow-2xl shadow-rose-900/10">
          <div className="bg-gradient-to-b from-rose-50 to-white dark:from-rose-500/10 dark:to-[#111827] p-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-[var(--vendor-radius-panel)] bg-[var(--vendor-panel-bg)] flex items-center justify-center text-rose-500 shadow-[0_15px_30px_-10px_rgba(225,29,72,0.3)] mb-8">
              <Trash2 size={40} strokeWidth={2.5} />
            </div>
            <DialogTitle className="text-[var(--vendor-title-text)] font-bold text-[var(--vendor-text)] uppercase tracking-tighter">Remove Subscriber?</DialogTitle>
            <DialogDescription className="mt-4 text-[var(--vendor-text-muted)] font-bold text-sm leading-relaxed max-w-[280px]">
              You are about to remove{" "}
              <span className="text-rose-600 underline underline-offset-4 decoration-rose-200">{subToDelete?.email}</span>{" "}
              from your subscriber list.
            </DialogDescription>
          </div>
          <DialogFooter className="p-8 bg-gray-50/50 dark:bg-gray-900 flex flex-row gap-4 border-t border-[var(--vendor-border)]">
            <Button
              variant="ghost"
              onClick={() => setSubToDelete(null)}
              className="flex-1 h-12 rounded-[var(--vendor-radius-panel)] font-bold text-[12px] uppercase tracking-wide text-[var(--vendor-text-muted)] hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-[var(--vendor-radius-panel)] font-black text-[12px] uppercase tracking-wide disabled:opacity-70"
            >
              {deleteMutation.isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
