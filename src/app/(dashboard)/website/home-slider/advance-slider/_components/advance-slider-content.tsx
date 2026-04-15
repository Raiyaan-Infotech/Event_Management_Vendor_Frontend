"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Upload, RotateCcw, Eye, Sliders } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { resolveMediaUrl } from "@/lib/utils";
import { useVendorPages } from "@/hooks/use-vendor-pages";
import { useUploadMedia } from "@/hooks/use-media";
import {
  useVendorSlider,
  useCreateVendorSlider,
  useUpdateVendorSlider,
} from "@/hooks/use-vendor-sliders";

const DEFAULT_TITLE_COLOR = "#ffffff";
const DEFAULT_DESC_COLOR = "#e2e8f0";
const DEFAULT_BTN_COLOR = "#3b82f6";

function getDefaultForm() {
  return {
    title: "",
    title_color: DEFAULT_TITLE_COLOR,
    description: "",
    description_color: DEFAULT_DESC_COLOR,
    button_label: "",
    page_id: null as number | null,
    button_color: DEFAULT_BTN_COLOR,
    content_alignment: "center" as "left" | "center" | "right",
    image_blur: 0,
    image_brightness: 100,
    overlay_opacity: 40,
    image_path: "",
    status: "draft" as "published" | "draft",
    is_active: true,
  };
}

