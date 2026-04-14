"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import {
  Plus,
  X,
  Phone,
  Mail,
  MapPin,
  Globe,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Linkedin,
  MessageCircle,
  Music,
  Send,
  Pin,
  Image as ImageIcon,
  Upload,
  Layout,
  Check,
  Search,
  Copyright,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useVendorAbout, useUpdateVendorAbout } from "@/hooks/use-vendors";
import { useVendorPages } from "@/hooks/use-vendor-pages";
import apiClient from "@/lib/api-client";
// ─── Types ────────────────────────────────────────────────────────────────────

interface QuickLinkItem {
  id: string;
  page_id: number;
  pageName: string;
  url: string;
}

interface QuickLinkColumn {
  id: string;
  title: string;
  links: QuickLinkItem[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SOCIAL_PLATFORMS = [
  { id: "website",   label: "Website",     icon: Globe,          color: "text-blue-500" },
  { id: "youtube",   label: "YouTube",     icon: Youtube,        color: "text-red-600" },
  { id: "facebook",  label: "Facebook",    icon: Facebook,       color: "text-blue-600" },
  { id: "instagram", label: "Instagram",   icon: Instagram,      color: "text-pink-600" },
  { id: "twitter",   label: "Twitter / X", icon: Twitter,        color: "text-gray-700 dark:text-gray-200" },
  { id: "linkedin",  label: "LinkedIn",    icon: Linkedin,       color: "text-blue-700" },
  { id: "whatsapp",  label: "WhatsApp",    icon: MessageCircle,  color: "text-green-500" },
  { id: "tiktok",    label: "TikTok",      icon: Music,          color: "text-black dark:text-white" },
  { id: "telegram",  label: "Telegram",    icon: Send,           color: "text-blue-400" },
  { id: "pinterest", label: "Pinterest",   icon: Pin,            color: "text-red-500" },
] as const;

const DEFAULT_VISIBILITY = Object.fromEntries(
  SOCIAL_PLATFORMS.map((p) => [p.id, true])
) as Record<string, boolean>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function FooterPage() {
  const router = useRouter();

  // ── API hooks (same pattern as AboutCompanyPage) ──
  const { data: vendor, isLoading } = useVendorAbout();
  const updateMutation = useUpdateVendorAbout('Footer saved successfully');
  const { data: pagesData } = useVendorPages({ limit: 100 });
  const vendorPages = pagesData?.data ?? [];

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

  // ── Social Links ──────────────────────────────────
  const [socialUrls, setSocialUrls] = useState<Record<string, string>>(
    Object.fromEntries(SOCIAL_PLATFORMS.map((p) => [p.id, ""]))
  );
  const [socialVisibility, setSocialVisibility] = useState<Record<string, boolean>>(
    { ...DEFAULT_VISIBILITY }
  );

  // ── Quick Links Columns ───────────────────────────
  const [columns, setColumns] = useState<QuickLinkColumn[]>([]);
  const [pageSearchByCol, setPageSearchByCol] = useState<{
    [key: string]: string;
  }>({});

  // ── Footer Bottom ─────────────────────────────────
  const [copyright, setCopyright] = useState<string>("");
  const [poweredBy, setPoweredBy] = useState<string>("");

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

    // Alternative contact
    setAltContact({
      mobile: vendor.contact || "",
      email: vendor.alt_email || "",
      address: vendor.address || "",
    });

    // Map social URLs from vendor fields
    setSocialUrls({
      website:   vendor.website   || "",
      youtube:   vendor.youtube   || "",
      facebook:  vendor.facebook  || "",
      instagram: vendor.instagram || "",
      twitter:   vendor.twitter   || "",
      linkedin:  vendor.linkedin  || "",
      whatsapp:  vendor.whatsapp  || "",
      tiktok:    vendor.tiktok    || "",
      telegram:  vendor.telegram  || "",
      pinterest: vendor.pinterest || "",
    });
    // Map social visibility (merge with defaults so new platforms default to true)
    setSocialVisibility({
      ...DEFAULT_VISIBILITY,
      ...(vendor.social_visibility ?? {}),
    });
  }, [vendor]);

