import AddStaffContent from "../../_components/add-staff-content";

export default function ViewStaffPage() {
  return (
    <div className="min-h-screen bg-background transition-all duration-300">
      <AddStaffContent isView={true} />
    </div>
  );
}
