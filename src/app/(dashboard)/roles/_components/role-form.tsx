"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { CommonCard } from "@/components/common/CommonCard";
import { FormGroup } from "@/components/common/FormGroup";
import { ActionFooter } from "@/components/common/ActionFooter";
import { Shield, FileText, ChevronDown, ChevronRight } from "lucide-react";
import {
  useCreateVendorRole,
  useUpdateVendorRole,
  useAssignPermissions,
  useVendorModules,
  type VendorRole,
  type VendorModule,
  type VendorPermission,
} from "@/hooks/use-vendor-roles";

interface RoleFormProps {
  role?: VendorRole | null;
}

export default function RoleForm({ role }: RoleFormProps) {
  const router = useRouter();
  const createMutation = useCreateVendorRole();
  const updateMutation = useUpdateVendorRole();
  const assignMutation = useAssignPermissions();
  const { data: modules, isLoading: modulesLoading } = useVendorModules();

  const [name, setName] = useState(role?.name || "");
  const [description, setDescription] = useState(role?.description || "");
  const [isActive, setIsActive] = useState(role ? role.is_active === 1 : true);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<number>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate selected permissions from existing role
  useEffect(() => {
    if (role?.permissions) {
      setSelectedPermissions(new Set(role.permissions.map((p) => p.id)));
    }
  }, [role]);

  const toggleModule = (slug: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  };

  const togglePermission = (id: number) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleModuleAll = (permissions: VendorPermission[], checked: boolean) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      permissions.forEach((p) => (checked ? next.add(p.id) : next.delete(p.id)));
      return next;
    });
  };

  const toggleAll = (checked: boolean) => {
    if (!modules) return;
    const allIds = modules.flatMap((m) => m.permissions.map((p) => p.id));
    setSelectedPermissions(checked ? new Set(allIds) : new Set());
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Role name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const permPayload = Array.from(selectedPermissions).map((id) => ({
      permission_id: id,
      requires_approval: false,
    }));

    if (role) {
      updateMutation.mutate(
        { id: role.id, data: { name, description, is_active: isActive ? 1 : 0 } },
        {
          onSuccess: () => {
            assignMutation.mutate(
              { roleId: role.id, permissions: permPayload },
              { onSuccess: () => router.push("/roles") },
            );
          },
        },
      );
    } else {
      createMutation.mutate(
        { name, description },
        {
          onSuccess: (newRole) => {
            if (permPayload.length > 0) {
              assignMutation.mutate(
                { roleId: newRole.id, permissions: permPayload },
                { onSuccess: () => router.push("/roles") },
              );
            } else {
              router.push("/roles");
            }
          },
        },
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || assignMutation.isPending;

  const allPermissionIds = modules?.flatMap((m) => m.permissions.map((p) => p.id)) ?? [];
  const allSelected = allPermissionIds.length > 0 && allPermissionIds.every((id) => selectedPermissions.has(id));

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Role Details */}
      <CommonCard title="Role Details" subtitle="Basic information" icon={Shield} iconColorClass="text-blue-600" iconBgClass="bg-blue-50 dark:bg-blue-500/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormGroup label="Role Name" icon={Shield} error={errors.name} required>
            <Input
              value={name}
              onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: "" })); }}
              placeholder="e.g. Event Coordinator"
              className={`h-12 pl-12 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl text-sm shadow-sm ${errors.name ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5"}`}
            />
          </FormGroup>
          <FormGroup label="Description" icon={FileText}>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
              className="h-12 pl-12 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl text-sm shadow-sm focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5"
            />
          </FormGroup>
        </div>
        <div className="flex items-center justify-between mt-6 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>
      </CommonCard>

      {/* Permissions */}
      <CommonCard title="Permissions" subtitle="Assign module permissions" icon={Shield} iconColorClass="text-purple-600" iconBgClass="bg-purple-50 dark:bg-purple-500/10">
        {/* Select All */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={allSelected}
              onCheckedChange={(checked) => toggleAll(!!checked)}
            />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Select All Permissions</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <button type="button" className="text-blue-600 hover:underline" onClick={() => setExpandedModules(new Set())}>
              Collapse all
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() => setExpandedModules(new Set(modules?.map((m) => m.slug) ?? []))}
            >
              Expand all
            </button>
          </div>
        </div>

        {modulesLoading ? (
          <div className="text-center py-8 text-sm text-gray-400">Loading permissions...</div>
        ) : (
          <div className="space-y-2">
            {modules?.map((mod) => {
              const isExpanded = expandedModules.has(mod.slug);
              const modPermIds = mod.permissions.map((p) => p.id);
              const modAllSelected = modPermIds.length > 0 && modPermIds.every((id) => selectedPermissions.has(id));
              const modSomeSelected = modPermIds.some((id) => selectedPermissions.has(id));

              return (
                <div key={mod.id} className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                  {/* Module Header */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 bg-gray-50/80 dark:bg-gray-800/30 cursor-pointer hover:bg-gray-100/80 dark:hover:bg-gray-800/50 transition-colors"
                    onClick={() => toggleModule(mod.slug)}
                  >
                    <Checkbox
                      checked={modAllSelected}
                      data-state={modSomeSelected && !modAllSelected ? "indeterminate" : undefined}
                      onCheckedChange={(checked) => toggleModuleAll(mod.permissions, !!checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {isExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{mod.name}</span>
                    <span className="text-[10px] font-bold text-gray-400 ml-auto">
                      {modPermIds.filter((id) => selectedPermissions.has(id)).length}/{modPermIds.length}
                    </span>
                  </div>

                  {/* Permissions */}
                  {isExpanded && (
                    <div className="px-6 py-3 flex flex-wrap gap-x-6 gap-y-2">
                      {mod.permissions.map((perm) => {
                        const action = perm.slug.split(".").pop() || perm.name;
                        return (
                          <div key={perm.id} className="flex items-center gap-2">
                            <Checkbox
                              id={`perm-${perm.id}`}
                              checked={selectedPermissions.has(perm.id)}
                              onCheckedChange={() => togglePermission(perm.id)}
                            />
                            <label htmlFor={`perm-${perm.id}`} className="text-sm cursor-pointer capitalize text-gray-600 dark:text-gray-400">
                              {action}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CommonCard>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="rounded-2xl h-11 px-8 font-semibold shadow-md"
        >
          {isPending ? "Saving..." : role ? "Update Role" : "Create Role"}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/roles")}
          disabled={isPending}
          className="rounded-2xl h-11 px-8"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
