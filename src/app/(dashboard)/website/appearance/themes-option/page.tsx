"use client";

import React, { useState } from "react";
import { Palette, Check, Save, RotateCcw, Home, Layout, Type, MousePointer2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import { useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PRESET_THEMES = [
  {
    id: 1,
    name: "Classic Corporate",
    colors: {
      header: "#2563eb", // Blue 600
      footer: "#1e3a8a", // Blue 900
      primary: "#3b82f6", // Blue 500
      secondary: "#60a5fa", // Blue 400
      hover: "#1d4ed8", // Blue 700
      text: "#1e293b", // Slate 800
    }
  },
  {
    id: 2,
    name: "Modern Portfolio",
    colors: {
      header: "#7c3aed", // Violet 600
      footer: "#4c1d95", // Violet 900
      primary: "#8b5cf6", // Violet 500
      secondary: "#a78bfa", // Violet 400
      hover: "#6d28d9", // Violet 700
      text: "#1e1b4b", // Indigo 950
    }
  },
  {
    id: 3,
    name: "Forest Harmony",
    colors: {
      header: "#166534", // Green 800
      footer: "#064e3b", // Emerald 900
      primary: "#22c55e", // Green 500
      secondary: "#4ade80", // Green 400
      hover: "#15803d", // Green 700
      text: "#022c22", // Emerald 950
    }
  },
  {
    id: 4,
    name: "Midnight Gold",
    colors: {
      header: "#1e1e1e", // Dark
      footer: "#0a0a0a", // Black
      primary: "#fbbf24", // Amber 400
      secondary: "#f59e0b", // Amber 500
      hover: "#d97706", // Amber 600
      text: "#ffffff", // White
    }
  },
  {
    id: 5,
    name: "Rose Quartz",
    colors: {
      header: "#e11d48", // Rose 600
      footer: "#881337", // Rose 900
      primary: "#f43f5e", // Rose 500
      secondary: "#fb7185", // Rose 400
      hover: "#be123c", // Rose 700
      text: "#4c0519", // Rose 950
    }
  },
  {
    id: 6,
    name: "Sunshine Glow",
    colors: {
      header: "#f59e0b", // Amber 500
      footer: "#78350f", // Amber 900
      primary: "#fbbf24", // Amber 400
      secondary: "#fef3c7", // Amber 100
      hover: "#d97706", // Amber 600
      text: "#451a03", // Amber 950
    }
  },
  {
    id: 7,
    name: "Deep Sea",
    colors: {
      header: "#0891b2", // Cyan 600
      footer: "#164e63", // Cyan 900
      primary: "#06b6d4", // Cyan 500
      secondary: "#67e8f9", // Cyan 300
      hover: "#0e7490", // Cyan 700
      text: "#083344", // Cyan 950
    }
  },
  {
    id: 8,
    name: "Minimalist Slate",
    colors: {
      header: "#334155", // Slate 700
      footer: "#0f172a", // Slate 900
      primary: "#64748b", // Slate 500
      secondary: "#94a3b8", // Slate 400
      hover: "#1e293b", // Slate 800
      text: "#020617", // Slate 950
    }
  }
];

export default function ThemesOptionPage() {
  const router = useRouter();
  const [themesList, setThemesList] = useState(PRESET_THEMES);
  const [selectedPresetId, setSelectedPresetId] = useState<number | string>(1);
  const [activeId, setActiveId] = useState<number | string>(1);
  const [activeColors, setActiveColors] = useState(PRESET_THEMES[0].colors);
  const [isCustom, setIsCustom] = useState(false);
  const [customThemeName, setCustomThemeName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Load active theme or draft from storage on mount
  React.useEffect(() => {
    // 1. First, load custom themes to have the full pool available for lookup
    const savedCustomThemes = localStorage.getItem("customThemes");
    const parsedCustom = savedCustomThemes ? JSON.parse(savedCustomThemes) : [];
    if (parsedCustom.length > 0) {
      setThemesList([...PRESET_THEMES, ...parsedCustom]);
    }
    
    const combinedThemesPool = [...PRESET_THEMES, ...parsedCustom];

    // 2. Check if we have a draft (returning from preview)
    const draftId = sessionStorage.getItem("draftThemeId");
    const draftColors = sessionStorage.getItem("draftColors");
    
    // 3. Load the actual activated state
    const savedActivePresetId = localStorage.getItem("activatedPresetId");
    if (savedActivePresetId) {
       const isCustomTrigger = savedActivePresetId === 'custom-trigger';
       setActiveId(isCustomTrigger ? 'custom-trigger' : parseInt(savedActivePresetId));
    }

    if (draftId && draftColors) {
      const parsedDraftId = draftId === 'custom-trigger' ? 'custom-trigger' : parseInt(draftId);
      setSelectedPresetId(parsedDraftId);
      setActiveColors(JSON.parse(draftColors));
      
      const draftName = sessionStorage.getItem("draftThemeName");
      if (draftName) setCustomThemeName(draftName);
    } else if (savedActivePresetId) {
      const idStr = savedActivePresetId;
      const idNum = idStr === 'custom-trigger' ? NaN : parseInt(idStr);
      const targetId = idStr === 'custom-trigger' ? 'custom-trigger' : idNum;
      
      setSelectedPresetId(targetId);
      
      // Look in the full pool we just loaded
      const preset = idStr === 'custom-trigger' ? null : combinedThemesPool.find(p => p.id === idNum);
      if (preset) {
        setActiveColors(preset.colors);
      }
    }
  }, []);

  const handlePresetSelect = (preset: typeof PRESET_THEMES[0]) => {
    setSelectedPresetId(preset.id);
    setActiveColors(preset.colors);
    setIsCustom(false);
    toast.success(`${preset.name} theme colors loaded!`);
  };

  const handleColorChange = (key: keyof typeof activeColors, value: string) => {
    if (selectedPresetId !== 'custom-trigger') return;
    setActiveColors(prev => ({ ...prev, [key]: value }));
    setIsCustom(true);
  };

  const handleSave = () => {
    if (selectedPresetId === 'custom-trigger') {
      if (!customThemeName.trim()) {
        toast.error("Please enter a name for your custom theme");
        return;
      }

      const newId = themesList.length + 1;
      const savedLayoutId = localStorage.getItem("activatedLayoutId") || "1";
      
      const newTheme = {
        id: newId,
        name: customThemeName.trim(),
        colors: { ...activeColors },
        layoutId: parseInt(savedLayoutId)
      };

      // Update state
      setThemesList(prev => [...prev, newTheme]);
      
      // Persist to localStorage (only the custom ones)
      const existingCustom = localStorage.getItem("customThemes");
      const customArray = existingCustom ? JSON.parse(existingCustom) : [];
      localStorage.setItem("customThemes", JSON.stringify([...customArray, newTheme]));

      setActiveId(newId);
      setSelectedPresetId(newId);
      localStorage.setItem("activatedPresetId", newId.toString());
      localStorage.setItem("activatedColors", JSON.stringify(activeColors));
      setCustomThemeName("");
      setIsCustom(false);
      
      // Navigate to the page where the new theme is located
      const newPage = Math.ceil((themesList.length + 2) / itemsPerPage); // +2 because of index shift and new item
      setCurrentPage(newPage);
      
      toast.success(`Theme "${newTheme.name}" created and saved!`);
    } else {
      setActiveId(selectedPresetId);
      localStorage.setItem("activatedPresetId", selectedPresetId.toString());
      localStorage.setItem("activatedColors", JSON.stringify(activeColors));
      toast.success("Theme configuration saved successfully!");
    }
  };

  const handleReset = () => {
    handlePresetSelect(PRESET_THEMES[0]);
    setActiveId(1);
    setCustomThemeName("");
    setCurrentPage(1);
  };

  const totalItems = themesList.length + 1; // +1 for the Custom Theme card
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Combine themesList with a placeholder for the custom theme card at the 2nd position
  const allDisplayItems = [
    themesList[0],
    { id: 'custom-trigger', type: 'custom' },
    ...themesList.slice(1)
  ];
  
  const currentDisplayItems = allDisplayItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar bg-gray-50/30 dark:bg-transparent relative">
      {/* Page Header */}
      <div className="max-w-[1700px] mx-auto mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1 font-poppins">Themes Option</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium font-poppins">Transform your website's appearance with powerful theme customization.</p>
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Color Preset Selection & Preview */}
        <div className="lg:col-span-9 space-y-8">
          <section className="bg-white dark:bg-sidebar p-6 md:p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-none">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight font-poppins">Select Preset Theme</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Professional Palettes</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {currentDisplayItems.map((item: any) => {
                if (item.type === 'custom') {
                  return (
                    <Card 
                      key="custom-trigger"
                      onClick={() => {
                        setSelectedPresetId('custom-trigger');
                        setIsCustom(true);
                        toast.success("Custom Theme activated! Use the Manual Config to adjust.");
                      }}
                      className={`relative cursor-pointer transition-all duration-500 rounded-3xl overflow-hidden border-2 group flex flex-col h-full ${
                        activeId === 'custom-trigger'
                          ? "border-dashed border-green-500 bg-green-50/30 shadow-2xl scale-[1.02]"
                          : selectedPresetId === 'custom-trigger' 
                          ? "border-dashed border-gray-400 bg-gray-50/50 shadow-2xl scale-[1.02]" 
                          : "border-dashed border-gray-200 bg-white hover:border-gray-400/50 hover:shadow-lg"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <CardContent className="p-5 relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[11px] font-black uppercase tracking-[0.05em] transition-colors duration-300 ${
                              activeId === 'custom-trigger' ? "text-green-600" : "text-gray-500"
                            }`}>CREATE CUSTOM THEME</span>
                          </div>

                          <div className="flex items-center gap-2">
                             <div className={`${activeId === 'custom-trigger' ? "bg-green-500" : "bg-gray-400"} px-4 mr-1 h-[26px] flex items-center rounded-full shadow-sm transition-colors duration-300`}>
                                <span className="text-[10px] font-black text-white font-poppins uppercase tracking-wider whitespace-nowrap">Custom</span>
                             </div>
                          </div>
                        </div>

                        <div className="mt-auto">
                          <div className="grid grid-cols-6 gap-1 pt-2">
                              {['#FF3B30', '#4285F4', '#34A853', '#FBBC05', '#AF52DE', '#FF9500'].map((color, idx) => (
                              <div key={idx} className="flex flex-col items-center gap-2">
                                  <div 
                                  className="w-full h-2 rounded-full ring-1 ring-black/5 shadow-sm" 
                                  style={{ backgroundColor: color }} 
                                  />
                                  <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest whitespace-nowrap">
                                  {idx === 0 ? 'Header' : idx === 1 ? 'Footer' : idx === 2 ? 'Primary' : idx === 3 ? 'Sec' : idx === 4 ? 'Hov' : 'Text'}
                                  </span>
                              </div>
                              ))}
                          </div>
                        </div>
                      </CardContent>
                      {(selectedPresetId === 'custom-trigger' || activeId === 'custom-trigger') && (
                        <div className={`absolute top-4 right-4 text-white rounded-full shadow-md z-20 flex items-center transition-all duration-300 h-[26px] ${
                          activeId === 'custom-trigger' 
                            ? "bg-green-500 pr-3.5 pl-2 gap-1.5" 
                            : "bg-primary pr-3.5 pl-2 gap-1.5"
                        }`}>
                          <Check size={11} strokeWidth={4} />
                          <span className="text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                             {activeId === 'custom-trigger' ? "Activated" : "Selected"}
                          </span>
                        </div>
                      )}
                    </Card>
                  );
                }

                const theme = item;
                const isSelected = selectedPresetId === theme.id;
                const isActive = activeId === theme.id;
                const isSystemDefault = theme.id === 1;
                
                return (
                  <Card 
                    key={theme.id}
                    onClick={() => handlePresetSelect(theme)}
                    className={`relative cursor-pointer transition-all duration-500 rounded-3xl overflow-hidden border-2 group flex flex-col h-full ${
                      isActive
                        ? "border-green-500 bg-white shadow-xl shadow-green-500/10 scale-[1.02]"
                        : isSelected 
                        ? isSystemDefault
                          ? "border-gray-400 bg-white shadow-xl shadow-gray-200"
                          : "border-primary bg-white shadow-xl shadow-primary/5 scale-[1.02]" 
                        : "border-transparent bg-white hover:border-gray-200 hover:shadow-lg"
                    }`}
                  >
                    <CardContent className="p-5 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <div className="space-y-3 flex-1">
                          {theme.id === 1 ? (
                            <div className="flex items-center gap-2 mb-1">
                               <span className={`text-[11px] font-black uppercase tracking-[0.05em] transition-colors ${
                                isActive ? "text-green-600" : "text-gray-500"
                               }`}>Default Theme</span>
                            </div>
                          ) : (
                            <div className="h-[18px] mb-1" />
                          )}
                          <div className="flex items-center gap-2">
                            <div className={`size-3 rounded-full`} style={{ backgroundColor: theme.colors.header }} />
                            <span className={`font-black text-sm transition-colors ${
                              isActive ? "text-green-700" : isSelected && isSystemDefault ? "text-gray-900" : "text-gray-900 group-hover:text-primary"
                            }`}>{theme.name}</span>
                          </div>
                        </div>

                        {theme.id === 1 && (
                          <div className={`${isActive ? "bg-green-500" : "bg-gray-400"} px-4 h-[26px] flex items-center rounded-full shadow-sm transition-colors duration-300`}>
                            <span className="text-[10px] font-black text-white font-poppins uppercase tracking-wider whitespace-nowrap">Default</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto">
                        <div className="flex gap-1 pt-2">
                          {Object.entries(theme.colors).map(([key, color]) => (
                            <div key={key} className="flex flex-col items-center flex-1 gap-1.5">
                              <div 
                                className="w-full h-2 rounded-full ring-1 ring-white shadow-sm" 
                                style={{ backgroundColor: color as string }} 
                              />
                              <span className="text-[7px] font-black uppercase text-gray-400 tracking-tighter whitespace-nowrap">
                                {key === 'header' ? 'Header' : key === 'footer' ? 'Footer' : key}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    {(isSelected || isActive) && (
                      <div className={`absolute top-4 right-4 text-white rounded-full shadow-md z-20 flex items-center transition-all duration-300 h-[26px] ${
                        isActive 
                          ? "bg-green-500 pr-3.5 pl-2 gap-1.5" 
                          : "bg-primary pr-3.5 pl-2 gap-1.5"
                      }`}>
                        <Check size={11} strokeWidth={4} />
                        <span className="text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                          {isActive ? "Activated" : "Selected"}
                        </span>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col items-center gap-6 mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl h-10 px-4 font-bold text-xs uppercase tracking-widest gap-2 bg-white dark:bg-sidebar shadow-sm"
                >
                  <ChevronLeft size={14} />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages || 1 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`size-10 rounded-xl font-black text-sm transition-all duration-300 ${
                        currentPage === i + 1
                          ? "bg-primary text-white shadow-lg shadow-primary/25 scale-110"
                          : "bg-white dark:bg-sidebar text-gray-400 hover:text-gray-900 dark:hover:text-white border border-transparent hover:border-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="rounded-xl h-10 px-4 font-bold text-xs uppercase tracking-widest gap-2 bg-white dark:bg-sidebar shadow-sm"
                >
                  Next
                  <ChevronRight size={14} />
                </Button>
              </div>
              
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Page {currentPage} of {totalPages || 1} — Showing {currentDisplayItems.length} themes
              </p>
            </div>
          </section>

          {/* Color Preview Dashboard Modal */}
          {/* Preview is now handled in a separate page */}
        </div>

        {/* Right Column: Actions & Custom Controls */}
        <div className="lg:col-span-3 space-y-6">
          {/* Actions Card */}
          <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <PersistenceActions 
              onSave={handleSave}
              onReset={handleReset}
              onPreview={() => {
                const params = new URLSearchParams(activeColors as any).toString();
                // Save current selection state to session before navigating
                sessionStorage.setItem("draftThemeId", selectedPresetId.toString());
                sessionStorage.setItem("draftColors", JSON.stringify(activeColors));
                if (customThemeName) sessionStorage.setItem("draftThemeName", customThemeName);
                
                const previewId = selectedPresetId === 'custom-trigger' ? 1 : selectedPresetId;
                window.open(`/public-preview/${previewId}?${params}`, '_blank');
              }}
              onCancel={() => router.push("/website/themes")}
              saveLabel="SAVE"
            />
          </div>

          {selectedPresetId === 'custom-trigger' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="bg-white dark:bg-sidebar rounded-2xl p-6 border-none shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] relative overflow-hidden">
                <div className="absolute -top-4 -right-4 p-8 opacity-40 group-hover:opacity-60 transition-all duration-500 scale-110">
                   <svg width="100" height="100" viewBox="0 0 24 24" fill="none" className="drop-shadow-sm">
                      <circle cx="7.2" cy="11.2" r="1.8" fill="#FF3B30" />
                      <circle cx="10.8" cy="8.2" r="1.8" fill="#4285F4" />
                      <circle cx="15.2" cy="8.2" r="1.8" fill="#34A853" />
                      <circle cx="18.8" cy="11.2" r="1.8" fill="#FBBC05" />
                   </svg>
                </div>
                
                <div className="relative z-10 space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight font-poppins leading-tight">Manual Config</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Personalize Color Theme</p>
                  </div>

                  <div className="space-y-6">
                     {/* Theme Name Field */}
                     <div className="space-y-3 pb-4 border-b border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600"><Type size={14} /></div>
                           <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Theme Name</Label>
                        </div>
                        <Input 
                          type="text" 
                          placeholder="My Custom Theme"
                          value={customThemeName} 
                          onChange={(e) => setCustomThemeName(e.target.value)}
                          className="font-poppins text-sm font-bold h-11 bg-gray-50/50"
                        />
                     </div>

                     <div className="space-y-3">
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-red-50 text-red-600"><Home size={14} /></div>
                           <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Header Color</Label>
                        </div>
                        <div className="flex gap-2">
                           <Input 
                            type="color" 
                            value={activeColors.header} 
                            onChange={(e) => handleColorChange('header', e.target.value)}
                            className="w-10 h-10 p-1 rounded-lg border-2"
                           />
                           <Input 
                            type="text" 
                            value={activeColors.header} 
                            onChange={(e) => handleColorChange('header', e.target.value)}
                            className="font-mono text-xs uppercase font-bold h-10"
                           />
                        </div>
                     </div>

                     <div className="space-y-3">
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><Layout size={14} /></div>
                           <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Footer Color</Label>
                        </div>
                        <div className="flex gap-2">
                           <Input 
                            type="color" 
                            value={activeColors.footer} 
                            onChange={(e) => handleColorChange('footer', e.target.value)}
                            className="w-10 h-10 p-1 rounded-lg border-2"
                           />
                           <Input 
                            type="text" 
                            value={activeColors.footer} 
                            onChange={(e) => handleColorChange('footer', e.target.value)}
                            className="font-mono text-xs uppercase font-bold h-10"
                           />
                        </div>
                     </div>

                     <div className="space-y-3">
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-purple-50 text-purple-600"><Type size={14} /></div>
                           <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Global Colors</Label>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                           {[
                             { id: 'primary', label: 'Primary' },
                             { id: 'secondary', label: 'Secondary' },
                             { id: 'hover', label: 'Hover' },
                             { id: 'text', label: 'Text/Base' }
                           ].map((item) => (
                             <div key={item.id} className="space-y-2">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                                <div className="flex gap-2">
                                   <Input 
                                    type="color" 
                                    value={activeColors[item.id as keyof typeof activeColors]} 
                                    onChange={(e) => handleColorChange(item.id as keyof typeof activeColors, e.target.value)}
                                    className="w-10 h-10 p-1 rounded-lg border-2"
                                   />
                                   <Input 
                                    type="text" 
                                    value={activeColors[item.id as keyof typeof activeColors]} 
                                    onChange={(e) => handleColorChange(item.id as keyof typeof activeColors, e.target.value)}
                                    className="font-mono text-xs uppercase font-bold h-10"
                                   />
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
