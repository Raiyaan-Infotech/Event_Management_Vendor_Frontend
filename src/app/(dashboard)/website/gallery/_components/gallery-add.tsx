"use client";

import React, { useState, useRef } from "react";
import { Camera, MapPin, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";

interface GalleryFormData {
  eventName: string;
  city: string;
  image: string; // URL returned from upload endpoint
}

interface GalleryAddProps {
  onSave: (data: GalleryFormData) => void;
  loading?: boolean;
}

export default function GalleryAdd({ onSave, loading = false }: GalleryAddProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<GalleryFormData>({ eventName: "", city: "", image: "" });
  const [preview, setPreview]       = useState<string>("");
  const [imageFile, setImageFile]   = useState<File | null>(null);
  const [uploading, setUploading]   = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file)); // local blob preview only
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const payload = new FormData();
    payload.append("file", file);
    payload.append("folder", "gallery");
    const res = await apiClient.post("/vendors/auth/upload", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data.file.url as string; // adjust key if your ApiResponse differs
  };

  const handleSave = async () => {
    if (!formData.eventName || !formData.city) return toast.error("Please fill all fields.");
    if (!imageFile && !formData.image)          return toast.error("Please upload an image.");

    try {
      let imageUrl = formData.image;
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadImage(imageFile);
        setUploading(false);
      }
      onSave({ ...formData, image: imageUrl });
    } catch {
      setUploading(false);
      toast.error("Image upload failed. Please try again.");
    }
  };

  const isBusy = uploading || loading;

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto custom-scrollbar bg-[#F8FAFC] dark:bg-black/40">
      <div className="max-w-[1700px] mx-auto px-6 py-8">
        <PageHeader title="Add to Gallery" subtitle="Upload a new event memory to your public showcase." />

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
                      Fill in the event information and upload an image.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-10 pt-8 space-y-8">
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

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Event Image</Label>
                  <div
                    onClick={() => !isBusy && fileInputRef.current?.click()}
                    className="relative h-[400px] w-full border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all overflow-hidden group"
                  >
                    {preview ? (
                      <>
                        <Image src={preview} alt="Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="secondary" className="rounded-full font-bold">Change Image</Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-center px-10">
                        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                          <ImageIcon size={40} />
                        </div>
                        <h4 className="text-lg font-black uppercase tracking-tighter">Click to Upload</h4>
                        <p className="text-xs font-bold text-gray-400 max-w-[200px] mt-1 uppercase tracking-widest">
                          Recommended size: 1200 x 800px
                        </p>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageSelect} className="hidden" accept="image/*" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8 animate-in fade-in slide-in-from-right duration-1000">
            <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <PersistenceActions
                onSave={handleSave}
                onCancel={() => router.back()}
                saveLabel={uploading ? "Uploading..." : loading ? "Saving..." : "Save Gallery"}
                isSubmitting={isBusy}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}