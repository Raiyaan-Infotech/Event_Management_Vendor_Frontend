"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { VendorSidebar } from "@/components/layout/Sidebar/VendorSidebar";
import VendorHeader from "@/components/layout/Header/VendorHeader";
import VendorBreadcrumb from "@/components/layout/Breadcrumb/VendorBreadcrumb";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <VendorSidebar />
      <SidebarInset className="bg-background flex flex-col min-w-0 min-h-screen transition-all duration-300">
        <VendorHeader />
        <VendorBreadcrumb />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <div className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 pb-6">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
