import RoleForm from "../_components/role-form";
import { PageHeader } from "@/components/common/PageHeader";

export default function CreateRolePage() {
  return (
    <div className="min-h-screen bg-background transition-all duration-300">
      <div className="p-6">
        <PageHeader title="Create Role" subtitle="Define a new staff role with permissions" />
      </div>
      <RoleForm />
    </div>
  );
}
