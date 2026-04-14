"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Plus, X, Phone, Mail, MapPin, Globe, Share2, Facebook, Twitter, MessageCircle, Send, Youtube, Instagram, Linkedin, Music, Pin, Image as ImageIcon, Edit, Eye, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useVendorAbout, useUpdateVendorAbout } from "@/hooks/use-vendors";
import apiClient from "@/lib/api-client";
import { PersistenceActions } from "@/components/common/PersistenceActions";

export default function AboutCompanyPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [contactMode, setContactMode] = useState<"default" | "alternative">("default");

  const { data: vendor, isLoading } = useVendorAbout();
  const updateMutation = useUpdateVendorAbout();

  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [aboutUsContent, setAboutUsContent] = useState("");
  const [defaultContact, setDefaultContact] = useState({ mobile: "", email: "", address: "" });
  const [altContact, setAltContact] = useState({ mobile: "", alt_mobile: "", email: "", address: "", alt_address: "" });
  const [socialMedia, setSocialMedia] = useState({
    website: "", facebook: "", twitter: "", whatsapp: "",
    telegram: "", youtube: "", instagram: "", linkedin: "",
    tiktok: "", pinterest: ""
  });

  // Populate form from API data
  useEffect(() => {
    if (!vendor) return;
    setLogoImage(vendor.company_logo || null);
    setCompanyName(vendor.company_name || "");
    setAboutUsContent(vendor.about_us || "");
    setDefaultContact({
      mobile: vendor.company_contact || "",
      email: vendor.company_email || "",
      address: vendor.company_address || "",
    });
    
    setAltContact({
      mobile:      vendor.contact      || "",
      alt_mobile:  vendor.alt_contact  || "",
      email:       vendor.alt_email    || "",
      address:     vendor.address      || "",
      alt_address: vendor.alt_address  || "",
    });
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'vendors');
      const res = await apiClient.post('/vendors/auth/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data.data?.file?.url || res.data.data?.url;
      if (url) setLogoImage(url);
    } catch {
      toast.error('Failed to upload logo');
    }
  };

  const handleSave = async () => {
    // If logoImage is base64 (data:...), upload it first to get a proper URL
    let logoUrl: string | undefined = logoImage ?? undefined;
    if (logoUrl?.startsWith('data:')) {
      try {
        const blob = await fetch(logoUrl).then(r => r.blob());
        const fd = new FormData();
        fd.append('file', blob, 'logo.jpg');
        fd.append('folder', 'vendors');
        const res = await apiClient.post('/vendors/auth/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        logoUrl = res.data.data?.file?.url || res.data.data?.url || undefined;
        if (logoUrl) setLogoImage(logoUrl);
      } catch {
        toast.error('Failed to upload logo');
        return;
      }
    }

    await updateMutation.mutateAsync({
      company_name:    companyName,
      company_logo:    logoUrl,
      about_us:        aboutUsContent,
      company_contact: defaultContact.mobile,
      company_email:   defaultContact.email,
      company_address: defaultContact.address,
      contact:         altContact.mobile,
      alt_contact:     altContact.alt_mobile,
      alt_email:       altContact.email,
      address:         altContact.address,
      alt_address:     altContact.alt_address,
      ...socialMedia,
    } as never);
    setIsEditing(false);
  };

  const handleReset = () => {
    if (!vendor) return;
    setLogoImage(vendor.company_logo || null);
    setCompanyName(vendor.company_name || "");
    setAboutUsContent(vendor.about_us || "");
    setDefaultContact({
      mobile: vendor.company_contact || "",
      email: vendor.company_email || "",
      address: vendor.company_address || "",
    });
    setAltContact({
      mobile:      vendor.contact      || "",
      alt_mobile:  vendor.alt_contact  || "",
      email:       vendor.alt_email    || "",
      address:     vendor.address      || "",
      alt_address: vendor.alt_address  || "",
    });
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
    toast.info("All settings reset.");
  };

  const city = vendor?.locality?.name ?? "";

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
        <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1">About Company</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your company info and social links.</p>
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Area */}
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
                  className="h-12 bg-gray-50/50 dark:bg-[#1e1e1e] border-gray-200 dark:border-gray-800 rounded-xl disabled:opacity-80"
                />
              </div>
            </div>
          </div>

          {/* About Us */}
          <div className="bg-white dark:bg-sidebar p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-none">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About Us</h3>
            <RichTextEditor
              key={vendor ? vendor.id : 'loading'}
              value={aboutUsContent}
              onChange={setAboutUsContent}
              placeholder="Write your company's story here..."
              height="400px"
              readOnly={!isEditing}
            />
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-sidebar p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-none">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Contact Info [Header | Footer]</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Default Contact */}
              <div
                onClick={() => isEditing && setContactMode("default")}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  isEditing ? "cursor-pointer" : "cursor-default"
                } ${
                  isEditing
                    ? contactMode === "default"
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/5 scale-[1.02]"
                      : "border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/5 opacity-60 hover:opacity-100 hover:border-gray-200"
                    : "border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  {isEditing && (
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${contactMode === "default" ? "border-primary bg-primary" : "border-gray-300 dark:border-gray-600"}`}>
                      {contactMode === "default" && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
                    </div>
                  )}
                  <span className={`text-sm font-bold transition-colors ${isEditing && contactMode === "default" ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}>Default Contact Info</span>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2"><Phone className="size-2.5" /> MOBILE</Label>
                    <Input value={defaultContact.mobile} onChange={(e) => setDefaultContact({...defaultContact, mobile: e.target.value})} disabled={!isEditing} placeholder="Enter Mobile Number..." className="h-10 text-xs bg-white dark:bg-[#121212] border-gray-100 dark:border-gray-800 rounded-lg font-medium" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2"><Mail className="size-2.5" /> EMAIL</Label>
                    <Input value={defaultContact.email} onChange={(e) => setDefaultContact({...defaultContact, email: e.target.value})} disabled={!isEditing} placeholder="Enter Email ID..." className="h-10 text-xs bg-white dark:bg-[#121212] border-gray-100 dark:border-gray-800 rounded-lg font-medium" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2"><MapPin className="size-2.5" /> ADDRESS</Label>
                    <Textarea value={defaultContact.address} onChange={(e) => setDefaultContact({...defaultContact, address: e.target.value})} disabled={!isEditing} placeholder="Enter Address..." className="min-h-[80px] text-xs bg-white dark:bg-[#121212] border-gray-100 dark:border-gray-800 rounded-lg resize-none leading-relaxed font-medium" />
                  </div>
                </div>
              </div>

              {/* Alternative Contact */}
              <div
                onClick={() => isEditing && setContactMode("alternative")}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  isEditing ? "cursor-pointer" : "cursor-default"
                } ${
                  isEditing
                    ? contactMode === "alternative"
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/5 scale-[1.02]"
                      : "border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/5 opacity-60 hover:opacity-100 hover:border-gray-200"
                    : "border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  {isEditing && (
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${contactMode === "alternative" ? "border-primary bg-primary" : "border-gray-300 dark:border-gray-600"}`}>
                      {contactMode === "alternative" && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
                    </div>
                  )}
                  <span className={`text-sm font-bold transition-colors ${isEditing && contactMode === "alternative" ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}>Alternative Contact Info</span>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2"><Phone className="size-2.5" /> MOBILE</Label>
                    <Input value={altContact.mobile} onChange={(e) => setAltContact({...altContact, mobile: e.target.value})} disabled={!isEditing} placeholder="Enter Mobile Number..." className="h-10 text-xs bg-white dark:bg-[#121212] border-gray-100 dark:border-gray-800 rounded-lg font-medium" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2"><Mail className="size-2.5" /> EMAIL</Label>
                    <Input value={altContact.email} onChange={(e) => setAltContact({...altContact, email: e.target.value})} disabled={!isEditing} placeholder="Enter Email ID..." className="h-10 text-xs bg-white dark:bg-[#121212] border-gray-100 dark:border-gray-800 rounded-lg font-medium" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2"><MapPin className="size-2.5" /> ADDRESS</Label>
                    <Textarea value={altContact.address} onChange={(e) => setAltContact({...altContact, address: e.target.value})} disabled={!isEditing} placeholder="Enter Address..." className="min-h-[80px] text-xs bg-white dark:bg-[#121212] border-gray-100 dark:border-gray-800 rounded-lg resize-none leading-relaxed font-medium" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Card */}
          <div className="bg-white dark:bg-sidebar p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-none">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                <Share2 size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Social Media</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {[
                { id: "website",   label: "Website",     icon: Globe,          color: "text-blue-500",                          placeholder: "https://company.com" },
                { id: "youtube",   label: "YouTube",     icon: Youtube,        color: "text-red-600",                           placeholder: "https://youtube.com/channel/..." },
                { id: "facebook",  label: "Facebook",    icon: Facebook,       color: "text-blue-600",                          placeholder: "https://facebook.com/..." },
                { id: "instagram", label: "Instagram",   icon: Instagram,      color: "text-pink-600",                          placeholder: "https://instagram.com/..." },
                { id: "twitter",   label: "Twitter / X", icon: Twitter,        color: "text-gray-900 dark:text-gray-100",       placeholder: "https://x.com/..." },
                { id: "linkedin",  label: "LinkedIn",    icon: Linkedin,       color: "text-blue-700",                          placeholder: "https://linkedin.com/company/..." },
                { id: "whatsapp",  label: "WhatsApp",    icon: MessageCircle,  color: "text-green-500",                         placeholder: "+91 9000000000 or wa.me link" },
                { id: "tiktok",    label: "TikTok",      icon: Music,          color: "text-black dark:text-white",             placeholder: "https://tiktok.com/@..." },
                { id: "telegram",  label: "Telegram",    icon: Send,           color: "text-blue-400",                          placeholder: "https://t.me/..." },
                { id: "pinterest", label: "Pinterest",   icon: Pin,            color: "text-red-500",                           placeholder: "https://pinterest.com/..." },
              ].map((platform) => (
                <div key={platform.id} className="space-y-2 group">
                  <div className="flex items-center gap-2">
                    <platform.icon className={`size-4 ${platform.color} transition-transform group-focus-within:scale-110`} />
                    <Label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{platform.label}</Label>
                  </div>
                  <Input
                    value={socialMedia[platform.id as keyof typeof socialMedia]}
                    onChange={(e) => setSocialMedia({...socialMedia, [platform.id]: e.target.value})}
                    disabled={!isEditing}
                    placeholder={platform.placeholder}
                    className="h-11 bg-white dark:bg-[#121212] border-gray-100 dark:border-gray-800 rounded-xl font-medium focus:border-primary/30 transition-all text-sm disabled:opacity-80"
                  />
                </div>
              ))}
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
              {isEditing ? <Eye className="size-4" /> : <Edit className="size-4" />}
              {isEditing ? "PREVIEW" : "EDIT"}
            </Button>

            <PersistenceActions 
              onSave={handleSave}
              onReset={handleReset}
              onCancel={() => router.push("/website/management")}
              saveLabel={updateMutation.isPending ? "SAVING..." : "UPDATE"}
              isSubmitting={updateMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
