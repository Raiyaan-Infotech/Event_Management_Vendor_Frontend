"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Image as ImageIcon, Edit } from "lucide-react";
import { toast } from "sonner";
import { useVendorAbout, useUpdateVendorAbout } from "@/hooks/use-vendors";
import apiClient from "@/lib/api-client";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import { ImageCropper } from "@/components/common/ImageCropper";
import { WebsiteSettingsPageSkeleton } from "@/components/boneyard/website-settings-page-skeleton";

export default function HeaderPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const { data: vendor, isLoading } = useVendorAbout();
  const updateMutation = useUpdateVendorAbout();

  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");

  // Populate form from API data
  useEffect(() => {
    if (!vendor) return;
    setLogoImage(vendor.company_logo || null);
    setCompanyName(vendor.company_name || "");
  }, [vendor]);

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
    try {
      const blob = await fetch(croppedBase64).then((r) => r.blob());
      const fd = new FormData();
      fd.append("file", new File([blob], "logo.jpg", { type: "image/jpeg" }));
      fd.append("folder", "vendors");
      const res = await apiClient.post("/vendors/auth/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.data?.file?.url || res.data.data?.url;
      if (url) setLogoImage(url);
    } catch {
      toast.error("Failed to upload logo");
    }
  };

  const handleSave = async () => {
    let logoUrl: string | undefined = logoImage ?? undefined;
    if (logoUrl?.startsWith("data:")) {
      try {
        const blob = await fetch(logoUrl).then((r) => r.blob());
        const fd = new FormData();
        fd.append("file", blob, "logo.jpg");
        fd.append("folder", "vendors");
        const res = await apiClient.post("/vendors/auth/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        logoUrl = res.data.data?.file?.url || res.data.data?.url || undefined;
        if (logoUrl) setLogoImage(logoUrl);
      } catch {
        toast.error("Failed to upload logo");
        return;
      }
    }

    await updateMutation.mutateAsync({
      company_name: companyName,
      company_logo: logoUrl,
    } as never);
    setIsEditing(false);
  };

  const handleReset = () => {
    if (!vendor) return;
    setLogoImage(vendor.company_logo || null);
    setCompanyName(vendor.company_name || "");
    toast.info("All settings reset.");
  };

  const city = vendor?.locality?.name ?? "";

  if (isLoading) return <WebsiteSettingsPageSkeleton />;

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar">
      {/* Page Header */}
      <div className="max-w-[1700px] mx-auto mb-8">
        <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1">Header</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your company logo, name, and city.</p>
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">

          {/* Identity & Branding Card */}
          <div className="bg-white dark:bg-sidebar p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-none">
            <div className="mb-8 flex flex-col md:flex-row items-center justify-center gap-6 w-full px-4">

              {/* Current logo preview */}
              <div className="group relative w-full max-w-[400px] aspect-[4/1] md:aspect-[3/1] rounded-3xl overflow-hidden bg-white dark:bg-[#121212] border-2 border-dashed border-gray-200 dark:border-white/10 shadow-sm flex-grow select-none">
                {!logoImage ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-50/50 dark:bg-white/2">
                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-sidebar flex items-center justify-center text-gray-400 dark:text-gray-500 shadow-sm border border-gray-100 dark:border-white/5">
                      <ImageIcon size={20} />
                    </div>
                    <p className="text-[8px] text-gray-400/60 dark:text-gray-500/60">Recommended: 300 x 100 px</p>
                  </div>
                ) : (
                  <Image src={logoImage} alt="Logo Preview" fill className="object-cover" />
                )}
              </div>

              {/* Logo upload */}
              <div
                onClick={() => isEditing && document.getElementById("logo-upload")?.click()}
                className={`group relative w-full max-w-[400px] aspect-[4/1] md:aspect-[3/1] rounded-3xl overflow-hidden transition-all duration-500 bg-white dark:bg-[#121212] flex-grow ${
                  !isEditing ? "cursor-default brightness-95" : "cursor-pointer"
                } border-2 border-dashed border-gray-200 dark:border-white/10 shadow-sm hover:border-primary/50`}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-50/50 dark:bg-white/2 transition-colors group-hover:bg-primary/5">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-sidebar flex items-center justify-center text-gray-400 dark:text-gray-500 shadow-sm border border-gray-100 dark:border-white/5 transition-all duration-500 group-hover:scale-110 group-hover:text-primary group-hover:shadow-primary/20">
                    {logoImage ? <ImageIcon size={20} className="text-primary" /> : <Plus size={20} />}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Upload Image</p>
                  <p className="text-[8px] text-gray-400/60 dark:text-gray-500/60">Recommended: 300 x 100 px</p>
                </div>
                <input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-900 dark:text-white">Company Name</Label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={!isEditing}
                  className="h-12 bg-gray-50/50 focus:bg-white dark:bg-[#1e1e1e] border-gray-200 dark:border-gray-800 rounded-xl transition-all disabled:opacity-80"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-900 dark:text-white">City</Label>
                <Input
                  value={city}
                  disabled
                  readOnly
                  className="h-12 bg-gray-50/50 dark:bg-[#1e1e1e] border-gray-200 dark:border-gray-800 rounded-xl cursor-not-allowed opacity-60"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Sticky Sidebar Actions */}
        <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-8">
          <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className={`w-full h-12 font-bold text-[13px] tracking-[0.1em] uppercase rounded-2xl shadow-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 ${
                isEditing
                  ? "bg-amber-500 text-white border-none hover:bg-amber-600 shadow-amber-500/20"
                  : "bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
            >
              <Edit className="size-4" />
              EDIT
            </Button>

            <PersistenceActions
              onSave={handleSave}
              onPreview={() => window.open("/preview", "_blank")}
              onReset={handleReset}
              onCancel={() => router.push("/website/management")}
              saveLabel={updateMutation.isPending ? "SAVING..." : "UPDATE"}
              isSubmitting={updateMutation.isPending}
            />
          </div>
        </div>
      </div>

      <ImageCropper
        open={cropperOpen}
        imageSrc={imageToCrop}
        onClose={() => setCropperOpen(false)}
        onCropComplete={handleCropComplete}
        aspectRatio={3}
        outputWidth={900}
        outputHeight={300}
      />
    </div>
  );
}
