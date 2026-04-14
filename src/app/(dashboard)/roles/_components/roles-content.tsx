"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Shield,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Layout
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { DataTableSearch } from "@/components/common/DataTableSearch";
import { PaginationControls } from "@/components/common/PaginationControls";
import { ActionButton } from "@/components/common/ActionButton";
import { ColumnToggle } from "@/components/common/ColumnToggle";
import { useVendorRoles, useDeleteVendorRole, type VendorRole } from "@/hooks/use-vendor-roles";

export default function RolesContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" | null }>({ key: "id", order: "desc" });
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [roleToDelete, setRoleToDelete] = useState<VendorRole | null>(null);

  const { data, isLoading } = useVendorRoles({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery
  });
  
  const deleteMutation = useDeleteVendorRole();

  const roles = data?.data ?? [];
  const total = data?.pagination?.total ?? 0;

  const roleColumns: Column<VendorRole>[] = [
    {
      key: "name",
      label: "Role",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
            <Shield size={16} className="text-blue-600" />
          </div>
          <span className="font-bold text-sm text-gray-800 dark:text-gray-100 uppercase tracking-tight">{item.name}</span>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
      render: (item) => (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate font-medium italic">
          {item.description || "—"}
        </p>
      ),
    },
    {
      key: "permissions",
      label: "Permissions",
      render: (item) => (
        <Badge variant="outline" className="text-[10px] font-black border-purple-200 text-purple-600 bg-purple-50/50 dark:bg-purple-500/10 dark:border-purple-500/20 uppercase">
          {item.permissions?.length ?? 0} PERMISSIONS
        </Badge>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      sortable: true,
      render: (item) => (
        item.is_active === 1 ? (
          <span className="inline-flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-500/20 uppercase">
            <CheckCircle2 size={12} className="mr-1.5" />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center text-[10px] font-black text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-500/20 uppercase">
            <XCircle size={12} className="mr-1.5" />
            Inactive
          </span>
        )
      ),
    },
  ];

  const allColumnKeys = roleColumns.map(c => c.key);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumnKeys);
  const [tempColumns, setTempColumns] = useState<string[]>(allColumnKeys);

  const handleDelete = async () => {
    if (!roleToDelete) return;
    deleteMutation.mutate(roleToDelete.id, {
      onSuccess: () => {
        toast.success(`Role "${roleToDelete.name}" deleted`);
        setRoleToDelete(null);
      },
    });
  };

  return (
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-3">
      <PageHeader
        title="ROLES"
        subtitle="Manage staff roles and assign specific permissions."
        total={total}
        rightContent={
          <ActionButton
            label="ADD ROLE"
            variant_type="Client"
            icon={Plus}
            onClick={() => router.push("/roles/create")}
          />
        }
      />

      <DataTableSearch
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
        placeholder="Search roles..."
        isFiltered={false}
        columnContent={
          <ColumnToggle
            columns={roleColumns.map(c => ({ key: c.key, label: c.label }))}
            tempColumns={tempColumns}
            onToggle={(key) => setTempColumns(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
            onToggleAll={() => setTempColumns(tempColumns.length === allColumnKeys.length ? [] : allColumnKeys)}
            onSave={() => { setVisibleColumns(tempColumns); toast.success("Columns updated"); }}
          />
        }
      />

      <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <DataTable
          data={roles}
          columns={roleColumns}
          visibleColumns={visibleColumns}
          selectedIds={selectedIds}
          rowIdKey="id"
          loading={isLoading}
          onSelect={(id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
          onSelectAll={() => setSelectedIds(selectedIds.length === roles.length ? [] : roles.map(d => d.id))}
          onSort={(key) => setSortConfig(prev => ({ key, order: prev.key === key && prev.order === "asc" ? "desc" : "asc" }))}
          sortConfig={sortConfig}
          noCard={true}
          actionContent={(item) => (
            <>
              <DropdownMenuItem
                onClick={() => router.push(`/roles/edit/${item.id}`)}
                className="gap-2.5 rounded-lg py-2 cursor-pointer text-gray-700"
              >
                <Edit2 size={15} className="text-blue-500" /> <span className="text-[13px] font-semibold">Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setRoleToDelete(item)}
                className="gap-2.5 rounded-lg py-2 cursor-pointer text-rose-500 focus:bg-rose-50"
              >
                <Trash2 size={15} /> <span className="text-[13px] font-semibold">Delete</span>
              </DropdownMenuItem>
            </>
          )}
          emptyContent={
            <div className="flex flex-col items-center justify-center space-y-5 animate-in fade-in duration-700">
               <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                  <Layout size={32} />
               </div>
               <h4 className="text-2xl font-bold text-gray-800">No roles found</h4>
            </div>
          }
        />
  
        <PaginationControls
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalResults={total}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
        />
      </div>

      <Dialog open={roleToDelete !== null} onOpenChange={(open) => { if (!open) setRoleToDelete(null); }}>
        <DialogContent className="sm:max-w-[420px] rounded-[40px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-gradient-to-b from-rose-50 to-white dark:from-rose-500/10 dark:to-[#111827] p-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-white dark:bg-gray-800 flex items-center justify-center text-rose-500 shadow-xl mb-8">
              <Trash2 size={40} strokeWidth={2.5} />
            </div>
            <DialogTitle className="text-2xl font-black text-gray-800 dark:text-gray-100 uppercase tracking-tighter">Delete Role?</DialogTitle>
            <DialogDescription className="mt-4 text-gray-500 dark:text-gray-400 font-bold text-sm leading-relaxed max-w-[280px]">
              Are you sure you want to delete the role &quot;{roleToDelete?.name}&quot;? This may affect staff permissions.
            </DialogDescription>
          </div>
          <DialogFooter className="p-8 bg-gray-50/50 dark:bg-gray-900 flex flex-row gap-4 border-t border-gray-50 dark:border-gray-800">
            <Button variant="ghost" onClick={() => setRoleToDelete(null)} className="flex-1 h-12 rounded-2xl font-bold uppercase tracking-widest text-gray-400">Cancel</Button>
            <Button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
