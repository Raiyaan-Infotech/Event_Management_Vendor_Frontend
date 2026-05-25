"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useVendorEmailTemplate,
  useCreateVendorEmailTemplate,
  useUpdateVendorEmailTemplate,
} from "@/hooks/use-vendor-email-templates";
import { useEmailCategories } from "@/hooks/use-vendor-email-categories";

interface EmailTemplateFormProps {
  mode: "add" | "edit" | "view";
  id?: string;
}

export default function EmailTemplateForm({ mode, id }: EmailTemplateFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: template, isLoading } = useVendorEmailTemplate(mode !== "add" ? id ?? null : null);
  const { data: categoriesRes } = useEmailCategories({ limit: 100 });
  const createMutation = useCreateVendorEmailTemplate();
  const updateMutation = useUpdateVendorEmailTemplate();

  const categories = categoriesRes?.data || [];

  useEffect(() => {
    if (template && mode !== "add") {
      setFormData({
        name: template.name || "",
        category_id: template.category_id ? String(template.category_id) : "",
        description: template.description || "",
      });
    }
  }, [template, mode]);

  const updateForm = (field: keyof typeof formData, value: string) => {
    if (mode === "view") return;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const handleSave = async () => {
    if (mode === "view") return;
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Template name is required";
    if (!formData.category_id) newErrors.category_id = "Category is required";
    const descText = (formData.description || "").replace(/<[^>]*>/g, "").trim();
    if (!descText) newErrors.description = "Description is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill all mandatory fields.");
      return;
    }
    setErrors({});

    const payload = {
      name: formData.name,
      category_id: Number(formData.category_id),
      description: formData.description,
    };

    if (mode === "edit" && id) {
      await updateMutation.mutateAsync({ id: Number(id), ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    router.push("/newsletter/email-template");
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (mode !== "add" && isLoading) {
    return <div className="p-20 text-center font-bold animate-pulse text-[var(--vendor-text-muted)] uppercase tracking-wide">Loading Template Data...</div>;
  }

  const title = mode === "add" ? "Add Email Template" : mode === "edit" ? "Edit Email Template" : "View Email Template";
  const subtitle = mode === "view" ? "" : "Define your template structure and design your notification content.";

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar">
      {/* Header Section */}
      <div className="max-w-[1700px] mx-auto mb-8">
        <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1 font-poppins">{title}</h1>
        <p className="text-sm text-[var(--vendor-text-muted)] font-medium tracking-tight">{subtitle}</p>
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom duration-1000 pb-10">
        {/* Main Content: Left Side (9 cols) */}
        <div className="lg:col-span-9 space-y-6 relative z-0">

          {/* Template Details Card */}
          <div className="bg-white dark:bg-sidebar p-6 md:p-8 rounded-[var(--vendor-radius-panel)] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name Field */}
              <div className="space-y-3">
                <div className="flex items-center gap-1 ml-1">
                  <Label className="text-[var(--vendor-form-label-text)] font-semibold uppercase text-[var(--vendor-text-muted)] tracking-wide">Template Name</Label>
                  {mode !== "view" && <span className="text-rose-500 font-bold">*</span>}
                </div>
                <Input
                  value={formData.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="Enter Template name.."
                  readOnly={mode === "view"}
                  className={`h-11 bg-gray-50 focus:bg-white dark:bg-[#181d23] rounded-[var(--vendor-radius-control)] text-sm font-bold shadow-sm transition-all disabled:opacity-80 ${errors.name ? "border-rose-500 ring-4 ring-rose-500/5" : "border-[var(--vendor-border)] focus:ring-4 focus:ring-[var(--vendor-primary-btn)]/10 focus:border-[var(--vendor-primary-btn)]/20"}`}
                />
                {errors.name && (
                  <p className="text-[11px] font-semibold text-rose-500 ml-1">{errors.name}</p>
                )}
              </div>

              {/* Category Dropdown */}
              <div className="space-y-3">
                <div className="flex items-center gap-1 ml-1">
                  <Label className="text-[var(--vendor-form-label-text)] font-semibold uppercase text-[var(--vendor-text-muted)] tracking-wide">Category</Label>
                  {mode !== "view" && <span className="text-rose-500 font-bold">*</span>}
                </div>
                {mode === "view" ? (
                  <Input
                    value={template?.category?.name || "—"}
                    readOnly
                    className="h-11 bg-gray-50 dark:bg-[#181d23] border-[var(--vendor-border)] rounded-[var(--vendor-radius-control)] text-sm font-bold shadow-sm disabled:opacity-80"
                  />
                ) : (
                  <Select value={formData.category_id} onValueChange={(val) => updateForm("category_id", val)}>
                    <SelectTrigger className={`h-11 bg-gray-50 focus:bg-white dark:bg-[#181d23] rounded-[var(--vendor-radius-control)] text-sm font-bold shadow-sm transition-all ${errors.category_id ? "border-rose-500 ring-4 ring-rose-500/5" : "border-[var(--vendor-border)] focus:ring-4 focus:ring-[var(--vendor-primary-btn)]/10 focus:border-[var(--vendor-primary-btn)]/20"}`}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-[var(--vendor-radius-control)] border-[var(--vendor-border)] font-bold">
                      {categories.map((cat: { id: number; name: string }) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.category_id && (
                  <p className="text-[11px] font-semibold text-rose-500 ml-1">{errors.category_id}</p>
                )}
              </div>
            </div>
          </div>

          {/* Email Content Card */}
          <div className="bg-white dark:bg-sidebar p-6 md:p-8 rounded-[var(--vendor-radius-panel)] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-none overflow-hidden">
            <div className="space-y-3">
               <div className="flex items-center gap-1 ml-1">
                 <Label className="text-[var(--vendor-form-label-text)] font-semibold uppercase text-[var(--vendor-text-muted)] tracking-wide">Description</Label>
                 {mode !== "view" && <span className="text-rose-500 font-bold">*</span>}
               </div>
               <div className={`rounded-[var(--vendor-radius-control)] border bg-gray-50/50 dark:bg-[#181d23]/50 overflow-hidden shadow-sm ${errors.description ? "border-rose-500 ring-4 ring-rose-500/10" : "border-[var(--vendor-border)]"}`}>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(val) => updateForm("description", val)}
                    height="450px"
                    readOnly={mode === "view"}
                    placeholder={mode === "view" ? "No content." : "Design your professional email template here using our HTML editor..."}
                  />
               </div>
               {errors.description && (
                 <p className="text-[11px] font-semibold text-rose-500 ml-1">{errors.description}</p>
               )}
            </div>
          </div>
        </div>

        {/* Action Sidebar: Right Side (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[var(--vendor-panel-bg)] backdrop-blur-md p-6 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-0 transition-all">
            <PersistenceActions
              onSave={mode !== "view" ? handleSave : undefined}
              onCancel={() => router.push("/newsletter/email-template")}
              saveLabel={isSubmitting ? "SAVING..." : mode === "edit" ? "UPDATE" : "CREATE"}
              cancelLabel={mode === "view" ? "BACK TO LIST" : "CANCEL"}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
