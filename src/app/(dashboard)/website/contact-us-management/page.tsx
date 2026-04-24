"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Youtube, 
  Linkedin, 
  Twitter,
  Sliders,
  AlignRight,
  AlignCenter
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ContactUsManagementPage() {
  const router = useRouter();
  
  // Configuration options state based on the provided image
  const [options, setOptions] = useState({
    contactForm: true,
    map: true,
    addressSection: true,
    position: "RIGHT", // "RIGHT" | "CENTER"
    addressField: true,
    emailField: true,
    mobileField: true,
    socialLinks: true
  });
  

  const handleSave = () => {
    toast.success("Contact Configuration Saved");
  };


  const ToggleItem = ({ label, checked, onChange, isNested = false }: { label: string, checked: boolean, onChange: (v: boolean) => void, isNested?: boolean }) => (
    <div className={cn("flex items-center justify-between py-1", isNested && "pl-8")}>
      <span className={cn(
        "text-xs font-bold uppercase tracking-[0.1em]",
        isNested ? "text-gray-400 text-[10px]" : "text-gray-900 dark:text-white"
      )}>
        {label}
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar bg-[#F8FAFC] dark:bg-black">
      <div className="max-w-[1600px] mx-auto mb-12 animate-in fade-in slide-in-from-bottom duration-1000">
        <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1">Contact Us</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">Configure layout modules and visibility options for your public contact page.</p>
      </div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
        
        {/* LEFT: MANAGEMENT CONFIG (9 Columns) */}
        <div className="lg:col-span-9 animate-in fade-in slide-in-from-left duration-700">
          <Card className="border-none shadow-2xl bg-white dark:bg-sidebar rounded-[2.5rem] overflow-hidden">
            <div className="p-10 space-y-12">
              
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-[#001720] text-white flex items-center justify-center shadow-2xl">
                  <Sliders size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white font-poppins uppercase tracking-tight">Configuration Options</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Section Display Controls</p>
                </div>
              </div>

              <div className="space-y-6 max-w-[450px]">
                {/* Main Toggles */}
                <ToggleItem label="Contact Form" checked={options.contactForm} onChange={(v) => setOptions({...options, contactForm: v})} />
                <ToggleItem label="Map" checked={options.map} onChange={(v) => setOptions({...options, map: v})} />
                <ToggleItem label="Address" checked={options.addressSection} onChange={(v) => setOptions({...options, addressSection: v})} />

                {/* Sub Options (Triggered by Address) */}
                {options.addressSection && (
                  <div className="space-y-5 pt-4 border-t border-gray-50 dark:border-white/5 animate-in slide-in-from-top-2 duration-300">
                    
                    {/* Position Toggle */}
                    <div className="flex items-center justify-between pl-8 py-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">Position</span>
                      <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl gap-1">
                        <button 
                          onClick={() => setOptions({...options, position: "RIGHT"})}
                          className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all flex items-center gap-1.5", 
                          options.position === "RIGHT" ? "bg-white dark:bg-sidebar shadow-md text-blue-600 scale-105" : "text-gray-400")}
                        >
                          <AlignRight size={12} />
                          Right
                        </button>
                        <button 
                          onClick={() => setOptions({...options, position: "CENTER"})}
                          className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all flex items-center gap-1.5", 
                          options.position === "CENTER" ? "bg-white dark:bg-sidebar shadow-md text-blue-600 scale-105" : "text-gray-400")}
                        >
                          <AlignCenter size={12} />
                          Center
                        </button>
                      </div>
                    </div>

                    <ToggleItem label="Address" checked={options.addressField} onChange={(v) => setOptions({...options, addressField: v})} isNested />
                    <ToggleItem label="Email" checked={options.emailField} onChange={(v) => setOptions({...options, emailField: v})} isNested />
                    <ToggleItem label="Mobile" checked={options.mobileField} onChange={(v) => setOptions({...options, mobileField: v})} isNested />
                    <ToggleItem label="Social Links" checked={options.socialLinks} onChange={(v) => setOptions({...options, socialLinks: v})} isNested />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT: ACTIONS (3 Columns) */}
        <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8">
          <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <PersistenceActions 
              onSave={handleSave}
              onCancel={() => router.push("/website/management")}
            />
          </div>
        </div>
      </div>
  
      <style jsx global>{`
        .custom-scrollbar-thin::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .dark .custom-scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.05);
        }
      `}</style>
    </div>
  );
}
