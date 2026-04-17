"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import { cn } from "@/lib/utils";
import { UserPlus, User, Mail, CreditCard, Settings2 } from "lucide-react";

function RadioOptions({ 
  options, 
  value, 
  onChange, 
  activeColor = "blue" 
}: { 
  options: string[], 
  value: string, 
  onChange: (val: string) => void,
  activeColor?: "blue" | "emerald" | "purple" | "rose"
}) {
  const colorMap = {
    blue: "bg-blue-600 text-white border-blue-600 shadow-blue-200",
    emerald: "bg-emerald-600 text-white border-emerald-600 shadow-emerald-200",
    purple: "bg-purple-600 text-white border-purple-600 shadow-purple-200",
    rose: "bg-rose-600 text-white border-rose-600 shadow-rose-200"
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
              "flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 text-[12px] font-black uppercase tracking-widest transition-all duration-300 shadow-sm",
              isActive 
                ? `${colorMap[activeColor as keyof typeof colorMap]} shadow-lg scale-[1.02]` 
                : "bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50/50"
            )}
          >
            <div className={cn(
              "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
              isActive ? "border-white bg-white" : "border-gray-200"
            )}>
              {isActive && <div className={cn("w-2 h-2 rounded-full", activeColor === "blue" ? "bg-blue-600" : activeColor === "emerald" ? "bg-emerald-600" : activeColor === "purple" ? "bg-purple-600" : "bg-rose-600")} />}
            </div>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function AddSubscriberForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userType: "Guest",
    name: "",
    email: "",
    plan: "",
    status: "Subscribe",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Please fill in Name and Email");
      return;
    }
    
    if (formData.userType === "Registered" && !formData.plan.trim()) {
      toast.error("Please provide the membership plan");
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      try {
        const savedSubscribers = localStorage.getItem("newsletter_subscribers");
        const subscribers = savedSubscribers ? JSON.parse(savedSubscribers) : [];
        
        const newSubscriber = {
          id: Date.now(),
          name: formData.name,
          membership: formData.userType === "Registered" ? formData.plan : "Guest",
          status: formData.status === "Subscribe" ? "Subscribed" : "UnSubscribed",
        };
        
        const updated = [newSubscriber, ...subscribers];
        localStorage.setItem("newsletter_subscribers", JSON.stringify(updated));
        
        setIsSubmitting(false);
        toast.success("Subscriber added successfully!");
        router.push("/website/newsletter");
      } catch (error) {
        console.error("Save error:", error);
        setIsSubmitting(false);
        toast.error("Failed to add subscriber");
      }
    }, 800);
  };

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar bg-[#F8FAFC] dark:bg-black/40">
      {/* Header Section */}
      <div className="max-w-[1700px] mx-auto mb-8">
        <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1 font-poppins">Add Subscriber</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-tight">Manually add a new contact to your newsletter database.</p>
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom duration-1000 pb-10">
        <div className="lg:col-span-9 space-y-6">
          
          <div className="bg-white dark:bg-sidebar p-8 md:p-10 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-none">
            <div className="space-y-12">
              
              {/* User Type */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                   <Label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">User Type</Label>
                </div>
                <RadioOptions 
                  options={["Guest", "Registered"]}
                  value={formData.userType}
                  onChange={(val) => setFormData({...formData, userType: val})}
                  activeColor="emerald"
                />
              </div>

              {/* Name & Email Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 ml-1">
                    <User size={14} className="text-gray-400" />
                    <Label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Name</Label>
                  </div>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter Name.."
                    className="h-12 bg-gray-50 focus:bg-white border-gray-100 rounded-xl text-sm font-bold shadow-sm transition-all focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 ml-1">
                    <Mail size={14} className="text-gray-400" />
                    <Label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Email</Label>
                  </div>
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter Email Address..."
                    className="h-12 bg-gray-50 focus:bg-white border-gray-100 rounded-xl text-sm font-bold shadow-sm transition-all focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20"
                  />
                </div>
              </div>

              {/* Conditional Plan Field */}
              {formData.userType === "Registered" && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2 ml-1">
                    <CreditCard size={14} className="text-gray-400" />
                    <Label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Membership Plan</Label>
                  </div>
                  <Input 
                    value={formData.plan}
                    onChange={(e) => setFormData({...formData, plan: e.target.value})}
                    placeholder="e.g. Gold Plan, Premium Member"
                    className="h-12 bg-gray-50 focus:bg-white border-gray-100 rounded-xl text-sm font-bold shadow-sm transition-all focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 max-w-md"
                  />
                </div>
              )}

              {/* Subscription Status */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 mb-2">
                   <Settings2 size={14} className="text-gray-400" />
                   <Label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Subscription Status</Label>
                </div>
                <RadioOptions 
                  options={["Subscribe", "Unsubscribe"]}
                  value={formData.status}
                  onChange={(val) => setFormData({...formData, status: val})}
                  activeColor="blue"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-0 transition-all">
            <PersistenceActions 
              onSave={handleSave}
              onCancel={() => router.push("/website/newsletter")}
              saveLabel={isSubmitting ? "SAVING..." : "SAVE"}
              cancelLabel="CANCEL"
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

