"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ThemeFullPagePreview } from "@/components/website/ThemeFullPagePreview";
import Loader from "@/components/ui/loader";
import { useVendorPreviewData } from "@/hooks/use-vendor-preview";

function PreviewContent() {
  const searchParams = useSearchParams();
  const { data: vendorData, isLoading } = useVendorPreviewData();

  if (isLoading) {
    return <Loader />;
  }

  if (!vendorData || !vendorData.theme_id) {
    return (
      <div className="h-[calc(100vh-86px)] flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-gray-500 font-medium">No active theme set.</p>
          <p className="text-sm text-gray-400">Please select a theme first.</p>
        </div>
      </div>
    );
  }

  // Use URL params if present (for live previewing unsaved colors), otherwise fall back to saved merged colors
  const activeColors = {
    header: searchParams.get("header") || vendorData.colors?.header_color || "#2563eb",
    footer: searchParams.get("footer") || vendorData.colors?.footer_color || "#1e3a8a",
    primary: searchParams.get("primary") || vendorData.colors?.primary_color || "#3b82f6",
    secondary: searchParams.get("secondary") || vendorData.colors?.secondary_color || "#60a5fa",
    hover: searchParams.get("hover") || vendorData.colors?.hover_color || "#1d4ed8",
    text: searchParams.get("text") || vendorData.colors?.text_color || "#1e293b",
  };

  return (
    <ThemeFullPagePreview 
      title="Live Designer"
      subtitle="PREVIEWING YOUR THEME WITH REAL DATA"
      themeId={vendorData.theme_id}
      colors={activeColors}
      vendorData={vendorData}
    />
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<Loader />}>
      <PreviewContent />
    </Suspense>
  );
}
