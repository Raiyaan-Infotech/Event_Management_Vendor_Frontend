"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera, MapPin, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { ImageCropper } from "@/components/common/ImageCropper";
import { GalleryImageItem, GalleryFormData } from "./gallery-add";

interface GalleryEditProps {
  onSave: (data: GalleryFormData) => void;
  initialData?: GalleryFormData;
  isLoading?: boolean;
  loading?: boolean;
}

const MAX_PER_VIEW = 10;

export default function GalleryEdit({ onSave, initialData, isLoading = false, loading = false }: GalleryEditProps) {
  const router       = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData,    setFormData]    = useState({ eventName: "", city: "" });
  const [images,      setImages]      = useState<GalleryImageItem[]>([]);
  const [imgView,     setImgView]     = useState<'public' | 'private'>('public');
  const [isActive,    setIsActive]    = useState(true);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");
  const [cropQueue,   setCropQueue]   = useState<string[]>([]);
  const [uploading,   setUploading]   = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({ eventName: initialData.eventName, city: initialData.city });
      setImages(initialData.images ?? []);
      setImgView(initialData.imgView ?? 'public');
      setIsActive(initialData.isActive ?? true);
    }
  }, [initialData]);

  const canAddMore = images.length < MAX_PER_VIEW;

  const openNextInQueue = (queue: string[]) => {
    if (queue.length === 0) return;
    setImageToCrop(queue[0]);
    setCropperOpen(true);
    setCropQueue(queue.slice(1));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const slots = MAX_PER_VIEW - images.length;
    const allowed = files.slice(0, slots);
    if (files.length > slots) toast.warning(`Only ${slots} more image(s) allowed. Extra files skipped.`);
    const readers: Promise<string>[] = allowed.map(
      (file) =>
        new Promise((resolve, reject) => {
          if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} too large (max 5MB)`); reject(); return; }
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
    );
    Promise.allSettled(readers).then((results) => {
      const base64List = results.filter((r) => r.status === "fulfilled").map((r) => (r as PromiseFulfilledResult<string>).value);
      if (base64List.length > 0) openNextInQueue(base64List);
    });
    e.target.value = "";
  };

  const handleCropComplete = (croppedBase64: string) => {
    setCropperOpen(false);
    fetch(croppedBase64)
      .then((r) => r.blob())
      .then((blob) => {
        const file = new File([blob], "gallery.jpg", { type: "image/jpeg" });
        setImages((prev) => [
          ...prev,
          { id: `img-${Date.now()}-${Math.random()}`, previewUrl: croppedBase64, file, uploading: false, error: false },
        ]);
        if (cropQueue.length > 0) openNextInQueue(cropQueue);
        else setImageToCrop("");
      });
  };

  const handleRemove = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const payload = new FormData();
    payload.append("file", file);
    payload.append("folder", "gallery");
    const res = await apiClient.post("/vendors/auth/upload", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data.file.url as string;
  };

  const handleSave = async () => {
    if (!formData.eventName || !formData.city) return toast.error("Please fill all fields.");
    if (images.length === 0) return toast.error("Please upload at least one image.");

    try {
      setUploading(true);
      const uploaded = await Promise.all(
        images.map(async (img) => {
          if (!img.file) return img; // already uploaded URL
          const url = await uploadImage(img.file);
          return { ...img, previewUrl: url, file: null };
        })
      );
      setUploading(false);
      onSave({ ...formData, images: uploaded, imgView, isActive });
    } catch {
      setUploading(false);
      toast.error("Image upload failed. Please try again.");
    }
  };

  const isBusy = uploading || loading;

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-86px)] overflow-y-auto bg-[#F8FAFC] dark:bg-black/40">
        <div className="max-w-[1700px] mx-auto px-6 py-8 space-y-8">
          <Skeleton className="h-12 w-64 rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-9"><Skeleton className="h-[500px] w-full rounded-[2.5rem]" /></div>
            <div className="lg:col-span-3"><Skeleton className="h-40 w-full rounded-[2.5rem]" /></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto custom-scrollbar bg-[#F8FAFC] dark:bg-black/40">
      <div className="max-w-[1700px] mx-auto px-6 py-8">
        <PageHeader title="Edit Gallery" subtitle="Update the event memory in your public showcase." />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10 items-start pb-20">
          <div className="lg:col-span-9 space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
            <Card className="border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none bg-white dark:bg-sidebar rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-10 pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <Camera size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tighter">Gallery Details</CardTitle>
                    <CardDescription className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                      Update the event information and images.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-10 pt-8 space-y-8">
                {/* Event Name + City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Event Name</Label>
                    <Input
                      value={formData.eventName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, eventName: e.target.value }))}
                      placeholder="Enter event name..."
                      className="h-14 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">City</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                        value={formData.city}
                        onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                        placeholder="Location of event..."
                        className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white transition-all font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Image Upload Grid (portfolio style) ── */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                      Event Images
                    </Label>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {images.length}/{MAX_PER_VIEW} Photos
                    </span>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {/* Uploaded image tiles */}
                    {images.map((img) => (
                      <div
                        key={img.id}
                        className="group relative aspect-square rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all"
                      >
                        <Image
                          src={img.previewUrl}
                          alt="gallery"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Delete overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => handleRemove(img.id)}
                            className="w-8 h-8 rounded-xl bg-rose-600 hover:bg-rose-700 flex items-center justify-center text-white shadow-xl transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                      </div>
                    ))}

                    {/* Add tile */}
                    {canAddMore && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-white/5 transition-all group"
                      >
                        <div className="w-9 h-9 rounded-full border-2 border-gray-300 group-hover:border-emerald-500 flex items-center justify-center transition-colors">
                          <Plus size={16} className="text-gray-400 group-hover:text-emerald-600" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-emerald-600">
                          Add Photo
                        </span>
                      </button>
                    )}

                    {/* Empty placeholder */}
                    {images.length === 0 && (
                      <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-300">
                        <ImageIcon size={40} className="mb-2" />
                        <span className="text-[11px] font-bold uppercase tracking-widest">No images yet</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8 animate-in fade-in slide-in-from-right duration-1000">

            {/* Visibility */}
            <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Visibility</p>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-gray-600 dark:text-gray-300">Public / Private</span>
                <div
                  onClick={() => setImgView(imgView === 'public' ? 'private' : 'public')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full cursor-pointer transition-all ${imgView === 'public' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                >
                  <div className={`relative w-8 h-4 rounded-full ${imgView === 'public' ? 'bg-emerald-300/60' : 'bg-rose-300/60'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all duration-200 ${imgView === 'public' ? 'left-[18px]' : 'left-0.5'}`} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">{imgView === 'public' ? 'Public' : 'Private'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-gray-600 dark:text-gray-300">Active</span>
                <div
                  onClick={() => setIsActive(!isActive)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full cursor-pointer transition-all ${isActive ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`relative w-8 h-4 rounded-full ${isActive ? 'bg-emerald-300/60' : 'bg-gray-200/60'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all duration-200 ${isActive ? 'left-[18px]' : 'left-0.5'}`} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">{isActive ? 'ON' : 'OFF'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <PersistenceActions
                onSave={handleSave}
                onCancel={() => router.back()}
                saveLabel={uploading ? "Uploading..." : loading ? "Saving..." : "Update"}
                isSubmitting={isBusy}
              />
            </div>
          </div>
        </div>
      </div>

      <ImageCropper
        open={cropperOpen}
        imageSrc={imageToCrop}
        onClose={() => setCropperOpen(false)}
        onCropComplete={handleCropComplete}
        aspectRatio={4 / 3}
        outputWidth={1200}
        outputHeight={900}
      />
    </div>
  );
}
