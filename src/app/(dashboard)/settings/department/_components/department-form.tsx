"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CommonCard } from "@/components/common/CommonCard";
import { FormGroup } from "@/components/common/FormGroup";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import { Building2, FileText } from "lucide-react";
import {
  useCreateVendorDepartment,
  useUpdateVendorDepartment,
  type VendorDepartment,
} from "@/hooks/use-vendor-departments";

interface DepartmentFormProps {
  department?: VendorDepartment | null;
}

export default function DepartmentForm({ department }: DepartmentFormProps) {
  const router = useRouter();
  const createMutation = useCreateVendorDepartment();
  const updateMutation = useUpdateVendorDepartment();

  const [name, setName]               = useState(department?.name || "");
  const [description, setDescription] = useState(department?.description || "");
  const [isActive, setIsActive]       = useState(department ? department.is_active === 1 : true);
  const [errors, setErrors]           = useState<Record<string, string>>({});

  useEffect(() => {
    if (department) {
      setName(department.name);
      setDescription(department.description || "");
      setIsActive(department.is_active === 1);
    }
  }, [department]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Department name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (department) {
      updateMutation.mutate(
        { id: department.id, data: { name: name.trim(), description: description.trim() || undefined, is_active: isActive ? 1 : 0 } },
        { onSuccess: () => router.push("/settings/department") }
      );
    } else {
      createMutation.mutate(
        { name: name.trim(), description: description.trim() || undefined },
        { onSuccess: () => router.push("/settings/department") }
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-[1700px] mx-auto px-6 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom duration-1000">
      {/* Left Column */}
      <div className="lg:col-span-9 space-y-6">
        <CommonCard
          title="Department Details"
          subtitle="Basic information about the department"
          icon={Building2}
          iconColorClass="text-indigo-600"
          iconBgClass="bg-indigo-50 dark:bg-indigo-500/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormGroup label="Department Name" icon={Building2} error={errors.name} required>
              <Input
                value={name}
                onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: "" })); }}
                placeholder="e.g. Operations"
                className={`h-12 pl-12 border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)]/20 rounded-[var(--vendor-radius-panel)] text-sm shadow-sm ${errors.name ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-[var(--vendor-primary-btn)]/20 focus:ring-4 focus:ring-[var(--vendor-primary-btn)]/10"}`}
              />
            </FormGroup>

            <FormGroup label="Description" icon={FileText}>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description (optional)"
                className="h-12 pl-12 border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)]/20 rounded-[var(--vendor-radius-panel)] text-sm shadow-sm focus:border-[var(--vendor-primary-btn)]/20 focus:ring-4 focus:ring-[var(--vendor-primary-btn)]/10"
              />
            </FormGroup>
          </div>

          <div className="flex items-center justify-between mt-6 p-4 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-gray-50/50 dark:bg-gray-800/20">
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
              <p className="text-xs text-[var(--vendor-text-muted)] mt-0.5">Inactive departments will not appear in staff assignment</p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </CommonCard>
      </div>

      {/* Right Column: Actions */}
      <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8">
        <div className="bg-[var(--vendor-panel-bg)] backdrop-blur-md p-6 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
          <PersistenceActions
            onSave={handleSubmit}
            onCancel={() => router.push("/settings/department")}
            saveLabel={department ? "UPDATE DEPARTMENT" : "CREATE DEPARTMENT"}
            isSubmitting={isPending}
          />
        </div>
      </div>
    </div>
  );
}
