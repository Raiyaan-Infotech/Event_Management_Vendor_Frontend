"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useCreateVendorPage } from "@/hooks/use-vendor-pages";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { FileText, AlignLeft, ArrowLeft, AlertCircle } from "lucide-react";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import { CommonCard } from "@/components/common/CommonCard";
import { FormGroup } from "@/components/common/FormGroup";
import { vendorUi } from "@/lib/vendor-ui";

const PAGE_NAME_MAX_LENGTH = 25;

export default function CreateWebsitePage() {
  const router = useRouter();
  const { mutate: createPage, isPending } = useCreateVendorPage();
  const [formData, setFormData] = useState({ name: "", description: "", content: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateForm = (field: "name" | "description" | "content", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const stripHtmlText = (html: string) => {
    if (typeof document === "undefined") return html.replace(/<[^>]*>/g, "").trim();
    const div = document.createElement("div");
    div.innerHTML = html;
    return (div.textContent || div.innerText || "").trim();
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Page name is required";
    else if (formData.name.trim().length > PAGE_NAME_MAX_LENGTH)
      newErrors.name = `Page name must be ${PAGE_NAME_MAX_LENGTH} characters or less`;
    if (!formData.description.trim()) newErrors.description = "Short description is required";
    if (!stripHtmlText(formData.content)) newErrors.content = "Page content is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill all mandatory fields.");
      return;
    }
    setErrors({});
    createPage({
      name: formData.name.trim(),
      description: formData.description,
      content: formData.content,
    });
  };

  return (
    <div className={vendorUi.page.shell}>
      <div className={vendorUi.page.inner}>
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/website/pages"
            className="w-9 h-9 flex items-center justify-center rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] text-[var(--vendor-text-muted)] hover:text-[var(--vendor-primary-btn)] hover:border-blue-100 transition-all"
            title="Back to Pages"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className={vendorUi.type.pageTitle}>Create Page</h1>
            <p className={vendorUi.type.pageSubtitle}>Define the basic information for your new page.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-9 space-y-6">
            <CommonCard title="Page Details" subtitle="Name and description for this page" icon={FileText}>
              <div className="space-y-6">
                <FormGroup label="Page Name" required error={errors.name}>
                  <Input
                    value={formData.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    placeholder="Enter page name.."
                    className={`h-10 pl-4 bg-gray-50/50 rounded-[var(--vendor-radius-control)] transition-all ${vendorUi.form.input} ${
                      errors.name
                        ? "border-rose-500 ring-4 ring-rose-500/5"
                        : "border-[var(--vendor-border)]"
                    }`}
                  />
                </FormGroup>

                <FormGroup label="Short Description" required error={errors.description}>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    placeholder="Type the description here..."
                    className={`w-full px-4 py-3 min-h-[100px] resize-none border bg-gray-50/50 rounded-[var(--vendor-radius-control)] outline-none transition-all ${vendorUi.form.input} ${
                      errors.description
                        ? "border-rose-500 ring-4 ring-rose-500/5"
                        : "border-[var(--vendor-border)] focus:border-[var(--vendor-primary-btn)]/20 focus:ring-4 focus:ring-[var(--vendor-primary-btn)]/10"
                    }`}
                  />
                </FormGroup>
              </div>
            </CommonCard>

            <CommonCard
              title={
                <span>
                  Page Content <span className="text-red-500 ml-1">*</span>
                </span>
              }
              subtitle="Main body content for this page"
              icon={AlignLeft}
            >
              <div
                className={
                  errors.content
                    ? "ring-4 ring-rose-500/10 border border-rose-500 rounded-[var(--vendor-radius-control)]"
                    : ""
                }
              >
                <RichTextEditor
                  value={formData.content}
                  onChange={(val) => updateForm("content", val)}
                  height="400px"
                  placeholder="Enter page content here..."
                />
              </div>
              {errors.content && (
                <div className="flex items-center gap-1.5 mt-2">
                  <AlertCircle size={12} className="text-rose-500" />
                  <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wide">
                    {errors.content}
                  </span>
                </div>
              )}
            </CommonCard>
          </div>

          <div className="lg:col-span-3">
            <div className="vendor-panel vendor-panel-padded">
              <PersistenceActions
                onSave={handleSave}
                onPreview={() => toast.info("Save the page first to open a live preview.")}
                onCancel={() => router.push("/website/pages")}
                saveLabel="SAVE"
                isSubmitting={isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
