"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const LeafletMap = dynamic(() => import("@/components/common/LeafletMap"), {
  ssr: false,
  loading: () => <div className="w-full h-[450px] bg-gray-100 dark:bg-white/5 animate-pulse rounded-2xl" />
});
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  Sliders
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ContactUsManagementPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  
  // Configuration options state
  const [options, setOptions] = useState({
    showForm: true,
    showInfo: true,
    showMap: true
  });
  
  // State for the page content
  const [content, setContent] = useState({
    title: "Sent A Message",
    email: "contact@events.com",
    phone: "+91 987654321",
    address: "10 New St, Brighton VIC 3186,\nAmerica",
    socials: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      youtube: "https://youtube.com",
      linkedin: "https://linkedin.com",
    }
  });

  // State for the actual map coordinates
  const [coordinates, setCoordinates] = useState({
    lat: 21.8207079,
    lng: 76.3769531
  });

  // State for the actual form inputs (Live Preview)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSave = () => {
    toast.success("Contact page configuration updated successfully");
    setIsEditing(false);
  };

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar bg-[#F8FAFC] dark:bg-black">
      {/* Page Header */}
      <div className="max-w-[1400px] mx-auto mb-10 animate-in fade-in slide-in-from-bottom duration-1000">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-poppins mb-1 uppercase tracking-tight">Contact Us Management</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Configure your public facing contact page information and layout.</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom duration-1000 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Preview/Form Section (8 Columns) */}
          {options.showForm && (
            <div className="lg:col-span-8">
              <div className={cn(
                "bg-white dark:bg-sidebar p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden transition-all duration-300",
                isEditing && "ring-2 ring-primary/20 bg-primary/5 shadow-xl"
              )}>
                {/* Subtle Gradient Background Blob */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
                
                <div className="relative z-10">
                  {isEditing ? (
                    <div className="mb-10 space-y-2">
                      <Label className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Heading Title</Label>
                      <Input 
                        value={content.title}
                        onChange={(e) => setContent({...content, title: e.target.value})}
                        className="text-xl font-bold border-gray-200 dark:border-gray-800 bg-white dark:bg-white/5 rounded-xl h-12 font-poppins"
                      />
                    </div>
                  ) : (
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-poppins uppercase">{content.title}</h2>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Name <span className="text-rose-500">*</span></Label>
                      <Input 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Your Name" 
                        className="h-12 rounded-xl border-gray-200 dark:border-gray-800 bg-gray-50/10 dark:bg-white/2 focus:bg-white transition-all px-4 font-medium" 
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Email <span className="text-rose-500">*</span></Label>
                      <Input 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="Your Email" 
                        className="h-12 rounded-xl border-gray-200 dark:border-gray-800 bg-gray-50/10 dark:bg-white/2 focus:bg-white transition-all px-4 font-medium" 
                      />
                    </div>

                    {/* Mobile */}
                    <div className="space-y-2">
                      <Label className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Mobile <span className="text-rose-500">*</span></Label>
                      <Input 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="Enter Mobile Number" 
                        className="h-12 rounded-xl border-gray-200 dark:border-gray-800 bg-gray-50/10 dark:bg-white/2 focus:bg-white transition-all px-4 font-medium" 
                      />
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Subject <span className="text-rose-500">*</span></Label>
                      <Input 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        placeholder="Subject" 
                        className="h-12 rounded-xl border-gray-200 dark:border-gray-800 bg-gray-50/10 dark:bg-white/2 focus:bg-white transition-all px-4 font-medium" 
                      />
                    </div>

                    {/* Message */}
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Message <span className="text-rose-500">*</span></Label>
                      <Textarea 
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Message" 
                        className="min-h-[140px] rounded-xl border-gray-200 dark:border-gray-800 bg-gray-50/10 dark:bg-white/2 focus:bg-white transition-all px-4 py-3 font-medium resize-none leading-relaxed" 
                      />
                    </div>
                  </div>

                  {/* T&C */}
                  <div className="mt-6 flex items-center gap-3">
                    <Checkbox id="terms" className="rounded-[4px] border-slate-300 data-[state=checked]:bg-[#001720] data-[state=checked]:border-[#001720]" />
                    <label htmlFor="terms" className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      I agree to the <span className="text-primary font-bold hover:underline cursor-pointer">Terms and Privacy Policy</span> <span className="text-rose-500">*</span>
                    </label>
                  </div>

                  {/* Button */}
                  <Button 
                    onClick={() => toast.success("Message sent successfully! (Preview Mode)")}
                    className="mt-8 h-12 px-10 bg-[#001720] hover:bg-[#002a3a] text-white rounded-xl font-bold text-xs tracking-widest shadow-lg shadow-[#001720]/10 transition-all active:scale-95"
                  >
                    SEND MESSAGE
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar Info Section (4 Columns) */}
          {options.showInfo && (
            <div className={cn("lg:col-span-4 h-full", !options.showForm && "lg:col-span-12")}>
              <div className="bg-white dark:bg-sidebar p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 h-full flex flex-col gap-10">
                
                {/* Email & Phone */}
                <div className="flex gap-5 group">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center transition-all duration-500 group-hover:scale-105">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-inner relative">
                      <MessageSquare size={18} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    {isEditing ? (
                      <div className="space-y-3">
                        <Input 
                          value={content.email}
                          onChange={(e) => setContent({...content, email: e.target.value})}
                          className="h-9 text-xs font-bold bg-white dark:bg-white/2 border-gray-200 dark:border-gray-800 rounded-lg"
                        />
                        <Input 
                          value={content.phone}
                          onChange={(e) => setContent({...content, phone: e.target.value})}
                          className="h-9 text-sm font-bold bg-white dark:bg-white/2 border-gray-200 dark:border-gray-800 rounded-lg"
                        />
                      </div>
                    ) : (
                      <>
                        <p className="text-base text-gray-700 dark:text-gray-300 font-poppins">{content.email}</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white font-poppins">{content.phone}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-5 group">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center transition-all duration-500 group-hover:scale-105">
                    <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center text-white shadow-inner">
                      <MapPin size={18} />
                    </div>
                  </div>
                  <div className="flex-1">
                    {isEditing ? (
                      <Textarea 
                        value={content.address}
                        onChange={(e) => setContent({...content, address: e.target.value})}
                        className="text-xs font-medium bg-white dark:bg-white/2 border-gray-200 dark:border-gray-800 rounded-lg leading-relaxed resize-none h-24"
                      />
                    ) : (
                      <p className="text-base text-gray-700 dark:text-gray-200 font-poppins leading-relaxed whitespace-pre-line">
                        {content.address}
                      </p>
                    )}
                  </div>
                </div>

                {/* Social Media */}
                <div className="flex gap-5 group items-start">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center transition-all duration-500 group-hover:scale-105">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                      <div className="relative">
                        <Globe size={20} className="animate-spin-slow" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 flex-1">
                    {isEditing ? (
                      <div className="grid grid-cols-1 gap-2">
                        <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Social Links</Label>
                        {Object.entries(content.socials).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-bold uppercase">{key[0]}</div>
                            <Input 
                              value={value}
                              onChange={(e) => setContent({
                                ...content, 
                                socials: {...content.socials, [key]: e.target.value}
                              })}
                              className="h-8 text-[10px] bg-white dark:bg-white/2 border-gray-200 dark:border-gray-800 rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-base text-gray-700 dark:text-gray-300 font-poppins">Find on social media</p>
                        <div className="flex items-center gap-2">
                          {[
                            { icon: Facebook, key: "facebook", color: "hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50" },
                            { icon: Twitter, key: "twitter", color: "hover:text-black hover:border-slate-200 hover:bg-slate-50" },
                            { icon: Youtube, key: "youtube", color: "hover:text-red-600 hover:border-red-100 hover:bg-red-50" },
                            { icon: Linkedin, key: "linkedin", color: "hover:text-blue-700 hover:border-blue-100 hover:bg-blue-50" },
                          ].map((social, i) => (
                            <a 
                              key={i}
                              href={content.socials[social.key as keyof typeof content.socials]}
                              target="_blank"
                              rel="noreferrer"
                              className={cn(
                                "w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 transition-all duration-300 shadow-sm bg-white dark:bg-sidebar",
                                social.color
                              )}
                            >
                              <social.icon size={16} />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Map Section (12 Columns) */}
        {options.showMap && (
          <div className="mt-8">
            <div className="bg-white dark:bg-sidebar p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white font-poppins">Office Location on Map</h3>
                </div>
              </div>

              <div className="space-y-6">
                {/* Search Bar */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input 
                      placeholder="Search address or place..." 
                      className="h-12 border-gray-200 dark:border-gray-800 bg-gray-50/10 dark:bg-white/2 rounded-xl pl-4 focus:bg-white transition-all font-medium"
                    />
                  </div>
                  <Button className="h-12 px-6 bg-[#001720] hover:bg-[#002a3a] text-white rounded-xl font-bold text-sm flex items-center gap-2">
                    <Search size={18} />
                    Search
                  </Button>
                  <div className="w-12 h-12 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                    <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-current" />
                    </div>
                  </div>
                </div>

                {/* Map Preview */}
                <div className="relative h-[450px] w-full rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                  <LeafletMap 
                    center={[coordinates.lat, coordinates.lng]} 
                    onLocationChange={(lat, lng) => setCoordinates({ lat, lng })}
                  />
                </div>

                {/* Lat/Long Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Latitude</Label>
                    <Input 
                      value={coordinates.lat} 
                      readOnly
                      className="h-12 border-gray-100 dark:border-gray-800 bg-gray-50/5 dark:bg-white/2 rounded-xl font-mono text-xs text-gray-500" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Longitude</Label>
                    <Input 
                      value={coordinates.lng} 
                      readOnly
                      className="h-12 border-gray-100 dark:border-gray-800 bg-gray-50/5 dark:bg-white/2 rounded-xl font-mono text-xs text-gray-500" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Config Options Section (12 Columns) - Added as a 3rd card row */}
        <div className="mt-8">
          <div className="bg-white dark:bg-sidebar p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                <Sliders size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white font-poppins uppercase tracking-tight">Config Options</h3>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-10">
                <div className="flex items-center gap-3 group cursor-pointer">
                  <Checkbox 
                    id="showForm" 
                    checked={options.showForm}
                    onCheckedChange={(checked) => setOptions({...options, showForm: !!checked})}
                    className="w-5 h-5 rounded-md border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-all"
                  />
                  <Label htmlFor="showForm" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer group-hover:text-blue-600 transition-colors uppercase tracking-wider">Show Contact Form</Label>
                </div>

                <div className="flex items-center gap-3 group cursor-pointer">
                  <Checkbox 
                    id="showInfo" 
                    checked={options.showInfo}
                    onCheckedChange={(checked) => setOptions({...options, showInfo: !!checked})}
                    className="w-5 h-5 rounded-md border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-all"
                  />
                  <Label htmlFor="showInfo" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer group-hover:text-blue-600 transition-colors uppercase tracking-wider">Show Information</Label>
                </div>

                <div className="flex items-center gap-3 group cursor-pointer">
                  <Checkbox 
                    id="showMap" 
                    checked={options.showMap}
                    onCheckedChange={(checked) => setOptions({...options, showMap: !!checked})}
                    className="w-5 h-5 rounded-md border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-all"
                  />
                  <Label htmlFor="showMap" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer group-hover:text-blue-600 transition-colors uppercase tracking-wider">Show Map</Label>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleSave}
                  className="h-11 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs tracking-widest shadow-lg shadow-blue-500/20 uppercase transition-all active:scale-95"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
}
