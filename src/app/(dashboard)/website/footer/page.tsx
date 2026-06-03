"use client";

import React, { useState, useEffect } from "react";
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
  Check,
  Search,
  Copyright,
  Share2,
  ExternalLink,
  Link as LinkIcon,
  FileText,
  GripVertical,
  Edit,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import * as LucideIcons from "lucide-react";
import { toast } from "sonner";
import { useVendorAbout, useUpdateVendorAbout } from "@/hooks/use-vendors";
import { useVendorPages, useVendorTerms, useVendorPrivacy } from "@/hooks/use-vendor-pages";
import { useVendorSocialLinks, useToggleSocialLink } from "@/hooks/use-vendor-social-links";
import { useVendorHomeBlocks } from "@/hooks/use-vendor-home-blocks";
import apiClient from "@/lib/api-client";
import { dataUrlToFile } from "@/lib/utils";
import { validateEmail, validateMobile } from "@/lib/validation";
import { ImageCropper } from "@/components/common/ImageCropper";
import { CompanyLogoUpload } from "@/components/common/CompanyLogoUpload";

// ─── Social icon renderer ─────────────────────────────────────────────────────
const lucideIconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = Object.fromEntries(
  Object.entries(LucideIcons)
    .filter(([k]) => /^[A-Z]/.test(k))
    .map(([k, v]) => [k.toLowerCase(), v as React.ComponentType<{ className?: string; style?: React.CSSProperties }>])
);
function SocialIcon({ name, color }: { name?: string | null; color?: string | null }) {
  if (!name) return <Share2 className="size-4 text-[var(--vendor-text-muted)]" />;
  const style = color ? { color } : undefined;
  if (name.includes(":")) return <Icon icon={name} className="size-4" style={style} />;
  const LucideIcon = lucideIconMap[name.toLowerCase()];
  if (!LucideIcon) return <Share2 className="size-4 text-[var(--vendor-text-muted)]" />;
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
  const [isEditing, setIsEditing] = useState(false);

  // ── API hooks (same pattern as AboutCompanyPage) ──
  const { data: vendor, isLoading, refetch } = useVendorAbout();
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
  const [contactMode, setContactMode] = useState<"default" | "alternative">(
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

  const validateContactBlock = (
    label: string,
    contact: { mobile: string; email: string; address: string },
  ) => {
    const mobileErr = validateMobile(contact.mobile);
    if (mobileErr) {
      toast.error(`${label}: ${mobileErr}`);
      return false;
    }

    const emailErr = validateEmail(contact.email);
    if (emailErr) {
      toast.error(`${label}: ${emailErr}`);
      return false;
    }

    if (!contact.address.trim()) {
      toast.error(`${label}: Address is required.`);
      return false;
    }

    return true;
  };

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

  // ── Footer logo cropper (parity with Header page) ──
  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");

  // ── Inline errors for mandatory fields ──
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // ── Terms / Privacy content (must be set to save footer) ──
  const { data: termsData } = useVendorTerms();
  const { data: privacyData } = useVendorPrivacy();
  const stripHtml = (html: string) => {
    if (typeof document === "undefined") return (html || "").replace(/<[^>]*>/g, "").trim();
    const div = document.createElement("div");
    div.innerHTML = html || "";
    return (div.textContent || div.innerText || "").trim();
  };

  const getSavedFooterLinks = (rawLinks: any[] | null | undefined) => {
    if (!rawLinks?.length) return [];

    const allPageIds: number[] = rawLinks.flatMap((col: any) => col.page_ids ?? []);
    return allPageIds
      .map((pid) => {
        const page = vendorPages.find((p) => p.id === pid);
        return page ? { page_id: page.id, pageName: page.name } : null;
      })
      .filter(Boolean) as QuickLinkItem[];
  };

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
      email: (vendor.company_email || "").toLowerCase(),
      address: vendor.company_address || "",
    });

    // Contact mode — persist which radio was selected
    setContactMode(((vendor as any).contact_mode as "default" | "alternative") || "default");

    // Newsletter
    setNewsletterEnabled((vendor as any).newsletter_status === 1);
    setNewsletterEmailPreview("");

    // Alternative contact
    setAltContact({
      mobile: vendor.contact || "",
      email: (vendor.alt_email || "").toLowerCase(),
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
      setSelectedLinks(getSavedFooterLinks(raw));
    }
  }, [vendor, vendorPages, footerLinksLoaded]);

  // ── Logo upload — open cropper first (same UX as Header page) ──
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const fd = new FormData();
      fd.append("file", await dataUrlToFile(croppedBase64, "logo"));
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
    // Mandatory text field checks
    const fe: Record<string, string> = {};
    if (!companyName.trim())           fe.companyName       = "Company name is required";
    if (!description.trim())           fe.description       = "Short description is required";
    if (!quickLinksHeading.trim())     fe.quickLinksHeading = "Quick Links heading is required";
    if (selectedLinks.length === 0)    fe.quickLinks        = "Select at least one page for Quick Links";
    if (!stripHtml(termsData?.content || "")) fe.terms      = "Terms & Conditions content is required";
    if (!stripHtml(privacyData?.content || "")) fe.privacy  = "Privacy Policy content is required";

    if (Object.keys(fe).length > 0) {
      setFieldErrors(fe);
      toast.error("Please fill all mandatory fields.");
      return;
    }
    setFieldErrors({});

    if (!validateContactBlock("Default contact", defaultContact)) return;
    if (!validateContactBlock("Alternative contact", altContact)) return;

    let logoUrl: string | undefined = logo || undefined;

    // Upload if still base64
    if (logoUrl?.startsWith("data:")) {
      try {
        const fd = new FormData();
        fd.append("file", await dataUrlToFile(logoUrl, "logo"));
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
      company_contact: defaultContact.mobile.trim(),
      company_email: defaultContact.email.trim().toLowerCase(),
      company_address: defaultContact.address.trim(),
      contact: altContact.mobile.trim(),
      alt_email: altContact.email.trim().toLowerCase(),
      address: altContact.address.trim(),
      short_description: description,
      contact_mode: contactMode,
      footer_links,
      newsletter_status: newsletterEnabled ? 1 : 0,
    } as never);
    setIsEditing(false);
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
  const handleReset = async () => {
    // Force-pull latest server state, then re-populate every field + clear errors
    const { data: fresh } = await refetch();
    const src = fresh || vendor;
    if (!src) return;
    setLogo(src.company_logo || "");
    setCompanyName(src.company_name || "");
    setContactMode(((src as any).contact_mode as "default" | "alternative") || "default");
    setDefaultContact({
      mobile: src.company_contact || "",
      email: src.company_email || "",
      address: src.company_address || "",
    });
    setAltContact({
      mobile: src.contact || "",
      email: src.alt_email || "",
      address: src.address || "",
    });
    setCopyright(src.copywrite || "");
    setPoweredBy(src.poweredby || "");
    setDescription(src.short_description || "");
    setQuickLinksHeading(src.footer_links?.[0]?.heading || "Quick Links");
    setSelectedLinks(getSavedFooterLinks(src.footer_links));
    setNewsletterEnabled((src as any).newsletter_status === 1);
    setNewsletterEmailPreview("");
    setFieldErrors({});
    setFooterLinksLoaded(false);  // allow quick-links useEffect to re-populate from fresh
    setCropperOpen(false);
    setImageToCrop("");
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
          <h1 className="text-2xl font-bold text-[var(--vendor-text)] font-poppins mb-1">
            Footer
          </h1>
          <p className="text-sm text-[var(--vendor-text-muted)]">
            Manage both brand identity and quick navigation links in a single
            view.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left Column: Form Editors ─────────────────────── */}
          <div className="lg:col-span-9 space-y-8">
            {/* Section 1: Brand Identity */}
            <div className="bg-white dark:bg-sidebar p-6 rounded-[var(--vendor-radius-panel)] shadow-sm border border-[var(--vendor-border)] space-y-6">
              <div className="flex items-center gap-3 border-b pb-4">
                <div className="w-10 h-10 rounded-[var(--vendor-radius-control)] bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-[var(--vendor-primary-btn)]">
                  <ImageIcon size={20} />
                </div>
                <h3 className="text-lg font-bold text-[var(--vendor-text)] font-poppins">
                  Footer Company Info
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name & Description */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      COMPANY NAME <span className="text-rose-500 ml-1">*</span>
                    </Label>
                    <Input
                      value={companyName}
                      disabled={!isEditing}
                      onChange={(e) => {
                        if (!isEditing) return;
                        setCompanyName(e.target.value);
                        if (fieldErrors.companyName) setFieldErrors((p) => ({ ...p, companyName: "" }));
                      }}
                      placeholder="Enter company name..."
                      className={`h-12 dark:border-[var(--vendor-border)] rounded-[var(--vendor-radius-control)] disabled:opacity-70 disabled:cursor-not-allowed ${fieldErrors.companyName ? "border-rose-500 ring-4 ring-rose-500/5" : "border-[var(--vendor-border)]"}`}
                    />
                    {fieldErrors.companyName && (
                      <p className="text-[11px] font-semibold text-rose-500 mt-1.5">{fieldErrors.companyName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      SHORT DESCRIPTION <span className="text-rose-500 ml-1">*</span>
                    </Label>
                    <Textarea
                      value={description}
                      disabled={!isEditing}
                      onChange={(e) => {
                        if (!isEditing) return;
                        setDescription(e.target.value);
                        if (fieldErrors.description) setFieldErrors((p) => ({ ...p, description: "" }));
                      }}
                      placeholder="Write short company description here..."
                      className={`min-h-[150px] dark:border-[var(--vendor-border)] rounded-[var(--vendor-radius-control)] resize-none focus:bg-white bg-gray-50/30 transition-all font-medium leading-relaxed disabled:opacity-70 disabled:cursor-not-allowed ${fieldErrors.description ? "border-rose-500 ring-4 ring-rose-500/5" : "border-[var(--vendor-border)]"}`}
                    />
                    {fieldErrors.description && (
                      <p className="text-[11px] font-semibold text-rose-500 mt-1.5">{fieldErrors.description}</p>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <CompanyLogoUpload imageUrl={logo} disabled={!isEditing} onFileChange={handleLogoUpload} />
                </div>
              </div>

              {/* Social Links — only shown when social_media block is in the active theme */}
              {hasSocialMediaBlock && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold uppercase tracking-wider text-[var(--vendor-text-muted)]">
                      Social Links
                    </Label>
                    <button
                      type="button"
                      onClick={() => router.push("/website/social-links")}
                      className="flex items-center gap-1 text-[var(--vendor-control-text)] font-semibold text-primary hover:underline"
                    >
                      <ExternalLink size={11} /> Manage
                    </button>
                  </div>

                  {socialLinks.length === 0 ? (
                    <p className="text-xs text-[var(--vendor-text-muted)] italic py-2">
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
                            className={`flex items-center gap-3 p-3 rounded-[var(--vendor-radius-control)] border transition-all ${
                              isOn
                                ? "bg-gray-50/50 dark:bg-white/5 border-[var(--vendor-border)]"
                                : "bg-gray-50/20 dark:bg-white/2 border-[var(--vendor-border)]/50 dark:border-[var(--vendor-border)]/50 opacity-50"
                            }`}
                          >
                            <SocialIcon name={link.icon} color={link.icon_color} />
                            <span className="flex-1 min-w-0 text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
                              {link.label}
                            </span>
                            <span className="text-[10px] text-[var(--vendor-text-muted)] truncate max-w-[100px] hidden sm:block">
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
            <div className="bg-white dark:bg-sidebar p-6 rounded-[var(--vendor-radius-panel)] shadow-sm border border-[var(--vendor-border)] space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[var(--vendor-radius-control)] bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600">
                    <LinkIcon size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--vendor-text)] font-poppins">Footer Top List</h3>
                    <p className="text-xs text-[var(--vendor-text-muted)]">Pages shown in the footer navigation</p>
                  </div>
                </div>
                <Button
                  disabled={!isEditing}
                  onClick={() => { if (!isEditing) return; setModalSearch(""); setPageModalOpen(true); }}
                  className="bg-green-600 hover:bg-green-700 text-white h-9 text-xs font-bold px-4 gap-2 shadow-sm shadow-green-500/10 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-green-600"
                >
                  <Plus size={14} /> Add Pages
                </Button>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <Label className="text-[var(--vendor-control-text)] font-semibold text-[var(--vendor-text-muted)] uppercase tracking-wide px-1">
                    Footer Top List Heading <span className="text-rose-500 ml-1">*</span>
                  </Label>
                  <Input
                    value={quickLinksHeading}
                    disabled={!isEditing}
                    onChange={(e) => {
                      if (!isEditing) return;
                      setQuickLinksHeading(e.target.value);
                      if (fieldErrors.quickLinksHeading) setFieldErrors((p) => ({ ...p, quickLinksHeading: "" }));
                    }}
                    placeholder="Type Heading Here..."
                    className={`font-bold text-base h-10 bg-white dark:bg-sidebar dark:border-[var(--vendor-border)] disabled:opacity-70 disabled:cursor-not-allowed ${fieldErrors.quickLinksHeading ? "border-rose-500 ring-4 ring-rose-500/5" : "border-[var(--vendor-border)]"}`}
                  />
                  {fieldErrors.quickLinksHeading && (
                    <p className="text-[11px] font-semibold text-rose-500 mt-1.5">{fieldErrors.quickLinksHeading}</p>
                  )}
                  {fieldErrors.quickLinks && (
                    <p className="text-[11px] font-semibold text-rose-500 mt-1.5">{fieldErrors.quickLinks}</p>
                  )}
                </div>

                {/* Selected pages list */}
                {selectedLinks.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <p className="text-[var(--vendor-control-text)] font-semibold uppercase tracking-wider text-[var(--vendor-text-muted)]">
                        Footer page hierarchy
                      </p>
                      <p className="text-[11px] font-semibold text-[var(--vendor-text-muted)]">
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
                        className={`flex items-center gap-3 px-4 py-3 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-gray-50/40 dark:bg-white/5 group cursor-move transition-all ${
                          draggedLinkIndex === index ? "opacity-50 border-primary/40" : "hover:border-primary/30"
                        }`}
                      >
                        <GripVertical size={15} className="text-gray-300 shrink-0" />
                        <span className="w-6 h-6 rounded-[var(--vendor-radius-control)] bg-white dark:bg-sidebar border border-[var(--vendor-border)] flex items-center justify-center text-[10px] font-black text-[var(--vendor-text-muted)]">
                          {index + 1}
                        </span>
                        <FileText size={14} className="text-[var(--vendor-text-muted)] shrink-0" />
                        <span className="flex-1 text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">
                          {link.pageName}
                        </span>
                        <button
                          type="button"
                          disabled={!isEditing}
                          onClick={() => { if (isEditing) removeLink(link.page_id); }}
                          className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 disabled:cursor-not-allowed disabled:hover:text-gray-300"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`py-10 text-center border-2 border-dashed rounded-[var(--vendor-radius-panel)] ${
                      fieldErrors.quickLinks
                        ? "border-rose-500 bg-rose-50/40 ring-4 ring-rose-500/5"
                        : "border-[var(--vendor-border)]/50"
                    }`}
                  >
                    <LinkIcon size={24} className={`mx-auto mb-2 ${fieldErrors.quickLinks ? "text-rose-400" : "text-gray-300"}`} />
                    <p className={`text-sm ${fieldErrors.quickLinks ? "text-rose-600 font-semibold" : "text-[var(--vendor-text-muted)]"}`}>
                      {fieldErrors.quickLinks || "No quick links yet."}
                    </p>
                    <p className="text-xs text-gray-300 mt-1">Click &quot;Add Pages&quot; to choose pages for the footer.</p>
                  </div>
                )}

                {/* Newsletter Card */}
                <div className="p-6 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-gray-50/50 dark:bg-white/5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[var(--vendor-control-text)] font-semibold text-[var(--vendor-text-muted)] dark:text-gray-500 uppercase tracking-[0.2em] px-1">
                      Newsletter
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-white dark:bg-sidebar transition-all">
                    <div className="flex items-center gap-3 transition-colors">
                      <input
                        type="checkbox"
                        id="newsletter-checkbox"
                        checked={newsletterEnabled}
                        disabled={!isEditing}
                        onChange={(e) => { if (isEditing) setNewsletterEnabled(e.target.checked); }}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary transition-all disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
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
                      <div className="space-y-3 p-5 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white dark:bg-sidebar shadow-sm">
                        <Label className="text-[10px] font-bold uppercase text-[var(--vendor-text-muted)] tracking-wider flex items-center gap-2">
                           Subscribe our newsletter
                        </Label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Input
                            value={newsletterEmailPreview}
                            readOnly
                            disabled
                            placeholder="Enter Email Address..."
                            className="h-11 text-xs bg-gray-100 dark:bg-[#121212] border-[var(--vendor-border)] rounded-[var(--vendor-radius-control)] font-medium flex-1 cursor-not-allowed opacity-70"
                          />
                          <Button type="button" disabled className="h-11 px-8 bg-primary text-white text-xs font-bold rounded-[var(--vendor-radius-control)] shadow-md shadow-primary/20 cursor-not-allowed opacity-70">
                            Subscribe
                          </Button>
                        </div>
                        <p className="text-[10px] italic text-[var(--vendor-text-muted)]">Preview only — readers subscribe on the public site.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Information [Multi-Mode] */}
                <div className="p-6 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-gray-50/50 dark:bg-white/5 space-y-6 shadow-sm">
                  <h3 className="text-[var(--vendor-control-text)] font-semibold text-[var(--vendor-text-muted)] dark:text-gray-500 uppercase tracking-[0.2em] px-1">
                    Contact Info
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Default Contact */}
                    <div
                      onClick={() => { if (isEditing) setContactMode("default"); }}
                      className={`group relative p-6 rounded-[var(--vendor-radius-panel)] border-2 cursor-pointer transition-all duration-300 ${
                        contactMode === "default"
                          ? "border-primary bg-white dark:bg-sidebar shadow-md shadow-primary/5 scale-[1.01]"
                          : "border-[var(--vendor-border)] bg-gray-50/30 dark:bg-white/5 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 hover:border-[var(--vendor-border)]"
                      } h-full flex flex-col`}
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
                      <div className="space-y-4 flex-1">
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold uppercase text-[var(--vendor-text-muted)] tracking-wider flex items-center gap-2">
                            <Phone size={10} /> MOBILE <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            value={defaultContact.mobile}
                            disabled={!isEditing}
                            onChange={(e) => isEditing && setDefaultContact({ ...defaultContact, mobile: e.target.value })}
                            placeholder="Enter Mobile Number..."
                            className="h-10 text-xs bg-white dark:bg-[#121212] border-[var(--vendor-border)] rounded-[var(--vendor-radius-control)] font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold uppercase text-[var(--vendor-text-muted)] tracking-wider flex items-center gap-2">
                            <Mail size={10} /> EMAIL <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            value={defaultContact.email}
                            disabled={!isEditing}
                            onChange={(e) => isEditing && setDefaultContact({ ...defaultContact, email: e.target.value.toLowerCase() })}
                            placeholder="Enter Email ID..."
                            className="h-10 text-xs bg-white dark:bg-[#121212] border-[var(--vendor-border)] rounded-[var(--vendor-radius-control)] font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold uppercase text-[var(--vendor-text-muted)] tracking-wider flex items-center gap-2">
                            <MapPin size={10} /> ADDRESS <span className="text-rose-500">*</span>
                          </Label>
                          <Textarea
                            value={defaultContact.address}
                            disabled={!isEditing}
                            onChange={(e) => isEditing && setDefaultContact({ ...defaultContact, address: e.target.value })}
                            placeholder="Enter Address..."
                            className="min-h-[80px] text-xs bg-white dark:bg-[#121212] border-[var(--vendor-border)] rounded-[var(--vendor-radius-control)] resize-none leading-relaxed font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Alternative Contact */}
                    <div
                      onClick={() => { if (isEditing) setContactMode("alternative"); }}
                      className={`group relative p-6 rounded-[var(--vendor-radius-panel)] border-2 cursor-pointer transition-all duration-300 ${
                        contactMode === "alternative"
                          ? "border-primary bg-white dark:bg-sidebar shadow-md shadow-primary/5 scale-[1.01]"
                          : "border-[var(--vendor-border)] bg-gray-50/30 dark:bg-white/5 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 hover:border-[var(--vendor-border)]"
                      } h-full flex flex-col`}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${contactMode === "alternative" ? "border-primary bg-primary" : "border-gray-300 dark:border-gray-600"}`}
                        >
                          {contactMode === "alternative" && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                          )}
                        </div>
                        <span
                          className={`text-sm font-bold font-poppins transition-colors ${contactMode === "alternative" ? "text-primary" : "text-gray-500"}`}
                        >
                          Alternative Contact Info
                        </span>
                      </div>
                      <div className="space-y-4 flex-1">
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold uppercase text-[var(--vendor-text-muted)] tracking-wider flex items-center gap-2">
                            <Phone size={10} /> MOBILE <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            value={altContact.mobile}
                            disabled={!isEditing}
                            onChange={(e) => isEditing && setAltContact({ ...altContact, mobile: e.target.value })}
                            placeholder="Enter Mobile Number..."
                            className="h-10 text-xs bg-white dark:bg-[#121212] border-[var(--vendor-border)] rounded-[var(--vendor-radius-control)] font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold uppercase text-[var(--vendor-text-muted)] tracking-wider flex items-center gap-2">
                            <Mail size={10} /> EMAIL <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            value={altContact.email}
                            disabled={!isEditing}
                            onChange={(e) => isEditing && setAltContact({ ...altContact, email: e.target.value.toLowerCase() })}
                            placeholder="Enter Email ID..."
                            className="h-10 text-xs bg-white dark:bg-[#121212] border-[var(--vendor-border)] rounded-[var(--vendor-radius-control)] font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-bold uppercase text-[var(--vendor-text-muted)] tracking-wider flex items-center gap-2">
                            <MapPin size={10} /> ADDRESS <span className="text-rose-500">*</span>
                          </Label>
                          <Textarea
                            value={altContact.address}
                            disabled={!isEditing}
                            onChange={(e) => isEditing && setAltContact({ ...altContact, address: e.target.value })}
                            placeholder="Enter Address..."
                            className="min-h-[80px] text-xs bg-white dark:bg-[#121212] border-[var(--vendor-border)] rounded-[var(--vendor-radius-control)] resize-none leading-relaxed font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Section 3: Footer Bottom */}
            <div className="bg-white dark:bg-sidebar p-6 rounded-[var(--vendor-radius-panel)] shadow-sm border border-[var(--vendor-border)] space-y-6">
              <div className="flex items-center gap-3 border-b pb-4">
                <div className="w-10 h-10 rounded-[var(--vendor-radius-control)] bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600">
                  <Copyright size={20} />
                </div>
                <h3 className="text-lg font-bold text-[var(--vendor-text)] font-poppins">
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
                    disabled
                    readOnly
                    placeholder="Configured from admin vendor information"
                    className="h-11 dark:border-[var(--vendor-border)] disabled:opacity-70 disabled:cursor-not-allowed border-[var(--vendor-border)]"
                  />
                  <p className="text-[11px] font-medium text-[var(--vendor-text-muted)]">Managed from Admin Portal vendor information.</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Powered By
                  </Label>
                  <Input
                    value={poweredBy}
                    disabled
                    readOnly
                    placeholder="Configured from admin vendor information"
                    className="h-11 dark:border-[var(--vendor-border)] disabled:opacity-70 disabled:cursor-not-allowed border-[var(--vendor-border)]"
                  />
                  <p className="text-[11px] font-medium text-[var(--vendor-text-muted)]">Managed from Admin Portal vendor information.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Terms & Privacy mandatory alerts ─────────────── */}
          {(fieldErrors.terms || fieldErrors.privacy) && (
            <div className="lg:col-span-9 -mt-2 space-y-2">
              {fieldErrors.terms && (
                <div className="px-4 py-3 rounded-[var(--vendor-radius-control)] border border-rose-300 bg-rose-50 text-rose-700 text-xs font-semibold flex items-center justify-between">
                  <span>Terms & Conditions content is required.</span>
                  <button
                    type="button"
                    onClick={() => router.push("/website/terms-conditions")}
                    className="underline font-bold"
                  >
                    Fill now
                  </button>
                </div>
              )}
              {fieldErrors.privacy && (
                <div className="px-4 py-3 rounded-[var(--vendor-radius-control)] border border-rose-300 bg-rose-50 text-rose-700 text-xs font-semibold flex items-center justify-between">
                  <span>Privacy Policy content is required.</span>
                  <button
                    type="button"
                    onClick={() => router.push("/website/privacy-policy")}
                    className="underline font-bold"
                  >
                    Fill now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Right Column: Sticky Actions ─────────────────── */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8">
            <div className="bg-[var(--vendor-panel-bg)] backdrop-blur-md p-6 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className={`w-full h-12 font-bold text-[13px] tracking-[0.1em] uppercase rounded-[var(--vendor-radius-panel)] shadow-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 ${
                isEditing
                  ? "bg-amber-500 text-white border-none hover:bg-amber-600 shadow-amber-500/20"
                  : "bg-white dark:bg-[#1e293b] text-[var(--vendor-text)] border border-[var(--vendor-border)] dark:border-[var(--vendor-border)] hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
            >
              <Edit className="size-4" />
              EDIT
            </Button>
            <PersistenceActions 
              onSave={handleSave}
              onPreview={() => window.open("/preview", "_blank")}
              onReset={handleReset}
              onCancel={() => router.push("/website/home")}
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--vendor-text-muted)] size-3.5" />
            <input
              placeholder="Search pages..."
              value={modalSearch}
              onChange={(e) => setModalSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-3 bg-gray-50 dark:bg-white/5 border border-[var(--vendor-border)] dark:border-[var(--vendor-border)] rounded-[var(--vendor-radius-control)] text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium"
            />
          </div>

          {/* Pages as cards */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-1 py-1">
            {vendorPages.length === 0 ? (
              <p className="text-center text-sm text-[var(--vendor-text-muted)] py-8">No pages found. Create pages first.</p>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {vendorPages
                  .filter((p) => p.name.toLowerCase().includes(modalSearch.toLowerCase()))
                  .map((page) => {
                    const isSelected = selectedLinks.some((l) => l.page_id === page.id);
                    return (
                      <div key={page.id} onClick={() => togglePageLink(page)}
                        className={`relative flex items-center gap-3 cursor-pointer rounded-[var(--vendor-radius-control)] border-2 p-4 transition-all select-none group ${
                          isSelected
                            ? "border-primary bg-primary/5 dark:bg-primary/10"
                            : "border-[var(--vendor-border)] hover:border-primary/40 hover:bg-gray-50 dark:hover:bg-white/5"
                        }`}>
                        {/* Check badge */}
                        {isSelected && (
                          <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check size={10} className="text-white" />
                          </span>
                        )}
                        <FileText size={20} className={`shrink-0 ${isSelected ? "text-primary" : "text-gray-300 group-hover:text-[var(--vendor-text-muted)]"}`} />
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
          <div className="shrink-0 flex items-center justify-between pt-3 border-t border-[var(--vendor-border)]">
            <span className="text-xs text-[var(--vendor-text-muted)] font-medium">
              {selectedLinks.length} page{selectedLinks.length !== 1 ? "s" : ""} selected
            </span>
            <Button onClick={() => setPageModalOpen(false)} className="h-9 px-6 text-xs font-bold">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Logo cropper (parity with Header page) ── */}
      <ImageCropper
        open={cropperOpen}
        imageSrc={imageToCrop}
        onClose={() => setCropperOpen(false)}
        onCropComplete={handleCropComplete}
        aspectRatio={3}
        outputWidth={900}
        outputHeight={300}
        outputType="image/png"
      />
    </div>
  );
}

