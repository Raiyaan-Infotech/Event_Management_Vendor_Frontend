"use client";

import React, { useRef, useState, useEffect } from "react";
import { Trash2, Users, Award, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { resolveMediaUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useUploadMedia } from "@/hooks/use-media";
import {
  usePortfolioItem,
  useUpdatePortfolioItem,
} from "@/hooks/use-vendor-portfolio";

interface Props {
  type: "client" | "sponsor";
  id: number;
}

export default function PortfolioItemsEdit({ type, id }: Props) {
  const isClient = type === "client";
  const label = isClient ? "Client" : "Sponsor";
  const backPath = `/website/portfolio-management/${type}s`;

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePath, setImagePath] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const { data: item, isLoading } = usePortfolioItem(type, id);
  const updateMutation = useUpdatePortfolioItem(type);
  const uploadMedia = useUploadMedia();

  useEffect(() => {
    if (item?.image_path) {
      setImagePath(item.image_path);
    }
  }, [item]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Image too large (max 5MB)");

    const blobUrl = URL.createObjectURL(file);
    setPreviewUrl(blobUrl);
    e.target.value = "";

    setUploading(true);
    try {
      const result = await uploadMedia.mutateAsync({ file, folder: "portfolio" });
      setImagePath(result.url);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setImagePath("");
  };

  const handleSave = async () => {
    if (!imagePath) return toast.error("Please select a logo image first.");
    await updateMutation.mutateAsync({ id, image_path: imagePath });
    router.push(backPath);
  };

  const displayUrl = previewUrl || (imagePath ? resolveMediaUrl(imagePath) : "");

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
                      Edit {label}
                    </CardTitle>
                    <CardDescription className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                      Replace the current logo with a new image.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-10 pt-8 flex flex-col items-center gap-6">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {isLoading ? (
                  <div className="w-full max-w-sm aspect-square rounded-3xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                ) : (
                  <div
                    onClick={() => !displayUrl && !uploading && fileInputRef.current?.click()}
                    className={cn(
                      "w-full max-w-sm aspect-square rounded-3xl border-2 border-dashed transition-all relative overflow-hidden flex flex-col items-center justify-center",
                      displayUrl
                        ? "border-gray-200 dark:border-white/10"
                        : cn(
                            "cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5",
                            isClient ? "border-orange-200 hover:border-orange-400" : "border-purple-200 hover:border-purple-400"
                          )
                    )}
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className={cn("w-10 h-10 border-2 border-t-transparent rounded-full animate-spin", isClient ? "border-orange-500" : "border-purple-500")} />
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Uploading…</p>
                      </div>
                    ) : displayUrl ? (
                      <>
                        {previewUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={displayUrl} alt="Preview" className="absolute inset-0 w-full h-full object-contain p-8" />
                        ) : (
                          <Image src={displayUrl} alt="Logo" fill className="object-contain p-8" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <Button
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                            className="w-10 h-10 rounded-xl bg-white text-gray-800 hover:bg-gray-100 shadow-xl"
                          >
                            <Upload size={18} />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                            className="w-10 h-10 rounded-xl shadow-xl"
                          >
                            <X size={18} />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-4 p-8 text-center">
                        <div className={cn("p-5 rounded-2xl", isClient ? "bg-orange-50 text-orange-500" : "bg-purple-50 text-purple-500")}>
                          <Upload size={32} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-tight">Click to upload logo</p>
                          <p className="text-[11px] text-gray-400 mt-1">PNG, JPG, SVG — max 5MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8 animate-in fade-in slide-in-from-right duration-1000">
            <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <PersistenceActions
                onSave={handleSave}
                onCancel={() => router.push(backPath)}
                onPreview={() => toast.info("Preview coming soon!")}
                saveLabel={updateMutation.isPending ? "Saving…" : "Update Logo"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
