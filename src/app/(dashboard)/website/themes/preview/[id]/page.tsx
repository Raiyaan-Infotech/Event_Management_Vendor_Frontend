"use client";

import React, { use } from "react";
import { ThemeFullPagePreview } from "@/components/website/ThemeFullPagePreview";

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

export default function ThemeFullPreviewPage({ params }: PreviewPageProps) {
  const { id } = use(params);
  
  const [colors, setColors] = React.useState<any>(undefined);
  const [layoutId, setLayoutId] = React.useState<number>(parseInt(id));

  React.useEffect(() => {
    const idNum = parseInt(id);
    
    // 1. Get global active state from Designer
    const activatedPresetId = localStorage.getItem("activatedPresetId");
    const activatedLayoutId = localStorage.getItem("activatedLayoutId");
    const activatedColorsStr = localStorage.getItem("activatedColors");
    
    // If we have an active layout and it matches the layout we are previewing, 
    // we should show the active designer colors.
    if (activatedLayoutId && parseInt(activatedLayoutId) === idNum && activatedColorsStr) {
        setColors(JSON.parse(activatedColorsStr));
        setLayoutId(idNum);
        return;
    }

    // 2. Check if it's a specific custom theme card being previewed
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

    // 3. Fallback to default presets for the base layouts
    if (idNum === 1) {
      setColors({ header: "#2563eb", footer: "#1e3a8a", primary: "#3b82f6", secondary: "#60a5fa", hover: "#1d4ed8", text: "#1e293b" });
    } else if (idNum === 2) {
      setColors({ header: "#7c3aed", footer: "#4c1d95", primary: "#8b5cf6", secondary: "#a78bfa", hover: "#6d28d9", text: "#1e1b4b" });
    }
  }, [id]);

  return (
    <ThemeFullPagePreview 
      title="Theme Preview"
      subtitle={`EXPLORING THEME LAYOUT #${id}`}
      themeId={layoutId}
      colors={colors}
      maxWidth="1100px"
    />
  );
}
