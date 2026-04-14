"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Briefcase, 
  Users, 
  Award, 
  Calendar, 
  Plus, 
  Trash2, 
  Upload, 
  X,
  History,
  PlayCircle,
  Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function PortfolioManagementPage() {
  const router = useRouter();
  
  // State for Events
  const [events, setEvents] = useState({
    past: "",
    current: "",
    upcoming: ""
  });

  // State for Clients (Images)
  const [clients, setClients] = useState<string[]>([]);
  const clientInputRef = useRef<HTMLInputElement>(null);

  // State for Sponsors (Images)
  const [sponsors, setSponsors] = useState<string[]>([]);
  const sponsorInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'clients' | 'sponsors') => {
    const files = e.target.files;
    if (!files) return;

    const currentList = type === 'clients' ? clients : sponsors;
    if (currentList.length >= 10) {
      return toast.error("Maximum 10 images allowed per section.");
    }

    const remainingSlots = 10 - currentList.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      if (file.size > 5 * 1024 * 1024) return toast.error(`Image ${file.name} is too large (>5MB)`);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (type === 'clients') {
          setClients(prev => [...prev, result]);
        } else {
          setSponsors(prev => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number, type: 'clients' | 'sponsors') => {
    if (type === 'clients') {
      setClients(prev => prev.filter((_, i) => i !== index));
    } else {
      setSponsors(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    toast.success("Portfolio data saved successfully!");
  };

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto custom-scrollbar bg-[#F8FAFC] dark:bg-black/40">
      <div className="max-w-[1700px] mx-auto px-6 py-8">
        
        <PageHeader 
          title="Portfolio Management"
          subtitle="Showcase your highlights, clients, and partners."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10 items-start pb-20">
          
          {/* MAIN FORM AREA (9 COLUMNS) */}
          <div className="lg:col-span-9 space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
            
            {/* CARD 1: EVENTS */}
            <Card className="border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none bg-white dark:bg-sidebar rounded-[2.5rem] overflow-hidden">
               <CardHeader className="p-10 pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                      <Calendar size={24} />
                    </div>
                    <div>
                       <CardTitle className="text-2xl font-black uppercase tracking-tighter">Events Highlights</CardTitle>
                       <CardDescription className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Configure your performance statistics.</CardDescription>
                    </div>
                  </div>
               </CardHeader>
               <CardContent className="p-10 pt-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     
                     <div className="space-y-2 group">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1 flex items-center gap-2">
                          <History size={12} /> Past Events
                        </Label>
                        <Input 
                          value={events.past}
                          onChange={(e) => setEvents({...events, past: e.target.value})}
                          placeholder="e.g. 500+ Events Done"
                          className="h-14 rounded-2xl border-gray-100 dark:border-white/5 bg-gray-50/30 focus:bg-white dark:bg-black/20 transition-all font-bold"
                        />
                     </div>

                     <div className="space-y-2 group">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1 flex items-center gap-2">
                          <PlayCircle size={12} className="text-emerald-500" /> Current Events
                        </Label>
                        <Input 
                          value={events.current}
                          onChange={(e) => setEvents({...events, current: e.target.value})}
                          placeholder="e.g. 12 Live Events"
                          className="h-14 rounded-2xl border-gray-100 dark:border-white/5 bg-gray-50/30 focus:bg-white dark:bg-black/20 transition-all font-bold"
                        />
                     </div>

                     <div className="space-y-2 group">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1 flex items-center gap-2">
                          <Clock size={12} className="text-orange-500" /> Upcoming Events
                        </Label>
                        <Input 
                          value={events.upcoming}
                          onChange={(e) => setEvents({...events, upcoming: e.target.value})}
                          placeholder="e.g. 25 Booked"
                          className="h-14 rounded-2xl border-gray-100 dark:border-white/5 bg-gray-50/30 focus:bg-white dark:bg-black/20 transition-all font-bold"
                        />
                     </div>

                  </div>
               </CardContent>
            </Card>

            {/* CARD 2: CLIENTS */}
            <Card className="border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none bg-white dark:bg-sidebar rounded-[2.5rem] overflow-hidden">
               <CardHeader className="p-10 pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                      <Users size={24} />
                    </div>
                    <div>
                       <CardTitle className="text-2xl font-black uppercase tracking-tighter">Clients</CardTitle>
                       <CardDescription className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Add logos of organizations you&apos;ve worked with (Max 10).</CardDescription>
                    </div>
                  </div>
               </CardHeader>
               <CardContent className="p-10 pt-8">
                  <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-6">
                    {clients.map((image, idx) => (
                      <div key={idx} className="group relative aspect-square rounded-[1.5rem] border border-gray-100 dark:border-white/5 overflow-hidden bg-gray-50/50 flex items-center justify-center p-4">
                        <Image src={image} alt={`Client ${idx + 1}`} fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="destructive" size="icon" onClick={() => removeImage(idx, 'clients')} className="w-8 h-8 rounded-xl shadow-xl">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {clients.length < 10 && (
                      <div 
                        onClick={() => clientInputRef.current?.click()}
                        className="aspect-square rounded-[1.5rem] border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-orange-500/50 hover:bg-orange-500/5 transition-all text-gray-400 hover:text-orange-500 group"
                      >
                         <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                           <Plus size={20} />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest">Add Client</span>
                      </div>
                    )}
                  </div>
                  <input type="file" multiple ref={clientInputRef} onChange={(e) => handleImageUpload(e, 'clients')} className="hidden" accept="image/*" />
               </CardContent>
            </Card>

            {/* CARD 3: SPONSORS */}
            <Card className="border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none bg-white dark:bg-sidebar rounded-[2.5rem] overflow-hidden">
               <CardHeader className="p-10 pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                      <Award size={24} />
                    </div>
                    <div>
                       <CardTitle className="text-2xl font-black uppercase tracking-tighter">Sponsors</CardTitle>
                       <CardDescription className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Display logos of your event supporters (Max 10).</CardDescription>
                    </div>
                  </div>
               </CardHeader>
               <CardContent className="p-10 pt-8">
                  <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-6">
                    {sponsors.map((image, idx) => (
                      <div key={idx} className="group relative aspect-square rounded-[1.5rem] border border-gray-100 dark:border-white/5 overflow-hidden bg-gray-50/50 flex items-center justify-center p-4">
                        <Image src={image} alt={`Sponsor ${idx + 1}`} fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="destructive" size="icon" onClick={() => removeImage(idx, 'sponsors')} className="w-8 h-8 rounded-xl shadow-xl">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {sponsors.length < 10 && (
                      <div 
                        onClick={() => sponsorInputRef.current?.click()}
                        className="aspect-square rounded-[1.5rem] border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-gray-400 hover:text-purple-500 group"
                      >
                         <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                           <Plus size={20} />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest">Add Sponsor</span>
                      </div>
                    )}
                  </div>
                  <input type="file" multiple ref={sponsorInputRef} onChange={(e) => handleImageUpload(e, 'sponsors')} className="hidden" accept="image/*" />
               </CardContent>
            </Card>

          </div>

          {/* SIDEBAR ACTIONS (3 COLUMNS) */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8 animate-in fade-in slide-in-from-right duration-1000">
             <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <PersistenceActions 
                  onSave={handleSave}
                  onCancel={() => router.back()}
                  onPreview={() => toast.info("Portfolio Preview Coming Soon!")}
                  saveLabel="Save Portfolio"
                />
             </div>

          </div>

        </div>
      </div>
    </div>
  );
}