export default function AdvanceSliderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit") ? Number(searchParams.get("edit")) : null;
  const isEditing = !!editId;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState(getDefaultForm());
  const [imageUploading, setImageUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { data: existingSlider } = useVendorSlider(editId);
  const { data: pagesData } = useVendorPages({ limit: 100 });
  const uploadMedia = useUploadMedia();
  const BACK = "/website/home-slider/advance-slider";
  const createMutation = useCreateVendorSlider(() => router.push(BACK));
  const updateMutation = useUpdateVendorSlider(editId ?? 0, () => router.push(BACK));

  const pages = pagesData?.data ?? [];

  useEffect(() => {
    if (existingSlider) {
      setFormData({
        title: existingSlider.title ?? "",
        title_color: existingSlider.title_color ?? DEFAULT_TITLE_COLOR,
        description: existingSlider.description ?? "",
        description_color: existingSlider.description_color ?? DEFAULT_DESC_COLOR,
        button_label: existingSlider.button_label ?? "",
        page_id: existingSlider.page_id ?? null,
        button_color: existingSlider.button_color ?? DEFAULT_BTN_COLOR,
        content_alignment: existingSlider.content_alignment ?? "center",
        image_blur: existingSlider.image_blur ?? 0,
        image_brightness: existingSlider.image_brightness ?? 100,
        overlay_opacity: existingSlider.overlay_opacity ?? 40,
        image_path: existingSlider.image_path ?? "",
        status: existingSlider.status ?? "draft",
        is_active: !!existingSlider.is_active,
      });
    }
  }, [existingSlider]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const result = await uploadMedia.mutateAsync({ file, folder: "sliders" });
      setFormData((prev) => ({ ...prev, image_path: result.url }));
    } finally {
      setImageUploading(false);
      e.target.value = "";
    }
  };

  const resetForm = () => setFormData(getDefaultForm());

  const handleSave = () => {
    if (!formData.title) return toast.error("Title is required.");
    if (!formData.button_label) return toast.error("Button Label is required.");
    if (!formData.image_path) return toast.error("Slider image is required.");

    const payload = {
      type: "advanced" as const,
      title: formData.title,
      title_color: formData.title_color,
      description: formData.description,
      description_color: formData.description_color,
      button_label: formData.button_label,
      page_id: formData.page_id,
      button_color: formData.button_color,
      content_alignment: formData.content_alignment,
      image_blur: formData.image_blur,
      image_brightness: formData.image_brightness,
      overlay_opacity: formData.overlay_opacity,
      image_path: formData.image_path,
      status: formData.status,
      is_active: formData.is_active ? 1 : 0,
    };

    if (isEditing) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload as Parameters<typeof createMutation.mutate>[0]);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const previewImage = formData.image_path ? resolveMediaUrl(formData.image_path) : "";

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-black p-6 space-y-6 flex flex-col animate-in fade-in duration-700">
      <div className="px-4 pb-2 flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
          {isEditing ? "Edit Advance Slider" : "Advance Slider Workspace"}
        </h1>
        <Button variant="ghost" onClick={() => router.push("/website/home-slider/advance-slider")} className="text-[12px] font-bold text-slate-500 hover:text-indigo-600 gap-2">
          <RotateCcw size={14} className="rotate-90" /> BACK TO LIST
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start px-4 text-slate-700">
        {/* Main form */}
        <div className="lg:col-span-9 space-y-6">
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                  <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Layout & Content</CardTitle>
                  <CardDescription className="text-xs">Precision control over typography and background effects.</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Left column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Title <span className="text-rose-500">*</span></Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="h-11 rounded-sm border-slate-200 bg-white" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Title Color</Label>
                  <ColorInput value={formData.title_color} onChange={(c) => setFormData({ ...formData, title_color: c })} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="min-h-[120px] rounded-sm border-slate-200 bg-white" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description Color</Label>
                  <ColorInput value={formData.description_color} onChange={(c) => setFormData({ ...formData, description_color: c })} />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Button Label <span className="text-rose-500">*</span></Label>
                  <Input value={formData.button_label} onChange={(e) => setFormData({ ...formData, button_label: e.target.value })} className="h-11 rounded-sm border-slate-200" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Button URL <span className="text-rose-500">*</span></Label>
                  <Select
                    value={formData.page_id ? String(formData.page_id) : "none"}
                    onValueChange={(v) => setFormData({ ...formData, page_id: v === "none" ? null : Number(v) })}
                  >
                    <SelectTrigger className="h-11 rounded-sm border-slate-200 bg-white font-medium">
                      <SelectValue placeholder="Select a page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className="text-[12px] font-bold text-slate-400">No page linked</SelectItem>
                      {pages.map((page) => (
                        <SelectItem key={page.id} value={String(page.id)} className="text-[12px] font-bold">
                          {page.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Button Color</Label>
                  <ColorInput value={formData.button_color} onChange={(c) => setFormData({ ...formData, button_color: c })} />
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-8">
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">Overlay Opacity</Label>
                    <input type="range" min="0" max="100" value={formData.overlay_opacity} onChange={(e) => setFormData({ ...formData, overlay_opacity: parseInt(e.target.value) })} className="w-full accent-indigo-600" />
                    <p className="text-[10px] font-bold text-slate-400">{formData.overlay_opacity}%</p>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">Image Blur</Label>
                    <input type="range" min="0" max="20" value={formData.image_blur} onChange={(e) => setFormData({ ...formData, image_blur: parseInt(e.target.value) })} className="w-full accent-indigo-600" />
                    <p className="text-[10px] font-bold text-slate-400">{formData.image_blur}px</p>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">Brightness</Label>
                    <input type="range" min="0" max="200" value={formData.image_brightness} onChange={(e) => setFormData({ ...formData, image_brightness: parseInt(e.target.value) })} className="w-full accent-indigo-600" />
                    <p className="text-[10px] font-bold text-slate-400">{formData.image_brightness}%</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Content Alignment</Label>
                  <Select value={formData.content_alignment} onValueChange={(v: "left" | "center" | "right") => setFormData({ ...formData, content_alignment: v })}>
                    <SelectTrigger className="h-11 rounded-sm border-slate-200 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Slider Image <span className="text-rose-500">*</span></Label>
                  <div
                    onClick={() => !previewImage && !imageUploading && fileInputRef.current?.click()}
                    className={cn(
                      "w-full aspect-video rounded-2xl border-2 border-dashed transition-all relative overflow-hidden group flex flex-col items-center justify-center bg-white",
                      previewImage ? "border-indigo-500/20" : "border-slate-200 cursor-pointer"
                    )}
                  >
                    {imageUploading ? (
                      <div className="text-center space-y-3">
                        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Uploading…</p>
                      </div>
                    ) : previewImage ? (
                      <>
                        <Image src={previewImage} alt="Slider" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                          <Button variant="destructive" size="icon" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, image_path: "" }); }} className="w-10 h-10 rounded-sm">
                            <X size={20} />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <Upload size={32} className="text-slate-300 mx-auto mb-2" />
                        <p className="text-[10px] font-bold text-indigo-600 uppercase">Choose image</p>
                        <p className="text-[10px] text-slate-400 mt-1">Recommended: 1800 × 900 px</p>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8">
          <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <PersistenceActions
              onSave={handleSave}
              onReset={isEditing ? resetForm : undefined}
              onCancel={() => router.push("/website/home-slider/advance-slider")}
              onPreview={() => setPreviewOpen(true)}
              saveLabel={isSaving ? "SAVING…" : isEditing ? "UPDATE SLIDER" : "SAVE SLIDER"}
            />
          </div>

          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">Status</Label>
              <Select value={formData.status} onValueChange={(v: "published" | "draft") => setFormData({ ...formData, status: v })}>
                <SelectTrigger className="h-10 rounded-sm border-slate-200 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="adv-active" checked={formData.is_active} onCheckedChange={(v: boolean) => setFormData({ ...formData, is_active: v })} />
              <Label htmlFor="adv-active" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Active</Label>
            </div>
          </Card>

          {/* Live preview */}
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                  <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">Live Preview</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="relative aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center shadow-2xl">
                {previewImage && (
                  <Image src={previewImage} alt="Live" fill className="object-cover transition-all duration-500" style={{ filter: `blur(${formData.image_blur}px) brightness(${formData.image_brightness}%)` }} />
                )}
                <div className="absolute inset-0 bg-black transition-opacity duration-300" style={{ opacity: formData.overlay_opacity / 100 }} />
                <div className={cn(
                  "relative z-10 w-full px-6 flex flex-col gap-3 transition-all duration-500",
                  formData.content_alignment === "left" ? "items-start text-left" : formData.content_alignment === "right" ? "items-end text-right" : "items-center text-center"
                )}>
                  <h3 className="text-xl font-black uppercase tracking-tighter leading-none" style={{ color: formData.title_color }}>
                    {formData.title || "Your Title Here"}
                  </h3>
                  <p className="text-[10px] font-medium leading-relaxed opacity-90" style={{ color: formData.description_color }}>
                    {formData.description || "Description will appear here…"}
                  </p>
                  {formData.button_label && (
                    <Button style={{ backgroundColor: formData.button_color }} className="h-8 px-6 rounded-full text-white text-[9px] font-black uppercase tracking-widest shadow-xl mt-2">
                      {formData.button_label}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full preview modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[1200px] border-none shadow-2xl p-0 aspect-[16/9] overflow-hidden rounded-[3rem] bg-black">
          <DialogTitle className="sr-only">Advance Slider Preview</DialogTitle>
          <div className="relative w-full h-full flex flex-col justify-center">
            {previewImage && (
              <Image src={previewImage} alt="Full" fill className="object-cover transition-all" style={{ filter: `blur(${formData.image_blur}px) brightness(${formData.image_brightness}%)` }} />
            )}
            <div className="absolute inset-0 bg-black" style={{ opacity: formData.overlay_opacity / 100 }} />
            <div className={cn(
              "relative z-10 px-20 flex flex-col gap-6",
              formData.content_alignment === "left" ? "items-start text-left" : formData.content_alignment === "right" ? "items-end text-right" : "items-center text-center"
            )}>
              <h2 className="text-6xl font-black uppercase tracking-tighter drop-shadow-2xl animate-in slide-in-from-bottom-10 duration-1000" style={{ color: formData.title_color }}>{formData.title}</h2>
              <p className="max-w-3xl text-xl font-medium opacity-90 animate-in slide-in-from-bottom-6 duration-1000 delay-200" style={{ color: formData.description_color }}>{formData.description}</p>
              {formData.button_label && (
                <Button style={{ backgroundColor: formData.button_color }} className="h-16 px-16 rounded-full text-white font-black text-sm tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all animate-in zoom-in duration-1000 delay-500 uppercase">
                  {formData.button_label}
                </Button>
              )}
            </div>
            <Button onClick={() => setPreviewOpen(false)} variant="secondary" size="icon" className="absolute top-10 right-10 w-12 h-12 rounded-2xl bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-3xl border-none transition-all shadow-2xl z-50">
              <X size={24} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ColorInput({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex items-center gap-0 border border-slate-200 rounded-sm overflow-hidden bg-white shadow-sm w-fit">
      <div className="relative w-11 h-11 border-r border-slate-200">
        <div className="absolute inset-0" style={{ backgroundColor: value }} />
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-24 border-none h-11 text-[11px] font-mono font-bold uppercase focus-visible:ring-0 bg-transparent"
      />
    </div>
  );
}
