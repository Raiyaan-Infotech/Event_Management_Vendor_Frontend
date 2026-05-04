"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  Palette,
  Home,
  Layout,
  Type,
  MousePointer2,
  Brush,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Loader from "@/components/ui/loader";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import { useVendorMe } from "@/hooks/use-vendors";
import {
  useVendorColors,
  useVendorPalettes,
  useSelectVendorPalette,
  useSaveVendorColors,
  useResetVendorColors,
  VendorColors,
  ColorPalette,
} from "@/hooks/use-vendor-colors";

// ─── Color field config ───────────────────────────────────────────────────────
const COLOR_FIELDS: {
  key: keyof VendorColors;
  label: string;
  swatchLabel: string;
  icon: React.ElementType;
  bg: string;
  text: string;
}[] = [
  {
    key: "primary_color",
    label: "Primary Color",
    swatchLabel: "Primary",
    icon: Palette,
    bg: "bg-indigo-50",
    text: "text-indigo-600",
  },
  {
    key: "secondary_color",
    label: "Secondary Color",
    swatchLabel: "Secondary",
    icon: Brush,
    bg: "bg-purple-50",
    text: "text-purple-600",
  },
  {
    key: "header_color",
    label: "Header Color",
    swatchLabel: "Header",
    icon: Home,
    bg: "bg-red-50",
    text: "text-red-600",
  },
  {
    key: "footer_color",
    label: "Footer Color",
    swatchLabel: "Footer",
    icon: Layout,
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    key: "text_color",
    label: "Text Color",
    swatchLabel: "Text",
    icon: Type,
    bg: "bg-gray-100",
    text: "text-gray-600",
  },
  {
    key: "hover_color",
    label: "Hover Color",
    swatchLabel: "Hover",
    icon: MousePointer2,
    bg: "bg-green-50",
    text: "text-green-600",
  },
];

const FALLBACK_COLORS: VendorColors = {
  primary_color: "#3b82f6",
  secondary_color: "#1e40af",
  header_color: "#2563eb",
  footer_color: "#1e3a8a",
  text_color: "#1e293b",
  hover_color: "#1d4ed8",
};

type CardId = number | "custom"; // palette id OR 'custom'

