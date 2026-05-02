"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Upload, RotateCcw, Image as ImageIcon, Layout } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PersistenceActions } from "@/components/common/PersistenceActions";
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
import { ImageCropper } from "@/components/common/ImageCropper";

const DEFAULT_COLOR = "#3b82f6";

function getDefaultForm() {
  return {
    title: "",
    button_label: "",
    page_id: null as number | null,
    button_color: DEFAULT_COLOR,
    image_path: "",
    status: "draft" as "published" | "draft",
    is_active: true,
  };
}

export default function SimpleSliderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit") ? Number(searchParams.get("edit")) : null;
  const isEditing = !!editId;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState(getDefaultForm());
  const [imageUploading, setImageUploading] = useState(false);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");

  const { data: existingSlider } = useVendorSlider(editId);
  const { data: pagesData } = useVendorPages({ limit: 100 });
  const uploadMedia = useUploadMedia();
  const BACK = "/website/home-slider/simple-slider";
  const createMutation = useCreateVendorSlider(() => router.push(BACK));
  const updateMutation = useUpdateVendorSlider(editId ?? 0, () => router.push(BACK));

  const pages = pagesData?.data ?? [];

  // Populate form when editing
  useEffect(() => {
    if (existingSlider) {
      setFormData({
        title: existingSlider.title ?? "",
        button_label: existingSlider.button_label ?? "",
        page_id: existingSlider.page_id ?? null,
        button_color: existingSlider.button_color ?? DEFAULT_COLOR,
        image_path: existingSlider.image_path ?? "",
        status: existingSlider.status ?? "draft",
        is_active: !!existingSlider.is_active,
      });
    }
  }, [existingSlider]);

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

  const resetForm = () => setFormData(getDefaultForm());

  const handleSave = () => {
    if (!formData.title) return toast.error("Title is required.");
    if (!formData.button_label) return toast.error("Button Label is required.");
    if (!formData.image_path) return toast.error("Slider image is required.");

    const payload = {
      type: "basic" as const,
      title: formData.title,
      button_label: formData.button_label,
      page_id: formData.page_id,
      button_color: formData.button_color,
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
        <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1">
          {isEditing ? "Edit Simple Slider" : "Add Simple Slider"}
        </h1>
        <Button variant="ghost" onClick={() => router.push("/website/home-slider/simple-slider")} className="text-[12px] font-bold text-slate-500 hover:text-blue-600 gap-2">
          <RotateCcw size={14} className="rotate-90" /> BACK TO LIST
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start px-4">
        {/* Form */}
        <div className="lg:col-span-9 space-y-6">
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <Layout className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Slider Details</CardTitle>
                  <CardDescription className="text-xs">Configure your slider content and target page.</CardDescription>
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
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="h-11 rounded-sm border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Button Label <span className="text-rose-500">*</span></Label>
                  <Input
                    value={formData.button_label}
                    onChange={(e) => setFormData({ ...formData, button_label: e.target.value })}
                    className="h-11 rounded-sm border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Linked Page</Label>
                  <Select
                    value={formData.page_id ? String(formData.page_id) : "none"}
                    onValueChange={(v) => setFormData({ ...formData, page_id: v === "none" ? null : Number(v) })}
                  >
                    <SelectTrigger className="h-11 rounded-sm border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 font-medium">
                      <SelectValue placeholder="Select a page" />
                    </SelectTrigger>
                    <SelectContent className="rounded-sm border-slate-100">
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
                  <div className="flex items-center gap-0 border border-slate-200 dark:border-slate-800 rounded-sm overflow-hidden w-fit bg-slate-50/50 dark:bg-slate-950/50">
                    <div className="relative w-11 h-11 border-r border-slate-200 dark:border-slate-800">
                      <div className="absolute inset-0 transition-colors" style={{ backgroundColor: formData.button_color }} />
                      <input type="color" value={formData.button_color} onChange={(e) => setFormData({ ...formData, button_color: e.target.value })} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                    <Input
                      value={formData.button_color}
                      onChange={(e) => setFormData({ ...formData, button_color: e.target.value })}
                      className="w-28 border-none h-11 text-[13px] font-mono font-bold uppercase focus-visible:ring-0 bg-transparent text-slate-700 dark:text-slate-300"
                    />
                    <Button variant="ghost" size="icon" onClick={() => setFormData({ ...formData, button_color: DEFAULT_COLOR })} className="h-11 w-11 text-slate-400 border-l border-slate-200 dark:border-slate-800 rounded-none hover:bg-white transition-colors">
                      <RotateCcw size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right column - image */}
              <div className="space-y-4">
                <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Slider Image <span className="text-rose-500">*</span></Label>
                <div
                  onClick={() => !previewImage && !imageUploading && fileInputRef.current?.click()}
                  className={cn(
                    "w-full aspect-[16/10] rounded-2xl border-2 border-dashed transition-all relative overflow-hidden group flex flex-col items-center justify-center p-2",
                    previewImage ? "border-blue-500/20 bg-blue-50/5" : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 cursor-pointer"
                  )}
                >
                  {imageUploading ? (
                    <div className="text-center space-y-3">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Uploading…</p>
                    </div>
                  ) : previewImage ? (
                    <>
                      <Image src={previewImage} alt="Slider" fill className="object-cover rounded-sm" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="destructive" size="icon" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, image_path: "" }); }} className="w-10 h-10 rounded-sm shadow-xl">
                          <X size={20} />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm inline-block text-blue-500 group-hover:scale-110 transition-transform duration-500">
                        <Upload size={28} />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">Choose Image</p>
                        <p className="text-[10px] font-medium text-slate-400 mt-1">Recommended: 1800 × 900 px</p>
                      </div>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
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
              onPreview={() => window.open("/preview?block=simple_slider", "_blank")}
              onReset={isEditing ? resetForm : undefined}
              onCancel={() => router.push("/website/home-slider/simple-slider")}
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
              <Checkbox id="simple-active" checked={formData.is_active} onCheckedChange={(v: boolean) => setFormData({ ...formData, is_active: v })} />
              <Label htmlFor="simple-active" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Active</Label>
            </div>
          </Card>

          {/* Live preview */}
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">Live Preview</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-950 rounded-sm overflow-hidden flex items-center justify-center border border-slate-100 dark:border-slate-800">
                {previewImage ? (
                  <Image src={previewImage} alt="Preview" fill className="object-cover" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-slate-300 opacity-50" />
                )}
                {formData.button_label && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                    <Button style={{ backgroundColor: formData.button_color }} className="h-9 px-8 rounded-full text-white text-[11px] font-bold shadow-xl animate-in zoom-in duration-300 tracking-wider uppercase">
                      {formData.button_label}
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest italic">Desktop Visualization</p>
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
    </div>
  );
}
