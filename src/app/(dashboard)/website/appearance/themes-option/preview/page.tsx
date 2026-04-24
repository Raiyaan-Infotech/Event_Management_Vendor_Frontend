"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ThemeFullPagePreview } from "@/components/website/ThemeFullPagePreview";

function PreviewContent() {
  const searchParams = useSearchParams();

  const [activeThemeId, setActiveThemeId] = React.useState(1);

  React.useEffect(() => {
    const savedId = localStorage.getItem("activeThemeId");
    if (savedId) {
      setActiveThemeId(parseInt(savedId));
    }
  }, []);

  const activeColors = {
    header: searchParams.get("header") || searchParams.get("home") || "#2563eb",
    footer: searchParams.get("footer") || "#1e3a8a",
    primary: searchParams.get("primary") || "#3b82f6",
    secondary: searchParams.get("secondary") || "#60a5fa",
    hover: searchParams.get("hover") || "#1d4ed8",
    text: searchParams.get("text") || "#1e293b",
  };

  return (
    <ThemeFullPagePreview 
      title="Live Designer"
      subtitle="CRAFTING YOUR CUSTOM THEME PALETTE"
      themeId={activeThemeId}
      colors={activeColors}
    />
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-bold uppercase tracking-widest animate-pulse">Loading Preview...</div>}>
      <PreviewContent />
    </Suspense>
  );
}
