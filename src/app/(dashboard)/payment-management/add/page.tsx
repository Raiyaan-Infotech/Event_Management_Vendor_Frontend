import AddPaymentContent from "../_components/add-payment-content";

export const metadata = {
  title: "Record Payment | Vendor Portal",
  description: "Record a new payment transaction and manage financial workflow for your events.",
};

export default function RecordPaymentPage() {
  return (
    <div className="min-h-screen bg-background transition-all duration-300">
      <AddPaymentContent />
    </div>
  );
}
