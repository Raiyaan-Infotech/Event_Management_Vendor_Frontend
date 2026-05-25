import DepartmentForm from "../_components/department-form";
import { PageHeader } from "@/components/common/PageHeader";

export default function CreateDepartmentPage() {
  return (
    <div className="min-h-screen bg-background transition-all duration-300">
      <div className="p-6">
        <PageHeader title="Add Department" subtitle="Add a new department for your staff" />
      </div>
      <DepartmentForm />
    </div>
  );
}
