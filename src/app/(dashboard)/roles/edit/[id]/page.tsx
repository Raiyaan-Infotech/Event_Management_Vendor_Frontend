"use client";

import { useParams } from "next/navigation";
import RoleForm from "../../_components/role-form";
import { PageHeader } from "@/components/common/PageHeader";
import { useVendorRole } from "@/hooks/use-vendor-roles";

export default function EditRolePage() {
  const params = useParams();
  const id = params.id as string;
  const { data: role, isLoading } = useVendorRole(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading role...</p>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-gray-400">Role not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-all duration-300">
      <div className="p-6">
        <PageHeader title="Edit Role" subtitle={`Update "${role.name}" role and permissions`} />
      </div>
      <RoleForm role={role} />
    </div>
  );
}
