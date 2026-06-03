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
import { useVendorColors } from "@/hooks/use-vendor-colors";
import { useUploadMedia } from "@/hooks/use-media";
import {
  useVendorSlider,
  useCreateVendorSlider,
  useUpdateVendorSlider,
} from "@/hooks/use-vendor-sliders";
import { ImageCropper } from "@/components/common/ImageCropper";

const DEFAULT_TITLE_COLOR = "#ffffff";
const DEFAULT_DESC_COLOR = "#e2e8f0";
const DEFAULT_BTN_COLOR = "#3b82f6";
const BUILT_IN_LINKS = [
  { id: -1, name: "About Us" },
  { id: -2, name: "Contact Us" },
];

const normalizeColor = (color?: string | null) => color?.trim().toLowerCase() ?? "";

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
  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: existingSlider } = useVendorSlider(editId);
  const { data: pagesData } = useVendorPages({ limit: 100 });
  const { data: colorData } = useVendorColors();
  const uploadMedia = useUploadMedia();
  const BACK = "/website/home-slider/advance-slider";
  const createMutation = useCreateVendorSlider(() => router.push(BACK));
  const updateMutation = useUpdateVendorSlider(editId ?? 0, () => router.push(BACK));

  const pages = pagesData?.data ?? [];
  const linkOptions = [...BUILT_IN_LINKS, ...pages];
  const paletteColors = [
    colorData?.merged?.primary_color,
    colorData?.merged?.secondary_color,
    colorData?.merged?.header_color,
    colorData?.merged?.footer_color,
    colorData?.merged?.text_color,
    colorData?.merged?.hover_color,
  ].filter(Boolean) as string[];
  const defaultButtonColor = colorData?.merged?.primary_color || DEFAULT_BTN_COLOR;
  const paletteColorsKey = paletteColors.map(normalizeColor).join("|");
  const isPaletteButtonColor = paletteColors.some(
    (color) => normalizeColor(color) === normalizeColor(formData.button_color),
  );
  const effectiveButtonColor =
    paletteColors.length === 0 || isPaletteButtonColor ? formData.button_color : defaultButtonColor;

  useEffect(() => {
    if (isEditing || paletteColors.length === 0) return;
    setFormData((prev) =>
      paletteColors.some((color) => normalizeColor(color) === normalizeColor(prev.button_color))
        ? prev
        : { ...prev, button_color: defaultButtonColor },
    );
  }, [defaultButtonColor, isEditing, paletteColorsKey]);

  useEffect(() => {
    if (!isEditing || paletteColors.length === 0) return;
    setFormData((prev) =>
      paletteColors.some((color) => normalizeColor(color) === normalizeColor(prev.button_color))
        ? prev
        : { ...prev, button_color: defaultButtonColor },
    );
  }, [defaultButtonColor, isEditing, paletteColorsKey]);

  useEffect(() => {
    if (existingSlider) {
      setFormData({
        title: existingSlider.title ?? "",
        title_color: existingSlider.title_color ?? DEFAULT_TITLE_COLOR,
        description: existingSlider.description ?? "",
        description_color: existingSlider.description_color ?? DEFAULT_DESC_COLOR,
        button_label: existingSlider.button_label ?? "",
        page_id: existingSlider.page_id ?? null,
        button_color: existingSlider.button_color ?? defaultButtonColor,
        content_alignment: existingSlider.content_alignment ?? "center",
        image_blur: existingSlider.image_blur ?? 0,
        image_brightness: existingSlider.image_brightness ?? 100,
        overlay_opacity: existingSlider.overlay_opacity ?? 40,
        image_path: existingSlider.image_path ?? "",
        status: existingSlider.status ?? "draft",
        is_active: !!existingSlider.is_active,
      });
    }
  }, [existingSlider, defaultButtonColor]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result as string);
      setCropperOpen(true);
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBase64: string) => {
    setCropperOpen(false);
    setImageToCrop("");
    setImageUploading(true);
    try {
      const blob = await fetch(croppedBase64).then((r) => r.blob());
      const file = new File([blob], "slider.jpg", { type: "image/jpeg" });
      const result = await uploadMedia.mutateAsync({ file, folder: "sliders" });
      setFormData((prev) => ({ ...prev, image_path: result.url }));
    } finally {
      setImageUploading(false);
    }
  };

  const resetForm = () => setFormData({ ...getDefaultForm(), button_color: defaultButtonColor });

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim())        newErrors.title        = "Title is required";
    if (!formData.button_label.trim()) newErrors.button_label = "Button label is required";
    if (!formData.page_id)             newErrors.page_id      = "Button URL (page) is required";
    if (!formData.image_path)          newErrors.image_path   = "Slider image is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill all mandatory fields.");
      return;
    }
    setErrors({});

    const payload = {
      type: "advanced" as const,
      title: formData.title,
      title_color: formData.title_color,
      description: formData.description,
      description_color: formData.description_color,
      button_label: formData.button_label,
      page_id: formData.page_id,
      button_color: effectiveButtonColor,
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
        <h1 className="text-[var(--vendor-title-text)] font-bold text-slate-800 dark:text-white uppercase tracking-tighter">
          {isEditing ? "Edit Advance Slider" : "Add Advance Slider"}
        </h1>
        <Button variant="ghost" onClick={() => router.push("/website/home-slider/advance-slider")} className="text-[var(--vendor-control-text)] font-semibold text-slate-500 hover:text-indigo-600 gap-2">
          <RotateCcw size={14} className="rotate-90" /> BACK TO LIST
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start px-4 text-slate-700">
        {/* Main form */}
        <div className="lg:col-span-9 space-y-6">
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[var(--vendor-radius-panel)] overflow-hidden">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-[var(--vendor-radius-control)]">
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
                  <Input
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (errors.title) setErrors((p) => ({ ...p, title: "" }));
                    }}
                    className={`h-11 rounded-sm bg-white ${errors.title ? "border-rose-500 ring-4 ring-rose-500/5" : "border-slate-200"}`}
                  />
                  {errors.title && <p className="text-[11px] font-semibold text-rose-500">{errors.title}</p>}
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
                  <Input
                    value={formData.button_label}
                    onChange={(e) => {
                      setFormData({ ...formData, button_label: e.target.value });
                      if (errors.button_label) setErrors((p) => ({ ...p, button_label: "" }));
                    }}
                    className={`h-11 rounded-sm ${errors.button_label ? "border-rose-500 ring-4 ring-rose-500/5" : "border-slate-200"}`}
                  />
                  {errors.button_label && <p className="text-[11px] font-semibold text-rose-500">{errors.button_label}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Button URL <span className="text-rose-500">*</span></Label>
                  <Select
                    value={formData.page_id ? String(formData.page_id) : "none"}
                    onValueChange={(v) => {
                      setFormData({ ...formData, page_id: v === "none" ? null : Number(v) });
                      if (errors.page_id) setErrors((p) => ({ ...p, page_id: "" }));
                    }}
                  >
                    <SelectTrigger className={`h-11 rounded-sm bg-white font-medium ${errors.page_id ? "border-rose-500 ring-4 ring-rose-500/5" : "border-slate-200"}`}>
                      <SelectValue placeholder="Select a page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className="text-[var(--vendor-control-text)] font-semibold text-slate-400">No page linked</SelectItem>
                      {linkOptions.map((page) => (
                        <SelectItem key={page.id} value={String(page.id)} className="text-[var(--vendor-control-text)] font-semibold">
                          {page.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.page_id && <p className="text-[11px] font-semibold text-rose-500">{errors.page_id}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Button Color</Label>
                  <ColorInput value={effectiveButtonColor} onChange={(c) => setFormData({ ...formData, button_color: c })} paletteColors={paletteColors} paletteOnly />
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-8">
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label className="text-[var(--vendor-control-text)] font-semibold text-slate-500 uppercase">Overlay Opacity</Label>
                    <input type="range" min="0" max="100" value={formData.overlay_opacity} onChange={(e) => setFormData({ ...formData, overlay_opacity: parseInt(e.target.value) })} className="w-full accent-indigo-600" />
                    <p className="text-[10px] font-bold text-slate-400">{formData.overlay_opacity}%</p>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[var(--vendor-control-text)] font-semibold text-slate-500 uppercase">Image Blur</Label>
                    <input type="range" min="0" max="20" value={formData.image_blur} onChange={(e) => setFormData({ ...formData, image_blur: parseInt(e.target.value) })} className="w-full accent-indigo-600" />
                    <p className="text-[10px] font-bold text-slate-400">{formData.image_blur}px</p>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[var(--vendor-control-text)] font-semibold text-slate-500 uppercase">Brightness</Label>
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
                  {errors.image_path && (
                    <p className="text-[11px] font-semibold text-rose-500 -mt-1">{errors.image_path}</p>
                  )}
                  <div
                    onClick={() => !previewImage && !imageUploading && fileInputRef.current?.click()}
                    className={cn(
                      "w-full aspect-video rounded-[var(--vendor-radius-panel)] border-2 border-dashed transition-all relative overflow-hidden group flex flex-col items-center justify-center bg-white",
                      previewImage ? "border-indigo-500/20" : "border-slate-200 cursor-pointer"
                    )}
                  >
                    {imageUploading ? (
                      <div className="text-center space-y-3">
                        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-[var(--vendor-control-text)] font-semibold text-slate-500 uppercase tracking-wider">Uploading…</p>
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
          <div className="bg-[var(--vendor-panel-bg)] backdrop-blur-md p-6 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <PersistenceActions
              onSave={handleSave}
              onReset={isEditing ? resetForm : undefined}
              onCancel={() => router.push("/website/home-slider/advance-slider")}
              onPreview={() => setPreviewOpen(true)}
              saveLabel={isSaving ? "SAVING…" : isEditing ? "UPDATE SLIDER" : "SAVE SLIDER"}
            />
          </div>

          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[var(--vendor-radius-panel)] p-6 space-y-6">
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
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[var(--vendor-radius-panel)] overflow-hidden">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-[var(--vendor-radius-control)]">
                  <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">Live Preview</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="relative aspect-[16/10] bg-slate-950 rounded-[var(--vendor-radius-panel)] overflow-hidden flex flex-col items-center justify-center shadow-2xl">
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
                    <Button style={{ backgroundColor: effectiveButtonColor }} className="h-8 px-6 rounded-full text-white text-[9px] font-black uppercase tracking-wide shadow-xl mt-2">
                      {formData.button_label}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ImageCropper
        open={cropperOpen}
        imageSrc={imageToCrop}
        onClose={() => setCropperOpen(false)}
        onCropComplete={handleCropComplete}
        aspectRatio={16 / 9}
        outputWidth={1800}
        outputHeight={900}
      />

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
                <Button style={{ backgroundColor: effectiveButtonColor }} className="h-16 px-16 rounded-full text-white font-black text-sm tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all animate-in zoom-in duration-1000 delay-500 uppercase">
                  {formData.button_label}
                </Button>
              )}
            </div>
            <Button onClick={() => setPreviewOpen(false)} variant="secondary" size="icon" className="absolute top-10 right-10 w-12 h-12 rounded-[var(--vendor-radius-panel)] bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-3xl border-none transition-all shadow-2xl z-50">
              <X size={24} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ColorInput({
  value,
  onChange,
  paletteColors = [],
  paletteOnly = false,
}: {
  value: string;
  onChange: (c: string) => void;
  paletteColors?: string[];
  paletteOnly?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-0 border border-slate-200 rounded-sm overflow-hidden bg-white shadow-sm w-fit">
        <div className="relative w-11 h-11 border-r border-slate-200">
          <div className="absolute inset-0" style={{ backgroundColor: value }} />
          {!paletteOnly && (
            <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
          )}
        </div>
        <Input
          value={value}
          readOnly={paletteOnly}
          onChange={(e) => !paletteOnly && onChange(e.target.value)}
          className="w-24 border-none h-11 text-[11px] font-mono font-bold uppercase focus-visible:ring-0 bg-transparent"
        />
      </div>
      {paletteColors.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {paletteColors.map((color, index) => (
            <button
              key={`${color}-${index}`}
              type="button"
              aria-label={`Use palette color ${index + 1}`}
              onClick={() => onChange(color)}
              className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                normalizeColor(value) === normalizeColor(color)
                  ? "border-slate-900 dark:border-white"
                  : "border-white shadow"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      ) : paletteOnly ? (
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Loading selected palette colors...</p>
      ) : null}
    </div>
  );
}
