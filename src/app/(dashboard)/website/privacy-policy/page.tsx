"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useVendorPrivacy, useUpdateVendorPrivacy } from "@/hooks/use-vendor-pages";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import { toast } from "sonner";
import { WebsiteSettingsPageSkeleton } from "@/components/boneyard/website-settings-page-skeleton";

export default function PrivacyPolicyPage() {
  const [isEditing, setIsEditing] = useState(false);
  const { data, isLoading } = useVendorPrivacy();
  const updateMutation = useUpdateVendorPrivacy();
  const [content, setContent] = useState("");

  useEffect(() => {
    if (data) setContent(data.content || "");
  }, [data]);

  const handleSave = async () => {
    await updateMutation.mutateAsync({ content });
    setIsEditing(false);
  };

  const handleReset = () => {
    setContent(data?.content || "");
    toast.info("Reset to saved content.");
  };

  if (isLoading) return <WebsiteSettingsPageSkeleton />;

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar">
      <div className="max-w-[1700px] mx-auto mb-8">
        <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1">Privacy Policy</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Write your privacy policy for customers.</p>
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white dark:bg-sidebar p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-none">
            <RichTextEditor
              key={isEditing ? "edit" : "view"}
              value={content}
              onChange={setContent}
              placeholder="Write your privacy policy here..."
              height="500px"
              readOnly={!isEditing}
            />
          </div>
        </div>

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
              <Edit className="size-4" />
              EDIT
            </Button>
            <PersistenceActions
              onSave={handleSave}
              onPreview={() => window.open("/preview?previewPage=privacy-policy", "_blank")}
              onReset={handleReset}
              onCancel={() => setIsEditing(false)}
              saveLabel={updateMutation.isPending ? "SAVING..." : "UPDATE"}
              isSubmitting={updateMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
