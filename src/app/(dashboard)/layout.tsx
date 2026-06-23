"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { VendorSidebar } from "@/components/layout/Sidebar/VendorSidebar";
import VendorHeader from "@/components/layout/Header/VendorHeader";
import VendorBreadcrumb from "@/components/layout/Breadcrumb/VendorBreadcrumb";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {/* Full-width top header bar */}
      <VendorHeader />
      {/* Sidebar starts below the 64px header */}
      <VendorSidebar />
      <SidebarInset className="bg-background flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-300 pt-14">
        <VendorBreadcrumb />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
          <div className="flex-1 overflow-auto h-full vendor-dashboard">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