export default function ThemesOptionPage() {
  const { data: vendor } = useVendorMe();
  const { data: colorsData, isLoading: colorsLoading } = useVendorColors();
  const { data: palettes, isLoading: palettesLoading } = useVendorPalettes();

  const selectPalette = useSelectVendorPalette();
  const saveColors = useSaveVendorColors();
  const resetColors = useResetVendorColors();

  // Which card is visually selected vs actually saved/activated
  const [selectedCard, setSelectedCard] = useState<CardId | null>(null);
  const [activeCard, setActiveCard] = useState<CardId | null>(null);

  // Editable custom color state (shown in pickers + right-side preview)
  const [formData, setFormData] = useState<VendorColors>(FALLBACK_COLORS);

  // On data load: restore saved state
  useEffect(() => {
    if (!colorsData) return;

    if (colorsData.has_custom) {
      setSelectedCard("custom");
      setActiveCard("custom");
      const base = {
        ...FALLBACK_COLORS,
        ...(colorsData.custom_colors ?? {}),
      } as VendorColors;
      setFormData(base);
    } else if (colorsData.palette_id) {
      setSelectedCard(colorsData.palette_id);
      setActiveCard(colorsData.palette_id);
      const base = {
        ...FALLBACK_COLORS,
        ...(colorsData.theme_defaults ?? {}),
      } as VendorColors;
      setFormData(base);
    }
  }, [colorsData]);

  const handleSelectCard = (id: CardId) => {
    setSelectedCard(id);
    if (id === "custom") {
      // Start custom form from current merged colors as base
      const base = {
        ...FALLBACK_COLORS,
        ...(colorsData?.merged ?? {}),
      } as VendorColors;
      setFormData(base);
    } else {
      // Show that palette's colors in the right preview
      const palette = palettes?.find((p: ColorPalette) => p.id === id);
      if (palette) {
        setFormData({ ...FALLBACK_COLORS, ...palette } as VendorColors);
      }
    }
  };

  const handleChange = (key: keyof VendorColors, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (selectedCard === "custom") {
      // Save custom 6 colors + activate them
      saveColors.mutate(formData, {
        onSuccess: () => setActiveCard("custom"),
      });
    } else if (typeof selectedCard === "number") {
      // Select an admin palette
      selectPalette.mutate(selectedCard, {
        onSuccess: () => setActiveCard(selectedCard),
      });
    }
  };

  const handleReset = () => {
    // Deactivate custom → go back to whichever palette was active
    if (activeCard === "custom") {
      resetColors.mutate(undefined, {
        onSuccess: () => {
          const fallbackCard = colorsData?.palette_id ?? null;
          setActiveCard(fallbackCard);
          setSelectedCard(fallbackCard);
          const base = {
            ...FALLBACK_COLORS,
            ...(colorsData?.theme_defaults ?? {}),
          } as VendorColors;
          setFormData(base);
        },
      });
    } else {
      setSelectedCard(activeCard);
      if (typeof activeCard === "number") {
        const palette = palettes?.find(
          (p: ColorPalette) => p.id === activeCard,
        );
        if (palette)
          setFormData({ ...FALLBACK_COLORS, ...palette } as VendorColors);
      }
    }
  };

  // Guard
  if (vendor && !(vendor as any).theme_id) {
    return (
      <div className="h-[calc(100vh-86px)] flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-gray-500 font-medium">No active theme set.</p>
          <p className="text-sm text-gray-400">
            Go to{" "}
            <Link href="/website/theme" className="text-primary underline">
              Themes
            </Link>{" "}
            and activate a theme first.
          </p>
        </div>
      </div>
    );
  }

  const isLoading = colorsLoading || palettesLoading;
  const isPending =
    selectPalette.isPending || saveColors.isPending || resetColors.isPending;

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar bg-gray-50/30 dark:bg-transparent">
      {(isLoading || isPending) && <Loader />}
      {/* ── Page Header ── */}
      <div className="max-w-[1700px] mx-auto mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1 font-poppins">
            Themes Option
          </h1>
          {activeCard === "custom" && (
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider rounded-full">
              Custom Active
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium font-poppins">
          Choose a color palette or create your own custom colors.
        </p>
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Left: Card Grid ── */}
        <div className="lg:col-span-9">
          <section className="bg-white dark:bg-sidebar p-6 md:p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
            <div className="mb-6 space-y-1">
              <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight font-poppins">
                Select Color Mode
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Pick a palette or use custom overrides
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-40 rounded-3xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
                {/* ── Palette Cards (one per admin palette) ── */}
                {(palettes ?? []).map((palette: ColorPalette) => {
                  const isSelected = selectedCard === palette.id;
                  const isActive = activeCard === palette.id;

                  return (
                    <Card
                      key={palette.id}
                      onClick={() => handleSelectCard(palette.id)}
                      className={`relative cursor-pointer transition-all duration-500 rounded-3xl overflow-hidden border-2 group flex flex-col h-full ${
                        isActive
                          ? "border-green-500 bg-white shadow-xl shadow-green-500/10 scale-[1.02]"
                          : isSelected
                            ? "border-primary bg-white shadow-xl shadow-primary/5 scale-[1.02]"
                            : "border-transparent bg-white hover:border-gray-200 hover:shadow-lg dark:bg-sidebar dark:border-white/5"
                      }`}
                    >
                      <CardContent className="p-5 flex flex-col h-full">
                        {/* Card top row */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-1">
                            <span
                              className={`text-[11px] font-black uppercase tracking-[0.05em] transition-colors ${
                                isActive ? "text-green-600" : "text-gray-500"
                              }`}
                            >
                              {palette.name}
                            </span>
                            <p className="text-[10px] text-gray-400 font-medium">
                              Admin palette
                            </p>
                          </div>
                          {/* <div className="bg-gray-400 px-4 h-[26px] flex items-center rounded-full">
                            <span className="text-[10px] font-black text-white uppercase tracking-wider">
                              Palette
                            </span>
                          </div> */}
                        </div>

                        {/* Color swatches */}
                        <div className="mt-auto">
                          <div className="grid grid-cols-6 gap-1 pt-2">
                            {COLOR_FIELDS.map(({ key, swatchLabel }) => (
                              <div
                                key={key}
                                className="flex flex-col items-center gap-2"
                              >
                                <div
                                  className="w-full h-2 rounded-full ring-1 ring-black/5 shadow-sm"
                                  style={{
                                    backgroundColor:
                                      (palette as any)[key] || "#e5e7eb",
                                  }}
                                />
                                <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest whitespace-nowrap">
                                  {swatchLabel}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>

                      {/* Selected / Activated badge */}
                      {(isSelected || isActive) && (
                        <div
                          className={`absolute top-4 right-4 text-white rounded-full shadow-md z-20 flex items-center h-[26px] pr-3.5 pl-2 gap-1.5 transition-all duration-300 ${
                            isActive ? "bg-green-500" : "bg-primary"
                          }`}
                        >
                          <Check size={11} strokeWidth={4} />
                          <span className="text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                            {isActive ? "Activated" : "Selected"}
                          </span>
                        </div>
                      )}
                    </Card>
                  );
                })}

                {/* ── Custom Colors Card ── */}
                {(() => {
                  const isSelected = selectedCard === "custom";
                  const isActive = activeCard === "custom";
                  const hasCustom = colorsData?.has_custom ?? false;

                  return (
                    <Card
                      onClick={() => handleSelectCard("custom")}
                      className={`relative cursor-pointer transition-all duration-500 rounded-3xl overflow-hidden border-2 group flex flex-col h-full ${
                        isActive
                          ? "border-green-500 bg-white shadow-xl shadow-green-500/10 scale-[1.02]"
                          : isSelected
                            ? "border-primary bg-white shadow-xl shadow-primary/5 scale-[1.02]"
                            : hasCustom
                              ? "border-transparent bg-white hover:border-gray-200 hover:shadow-lg dark:bg-sidebar"
                              : "border-dashed border-gray-200 bg-white hover:border-gray-400/50 hover:shadow-lg dark:bg-sidebar dark:border-white/5"
                      }`}
                    >
                      <CardContent className="p-5 flex flex-col h-full">
                        {/* Card top row */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-1">
                            <span
                              className={`text-[11px] font-black uppercase tracking-[0.05em] transition-colors ${
                                isActive ? "text-green-600" : "text-gray-500"
                              }`}
                            >
                              Custom Colors
                            </span>
                            <p className="text-[10px] text-gray-400 font-medium">
                              Your per-theme overrides
                            </p>
                          </div>
                          {hasCustom ? (
                            <div className="bg-primary px-4 h-[26px] flex items-center rounded-full">
                              <span className="text-[10px] font-black text-white uppercase tracking-wider">
                                Custom
                              </span>
                            </div>
                          ) : (
                            <div className="border border-dashed border-gray-300 px-4 h-[26px] flex items-center rounded-full">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                                No overrides
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Color swatches */}
                        <div className="mt-auto">
                          <div className="grid grid-cols-6 gap-1 pt-2">
                            {COLOR_FIELDS.map(({ key, swatchLabel }) => {
                              const color = hasCustom
                                ? (colorsData?.custom_colors as any)?.[key]
                                : null;
                              return (
                                <div
                                  key={key}
                                  className="flex flex-col items-center gap-2"
                                >
                                  <div
                                    className={`w-full h-2 rounded-full ring-1 ring-black/5 shadow-sm ${!color ? "border border-dashed border-gray-200 bg-gray-50" : ""}`}
                                    style={
                                      color ? { backgroundColor: color } : {}
                                    }
                                  />
                                  <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest whitespace-nowrap">
                                    {swatchLabel}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </CardContent>

                      {/* Selected / Activated badge */}
                      {(isSelected || isActive) && (
                        <div
                          className={`absolute top-4 right-4 text-white rounded-full shadow-md z-20 flex items-center h-[26px] pr-3.5 pl-2 gap-1.5 transition-all duration-300 ${
                            isActive ? "bg-green-500" : "bg-primary"
                          }`}
                        >
                          <Check size={11} strokeWidth={4} />
                          <span className="text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                            {isActive ? "Activated" : "Selected"}
                          </span>
                        </div>
                      )}
                    </Card>
                  );
                })()}
              </div>
            )}
          </section>
        </div>

        {/* ── Right: Actions + Preview + Pickers ── */}
        <div className="lg:col-span-3 space-y-6">
          {/* Actions */}
          <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <PersistenceActions
              onSave={handleSave}
              onPreview={() => window.open(`/preview?primary=${encodeURIComponent(formData.primary_color || "")}&secondary=${encodeURIComponent(formData.secondary_color || "")}&header=${encodeURIComponent(formData.header_color || "")}&footer=${encodeURIComponent(formData.footer_color || "")}&text=${encodeURIComponent(formData.text_color || "")}&hover=${encodeURIComponent(formData.hover_color || "")}`, "_blank")}
              onReset={handleReset}
              isSubmitting={isPending}
              saveLabel="SAVE"
            />
          </div>

          {/* Color preview swatches */}
          <div className="bg-white dark:bg-sidebar/50 p-5 rounded-2xl border border-gray-100 dark:border-white/5">
            {/* <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Preview</p>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_FIELDS.map(({ key, swatchLabel }) => (
                <div key={key} className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-full h-8 rounded-lg shadow-sm"
                    style={{ backgroundColor: formData[key] || "#e5e7eb" }}
                  />
                  <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest">
                    {swatchLabel}
                  </span>
                </div>
              ))}
            </div> */}

            <div className=" pt-5 border-t border-gray-100 dark:border-white/5">
              <a
                href={`/preview?primary=${encodeURIComponent(formData.primary_color || "")}&secondary=${encodeURIComponent(formData.secondary_color || "")}&header=${encodeURIComponent(formData.header_color || "")}&footer=${encodeURIComponent(formData.footer_color || "")}&text=${encodeURIComponent(formData.text_color || "")}&hover=${encodeURIComponent(formData.hover_color || "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full bg-[#0a0a0a] hover:bg-black text-white h-12 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg transition-all active:scale-95"
              >
                Open Live Preview ↗
              </a>
            </div>
          </div>

          {/* Color pickers — only when Custom card selected */}
          {selectedCard === "custom" && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="bg-white dark:bg-sidebar rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
                <div className="mb-6 space-y-1">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight font-poppins leading-tight">
                    Manual Config
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Personalize color theme
                  </p>
                </div>

                <div className="space-y-6">
                  {COLOR_FIELDS.map(({ key, label, icon: Icon, bg, text }) => (
                    <div key={key} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${bg} ${text}`}>
                          <Icon size={14} />
                        </div>
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                          {label}
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={formData[key] || "#000000"}
                          onChange={(e) => handleChange(key, e.target.value)}
                          className="w-10 h-10 p-1 rounded-lg border-2 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={formData[key] || ""}
                          onChange={(e) => handleChange(key, e.target.value)}
                          className="font-mono text-xs uppercase font-bold h-10 flex-1"
                          placeholder="#000000"
                        />
                      </div>
                      <div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: formData[key] || "#e5e7eb" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
