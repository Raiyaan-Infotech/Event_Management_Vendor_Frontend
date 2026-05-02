"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useVendorAbout, useUpdateVendorAbout } from "@/hooks/use-vendors";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import { WebsiteSettingsPageSkeleton } from "@/components/boneyard/website-settings-page-skeleton";

export default function AboutUsPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const { data: vendor, isLoading } = useVendorAbout();
  const updateMutation = useUpdateVendorAbout();

  const [aboutUsContent, setAboutUsContent] = useState("");

  // Populate form from API data
  useEffect(() => {
    if (!vendor) return;
    setAboutUsContent(vendor.about_us || "");
  }, [vendor]);

  const handleSave = async () => {
    await updateMutation.mutateAsync({
      about_us: aboutUsContent,
    } as never);
    setIsEditing(false);
  };

  const handleReset = () => {
    if (!vendor) return;
    setAboutUsContent(vendor.about_us || "");
    toast.info("All settings reset.");
  };

  if (isLoading) return <WebsiteSettingsPageSkeleton />;

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar">
      {/* Page Header */}
      <div className="max-w-[1700px] mx-auto mb-8">
        <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1">About Us</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Write your company's story and description.</p>
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">

          <div className="bg-white dark:bg-sidebar p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-none">
            <RichTextEditor
              key={vendor ? vendor.id : "loading"}
              value={aboutUsContent}
              onChange={setAboutUsContent}
              placeholder="Write your company's story here..."
              height="500px"
              readOnly={!isEditing}
            />
          </div>

        </div>

        {/* Sticky Sidebar Actions */}
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
              onPreview={() => window.open("/preview#about-us", "_blank")}
              onReset={handleReset}
              onCancel={() => router.push("/website/management")}
              saveLabel={updateMutation.isPending ? "SAVING..." : "UPDATE"}
              isSubmitting={updateMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