  // ── Load footer_links once both vendor + pages are ready ──
  const [footerLinksLoaded, setFooterLinksLoaded] = useState(false);
  useEffect(() => {
    if (footerLinksLoaded || !vendor || !vendorPages.length) return;
    setFooterLinksLoaded(true);
    const raw = vendor.footer_links;
    if (raw?.length) {
      setColumns(
        raw.map((col, i) => ({
          id: `c${i}-loaded`,
          title: col.heading,
          links: col.page_ids
            .map((pid, j) => {
              const page = vendorPages.find((p) => p.id === pid);
              return page
                ? { id: `l${i}-${j}`, page_id: page.id, pageName: page.name, url: `/website/pages/view/${page.id}` }
                : null;
            })
            .filter(Boolean) as QuickLinkItem[],
        }))
      );
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

    const footer_links = columns.map((col) => ({
      heading: col.title,
      page_ids: col.links.map((l) => l.page_id).filter(Boolean),
    }));

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
      ...socialUrls,
      social_visibility: socialVisibility,
      footer_links,
    } as never);
  };

  // ── Column helpers ────────────────────────────────
  const addColumn = () => {
    if (columns.length >= 2) return toast.error("Only two columns maximum");
    setColumns([
      ...columns,
      {
        id: Date.now().toString(),
        title: "",
        links: [],
      },
    ]);
  };
  const removeColumn = (id: string) =>
    setColumns(columns.filter((c) => c.id !== id));
  const updateColumnTitle = (id: string, title: string) =>
    setColumns(columns.map((c) => (c.id === id ? { ...c, title } : c)));

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
    setSocialUrls({
      website:   vendor.website   || "",
      youtube:   vendor.youtube   || "",
      facebook:  vendor.facebook  || "",
      instagram: vendor.instagram || "",
      twitter:   vendor.twitter   || "",
      linkedin:  vendor.linkedin  || "",
      whatsapp:  vendor.whatsapp  || "",
      tiktok:    vendor.tiktok    || "",
      telegram:  vendor.telegram  || "",
      pinterest: vendor.pinterest || "",
    });
    setSocialVisibility({ ...DEFAULT_VISIBILITY, ...(vendor.social_visibility ?? {}) });
    setColumns([]);
    toast.info("All settings reset.");
  };

  // ── Loading guard ─────────────────────────────────
  if (isLoading) {
    return (
      <div className="h-[calc(100vh-86px)] flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar">
      <div className="max-w-[1700px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-poppins mb-1">
            Footer Management
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

              {/* Social Links */}
              <div className="space-y-4 pt-4 border-t">
                <Label className="text-sm font-bold uppercase tracking-wider text-gray-400">
                  Social Links
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SOCIAL_PLATFORMS.map((platform) => {
                    const isOn = socialVisibility[platform.id] !== false;
                    return (
                      <div
                        key={platform.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          isOn
                            ? "bg-gray-50/50 dark:bg-white/5 border-gray-100 dark:border-gray-800"
                            : "bg-gray-50/20 dark:bg-white/2 border-gray-100/50 dark:border-gray-800/50 opacity-50"
                        }`}
                      >
                        <platform.icon className={`size-4 flex-shrink-0 ${platform.color}`} />
                        <Input
                          value={socialUrls[platform.id] || ""}
                          onChange={(e) =>
                            setSocialUrls((prev) => ({ ...prev, [platform.id]: e.target.value }))
                          }
                          placeholder={platform.label}
                          className="h-8 text-xs border-none bg-white dark:bg-sidebar shadow-none flex-1 min-w-0"
                        />
                        {/* Toggle */}
                        <button
                          type="button"
                          onClick={() =>
                            setSocialVisibility((prev) => ({ ...prev, [platform.id]: !isOn }))
                          }
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
              </div>
            </div>

            {/* Section 2: Quick Links Columns */}
            <div className="bg-white dark:bg-sidebar p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600">
                    <Layout size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white font-poppins">
                    Footer Top List
                  </h3>
                </div>
                <Button
                  onClick={addColumn}
                  className="bg-green-600 hover:bg-green-700 text-white h-9 text-xs font-bold px-4 gap-2 shadow-sm shadow-green-500/10 active:scale-95 transition-all"
                >
                  <Plus size={14} /> Add Column
                </Button>
              </div>

              <div className="space-y-8">
                {columns.map((col) => (
                  <div
                    key={col.id}
                    className="p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/5 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 max-w-[300px]">
                        <Input
                          value={col.title}
                          onChange={(e) =>
                            updateColumnTitle(col.id, e.target.value)
                          }
                          placeholder="Type Heading Here..."
                          className="font-bold text-base h-10 bg-white dark:bg-sidebar border-gray-200 dark:border-gray-800"
                        />
                      </div>
                      <button
                        onClick={() => removeColumn(col.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">
                          Select Navigation Pages
                        </Label>
                        <div className="bg-white dark:bg-sidebar border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                          <div className="p-3 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-white/5">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-3.5" />
                              <input
                                placeholder="Search pages..."
                                value={pageSearchByCol[col.id] || ""}
                                onChange={(e) =>
                                  setPageSearchByCol({
                                    ...pageSearchByCol,
                                    [col.id]: e.target.value,
                                  })
                                }
                                className="w-full h-9 pl-9 pr-3 bg-white dark:bg-sidebar border border-gray-200 dark:border-gray-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                              />
                            </div>
                          </div>
                          <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-1.5 bg-white dark:bg-sidebar">
                            {vendorPages.filter((p) =>
                              p.name
                                .toLowerCase()
                                .includes(
                                  (pageSearchByCol[col.id] || "").toLowerCase(),
                                ),
                            ).map((page) => {
                              const isSelected = col.links.some(
                                (l) => l.pageName === page.name,
                              );
                              return (
                                <div
                                  key={page.id}
                                  onClick={() => {
                                    if (isSelected) {
                                      setColumns((prev) =>
                                        prev.map((c) =>
                                          c.id === col.id
                                            ? {
                                                ...c,
                                                links: c.links.filter(
                                                  (l) =>
                                                    l.pageName !== page.name,
                                                ),
                                              }
                                            : c,
                                        ),
                                      );
                                    } else {
                                      setColumns((prev) =>
                                        prev.map((c) =>
                                          c.id === col.id
                                            ? {
                                                ...c,
                                                links: [
                                                  ...c.links,
                                                  {
                                                    id: `l-${Date.now()}`,
                                                    page_id: page.id,
                                                    pageName: page.name,
                                                    url: `/website/pages/view/${page.id}`,
                                                  },
                                                ],
                                              }
                                            : c,
                                        ),
                                      );
                                    }
                                  }}
                                  className={`px-3 py-1.5 rounded-lg border border-transparent hover:border-primary/10 hover:bg-primary/5 dark:hover:bg-primary/10 cursor-pointer group transition-all flex items-center gap-3 mb-0.5 select-none ${isSelected ? "bg-primary/5 border-primary/20" : ""}`}
                                >
                                  <div
                                    className={`w-4 h-4 rounded-md border flex flex-shrink-0 items-center justify-center transition-all ${isSelected ? "bg-primary border-primary text-white" : "border-gray-300 dark:border-gray-700 bg-white dark:bg-sidebar group-hover:border-primary/50"}`}
                                  >
                                    {isSelected && <Check size={10} />}
                                  </div>
                                  <span
                                    className={`text-[13px] font-bold transition-colors ${isSelected ? "text-primary" : "text-gray-700 dark:text-gray-200 group-hover:text-primary"}`}
                                  >
                                    {page.name}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      {col.links.length === 0 && (
                        <p className="text-xs text-gray-400 italic py-2 pl-2">
                          No links in this column yet.
                        </p>
                      )}
                    </div>
                  </div>
                ))}

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

                {columns.length === 0 && (
                  <div className="py-12 text-center border-2 border-dashed border-gray-100 dark:border-gray-800/50 rounded-2xl">
                    <p className="text-sm text-gray-400">
                      Click &quot;Add Column&quot; to start building your footer
                      link structure.
                    </p>
                  </div>
                )}
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
              onReset={handleReset}
              onCancel={() => router.push("/website/management")}
              saveLabel={updateMutation.isPending ? "SAVING..." : "UPDATE"}
              isSubmitting={updateMutation.isPending}
            />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
