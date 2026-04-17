"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Send, Users, FileText, Settings2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

function RadioOptions({ 
  options, 
  value, 
  onChange, 
  activeColor = "blue" 
}: { 
  options: string[], 
  value: string, 
  onChange: (val: string) => void,
  activeColor?: "blue" | "emerald" | "purple"
}) {
  const colorMap = {
    blue: "bg-blue-600 text-white border-blue-600 shadow-blue-200",
    emerald: "bg-emerald-600 text-white border-emerald-600 shadow-emerald-200",
    purple: "bg-purple-600 text-white border-purple-600 shadow-purple-200"
  };

  return (
    <div className="flex flex-wrap gap-4">
      {options.map((opt) => {
        const isActive = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-[13px] font-black uppercase tracking-widest transition-all duration-300 shadow-sm",
              isActive 
                ? `${colorMap[activeColor]} shadow-lg scale-[1.02]` 
                : "bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50/50"
            )}
          >
            <div className={cn(
              "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
              isActive ? "border-white bg-white" : "border-gray-200"
            )}>
              {isActive && <div className={cn("w-2 h-2 rounded-full", activeColor === "blue" ? "bg-blue-600" : activeColor === "emerald" ? "bg-emerald-600" : "bg-purple-600")} />}
            </div>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function SendMailContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userType: "All",
    template: "",
    subscriptionStatus: "All",
  });
  const [templates, setTemplates] = useState<{ id: any, name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load email templates from localStorage
    const savedTemplates = localStorage.getItem("email_templates");
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  }, []);

  const handleSend = async () => {
    if (!formData.template) {
      toast.error("Please select an email template");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate campaign execution
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Newsletter campaign started successfully!");
      router.push("/website/newsletter/mail-status");
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar bg-[#F8FAFC] dark:bg-black/40">
      {/* Header Section */}
      <div className="max-w-[1700px] mx-auto mb-8">
        <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1 font-poppins">Send Newsletter</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-tight">Configure your audience and select a template to start your campaign.</p>
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom duration-1000 pb-10">
        {/* Main Content: Left Side (9 cols) */}
        <div className="lg:col-span-9 space-y-6 relative z-0">
          
          {/* Campaign Configuration Card */}
          <div className="bg-white dark:bg-sidebar p-8 md:p-10 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-none">
            <div className="space-y-12">
              
              {/* User Type Selection */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                      <Users size={18} />
                   </div>
                   <Label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Target User Type</Label>
                </div>
                <RadioOptions 
                  options={["Guest", "Registered", "All"]}
                  value={formData.userType}
                  onChange={(val) => setFormData({...formData, userType: val})}
                  activeColor="blue"
                />
              </div>

              {/* Template Selection */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <FileText size={18} />
                   </div>
                   <Label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Select Email Template</Label>
                </div>
                <div className="ml-1 max-w-md">
                   <Select value={formData.template} onValueChange={(val) => setFormData({...formData, template: val})}>
                      <SelectTrigger className="h-12 rounded-xl text-sm font-bold border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all">
                         <SelectValue placeholder="Choose a pre-designed template..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl font-bold border-gray-100">
                         {templates.map((t) => (
                           <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                         ))}
                         {templates.length === 0 && (
                           <SelectItem value="none" disabled>No templates created yet</SelectItem>
                         )}
                      </SelectContent>
                   </Select>
                </div>
              </div>

              {/* Subscription Status Selection */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600">
                      <Settings2 size={18} />
                   </div>
                   <Label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Subscription Status</Label>
                </div>
                <RadioOptions 
                  options={["Subscribe", "Unsubscribe", "All"]}
                  value={formData.subscriptionStatus}
                  onChange={(val) => setFormData({...formData, subscriptionStatus: val})}
                  activeColor="purple"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Action Sidebar: Right Side (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-0 transition-all">
            <PersistenceActions 
              onSave={handleSend}
              onCancel={() => router.push("/website/newsletter")}
              saveLabel={isSubmitting ? "SENDING..." : "SEND"}
              cancelLabel="CANCEL"
              saveIcon={Send}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
