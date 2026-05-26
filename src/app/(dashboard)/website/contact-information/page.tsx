"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Edit, Contact } from "lucide-react";
import { toast } from "sonner";
import { useVendorAbout, useUpdateVendorAbout } from "@/hooks/use-vendors";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import { WebsiteSettingsPageSkeleton } from "@/components/boneyard/website-settings-page-skeleton";
import { validateEmail, validateMobile } from "@/lib/validation";

export default function ContactInfoPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [contactMode, setContactMode] = useState<"default" | "alternative">("default");

  const { data: vendor, isLoading, refetch } = useVendorAbout();
  const updateMutation = useUpdateVendorAbout();

  const [defaultContact, setDefaultContact] = useState({ mobile: "", email: "", address: "" });
  const [altContact, setAltContact] = useState({
    mobile: "", alt_mobile: "", email: "", address: "", alt_address: "",
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

  useEffect(() => {
    if (!vendor) return;
    setDefaultContact({
      mobile:  vendor.company_contact || "",
      email:   (vendor.company_email   || "").toLowerCase(),
      address: vendor.company_address || "",
    });
    setAltContact({
      mobile:      vendor.contact      || "",
      alt_mobile:  vendor.alt_contact  || "",
      email:       (vendor.alt_email    || "").toLowerCase(),
      address:     vendor.address      || "",
      alt_address: vendor.alt_address  || "",
    });
    if (vendor.contact_mode === "alternative") {
      setContactMode("alternative");
    } else {
      setContactMode("default");
    }
  }, [vendor]);

  const handleSave = async () => {
    if (!validateContactBlock("Default contact", defaultContact)) return;
    if (!validateContactBlock("Alternative contact", altContact)) return;

    await updateMutation.mutateAsync({
      company_contact: defaultContact.mobile.trim(),
      company_email:   defaultContact.email.trim().toLowerCase(),
      company_address: defaultContact.address.trim(),
      contact:         altContact.mobile.trim(),
      alt_contact:     altContact.alt_mobile,
      alt_email:       altContact.email.trim().toLowerCase(),
      address:         altContact.address.trim(),
      alt_address:     altContact.alt_address,
      contact_mode:    contactMode,
    });
    setIsEditing(false);
    toast.success("Contact info updated.");
  };

  const handleReset = async () => {
    // Force-pull latest server state, then re-populate every field
    const { data: fresh } = await refetch();
    const src = fresh || vendor;
    if (!src) return;
    setDefaultContact({
      mobile:  src.company_contact || "",
      email:   (src.company_email   || "").toLowerCase(),
      address: src.company_address || "",
    });
    setAltContact({
      mobile:      src.contact      || "",
      alt_mobile:  src.alt_contact  || "",
      email:       (src.alt_email    || "").toLowerCase(),
      address:     src.address      || "",
      alt_address: src.alt_address  || "",
    });
    setContactMode(src.contact_mode === "alternative" ? "alternative" : "default");
    toast.info("Contact info reset.");
  };

  if (isLoading) return <WebsiteSettingsPageSkeleton />;

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar">
      {/* Page Header */}
      <div className="max-w-[1700px] mx-auto mb-8">
        <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1">Contact Info</h1>
        <p className="text-sm text-[var(--vendor-text-muted)]">
          Manage the contact details shown in your website header and footer.
        </p>
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Card */}
        <div className="lg:col-span-9">
          <div className="bg-white dark:bg-sidebar p-8 rounded-[var(--vendor-radius-panel)] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-none">

            {/* Card Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-[var(--vendor-radius-control)] bg-primary/5 flex items-center justify-center text-primary">
                <Contact size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--vendor-text)]">Contact Info</h3>
                <p className="text-xs text-[var(--vendor-text-muted)] mt-0.5">
                  These details appear in your website header and footer.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Default Contact */}
              <div
                onClick={() => isEditing && setContactMode("default")}
                className={`group relative p-6 rounded-[var(--vendor-radius-panel)] border-2 transition-all duration-300 ${
                  isEditing ? "cursor-pointer" : "cursor-default"
                } ${
                  contactMode === "default"
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/5" + (isEditing ? " scale-[1.02]" : "")
                    : isEditing
                      ? "border-[var(--vendor-border)] bg-gray-50/30 dark:bg-white/5 opacity-60 hover:opacity-100 hover:border-[var(--vendor-border)]"
                      : "border-[var(--vendor-border)] bg-gray-50/30 dark:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${contactMode === "default" ? "border-primary bg-primary" : "border-gray-300 dark:border-gray-600"}`}>
                    {contactMode === "default" && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
                  </div>
                  <span className={`text-sm font-bold transition-colors ${contactMode === "default" ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}>
                    Default Contact Info
                  </span>
                  {!isEditing && contactMode === "default" && (
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">Active</span>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-[var(--vendor-text-muted)] tracking-wider flex items-center gap-2">
                      <Phone className="size-2.5" /> MOBILE <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      value={defaultContact.mobile}
                      onChange={(e) => setDefaultContact({ ...defaultContact, mobile: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Enter Mobile Number..."
                      className="h-10 text-xs bg-white dark:bg-[#121212] border-[var(--vendor-border)] rounded-[var(--vendor-radius-control)] font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-[var(--vendor-text-muted)] tracking-wider flex items-center gap-2">
                      <Mail className="size-2.5" /> EMAIL <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      value={defaultContact.email}
                      onChange={(e) => setDefaultContact({ ...defaultContact, email: e.target.value.toLowerCase() })}
                      disabled={!isEditing}
                      placeholder="Enter Email ID..."
                      className="h-10 text-xs bg-white dark:bg-[#121212] border-[var(--vendor-border)] rounded-[var(--vendor-radius-control)] font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-[var(--vendor-text-muted)] tracking-wider flex items-center gap-2">
                      <MapPin className="size-2.5" /> ADDRESS <span className="text-rose-500">*</span>
                    </Label>
                    <Textarea
                      value={defaultContact.address}
                      onChange={(e) => setDefaultContact({ ...defaultContact, address: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Enter Address..."
                      className="min-h-[80px] text-xs bg-white dark:bg-[#121212] border-[var(--vendor-border)] rounded-[var(--vendor-radius-control)] resize-none leading-relaxed font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Alternative Contact */}
              <div
                onClick={() => isEditing && setContactMode("alternative")}
                className={`group relative p-6 rounded-[var(--vendor-radius-panel)] border-2 transition-all duration-300 ${
                  isEditing ? "cursor-pointer" : "cursor-default"
                } ${
                  contactMode === "alternative"
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/5" + (isEditing ? " scale-[1.02]" : "")
                    : isEditing
                      ? "border-[var(--vendor-border)] bg-gray-50/30 dark:bg-white/5 opacity-60 hover:opacity-100 hover:border-[var(--vendor-border)]"
                      : "border-[var(--vendor-border)] bg-gray-50/30 dark:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${contactMode === "alternative" ? "border-primary bg-primary" : "border-gray-300 dark:border-gray-600"}`}>
                    {contactMode === "alternative" && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
                  </div>
                  <span className={`text-sm font-bold transition-colors ${contactMode === "alternative" ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}>
                    Alternative Contact Info
                  </span>
                  {!isEditing && contactMode === "alternative" && (
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">Active</span>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-[var(--vendor-text-muted)] tracking-wider flex items-center gap-2">
                      <Phone className="size-2.5" /> MOBILE <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      value={altContact.mobile}
                      onChange={(e) => setAltContact({ ...altContact, mobile: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Enter Mobile Number..."
                      className="h-10 text-xs bg-white dark:bg-[#121212] border-[var(--vendor-border)] rounded-[var(--vendor-radius-control)] font-medium"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-[var(--vendor-text-muted)] tracking-wider flex items-center gap-2">
                      <Mail className="size-2.5" /> EMAIL <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      value={altContact.email}
                      onChange={(e) => setAltContact({ ...altContact, email: e.target.value.toLowerCase() })}
                      disabled={!isEditing}
                      placeholder="Enter Email ID..."
                      className="h-10 text-xs bg-white dark:bg-[#121212] border-[var(--vendor-border)] rounded-[var(--vendor-radius-control)] font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-[var(--vendor-text-muted)] tracking-wider flex items-center gap-2">
                      <MapPin className="size-2.5" /> ADDRESS <span className="text-rose-500">*</span>
                    </Label>
                    <Textarea
                      value={altContact.address}
                      onChange={(e) => setAltContact({ ...altContact, address: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Enter Address..."
                      className="min-h-[80px] text-xs bg-white dark:bg-[#121212] border-[var(--vendor-border)] rounded-[var(--vendor-radius-control)] resize-none leading-relaxed font-medium"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Sticky Sidebar */}
        <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-8">
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
              onPreview={() => window.open("/preview?previewPage=contact", "_blank")}
              onReset={handleReset}
              onCancel={() => router.push("/website/home")}
              saveLabel={updateMutation.isPending ? "SAVING..." : "UPDATE"}
              isSubmitting={updateMutation.isPending}
            />
          </div>

          {/* Quick summary panel */}
          <div className="bg-[var(--vendor-panel-bg)] p-4 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--vendor-text-muted)]">Default</p>
            {[
              { icon: Phone,  value: defaultContact.mobile  },
              { icon: Mail,   value: defaultContact.email   },
              { icon: MapPin, value: defaultContact.address },
            ].map(({ icon: Icon, value }, i) => (
              <div key={i} className="flex items-start gap-2">
                <Icon className="size-3 text-[var(--vendor-text-muted)] mt-0.5 shrink-0" />
                <p className="text-[11px] text-[var(--vendor-text-muted)] truncate">
                  {value || <span className="italic text-gray-300 dark:text-gray-600">Not set</span>}
                </p>
              </div>
            ))}

            <div className="border-t border-[var(--vendor-border)] dark:border-white/5 pt-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--vendor-text-muted)] mb-2">Alternative</p>
              {[
                { icon: Phone,  value: altContact.mobile      },
                { icon: Mail,   value: altContact.email       },
                { icon: MapPin, value: altContact.address     },
              ].map(({ icon: Icon, value }, i) => (
                <div key={i} className="flex items-start gap-2 mb-2">
                  <Icon className="size-3 text-[var(--vendor-text-muted)] mt-0.5 shrink-0" />
                  <p className="text-[11px] text-[var(--vendor-text-muted)] truncate">
                    {value || <span className="italic text-gray-300 dark:text-gray-600">Not set</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

