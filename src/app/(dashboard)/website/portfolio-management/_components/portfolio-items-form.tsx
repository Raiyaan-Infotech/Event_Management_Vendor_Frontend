"use client";

import React, { useRef, useState } from "react";
import { Upload, X, RotateCcw, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useUploadMedia } from "@/hooks/use-media";
import { useAddPortfolioItem } from "@/hooks/use-vendor-portfolio";
import { ImageCropper } from "@/components/common/ImageCropper";

interface Props {
  type: "client" | "sponsor";
}

export default function PortfolioItemsForm({ type }: Props) {
  const isClient = type === "client";
  const label = isClient ? "Client" : "Sponsor";
  const backPath = `/website/portfolio-management/${type}s`;

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePath, setImagePath] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");

  const uploadMedia = useUploadMedia();
  const addMutation = useAddPortfolioItem(type);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Image too large (max 5MB)");
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
    setPreviewUrl(croppedBase64);
    setUploading(true);
    try {
      const blob = await fetch(croppedBase64).then((r) => r.blob());
      const file = new File([blob], "logo.jpg", { type: "image/jpeg" });
      const result = await uploadMedia.mutateAsync({ file, folder: "portfolio" });
      setImagePath(result.url);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!imagePath) return toast.error("Please upload a logo image first.");
    await addMutation.mutateAsync(imagePath);
    router.push(backPath);
  };

  const handleRemoveImage = () => {
    setImagePath("");
    setPreviewUrl("");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-black p-6 space-y-6 animate-in fade-in duration-700">
      <div className="px-4 pb-2 flex items-center justify-between max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">
          Add {label} Logo
        </h1>
        <Button variant="ghost" onClick={() => router.push(backPath)} className="text-[12px] font-bold text-slate-500 hover:text-blue-600 gap-2">
          <RotateCcw size={14} className="rotate-90" /> BACK TO LIST
        </Button>
      </div>

      <div className="max-w-3xl mx-auto space-y-6 px-4">
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", isClient ? "bg-orange-50 dark:bg-orange-950/30" : "bg-purple-50 dark:bg-purple-950/30")}>
                <ImageIcon className={cn("w-5 h-5", isClient ? "text-orange-600" : "text-purple-600")} />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                  {label} Logo
                </CardTitle>
                <CardDescription className="text-xs">
                  Upload a logo image. Recommended: square PNG with transparent background.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-10 flex flex-col items-center gap-6">
            {/* Image upload zone */}
            <div
              onClick={() => !previewUrl && !uploading && fileInputRef.current?.click()}
              className={cn(
                "w-full max-w-sm aspect-square rounded-3xl border-2 border-dashed transition-all relative overflow-hidden flex flex-col items-center justify-center",
                previewUrl
                  ? "border-slate-200"
                  : cn(
                      "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800",
                      isClient ? "border-orange-200 hover:border-orange-400" : "border-purple-200 hover:border-purple-400"
                    )
              )}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className={cn("w-10 h-10 border-2 border-t-transparent rounded-full animate-spin", isClient ? "border-orange-500" : "border-purple-500")} />
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Uploading…</p>
                </div>
              ) : previewUrl ? (
                <>
                  <Image src={previewUrl} alt="Preview" fill className="object-contain p-8" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="w-10 h-10 rounded-xl bg-white text-slate-800 hover:bg-slate-100 shadow-xl"
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
                    <p className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">Click to upload logo</p>
                    <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, SVG — max 5MB</p>
                  </div>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full max-w-sm">
              <Button
                variant="ghost"
                onClick={() => router.push(backPath)}
                className="flex-1 h-12 rounded-2xl font-bold text-[12px] uppercase tracking-widest text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!imagePath || addMutation.isPending}
                className={cn(
                  "flex-1 h-12 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest transition-all disabled:opacity-50",
                  isClient
                    ? "bg-orange-500 hover:bg-orange-600 shadow-[0_10px_20px_-5px_rgba(249,115,22,0.4)]"
                    : "bg-purple-600 hover:bg-purple-700 shadow-[0_10px_20px_-5px_rgba(147,51,234,0.4)]"
                )}
              >
                {addMutation.isPending ? "Saving…" : `Save ${label}`}
              </Button>
            </div>
          </CardContent>
        </Card>
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
    </div>
  );
}
