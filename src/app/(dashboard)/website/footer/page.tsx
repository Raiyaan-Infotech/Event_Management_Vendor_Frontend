"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import { WebsiteSettingsPageSkeleton } from "@/components/boneyard/website-settings-page-skeleton";
import {
  Plus,
  X,
  Phone,
  Mail,
  MapPin,
  Image as ImageIcon,
  Upload,
  Layout,
  Check,
  Search,
  Copyright,
  Trash2,
  Share2,
  ExternalLink,
  Link as LinkIcon,
  FileText,
  GripVertical,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import * as LucideIcons from "lucide-react";
import { toast } from "sonner";
import { useVendorAbout, useUpdateVendorAbout } from "@/hooks/use-vendors";
import { useVendorPages } from "@/hooks/use-vendor-pages";
import { useVendorSocialLinks, useToggleSocialLink } from "@/hooks/use-vendor-social-links";
import { useVendorHomeBlocks } from "@/hooks/use-vendor-home-blocks";
import apiClient from "@/lib/api-client";

// ─── Social icon renderer ─────────────────────────────────────────────────────
const lucideIconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = Object.fromEntries(
  Object.entries(LucideIcons)
    .filter(([k]) => /^[A-Z]/.test(k))
    .map(([k, v]) => [k.toLowerCase(), v as React.ComponentType<{ className?: string; style?: React.CSSProperties }>])
);
function SocialIcon({ name, color }: { name?: string | null; color?: string | null }) {
  if (!name) return <Share2 className="size-4 text-gray-400" />;
  const style = color ? { color } : undefined;
  if (name.includes(":")) return <Icon icon={name} className="size-4" style={style} />;
  const LucideIcon = lucideIconMap[name.toLowerCase()];
  if (!LucideIcon) return <Share2 className="size-4 text-gray-400" />;
  return <LucideIcon className="size-4" style={style} />;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuickLinkItem {
  page_id: number;
  pageName: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FooterPage() {
  const router = useRouter();

  // ── API hooks (same pattern as AboutCompanyPage) ──
  const { data: vendor, isLoading } = useVendorAbout();
  const updateMutation = useUpdateVendorAbout('Footer saved successfully');
  const { data: pagesData } = useVendorPages({ limit: 100 });
  const vendorPages = pagesData?.data ?? [];
  const { data: socialLinks = [] } = useVendorSocialLinks();
  const toggleSocialLink = useToggleSocialLink();
  const { data: homeBlocks = [] } = useVendorHomeBlocks();
  const hasSocialMediaBlock = homeBlocks.some((b) => b.block_type === "social_media");

  // ── Logo & Brand ──────────────────────────────────
  const [logo, setLogo] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // ── Contact (maps to same vendor fields as AboutCompanyPage) ──
  const [contactMode, setContactMode] = useState<"default" | "alternate">(
    "default",
  );

  // Default contact → company_contact / company_email / company_address
  const [defaultContact, setDefaultContact] = useState({
    mobile: "",
    email: "",
    address: "",
  });

  // Alternative contact → contact / alt_email / address
  const [altContact, setAltContact] = useState({
    mobile: "",
    email: "",
    address: "",
  });

  // ── Quick Links ──────────────────────────────────
  const [quickLinksHeading, setQuickLinksHeading] = useState("Quick Links");
  const [selectedLinks, setSelectedLinks] = useState<QuickLinkItem[]>([]);
  const [pageModalOpen, setPageModalOpen] = useState(false);
  const [modalSearch, setModalSearch]     = useState("");
  const [draggedLinkIndex, setDraggedLinkIndex] = useState<number | null>(null);

  // ── Footer Bottom ─────────────────────────────────
  const [copyright, setCopyright] = useState<string>("");
  const [poweredBy, setPoweredBy] = useState<string>("");

  // ── Newsletter ────────────────────────────────────
  const [newsletterEnabled, setNewsletterEnabled] = useState(false);
  const [newsletterEmailPreview, setNewsletterEmailPreview] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Populate from API (same field mapping as AboutCompanyPage) ──
  useEffect(() => {
    if (!vendor) return;

    setLogo(vendor.company_logo || "");
    setCompanyName(vendor.company_name || "");
    setDescription(vendor.short_description || "");
    setCopyright(vendor.copywrite || "");
    setPoweredBy(vendor.poweredby || "");

    // Default contact
    setDefaultContact({
      mobile: vendor.company_contact || "",
      email: vendor.company_email || "",
      address: vendor.company_address || "",
    });

    // Newsletter
    setNewsletterEnabled((vendor as any).newsletter_status === 1);
    setNewsletterEmailPreview("");

    // Alternative contact
    setAltContact({
      mobile: vendor.contact || "",
      email: vendor.alt_email || "",
      address: vendor.address || "",
    });

  }, [vendor]);

  // ── Load footer_links once both vendor + pages are ready ──
  const [footerLinksLoaded, setFooterLinksLoaded] = useState(false);
  useEffect(() => {
    if (footerLinksLoaded || !vendor || !vendorPages.length) return;
    setFooterLinksLoaded(true);
    const raw = vendor.footer_links;
    if (raw?.length) {
      setQuickLinksHeading(raw[0]?.heading || "Quick Links");
      // Flatten all page_ids from all columns into a single list
      const allPageIds: number[] = raw.flatMap((col: any) => col.page_ids ?? []);
      const links: QuickLinkItem[] = allPageIds
        .map((pid) => {
          const page = vendorPages.find((p) => p.id === pid);
          return page ? { page_id: page.id, pageName: page.name } : null;
        })
        .filter(Boolean) as QuickLinkItem[];
      setSelectedLinks(links);
    }
  }, [vendor, vendorPages, footerLinksLoaded]);

  // ── Logo upload (same pattern as AboutCompanyPage) ──
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "vendors");
      const res = await apiClient.post("/vendors/auth/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.data?.file?.url || res.data.data?.url;
      if (url) setLogo(url);
    } catch {
      toast.error("Failed to upload logo");
    }
  };

  // ── Save (same mutation + base64 guard as AboutCompanyPage) ──
  const handleSave = async () => {
    let logoUrl: string | undefined = logo || undefined;

    // Upload if still base64
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
        if (logoUrl) setLogo(logoUrl);
      } catch {
        toast.error("Failed to upload logo");
        return;
      }
    }

    const footer_links = selectedLinks.length
      ? [{ heading: quickLinksHeading.trim() || "Quick Links", page_ids: selectedLinks.map((l) => l.page_id) }]
      : [];

    await updateMutation.mutateAsync({
      company_name: companyName,
      company_logo: logoUrl,
      company_contact: defaultContact.mobile,
      company_email: defaultContact.email,
      company_address: defaultContact.address,
      contact: altContact.mobile,
      alt_email: altContact.email,
      address: altContact.address,
      short_description: description,
      poweredby: poweredBy,
      copywrite: copyright,
      footer_links,
      newsletter_status: newsletterEnabled ? 1 : 0,
    } as never);
  };

  // ── Quick link helpers ────────────────────────────
  const togglePageLink = (page: { id: number; name: string }) => {
    setSelectedLinks((prev) =>
      prev.some((l) => l.page_id === page.id)
        ? prev.filter((l) => l.page_id !== page.id)
        : [...prev, { page_id: page.id, pageName: page.name }]
    );
  };
  const removeLink = (page_id: number) =>
    setSelectedLinks((prev) => prev.filter((l) => l.page_id !== page_id));

  const handleQuickLinkDrop = (targetIndex: number) => {
    if (draggedLinkIndex === null || draggedLinkIndex === targetIndex) return;
    setSelectedLinks((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(draggedLinkIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
    });
    setDraggedLinkIndex(null);
  };

  // ── Reset ─────────────────────────────────────────
  const handleReset = () => {
    if (!vendor) return;
    setLogo(vendor.company_logo || "");
    setCompanyName(vendor.company_name || "");
    setDefaultContact({
      mobile: vendor.company_contact || "",
      email: vendor.company_email || "",
      address: vendor.company_address || "",
    });
    setAltContact({
      mobile: vendor.contact || "",
      email: vendor.alt_email || "",
      address: vendor.address || "",
    });
    setCopyright(vendor.copywrite || "");
    setPoweredBy(vendor.poweredby || "");
    setDescription(vendor.short_description || "");
    setQuickLinksHeading(vendor.footer_links?.[0]?.heading || "Quick Links");
    setSelectedLinks([]);
    setNewsletterEnabled(false);
    setNewsletterEmailPreview("");
    toast.info("All settings reset.");
  };

  // ── Loading guard ─────────────────────────────────
  if (isLoading) return <WebsiteSettingsPageSkeleton />;

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar">
      <div className="max-w-[1700px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-poppins mb-1">
            Footer
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage both brand identity and quick navigation links in a single
            view.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left Column: Form Editors ─────────────────────── */}
          <div className="lg:col-span-9 space-y-8">
            {/* Section 1: Brand Identity */}
            <div className="bg-white dark:bg-sidebar p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
              <div className="flex items-center gap-3 border-b pb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <ImageIcon size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-poppins">
                  Footer Company Info
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name & Description */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      COMPANY NAME
                    </Label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter company name..."
                      className="h-12 border-gray-200 dark:border-gray-800 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      SHORT DESCRIPTION
                    </Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Write short company description here..."
                      className="min-h-[150px] border-gray-200 dark:border-gray-800 rounded-xl resize-none focus:bg-white bg-gray-50/30 transition-all font-medium leading-relaxed"
                    />
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="space-y-2">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="h-full min-h-[250px] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-all p-8 relative group"
                  >
                    {logo ? (
                      <div className="relative h-32 w-full">
                        <Image
                          src={logo}
                          alt="Logo"
                          fill
                          className="object-contain transition-transform group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-sidebar shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Upload size={24} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">
                            UPLOAD LOGO
                          </p>
                          <p className="text-[10px] font-semibold text-gray-400 mt-1 uppercase tracking-wider">
                            PNG, JPG up to 5MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>

              {/* Social Links — only shown when social_media block is in the active theme */}
              {hasSocialMediaBlock && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold uppercase tracking-wider text-gray-400">
                      Social Links
                    </Label>
                    <button
                      type="button"
                      onClick={() => router.push("/website/social-links")}
                      className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                    >
                      <ExternalLink size={11} /> Manage
                    </button>
                  </div>

                  {socialLinks.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-2">
                      No social links added yet.{" "}
                      <button
                        type="button"
                        onClick={() => router.push("/website/social-links/add")}
                        className="text-primary font-semibold hover:underline"
                      >
                        Add one
                      </button>
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {socialLinks.map((link) => {
                        const isOn = link.is_active === 1;
                        return (
                          <div
                            key={link.id}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                              isOn
                                ? "bg-gray-50/50 dark:bg-white/5 border-gray-100 dark:border-gray-800"
                                : "bg-gray-50/20 dark:bg-white/2 border-gray-100/50 dark:border-gray-800/50 opacity-50"
                            }`}
                          >
                            <SocialIcon name={link.icon} color={link.icon_color} />
                            <span className="flex-1 min-w-0 text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
                              {link.label}
                            </span>
                            <span className="text-[10px] text-gray-400 truncate max-w-[100px] hidden sm:block">
                              {link.url}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleSocialLink.mutate(link.id)}
                              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none ${
                                isOn ? "bg-primary" : "bg-red-500"
                              }`}
                              title={isOn ? "Visible — click to hide" : "Hidden — click to show"}
                            >
                              <span
                                className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                  isOn ? "translate-x-4" : "translate-x-0.5"
                                }`}
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Section 2: Quick Links */}
            <div className="bg-white dark:bg-sidebar p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600">
                    <LinkIcon size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white font-poppins">Footer Top List</h3>
                    <p className="text-xs text-gray-400">Pages shown in the footer navigation</p>
                  </div>
                </div>
                <Button
                  onClick={() => { setModalSearch(""); setPageModalOpen(true); }}
                  className="bg-green-600 hover:bg-green-700 text-white h-9 text-xs font-bold px-4 gap-2 shadow-sm shadow-green-500/10 active:scale-95 transition-all"
                >
                  <Plus size={14} /> Add Pages
                </Button>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">
                    Footer Top List Heading
                  </Label>
                  <Input
                    value={quickLinksHeading}
                    onChange={(e) => setQuickLinksHeading(e.target.value)}
                    placeholder="Type Heading Here..."
                    className="font-bold text-base h-10 bg-white dark:bg-sidebar border-gray-200 dark:border-gray-800"
                  />
                </div>

                {/* Selected pages list */}
                {selectedLinks.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Footer page hierarchy
                      </p>
                      <p className="text-[11px] font-semibold text-gray-400">
                        Drag to reorder
                      </p>
                    </div>
                    {selectedLinks.map((link, index) => (
                      <div
                        key={link.page_id}
                        draggable
                        onDragStart={() => setDraggedLinkIndex(index)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => handleQuickLinkDrop(index)}
                        onDragEnd={() => setDraggedLinkIndex(null)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-white/5 group cursor-move transition-all ${
                          draggedLinkIndex === index ? "opacity-50 border-primary/40" : "hover:border-primary/30"
                        }`}
                      >
                        <GripVertical size={15} className="text-gray-300 shrink-0" />
                        <span className="w-6 h-6 rounded-lg bg-white dark:bg-sidebar border border-gray-100 dark:border-gray-800 flex items-center justify-center text-[10px] font-black text-gray-400">
                          {index + 1}
                        </span>
                        <FileText size={14} className="text-gray-400 shrink-0" />
                        <span className="flex-1 text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">
                          {link.pageName}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeLink(link.page_id)}
                          className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center border-2 border-dashed border-gray-100 dark:border-gray-800/50 rounded-2xl">
                    <LinkIcon size={24} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">No quick links yet.</p>
                    <p className="text-xs text-gray-300 mt-1">Click &quot;Add Pages&quot; to choose pages for the footer.</p>
                  </div>
                )}

                {/* Newsletter Card */}
                <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1">
                      Newsletter
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-sidebar transition-all">
                    <div className="flex items-center gap-3 transition-colors">
                      <input
                        type="checkbox"
                        id="newsletter-checkbox"
                        checked={newsletterEnabled}
                        onChange={(e) => setNewsletterEnabled(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer transition-all"
                      />
                      <Label 
                        htmlFor="newsletter-checkbox" 
                        className={`text-sm font-bold cursor-pointer transition-colors ${newsletterEnabled ? "text-primary" : "text-gray-500"}`}
                      >
                        Newsletter
                      </Label>
                    </div>
                  </div>

                  {newsletterEnabled && (
                    <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top duration-300">
                      <div className="space-y-3 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-sidebar shadow-sm">
                        <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                           Subscribe our newsletter
                        </Label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Input
                            value={newsletterEmailPreview}
                            onChange={(e) => setNewsletterEmailPreview(e.target.value)}
                            placeholder="Enter Email Address..."
                            className="h-11 text-xs bg-gray-50/50 dark:bg-[#121212] border-gray-100 dark:border-gray-800 rounded-xl font-medium focus:ring-2 focus:ring-primary/10 transition-all flex-1"
                          />
                          <Button className="h-11 px-8 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl shadow-md shadow-primary/20 active:scale-95 transition-all">
                            Subscribe
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Information [Multi-Mode] */}
                <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 space-y-6 shadow-sm">
                  <h3 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1">
                    Contact Info
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Default Contact */}
                    <div
                      onClick={() => setContactMode("default")}
                      className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        contactMode === "default"
                          ? "border-primary bg-white dark:bg-sidebar shadow-md shadow-primary/5 scale-[1.01]"
                          : "border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/5 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${contactMode === "default" ? "border-primary bg-primary" : "border-gray-300 dark:border-gray-600"}`}
                        >
                          {contactMode === "default" && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                          )}
                        </div>
                        <span
                          className={`text-sm font-bold font-poppins transition-colors ${contactMode === "default" ? "text-primary" : "text-gray-500"}`}
                        >
                          Default Contact Info
                        </span>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                            <Phone size={10} /> MOBILE
                          </Label>
                          <Input
                            value={defaultContact.mobile}
                            onChange={(e) =>
                              setDefaultContact({
                                ...defaultContact,
                                mobile: e.target.value,
                              })
                            }
                            placeholder="Enter Mobile Number..."
                            className="h-10 text-xs bg-white dark:bg-[#121212] border-gray-100 dark:border-gray-800 rounded-lg font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                            <Mail size={10} /> EMAIL
                          </Label>
                          <Input
                            value={defaultContact.email}
                            onChange={(e) =>
                              setDefaultContact({
                                ...defaultContact,
                                email: e.target.value,
                              })
                            }
                            placeholder="Enter Email ID..."
                            className="h-10 text-xs bg-white dark:bg-[#121212] border-gray-100 dark:border-gray-800 rounded-lg font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                            <MapPin size={10} /> ADDRESS
                          </Label>
                          <Textarea
                            value={defaultContact.address}
                            onChange={(e) =>
                              setDefaultContact({
                                ...defaultContact,
                                address: e.target.value,
                              })
                            }
                            placeholder="Enter Address..."
                            className="min-h-[80px] text-xs bg-white dark:bg-[#121212] border-gray-100 dark:border-gray-800 rounded-lg resize-none leading-relaxed font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Alternative Contact */}
                    <div
                      onClick={() => setContactMode("alternate")}
                      className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        contactMode === "alternate"
                          ? "border-primary bg-white dark:bg-sidebar shadow-md shadow-primary/5 scale-[1.01]"
                          : "border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/5 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${contactMode === "alternate" ? "border-primary bg-primary" : "border-gray-300 dark:border-gray-600"}`}
                        >
                          {contactMode === "alternate" && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                          )}
                        </div>
                        <span
                          className={`text-sm font-bold font-poppins transition-colors ${contactMode === "alternate" ? "text-primary" : "text-gray-500"}`}
                        >
                          Alternative Contact Info
                        </span>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                            <Phone size={10} /> MOBILE
                          </Label>
                          <Input
                            value={altContact.mobile}
                            onChange={(e) =>
                              setAltContact({
                                ...altContact,
                                mobile: e.target.value,
                              })
                            }
                            placeholder="Enter Mobile Number..."
                            className="h-10 text-xs bg-white dark:bg-[#121212] border-gray-100 dark:border-gray-800 rounded-lg font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                            <Mail size={10} /> EMAIL
                          </Label>
                          <Input
                            value={altContact.email}
                            onChange={(e) =>
                              setAltContact({
                                ...altContact,
                                email: e.target.value,
                              })
                            }
                            placeholder="Enter Email ID..."
                            className="h-10 text-xs bg-white dark:bg-[#121212] border-gray-100 dark:border-gray-800 rounded-lg font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                            <MapPin size={10} /> ADDRESS
                          </Label>
                          <Textarea
                            value={altContact.address}
                            onChange={(e) =>
                              setAltContact({
                                ...altContact,
                                address: e.target.value,
                              })
                            }
                            placeholder="Enter Address..."
                            className="min-h-[80px] text-xs bg-white dark:bg-[#121212] border-gray-100 dark:border-gray-800 rounded-lg resize-none leading-relaxed font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Section 3: Footer Bottom */}
            <div className="bg-white dark:bg-sidebar p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
              <div className="flex items-center gap-3 border-b pb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600">
                  <Copyright size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-poppins">
                  Footer Bottom
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Copyright Text
                  </Label>
                  <Input
                    value={copyright}
                    onChange={(e) => setCopyright(e.target.value)}
                    placeholder="Type Copyright Text..."
                    className="h-11 border-gray-200 dark:border-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Powered By</Label>
                  <Input
                    value={poweredBy}
                    disabled
                    placeholder="Type Powered By text..."
                    className="h-11 border-gray-200 dark:border-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Sticky Actions ─────────────────── */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8">
            <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
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
      </div>

      {/* ── Add Pages Modal ─────────────────────────────── */}
      <Dialog open={pageModalOpen} onOpenChange={setPageModalOpen}>
        <DialogContent
          className="max-h-[92vh] flex flex-col"
          style={{
            width: "calc(100vw - 320px)",
            maxWidth: "1500px",
            left: "calc(50% + 120px)",
          }}
        >
          <DialogHeader className="shrink-0">
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <FileText size={16} className="text-primary" /> Select Pages for Quick Links
            </DialogTitle>
          </DialogHeader>

          {/* Search */}
          <div className="relative shrink-0 px-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-3.5" />
            <input
              placeholder="Search pages..."
              value={modalSearch}
              onChange={(e) => setModalSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium"
            />
          </div>

          {/* Pages as cards */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-1 py-1">
            {vendorPages.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8">No pages found. Create pages first.</p>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {vendorPages
                  .filter((p) => p.name.toLowerCase().includes(modalSearch.toLowerCase()))
                  .map((page) => {
                    const isSelected = selectedLinks.some((l) => l.page_id === page.id);
                    return (
                      <div key={page.id} onClick={() => togglePageLink(page)}
                        className={`relative flex items-center gap-3 cursor-pointer rounded-xl border-2 p-4 transition-all select-none group ${
                          isSelected
                            ? "border-primary bg-primary/5 dark:bg-primary/10"
                            : "border-gray-100 dark:border-gray-800 hover:border-primary/40 hover:bg-gray-50 dark:hover:bg-white/5"
                        }`}>
                        {/* Check badge */}
                        {isSelected && (
                          <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check size={10} className="text-white" />
                          </span>
                        )}
                        <FileText size={20} className={`shrink-0 ${isSelected ? "text-primary" : "text-gray-300 group-hover:text-gray-400"}`} />
                        <p className={`flex-1 text-sm font-bold truncate leading-tight ${isSelected ? "text-primary" : "text-gray-700 dark:text-gray-200"}`}>
                          {page.name}
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="shrink-0 flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs text-gray-400 font-medium">
              {selectedLinks.length} page{selectedLinks.length !== 1 ? "s" : ""} selected
            </span>
            <Button onClick={() => setPageModalOpen(false)} className="h-9 px-6 text-xs font-bold">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
