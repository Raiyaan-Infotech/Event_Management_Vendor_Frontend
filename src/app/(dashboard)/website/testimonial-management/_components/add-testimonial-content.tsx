"use client";

import React, { useState, useRef } from "react";
import {
  Star,
  User,
  Calendar,
  Upload,
  X,
  ArrowLeft
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import QuillEditor from "@/components/ui/quill-editor";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { useAddTestimonial } from "@/hooks/use-testimonials";

export default function AddTestimonialContent() {
  const router  = useRouter();
  const addItem = useAddTestimonial();

  const [formData, setFormData] = useState({
    customer_name:     "",
    event_name:        "",
    client_feedback:   "",
    is_active:         true,
  });
  const [preview,   setPreview]   = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const payload = new FormData();
    payload.append("file", file);
    payload.append("folder", "testimonials");
    const res = await apiClient.post("/vendors/auth/upload", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data.file.url as string;
  };

  const handleSave = async () => {
    if (!formData.customer_name) return toast.error("Customer name is required.");
    if (!formData.client_feedback) return toast.error("Client feedback is required.");

    try {
      let portraitUrl = "";
      if (imageFile) {
        setUploading(true);
        portraitUrl = await uploadImage(imageFile);
        setUploading(false);
      }

      addItem.mutate(
        {
          customer_name:     formData.customer_name,
          event_name:        formData.event_name,
          client_feedback:   formData.client_feedback,
          customer_portrait: portraitUrl,
        },
        { onSuccess: () => router.push("/website/testimonial-management") },
      );
    } catch {
      setUploading(false);
      toast.error("Image upload failed. Please try again.");
    }
  };

  const isBusy = uploading || addItem.isPending;

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar bg-[#F8FAFC] dark:bg-black">
      <div className="max-w-[1700px] mx-auto mb-10 space-y-6">
        <Link href="/website/testimonial-management">
          <Button variant="ghost" className="w-fit text-gray-500 hover:text-blue-600 gap-2 p-0 h-auto font-bold uppercase tracking-widest text-[10px]">
            <ArrowLeft size={16} /> Back to Listings
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 shadow-sm border border-orange-500/10">
            <Star size={28} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white font-poppins uppercase tracking-tighter">Add New Testimonial</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">Enter the details of the client feedback to showcase on your website.</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom duration-1000 pb-20">

        {/* LEFT: FORM FIELDS (9 Columns) */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white dark:bg-sidebar p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
              <div className="space-y-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Customer Name <span className="text-rose-500">*</span></Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <Input
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="h-14 pl-12 rounded-2xl border-gray-200 bg-gray-50/10 focus:bg-white transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Event Name</Label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                    <Input
                      value={formData.event_name}
                      onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                      placeholder="e.g. Wedding Ceremony"
                      className="h-14 pl-12 rounded-2xl border-gray-200 bg-gray-50/10 focus:bg-white transition-all font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 flex flex-col h-full">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Customer Portrait</Label>
                <div
                  onClick={() => !preview && fileInputRef.current?.click()}
                  className={cn(
                    "w-full rounded-[2.5rem] border-2 border-dashed transition-all p-1 relative flex flex-col items-center justify-center overflow-hidden min-h-[180px]",
                    preview
                      ? "border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-500/5 group"
                      : "border-gray-200 dark:border-gray-800 bg-gray-50/30 hover:bg-gray-50 cursor-pointer"
                  )}
                >
                  {preview ? (
                    <div className="relative w-full h-full min-h-[180px] flex items-center justify-center">
                      <Image src={preview} alt="Customer" fill className="object-cover rounded-[2.3rem]" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="destructive" size="icon" onClick={(e) => { e.stopPropagation(); setPreview(""); setImageFile(null); }} className="w-12 h-12 rounded-2xl">
                          <X size={20} />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-5 text-center">
                      <div className="w-24 h-24 rounded-[2rem] bg-white dark:bg-sidebar shadow-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-all duration-500">
                        <Upload size={40} />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-800 dark:text-gray-200">Upload Customer Photo</p>
                        <p className="text-[9px] font-bold text-gray-400 mt-2 uppercase tracking-widest">Recommended: 1:1 Aspect Ratio</p>
                      </div>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageSelect} className="hidden" accept="image/*" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Client Feedback <span className="text-rose-500">*</span></Label>
              <QuillEditor
                value={formData.client_feedback}
                onChange={({ html }) => setFormData({ ...formData, client_feedback: html })}
                placeholder="Share what the client said about your service..."
                height="280px"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: ACTIONS & STATUS (3 Columns) */}
        <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8">
          <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <PersistenceActions
              onSave={handleSave}
              onCancel={() => router.push("/website/testimonial-management")}
              saveLabel={uploading ? "Uploading..." : isBusy ? "Saving..." : "Save"}
              isSubmitting={isBusy}
            />
          </div>

          <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
            <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Visibility Status</Label>
            <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 transition-all">
              <span className={cn("text-xs font-bold uppercase tracking-widest", formData.is_active ? "text-emerald-500" : "text-gray-400")}>
                {formData.is_active ? "Showing" : "Hidden"}
              </span>
              <Switch checked={formData.is_active} onCheckedChange={(v) => setFormData({ ...formData, is_active: v })} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
