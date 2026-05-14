"use client";

import { useParams } from "next/navigation";
import DepartmentForm from "../../_components/department-form";
import { PageHeader } from "@/components/common/PageHeader";
import { useVendorDepartment } from "@/hooks/use-vendor-departments";

export default function EditDepartmentPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: department, isLoading } = useVendorDepartment(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-[var(--vendor-text-muted)]">Loading department...</p>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-[var(--vendor-text-muted)]">Department not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-all duration-300">
      <div className="p-6">
        <PageHeader title="Edit Department" subtitle={`Update "${department.name}" department`} />
      </div>
      <DepartmentForm department={department} />
    </div>
  );
}
