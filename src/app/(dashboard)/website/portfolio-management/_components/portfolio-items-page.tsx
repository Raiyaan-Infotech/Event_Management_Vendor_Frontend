"use client";

import React, { useRef, useState } from "react";
import { Trash2, Users, Award, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { resolveMediaUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useUploadMedia } from "@/hooks/use-media";
import {
  usePortfolioItems,
  useAddPortfolioItem,
  useTogglePortfolioItemStatus,
  useDeletePortfolioItem,
  PortfolioItem,
} from "@/hooks/use-vendor-portfolio";
import { ImageCropper } from "@/components/common/ImageCropper";

interface Props {
  type: "client" | "sponsor";
}

export default function PortfolioItemsPage({ type }: Props) {
  const isClient = type === "client";
  const label = isClient ? "Client" : "Sponsor";

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [itemToDelete, setItemToDelete] = useState<PortfolioItem | null>(null);
  const [pendingPreviews, setPendingPreviews] = useState<{ id: string; previewUrl: string; uploading: boolean; error: boolean }[]>([]);

  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");

  const { data: items = [], isLoading } = usePortfolioItems(type);
  const addMutation = useAddPortfolioItem(type);
  const toggleStatus = useTogglePortfolioItemStatus(type);
  const deleteMutation = useDeletePortfolioItem(type);
  const uploadMedia = useUploadMedia();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${file.name} is too large (max 5MB)`);
      return;
    }
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
    const previewId = `crop-${Date.now()}`;
    setPendingPreviews((prev) => [...prev, { id: previewId, previewUrl: croppedBase64, uploading: true, error: false }]);
    try {
      const blob = await fetch(croppedBase64).then((r) => r.blob());
      const file = new File([blob], "logo.jpg", { type: "image/jpeg" });
      const result = await uploadMedia.mutateAsync({ file, folder: "portfolio" });
      await addMutation.mutateAsync(result.url);
      setPendingPreviews((prev) => prev.filter((p) => p.id !== previewId));
    } catch {
      setPendingPreviews((prev) =>
        prev.map((p) => p.id === previewId ? { ...p, uploading: false, error: true } : p)
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    await deleteMutation.mutateAsync(itemToDelete.id);
    setItemToDelete(null);
  };

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto custom-scrollbar bg-[#F8FAFC] dark:bg-black/40">
      <div className="max-w-[1700px] mx-auto px-6 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">

          {/* MAIN CARD */}
          <div className="lg:col-span-9 animate-in fade-in slide-in-from-bottom duration-700">
            <Card className="border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none bg-white dark:bg-sidebar rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-10 pb-0">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    isClient ? "bg-orange-500/10 text-orange-600" : "bg-purple-500/10 text-purple-600"
                  )}>
                    {isClient ? <Users size={24} /> : <Award size={24} />}
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tighter">
                      {label}s
                    </CardTitle>
                    <CardDescription className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                      Add logos of organizations you&apos;ve worked with (max 10).
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-10 pt-8">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleUpload}
                  accept="image/*"
                  className="hidden"
                />

                {isLoading ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="aspect-square rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {/* Existing logo tiles */}
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="group relative aspect-square rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all"
                      >
                        <Image
                          src={resolveMediaUrl(item.image_path)}
                          alt={`${label} logo`}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Delete overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => setItemToDelete(item)}
                            className="w-8 h-8 rounded-xl shadow-xl"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                        {/* Status badge */}
                        <button
                          onClick={() => toggleStatus.mutate(item.id)}
                          className="absolute top-1.5 right-1.5 z-10"
                          title="Toggle active"
                        >
                          <Badge className={cn(
                            "text-[9px] font-black px-1.5 py-0.5 rounded-full border-none cursor-pointer",
                            item.is_active ? "bg-emerald-500 text-white" : "bg-gray-300 text-gray-600"
                          )}>
                            {item.is_active ? "ON" : "OFF"}
                          </Badge>
                        </button>
                      </div>
                    ))}

                    {/* Pending preview tiles */}
                    {pendingPreviews.map((p) => (
                      <div key={p.id} className="relative aspect-square rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.previewUrl} alt="preview" className="w-full h-full object-contain p-4" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          {p.uploading ? (
                            <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin" />
                          ) : (
                            <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Error</span>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Add tile */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group"
                    >
                      <div className="w-9 h-9 rounded-full border-2 border-gray-300 group-hover:border-gray-500 flex items-center justify-center transition-colors">
                        <Plus size={16} className="text-gray-400 group-hover:text-gray-600" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-600">
                        Add {label}
                      </span>
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8 animate-in fade-in slide-in-from-right duration-1000">
            <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <PersistenceActions
                onSave={() => {
                  toast.success(`${label} logos saved!`);
                  router.push(`/website/portfolio-management/${type}s`);
                }}
                onCancel={() => router.push(`/website/portfolio-management/${type}s`)}
                onPreview={() => toast.info("Preview coming soon!")}
                saveLabel="Save"
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
        aspectRatio={1}
        outputWidth={400}
        outputHeight={400}
      />

      {/* Delete confirmation */}
      <Dialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <DialogContent className="sm:max-w-[420px] rounded-[40px] p-0 overflow-hidden border-none shadow-2xl shadow-rose-900/10">
          <div className="bg-gradient-to-b from-rose-50 to-white dark:from-rose-500/10 dark:to-[#111827] p-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-white dark:bg-gray-800 flex items-center justify-center text-rose-500 shadow-[0_15px_30px_-10px_rgba(225,29,72,0.3)] mb-8 animate-in zoom-in duration-500">
              <Trash2 size={40} strokeWidth={2.5} />
            </div>
            <DialogTitle className="text-2xl font-black text-gray-800 dark:text-gray-100 uppercase tracking-tighter">
              Remove {label}?
            </DialogTitle>
            <DialogDescription className="mt-4 text-gray-500 dark:text-gray-400 font-bold text-sm leading-relaxed">
              This logo will be permanently removed from your portfolio.
            </DialogDescription>
          </div>
          <DialogFooter className="p-8 bg-gray-50/50 dark:bg-gray-900 flex flex-row gap-4 border-t border-gray-50 dark:border-gray-800">
            <Button
              variant="ghost"
              onClick={() => setItemToDelete(null)}
              className="flex-1 h-12 rounded-2xl font-bold text-[12px] uppercase tracking-widest text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-[0_10px_20px_-5px_rgba(225,29,72,0.4)] hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-70"
            >
              {deleteMutation.isPending ? "Removing..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
