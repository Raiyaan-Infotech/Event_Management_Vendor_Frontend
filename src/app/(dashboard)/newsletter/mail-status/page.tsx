import React, { Suspense } from "react";
import MailStatusContent from "../_components/mail-status-content";

export const metadata = {
  title: "Mail Delivery Status | Vendor Portal",
  description: "Track the status of your newsletter mail deliveries.",
};

export default function MailStatusPage() {
  return (
    <Suspense fallback={<div className="h-full flex items-center justify-center p-8 bg-[#F8FAFC]">Loading mail status...</div>}>
      <MailStatusContent />
    </Suspense>
  );
}
