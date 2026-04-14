"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const LeafletMap = dynamic(() => import("@/components/common/LeafletMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 dark:bg-white/5 animate-pulse rounded-2xl" />
});

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
  Send, 
  MessageSquare,
  Globe,
  Edit,
  Eye,
  Plus,
  X,
  Twitter,
  Search,
  Sliders,
  Save,
  Trash2,
  Layout,
  ExternalLink,
  Maximize2,
  Navigation,
  Map as MapIcon,
  CheckCircle2,
  AlignCenter,
  AlignRight
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
  
  // Simulated content from Profile
  const [content, setContent] = useState({
    title: "Sent A Message",
    email: "contact@events.com",
    phone: "+91 987654321",
    address: "10 New St, Brighton VIC 3186, America",
    socials: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      youtube: "https://youtube.com",
      linkedin: "https://linkedin.com",
    }
  });

  const [coordinates, setCoordinates] = useState({
    lat: 21.8207079,
    lng: 76.3769531
  });

  const handleSave = () => {
    toast.success("Contact Configuration Saved");
  };

  // Reusable Preview Component
  const PreviewContent = ({ isMini = false }: { isMini?: boolean }) => {
    const isCenter = options.position === "CENTER";
    
    return (
      <div className={cn(
        "bg-[#F8FAFC] dark:bg-[#0A0D10] w-full",
        isMini ? "p-4 space-y-6" : "p-10 space-y-12"
      )}>
        <div className={cn("mx-auto space-y-8", isMini ? "max-w-full" : "max-w-[1100px]")}>
          {/* Title Preview */}
          <div className="text-center space-y-2">
            <h2 className={cn(
              "font-black text-gray-900 dark:text-white font-poppins uppercase tracking-tight",
              isMini ? "text-xl" : "text-4xl"
            )}>{content.title}</h2>
            <div className={cn("bg-blue-600 mx-auto rounded-full", isMini ? "w-10 h-1" : "w-20 h-1.5")} />
          </div>

          {/* Main Contact Section */}
          <div className={cn(
            "grid gap-8",
            isCenter ? "grid-cols-1" : "grid-cols-1 md:grid-cols-12"
          )}>
            
            {/* Public Form Preview */}
            {options.contactForm && (
              <div className={cn(
                isCenter ? "w-full max-w-[800px] mx-auto" : (options.addressSection ? "md:col-span-8" : "md:col-span-12")
              )}>
                <div className={cn(
                  "bg-white dark:bg-sidebar rounded-3xl shadow-sm border border-gray-100 dark:border-white/5",
                  isMini ? "p-4 space-y-4" : "p-8 space-y-6"
                )}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["Full Name", "Email Address", "Mobile Number", "Subject"].map((label, i) => (
                      <div key={i} className="space-y-1.5">
                        <Label className="text-[9px] font-bold uppercase text-gray-400">{label}</Label>
                        <Input readOnly className="h-10 rounded-xl bg-gray-50/50 dark:bg-white/5 border-none text-xs" />
                      </div>
                    ))}
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="text-[9px] font-bold uppercase text-gray-400">Message</Label>
                      <Textarea readOnly className="min-h-[80px] rounded-xl bg-gray-50/50 dark:bg-white/5 border-none resize-none py-2 text-xs" />
                    </div>
                  </div>
                  <Button className="w-full h-12 bg-[#001720] hover:bg-[#002a3a] text-white rounded-2xl font-bold tracking-widest uppercase text-xs shadow-xl shadow-[#001720]/10">
                    Send Message
                  </Button>
                </div>
              </div>
            )}

            {/* Information Preview */}
            {options.addressSection && (
              <div className={cn(
                isCenter ? "w-full max-w-[800px] mx-auto order-first" : (options.contactForm ? "md:col-span-4" : "md:col-span-12"),
                "space-y-4"
              )}>
                <div className={cn(
                  "bg-white dark:bg-sidebar rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col gap-6",
                  isMini ? "p-4" : "p-8"
                )}>
                  {options.emailField && (
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-blue-500/10 text-blue-600">
                        <Mail size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Us</p>
                        <p className="text-[11px] font-bold text-gray-900 dark:text-white break-all">{content.email}</p>
                      </div>
                    </div>
                  )}
                  {options.mobileField && (
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-500/10 text-emerald-600">
                        <Phone size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Call Us</p>
                        <p className="text-[11px] font-bold text-gray-900 dark:text-white">{content.phone}</p>
                      </div>
                    </div>
                  )}
                  {options.addressField && (
                    <div className="flex gap-3 items-start">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-purple-500/10 text-purple-600">
                        <MapPin size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Our Office</p>
                        <p className="text-[11px] font-bold text-gray-900 dark:text-white">{content.address}</p>
                      </div>
                    </div>
                  )}

                  {options.socialLinks && (
                    <div className="pt-4 border-t border-gray-50 dark:border-white/5">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Follow Us</p>
                      <div className="flex gap-2">
                        {Object.entries(content.socials).map(([key, value]) => (
                          <div key={key} className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-500">
                            {key === "facebook" && <Facebook size={14} />}
                            {key === "twitter" && <Twitter size={14} />}
                            {key === "youtube" && <Youtube size={14} />}
                            {key === "linkedin" && <Linkedin size={14} />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Map Preview Area */}
          {options.map && (
            <div className="animate-in fade-in duration-1000">
              <div className="bg-white dark:bg-sidebar p-2 rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/5">
                <div className={cn("relative w-full rounded-[1.5rem] overflow-hidden", isMini ? "h-[200px]" : "h-[450px]")}>
                  <LeafletMap center={[coordinates.lat, coordinates.lng]} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
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
      {/* Page Header */}
      <div className="max-w-[1600px] mx-auto mb-12 animate-in fade-in slide-in-from-bottom duration-1000">
        <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1">Contact Us Management</h1>
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

        {/* RIGHT: LIVE PREVIEW & ACTIONS (3 Columns) */}
        <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8">
          <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <PersistenceActions 
              onSave={handleSave}
              onCancel={() => router.push("/website/management")}
              saveLabel="SAVE CONFIG"
            />
          </div>

          {/* Scaled Down Preview */}
          <div className="w-full aspect-[9/16] bg-white dark:bg-[#0A0D10] rounded-[2rem] shadow-2xl border-[6px] border-[#1E293B] overflow-hidden relative group">
            <div className="bg-[#1E293B] px-4 py-2 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest">Preview</span>
              </div>
            </div>

            <div className="relative w-full h-[calc(100%-40px)] overflow-y-auto overflow-x-hidden custom-scrollbar-thin bg-[#F8FAFC] dark:bg-[#0A0D10]">
              <PreviewContent isMini={true} />
            </div>

            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-12 px-6 bg-white text-black hover:bg-gray-100 rounded-[1.2rem] font-black text-[10px] tracking-widest flex items-center gap-2 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <Maximize2 size={16} />
                    FULL PREVIEW
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] w-full lg:max-w-[1450px] h-[92vh] p-0 overflow-hidden rounded-[3rem] border-none shadow-[0_0_80px_-15px_rgba(0,0,0,0.6)] bg-white dark:bg-[#0A0D10]">
                  <DialogHeader className="bg-[#1E293B] px-12 py-6 flex-row items-center justify-between space-y-0 text-white shrink-0">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-[1.2rem] bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner">
                        <Eye size={28} />
                      </div>
                      <div>
                        <DialogTitle className="text-2xl font-black font-poppins tracking-tight uppercase">Public Page Live Preview</DialogTitle>
                        <p className="text-[10px] text-white/40 uppercase tracking-[0.5em] font-black">Desktop High Fidelity View</p>
                      </div>
                    </div>
                  </DialogHeader>
                  <div className="h-[calc(92vh-100px)] overflow-y-auto bg-[#F8FAFC] dark:bg-[#0A0D10] custom-scrollbar scroll-smooth">
                    <div className="w-full mx-auto py-16 px-12">
                      <PreviewContent />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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
