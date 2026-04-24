'use client';

import { useState, useEffect } from "react";
import { useVendorSubscription } from '@/hooks/use-vendor-subscription';
import { useVendorTheme, useSaveVendorTheme } from '@/hooks/use-vendor-theme';
import { useVendorMe } from '@/hooks/use-vendors';
import { Check, Palette, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Internal ThemePreview substitute since the component is missing in the project
const InternalThemePreview = ({ theme }: { theme: any }) => {
    const blocks = Array.isArray(theme.home_blocks) ? theme.home_blocks : (typeof theme.home_blocks === 'string' ? JSON.parse(theme.home_blocks) : []);
    
    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 bg-white dark:bg-[#121212] shadow-inner flex flex-col p-3">
             {/* Mini Browser Header */}
             <div className="flex items-center gap-1.5 mb-3 border-b pb-2 dark:border-gray-800">
                <div className="h-2 w-2 rounded-full bg-red-400"></div>
                <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
            </div>
            
            {/* Preview Placeholder Layout using actual color tokens */}
            <div className="space-y-3 opacity-80 flex-1">
                {/* Header Bar */}
                <div className="h-4 w-full rounded-md" style={{ backgroundColor: theme.header_color || '#e5e7eb' }} />
                {/* Hero block simulation */}
                <div className="h-16 w-full rounded-lg" style={{ backgroundColor: theme.primary_color || '#d1d5db' }} />
                
                <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 col-span-2 rounded-lg" style={{ backgroundColor: theme.secondary_color || '#d1d5db' }} />
                    <div className="h-12 col-span-1 border rounded-lg dark:border-gray-700" />
                </div>

                <div className="text-[10px] text-muted-foreground mt-2 border-t pt-2 dark:border-gray-800 flex items-center justify-between">
                    <span className="flex items-center gap-1"><LayoutTemplate className="w-3 h-3"/> {blocks.length} Blocks</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.primary_color }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.secondary_color }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export function VendorThemeContent() {
    const { data: subData, isLoading: subLoading } = useVendorSubscription();
    const { data: vendor } = useVendorMe();
    const saveTheme = useSaveVendorTheme();

    const activePlan = subData?.plans && subData.plans.length > 0 ? subData.plans[0] : null;
    const planId = activePlan?.id;

    const { data: themesRaw, isLoading: themeLoading } = useVendorTheme(planId);
    const themes = themesRaw ?? [];

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [activatedPresetId, setActivatedPresetId] = useState<number | null>(null);

    // Pre-select the vendor's saved theme_id once data loads
    useEffect(() => {
        if (!vendor) return;
        const saved = (vendor as any).theme_id ?? null;
        if (saved) {
            setActivatedPresetId(saved);
            setSelectedId(saved);
        } else if (themes.length > 0 && !selectedId) {
            setSelectedId(themes[0].id);
        }
    }, [vendor, themes]);

    const handleActivate = (id: number) => {
        setActivatedPresetId(id);
        setSelectedId(id);
        saveTheme.mutate(id);
    };

    if (subLoading || themeLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-[450px] w-full rounded-[2rem]" />)}
            </div>
        );
    }

    if (!activePlan) {
        return (
            <div className="p-12 text-center border rounded-[2rem] bg-muted/20">
                <p className="text-muted-foreground">You do not have an active subscription plan.</p>
            </div>
        );
    }

    if (themes.length === 0) {
        return (
            <div className="p-12 text-center border rounded-[2rem] bg-muted/20 flex flex-col items-center gap-3">
                <Palette className="h-12 w-12 text-muted-foreground/30" />
                <div>
                    <h3 className="font-bold text-lg dark:text-gray-100">No Themes Available</h3>
                    <p className="text-sm text-muted-foreground">Your plan ({activePlan.name}) has no themes assigned yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {themes.map((theme) => {
                        const isActivated = activatedPresetId === theme.id;
                        const isSelected = selectedId === theme.id;
                        
                        return (
                            <div 
                                key={theme.id}
                                onClick={() => setSelectedId(theme.id)}
                                className={`group relative bg-white dark:bg-sidebar rounded-[2rem] overflow-hidden transition-all duration-500 border-2 cursor-pointer ${
                                    isActivated
                                        ? "border-green-500 shadow-[0_20px_50px_-12px_rgba(34,197,94,0.15)]"
                                        : isSelected 
                                        ? "border-blue-600 shadow-[0_20px_50px_-12px_rgba(59,130,246,0.15)] scale-[1.02]" 
                                        : "border-transparent shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:scale-[1.01]"
                                } dark:border-gray-800`}
                            >
                                {/* Theme Preview Webpage Area */}
                                <div className="relative aspect-[4/3] w-full p-6 bg-gray-50 dark:bg-[#0f0f0f]">
                                    {isActivated && (
                                        <div className="absolute top-4 right-10 bg-green-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-lg flex items-center gap-1.5 z-30">
                                            <Check size={10} strokeWidth={4} />
                                            Active Now
                                        </div>
                                    )}
                                    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 bg-white dark:bg-[#121212] shadow-inner custom-scrollbar-hidden">
                                        <InternalThemePreview theme={theme} />
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-8 pt-2 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider font-poppins">{theme.name}</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        <Button
                                            onClick={(e) => { e.stopPropagation(); handleActivate(theme.id); }}
                                            className={`h-12 w-full font-black text-[12px] tracking-[0.2em] uppercase rounded-xl transition-all duration-300 shadow-sm active:scale-95 ${
                                                isActivated 
                                                    ? "bg-green-500 hover:bg-green-600 text-white cursor-default" 
                                                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
                                            }`}
                                        >
                                            {isActivated ? "ACTIVATED" : "ACTIVATE"}
                                        </Button>
                                        
                                        <Button
                                            variant="secondary"
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                // Preview logic would go here
                                                toast.info("Full preview demo mode.");
                                            }}
                                            className="h-12 w-full font-black text-[12px] tracking-[0.2em] uppercase rounded-xl bg-[#e2e2e2] hover:bg-[#d4d4d4] dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-white border-none transition-all duration-300 active:scale-95"
                                        >
                                            PREVIEW
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
        </div>
    );
}
