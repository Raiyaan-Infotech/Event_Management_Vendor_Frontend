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
  };

  const handleSave = async () => {
    if (mode === "view") return;
    if (!formData.name.trim() || !formData.category_id) {
      toast.error("Please fill in Template Name and Category");
      return;
    }

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
    return <div className="p-20 text-center font-bold animate-pulse text-gray-400 uppercase tracking-widest">Loading Template Data...</div>;
  }

  const title = mode === "add" ? "Add Email Template" : mode === "edit" ? "Edit Email Template" : "View Email Template";
  const subtitle = mode === "view" ? "" : "Define your template structure and design your notification content.";

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar">
      {/* Header Section */}
      <div className="max-w-[1700px] mx-auto mb-8">
        <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1 font-poppins">{title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-tight">{subtitle}</p>
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom duration-1000 pb-10">
        {/* Main Content: Left Side (9 cols) */}
        <div className="lg:col-span-9 space-y-6 relative z-0">

          {/* Template Details Card */}
          <div className="bg-white dark:bg-sidebar p-6 md:p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name Field */}
              <div className="space-y-3">
                <div className="flex items-center gap-1 ml-1">
                  <Label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Template Name</Label>
                  {mode !== "view" && <span className="text-rose-500 font-bold">*</span>}
                </div>
                <Input
                  value={formData.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="Enter Template name.."
                  readOnly={mode === "view"}
                  className="h-11 bg-gray-50 focus:bg-white dark:bg-[#181d23] border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold shadow-sm transition-all focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 disabled:opacity-80"
                />
              </div>

              {/* Category Dropdown */}
              <div className="space-y-3">
                <div className="flex items-center gap-1 ml-1">
                  <Label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Category</Label>
                  {mode !== "view" && <span className="text-rose-500 font-bold">*</span>}
                </div>
                {mode === "view" ? (
                  <Input
                    value={template?.category?.name || "—"}
                    readOnly
                    className="h-11 bg-gray-50 dark:bg-[#181d23] border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold shadow-sm disabled:opacity-80"
                  />
                ) : (
                  <Select value={formData.category_id} onValueChange={(val) => updateForm("category_id", val)}>
                    <SelectTrigger className="h-11 bg-gray-50 focus:bg-white dark:bg-[#181d23] border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold shadow-sm transition-all focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-100 font-bold">
                      {categories.map((cat: { id: number; name: string }) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>

          {/* Email Content Card */}
          <div className="bg-white dark:bg-sidebar p-6 md:p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-none overflow-hidden">
            <div className="space-y-3">
               <div className="flex items-center gap-1 ml-1">
                 <Label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Description</Label>
               </div>
               <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#181d23]/50 overflow-hidden shadow-sm">
                  <RichTextEditor
                    value={formData.description}
                    onChange={(val) => updateForm("description", val)}
                    height="450px"
                    readOnly={mode === "view"}
                    placeholder={mode === "view" ? "No content." : "Design your professional email template here using our HTML editor..."}
                  />
               </div>
            </div>
          </div>
        </div>

        {/* Action Sidebar: Right Side (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-0 transition-all">
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
