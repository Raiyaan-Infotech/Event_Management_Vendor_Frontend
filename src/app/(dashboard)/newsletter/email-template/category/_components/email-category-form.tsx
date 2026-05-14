"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import {
  useEmailCategory,
  useCreateEmailCategory,
  useUpdateEmailCategory,
} from "@/hooks/use-vendor-email-categories";

interface EmailCategoryFormProps {
  mode: "add" | "edit";
  id?: string;
}

export default function EmailCategoryForm({ mode, id }: EmailCategoryFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const { data: category, isLoading } = useEmailCategory(mode === "edit" ? id ?? null : null);
  const createMutation = useCreateEmailCategory();
  const updateMutation = useUpdateEmailCategory();

  useEffect(() => {
    if (category && mode === "edit") {
      setFormData({
        name: category.name || "",
        description: category.description || "",
      });
    }
  }, [category, mode]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Please fill in the Category Name");
      return;
    }

    if (mode === "edit" && id) {
      await updateMutation.mutateAsync({ id: Number(id), name: formData.name, description: formData.description });
    } else {
      await createMutation.mutateAsync({ name: formData.name, description: formData.description });
    }
    router.push("/newsletter/email-template/category");
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (mode === "edit" && isLoading) {
    return <div className="p-20 text-center font-bold animate-pulse text-[var(--vendor-text-muted)] uppercase tracking-wide">Loading Category...</div>;
  }

  const title = mode === "add" ? "Add Email Category" : "Edit Email Category";

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar">
      <div className="max-w-[1700px] mx-auto mb-8">
        <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1 font-poppins">{title}</h1>
        <p className="text-sm text-[var(--vendor-text-muted)] font-medium tracking-tight">Define a category to organize your email templates.</p>
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom duration-1000 pb-10">
        <div className="lg:col-span-9 space-y-6 relative z-0">
          <div className="bg-white dark:bg-sidebar p-6 md:p-8 rounded-[var(--vendor-radius-panel)] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-none">
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-1 ml-1">
                  <Label className="text-[var(--vendor-form-label-text)] font-semibold uppercase text-[var(--vendor-text-muted)] tracking-wide">Category Name</Label>
                  <span className="text-rose-500 font-bold">*</span>
                </div>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Welcome, Transactional, Notification"
                  className="h-11 bg-gray-50 focus:bg-white dark:bg-[#181d23] border-[var(--vendor-border)] rounded-[var(--vendor-radius-control)] text-sm font-bold shadow-sm transition-all focus:ring-4 focus:ring-[var(--vendor-primary-btn)]/10 focus:border-[var(--vendor-primary-btn)]/20"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-1 ml-1">
                  <Label className="text-[var(--vendor-form-label-text)] font-semibold uppercase text-[var(--vendor-text-muted)] tracking-wide">Description</Label>
                </div>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Short description for this category..."
                  rows={4}
                  className="bg-gray-50 focus:bg-white dark:bg-[#181d23] border-[var(--vendor-border)] rounded-[var(--vendor-radius-control)] text-sm font-bold shadow-sm transition-all focus:ring-4 focus:ring-[var(--vendor-primary-btn)]/10 focus:border-[var(--vendor-primary-btn)]/20"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[var(--vendor-panel-bg)] backdrop-blur-md p-6 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-0 transition-all">
            <PersistenceActions
              onSave={handleSave}
              onCancel={() => router.push("/newsletter/email-template/category")}
              saveLabel={isSubmitting ? "SAVING..." : mode === "edit" ? "UPDATE" : "CREATE"}
              cancelLabel="CANCEL"
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
