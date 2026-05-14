"use client";

import { useState, useEffect, use } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useVendorPage, useUpdateVendorPage } from "@/hooks/use-vendor-pages";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { FileText, AlignLeft } from "lucide-react";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import { CommonCard } from "@/components/common/CommonCard";
import { FormGroup } from "@/components/common/FormGroup";
import { vendorUi } from "@/lib/vendor-ui";

const PAGE_NAME_MAX_LENGTH = 25;

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditWebsitePage({ params }: EditPageProps) {
  const { id } = use(params);
  const pageId = Number(id);
  const router = useRouter();

  const { data: page, isLoading } = useVendorPage(pageId);
  const { mutate: updatePage, isPending } = useUpdateVendorPage(pageId);

  const [formData, setFormData] = useState({ name: "", description: "", content: "" });

  useEffect(() => {
    if (page) {
      setFormData({
        name: page.name,
        description: page.description || "",
        content: page.content || "",
      });
    }
  }, [page]);

  const updateForm = (field: "name" | "description" | "content", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const stripHtmlText = (html: string) => {
    if (typeof document === "undefined") return html.replace(/<[^>]*>/g, "").trim();
    const div = document.createElement("div");
    div.innerHTML = html;
    return (div.textContent || div.innerText || "").trim();
  };

  const handleSave = () => {
    if (!formData.name.trim()) { toast.error("Page name is required"); return; }
    if (!formData.description.trim()) { toast.error("Short description is required"); return; }
    if (!stripHtmlText(formData.content)) { toast.error("Page content is required"); return; }
    if (formData.name.trim().length > PAGE_NAME_MAX_LENGTH) {
      toast.error(`Page name must be ${PAGE_NAME_MAX_LENGTH} characters or less`);
      return;
    }
    updatePage({
      name: formData.name.trim(),
      description: formData.description,
      content: formData.content,
    });
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-86px)] flex items-center justify-center">
        <p className={vendorUi.type.pageSubtitle}>Loading editor…</p>
      </div>
    );
  }

  if (!page) {
    router.push("/website/pages");
    return null;
  }

  return (
    <div className={vendorUi.page.shell}>
      <div className={vendorUi.page.inner}>
        <div className="mb-6">
          <h1 className={vendorUi.type.pageTitle}>Edit Page</h1>
          <p className={vendorUi.type.pageSubtitle}>Modify the basic information and content for this page.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-9 space-y-6">
            <CommonCard title="Page Details" subtitle="Name and description for this page" icon={FileText}>
              <div className="space-y-6">
                <FormGroup label="Page Name" required>
                  <Input
                    value={formData.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    placeholder="Enter page name.."
                    className={`h-10 pl-4 border-[var(--vendor-border)] bg-gray-50/50 rounded-[var(--vendor-radius-control)] transition-all ${vendorUi.form.input}`}
                  />
                </FormGroup>

                <FormGroup label="Short Description" required>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    placeholder="Type the description here..."
                    className={`w-full px-4 py-3 min-h-[100px] resize-none border border-[var(--vendor-border)] bg-gray-50/50 rounded-[var(--vendor-radius-control)] outline-none transition-all focus:border-[var(--vendor-primary-btn)]/20 focus:ring-4 focus:ring-[var(--vendor-primary-btn)]/10 ${vendorUi.form.input}`}
                  />
                </FormGroup>
              </div>
            </CommonCard>

            <CommonCard title="Page Content" subtitle="Main body content for this page" icon={AlignLeft}>
              <RichTextEditor
                value={formData.content}
                onChange={(val) => updateForm("content", val)}
                height="400px"
                placeholder="Enter page content here..."
              />
            </CommonCard>
          </div>

          <div className="lg:col-span-3 lg:sticky lg:top-8">
            <div className="vendor-panel vendor-panel-padded">
              <PersistenceActions
                onSave={handleSave}
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
