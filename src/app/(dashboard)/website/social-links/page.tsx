"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Globe, Facebook, Twitter, MessageCircle, Send,
  Youtube, Instagram, Linkedin, Music, Pin, Share2,
  Edit, Eye, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useVendorAbout, useUpdateVendorAbout } from "@/hooks/use-vendors";
import { PersistenceActions } from "@/components/common/PersistenceActions";

const PLATFORMS = [
  { id: "website",   label: "Website",     icon: Globe,         color: "text-blue-500",                    placeholder: "https://company.com" },
  { id: "youtube",   label: "YouTube",     icon: Youtube,       color: "text-red-600",                     placeholder: "https://youtube.com/channel/..." },
  { id: "facebook",  label: "Facebook",    icon: Facebook,      color: "text-blue-600",                    placeholder: "https://facebook.com/..." },
  { id: "instagram", label: "Instagram",   icon: Instagram,     color: "text-pink-600",                    placeholder: "https://instagram.com/..." },
  { id: "twitter",   label: "Twitter / X", icon: Twitter,       color: "text-gray-900 dark:text-gray-100", placeholder: "https://x.com/..." },
  { id: "linkedin",  label: "LinkedIn",    icon: Linkedin,      color: "text-blue-700",                    placeholder: "https://linkedin.com/company/..." },
  { id: "whatsapp",  label: "WhatsApp",    icon: MessageCircle, color: "text-green-500",                   placeholder: "+91 9000000000 or wa.me link" },
  { id: "tiktok",    label: "TikTok",      icon: Music,         color: "text-black dark:text-white",       placeholder: "https://tiktok.com/@..." },
  { id: "telegram",  label: "Telegram",    icon: Send,          color: "text-blue-400",                    placeholder: "https://t.me/..." },
  { id: "pinterest", label: "Pinterest",   icon: Pin,           color: "text-red-500",                     placeholder: "https://pinterest.com/..." },
] as const;

type SocialFields = Record<typeof PLATFORMS[number]["id"], string>;

const EMPTY_SOCIAL: SocialFields = {
  website: "", facebook: "", twitter: "", whatsapp: "",
  telegram: "", youtube: "", instagram: "", linkedin: "",
  tiktok: "", pinterest: "",
};

export default function SocialLinksPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [socialMedia, setSocialMedia] = useState<SocialFields>(EMPTY_SOCIAL);

  const { data: vendor, isLoading } = useVendorAbout();
  const updateMutation = useUpdateVendorAbout();

  // Populate from API
  useEffect(() => {
    if (!vendor) return;
    setSocialMedia({
      website:   vendor.website   || "",
      facebook:  vendor.facebook  || "",
      twitter:   vendor.twitter   || "",
      whatsapp:  vendor.whatsapp  || "",
      telegram:  vendor.telegram  || "",
      youtube:   vendor.youtube   || "",
      instagram: vendor.instagram || "",
      linkedin:  vendor.linkedin  || "",
      tiktok:    vendor.tiktok    || "",
      pinterest: vendor.pinterest || "",
    });
  }, [vendor]);

  const handleSave = async () => {
    await updateMutation.mutateAsync(socialMedia as never);
    setIsEditing(false);
    toast.success("Social links updated.");
  };

  const handleReset = () => {
    if (!vendor) return;
    setSocialMedia({
      website:   vendor.website   || "",
      facebook:  vendor.facebook  || "",
      twitter:   vendor.twitter   || "",
      whatsapp:  vendor.whatsapp  || "",
      telegram:  vendor.telegram  || "",
      youtube:   vendor.youtube   || "",
      instagram: vendor.instagram || "",
      linkedin:  vendor.linkedin  || "",
      tiktok:    vendor.tiktok    || "",
      pinterest: vendor.pinterest || "",
    });
    toast.info("Social links reset.");
  };

  // Count how many links are filled in
  const filledCount = Object.values(socialMedia).filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-86px)] flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar">
      {/* Page Header */}
      <div className="max-w-[1700px] mx-auto mb-8">
        <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1">Social Links</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your social media and web presence.{" "}
          {filledCount > 0 && (
            <span className="text-primary font-semibold">{filledCount} of {PLATFORMS.length} linked</span>
          )}
        </p>
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Card */}
        <div className="lg:col-span-9">
          <div className="bg-white dark:bg-sidebar p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-none">

            {/* Card Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                <Share2 size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Social Media</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  These links appear in your website header and footer.
                </p>
              </div>
            </div>

            {/* Platform Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {PLATFORMS.map((platform) => (
                <div key={platform.id} className="space-y-2 group">
                  <div className="flex items-center gap-2">
                    <platform.icon
                      className={`size-4 ${platform.color} transition-transform group-focus-within:scale-110`}
                    />
                    <Label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                      {platform.label}
                    </Label>
                    {/* Active indicator dot */}
                    {socialMedia[platform.id] && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400" />
                    )}
                  </div>
                  <Input
                    value={socialMedia[platform.id]}
                    onChange={(e) =>
                      setSocialMedia({ ...socialMedia, [platform.id]: e.target.value })
                    }
                    disabled={!isEditing}
                    placeholder={platform.placeholder}
                    className="h-11 bg-white dark:bg-[#121212] border-gray-100 dark:border-gray-800 rounded-xl font-medium focus:border-primary/30 transition-all text-sm disabled:opacity-80"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Sidebar */}
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
              {isEditing ? <Eye className="size-4" /> : <Edit className="size-4" />}
              {isEditing ? "PREVIEW" : "EDIT"}
            </Button>

            <Button
              onClick={() => {
                const url = vendor?.website;
                if (url) window.open(url, "_blank");
                else toast.info("No website URL set.");
              }}
              className="w-full h-12 font-bold text-[13px] tracking-[0.1em] uppercase rounded-2xl shadow-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <ExternalLink className="size-4" />
              PREVIEW
            </Button>

            <PersistenceActions
              onSave={handleSave}
              onReset={handleReset}
              onCancel={() => router.push("/website/management")}
              saveLabel={updateMutation.isPending ? "SAVING..." : "UPDATE"}
              isSubmitting={updateMutation.isPending}
            />
          </div>

          {/* Quick stats panel */}
          <div className="bg-white dark:bg-sidebar/50 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Connected</p>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.filter((p) => socialMedia[p.id]).map((p) => (
                <div key={p.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-white/5">
                  <p.icon className={`size-3 ${p.color}`} />
                  <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">{p.label}</span>
                </div>
              ))}
              {filledCount === 0 && (
                <p className="text-xs text-gray-400">No links added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}