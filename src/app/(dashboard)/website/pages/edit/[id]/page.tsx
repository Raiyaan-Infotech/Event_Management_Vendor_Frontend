"use client";

import { useState, useEffect, use } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useVendorPage, useUpdateVendorPage } from "@/hooks/use-vendor-pages";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Plus, X, Eye, ArrowLeft } from "lucide-react";
import { PersistenceActions } from "@/components/common/PersistenceActions";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditWebsitePage({ params }: EditPageProps) {
  const { id } = use(params);
  const pageId = Number(id);
  const router = useRouter();

  const { data: page, isLoading } = useVendorPage(pageId);
  const { mutate: updatePage, isPending } = useUpdateVendorPage(pageId);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    content: "",
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

  const handleSave = () => {
    if (!formData.name.trim() || !formData.description.trim() || !formData.content.trim()) {
      toast.error("Please fill in all mandatory fields");
      return;
    }
    updatePage({ name: formData.name, description: formData.description, content: formData.content });
  };

  if (isLoading) {
    return <div className="h-[calc(100vh-86px)] flex items-center justify-center"><p className="text-gray-500 font-bold">Loading Editor...</p></div>;
  }

  if (!page) {
    router.push("/website/pages");
    return null;
  }

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar">
      <div className="max-w-[1700px] mx-auto mb-8">
        <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1 font-poppins">Edit Page</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Modify the basic information and content for this page.</p>
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom duration-1000">
          {/* Left side: Form Inputs */}
          <div className="lg:col-span-9 space-y-6 relative z-0">
            {/* Edit Page Details Card */}
            <div className="bg-white dark:bg-sidebar p-6 md:p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-none">

               <div className="space-y-6">
                 {/* Name Field */}
                 <div className="space-y-2">
                   <Label className="text-sm font-bold text-gray-900 dark:text-white font-poppins">Page Name <span className="text-red-500">*</span></Label>
                   <Input 
                     value={formData.name}
                     onChange={(e) => updateForm("name", e.target.value)}
                     placeholder="Enter page name.."
                     className="h-11 bg-gray-50 focus:bg-white dark:bg-[#1e1e1e] border-gray-200 dark:border-gray-800 rounded-lg"
                   />
                 </div>

                 {/* Description Field */}
                 <div className="space-y-2">
                   <Label className="text-sm font-bold text-gray-900 dark:text-white font-poppins">Short Description <span className="text-red-500">*</span></Label>
                   <Textarea 
                     value={formData.description}
                     onChange={(e) => updateForm("description", e.target.value)}
                     placeholder="type the description here ..."
                     className="min-h-[120px] bg-gray-50 focus:bg-white dark:bg-[#1e1e1e] border-gray-200 dark:border-gray-800 resize-none rounded-lg"
                   />
                 </div>
               </div>
            </div>

            {/* Page Content Card */}
            <div className="bg-white dark:bg-sidebar p-6 md:p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-none">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-900 dark:text-white font-poppins mb-2 block">Page Content <span className="text-red-500">*</span></Label>
                 <RichTextEditor 
                   value={formData.content} 
                   onChange={(val) => updateForm("content", val)}
                   height="400px"
                   placeholder="Enter page content here..."
                 />
              </div>
            </div>
          </div>

          {/* Right side: Actions & Live Preview */}
          <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-8">
            <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
                <PersistenceActions 
                  onSave={handleSave}
                  onCancel={() => router.push("/website/pages")}
                  onPreview={() => setIsPreviewOpen(true)}
                  saveLabel="SAVE"
                  isSubmitting={isPending}
                />
            </div>
          </div>
        </div>

      {/* Full Page Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
         <DialogContent className="sm:max-w-none w-[96vw] max-w-[1700px] h-[94vh] p-0 gap-0 overflow-hidden rounded-3xl border-none bg-gray-50 dark:bg-[#0f1115] focus:outline-none shadow-2xl">
            <DialogHeader className="bg-white dark:bg-sidebar border-b border-gray-100 dark:border-white/5 px-8 py-4 shrink-0 relative">
               <div className="flex items-center justify-between w-full h-12">
                  <div className="flex items-center z-10">
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       onClick={() => setIsPreviewOpen(false)}
                       className="hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl gap-2 text-gray-800 dark:text-white font-black uppercase text-[10px] tracking-widest px-4 transition-all active:scale-95 border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                     >
                        <ArrowLeft size={14} className="text-primary" strokeWidth={3} />
                        Back to Editor
                     </Button>
                  </div>

                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 text-center">
                     <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner shrink-0 hidden sm:flex">
                        <Eye size={20} />
                     </div>
                     <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                        <DialogTitle className="text-base sm:text-xl font-black text-gray-900 dark:text-white font-poppins tracking-tighter leading-none">Webpage Preview</DialogTitle>
                        <p className="text-[9px] text-emerald-500 uppercase tracking-[0.4em] font-black mt-1">Live Page Showcase</p>
                     </div>
                  </div>
                  <div className="w-24 hidden sm:block" />
               </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-white dark:bg-[#0f1115]">
               {/* Hero Section */}
               <div className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5 py-24">
                  <div className="max-w-[1000px] mx-auto px-8 text-center space-y-6">
                     <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                        Official Page
                     </div>
                     <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter font-poppins leading-[1.1]">
                        {formData.name || "Untitled Page"}
                     </h1>
                     <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-[700px] mx-auto">
                        {formData.description || "No description provided for this page showcase."}
                     </p>
                  </div>
               </div>

               {/* Content Section */}
               <div className="py-24">
                  <div className="max-w-[1000px] mx-auto px-8">
                     <div 
                        className="prose prose-xl dark:prose-invert max-w-none prose-p:leading-[1.8] prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-headings:font-black prose-headings:tracking-tighter prose-strong:text-gray-900 dark:prose-strong:text-white prose-img:rounded-[2.5rem] prose-img:shadow-2xl font-medium"
                        dangerouslySetInnerHTML={{ __html: formData.content || "<p class='text-center text-gray-400 italic font-bold'>Your content will appear here...</p>" }}
                     />
                  </div>
               </div>

               {/* Mock Footer Placeholder */}
               <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 py-12">
                  <div className="max-w-[1000px] mx-auto px-8 text-center text-gray-400 text-sm font-bold uppercase tracking-widest">
                     Website Footer Placeholder
                  </div>
               </div>
            </div>
         </DialogContent>
      </Dialog>
    </div>
  );
}

