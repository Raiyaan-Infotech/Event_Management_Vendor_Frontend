"use client";

import React, { use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ThemePreview } from "@/components/website/ThemePreview";

interface PublicPreviewContentProps {
    id: string;
}

function PublicPreviewContent({ id }: PublicPreviewContentProps) {
  const searchParams = useSearchParams();
  const idNum = parseInt(id);
  
  const [colors, setColors] = React.useState<any>(undefined);
  const [layoutId, setLayoutId] = React.useState<number>(idNum);

  React.useEffect(() => {
    // 1. Check for colors in URL (Designer mode)
    const header = searchParams.get("header");
    if (header) {
      setColors({
        header: searchParams.get("header") || "#2563eb",
        footer: searchParams.get("footer") || "#1e3a8a",
        primary: searchParams.get("primary") || "#3b82f6",
        secondary: searchParams.get("secondary") || "#60a5fa",
        hover: searchParams.get("hover") || "#1d4ed8",
        text: searchParams.get("text") || "#1e293b",
      });
      return;
    }

    // 2. Check for logical active state from storage (Inherit active mood)
    const activatedColorsStr = localStorage.getItem("activatedColors");
    if (activatedColorsStr) {
        setColors(JSON.parse(activatedColorsStr));
        setLayoutId(idNum);
        return;
    }

    // 3. Check for specific custom theme card
    const savedCustom = localStorage.getItem("customThemes");
    if (savedCustom) {
      const parsedCustom = JSON.parse(savedCustom);
      const customTheme = parsedCustom.find((t: any) => t.id === idNum);
      if (customTheme) {
        setColors(customTheme.colors);
        setLayoutId(customTheme.layoutId || 1);
        return;
      }
    }

    // 4. Default presets fallback
    if (idNum === 1) {
      setColors({ header: "#2563eb", footer: "#1e3a8a", primary: "#3b82f6", secondary: "#60a5fa", hover: "#1d4ed8", text: "#1e293b" });
    } else if (idNum === 2) {
      setColors({ header: "#7c3aed", footer: "#4c1d95", primary: "#8b5cf6", secondary: "#a78bfa", hover: "#6d28d9", text: "#1e1b4b" });
    }
  }, [id, searchParams]);

  if (!colors) return <div className="h-screen w-full flex items-center justify-center font-black uppercase tracking-widest animate-pulse">Initializing Theme...</div>;

  return (
    <div className="min-h-screen w-full bg-white transition-colors duration-500 overflow-x-hidden">
      <ThemePreview themeId={layoutId} colors={colors} isFullPage={true} />
    </div>
  );
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function PublicPreviewPage({ params }: PageProps) {
  const resolvedParams = use(params);
  
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center font-black uppercase tracking-widest">Loading...</div>}>
      <PublicPreviewContent id={resolvedParams.id} />
    </Suspense>
  );
}
