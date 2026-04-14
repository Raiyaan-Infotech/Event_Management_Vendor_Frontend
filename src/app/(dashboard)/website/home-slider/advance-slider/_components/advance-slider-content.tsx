"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Save, 
  X, 
  Upload, 
  RotateCcw,
  ExternalLink,
  Search,
  Sliders,
  Image as ImageIcon,
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Settings2
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface AdvanceSlider {
  id: string;
  title: string;
  titleColor: string;
  description: string;
  descriptionColor: string;
  buttonLabel: string;
  buttonUrl: string;
  buttonColor: string;
  alignment: "left" | "center" | "right";
  blur: number;
  brightness: number;
  overlayOpacity: number;
  image: string;
  status: string;
  isActive: boolean;
}

const DEFAULT_TITLE_COLOR = "#ffffff";
const DEFAULT_DESC_COLOR = "#e2e8f0";
const DEFAULT_BTN_COLOR = "#3b82f6";

export default function AdvanceSliderContent() {
  const router = useRouter();
  const [sliders, setSliders] = useState<AdvanceSlider[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState<Omit<AdvanceSlider, "id">>({
    title: "",
    titleColor: DEFAULT_TITLE_COLOR,
    description: "",
    descriptionColor: DEFAULT_DESC_COLOR,
    buttonLabel: "",
    buttonUrl: "",
    buttonColor: DEFAULT_BTN_COLOR,
    alignment: "center",
    blur: 0,
    brightness: 100,
    overlayOpacity: 40,
    image: "",
    status: "Published",
    isActive: true
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<AdvanceSlider | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  useEffect(() => {
    const saved = localStorage.getItem("vendor_advance_sliders_data");
    let sliderData: AdvanceSlider[] = [];
    if (saved) {
      sliderData = JSON.parse(saved);
      setSliders(sliderData);
    } else {
      const initial: AdvanceSlider[] = [
        { 
          id: "1", 
          title: "Luxury Event Management", 
          titleColor: "#ffffff",
          description: "Elevating your most precious moments with sophisticated design and flawless execution.", 
          descriptionColor: "#f1f5f9",
          buttonLabel: "Explore Services", 
          buttonUrl: "/events", 
          buttonColor: "#3b82f6", 
          alignment: "center",
          blur: 0,
          brightness: 100,
          overlayOpacity: 50,
          image: "", 
          status: "Published", 
          isActive: true 
        },
      ];
      sliderData = initial;
      setSliders(initial);
      localStorage.setItem("vendor_advance_sliders_data", JSON.stringify(initial));
    }

    if (editId) {
       const sliderToEdit = sliderData.find(s => s.id === editId);
       if (sliderToEdit) {
          setFormData(sliderToEdit);
          setIsEditing(true);
          setEditingId(editId);
       }
    }
  }, [editId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setFormData({ ...formData, image: event.target?.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.buttonLabel) {
      return toast.error("Title and Button Label are required.");
    }

    let updatedSliders;
    if (isEditing && editingId) {
      updatedSliders = sliders.map(s => s.id === editingId ? { ...formData, id: editingId } : s);
      toast.success("Advance slider updated");
    } else {
      const newSlider = { ...formData, id: Date.now().toString() };
      updatedSliders = [...sliders, newSlider];
      toast.success("New advance slider added");
    }

    setSliders(updatedSliders);
    localStorage.setItem("vendor_advance_sliders_data", JSON.stringify(updatedSliders));
    resetForm();
    router.push("/website/home-slider/advance-slider");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      titleColor: DEFAULT_TITLE_COLOR,
      description: "",
      descriptionColor: DEFAULT_DESC_COLOR,
      buttonLabel: "",
      buttonUrl: "",
      buttonColor: DEFAULT_BTN_COLOR,
      alignment: "center",
      blur: 0,
      brightness: 100,
      overlayOpacity: 40,
      image: "",
      status: "Published",
      isActive: true
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (slider: AdvanceSlider) => {
    setFormData(slider);
    setIsEditing(true);
    setEditingId(slider.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    const updated = sliders.filter(s => s.id !== id);
    setSliders(updated);
    localStorage.setItem("vendor_advance_sliders_data", JSON.stringify(updated));
    toast.success("Slider removed");
  };

  const filteredSliders = useMemo(() => {
    return sliders.filter(s => 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sliders, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-black p-6 space-y-6 flex flex-col animate-in fade-in duration-700">
      


      <div className="px-4 pb-2 flex items-center justify-between">
         <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
            {isEditing ? "Edit Advance Slider" : "Advance Slider Workspace"}
         </h1>
         <Button 
            variant="ghost" 
            onClick={() => router.push("/website/home-slider/advance-slider")}
            className="text-[12px] font-bold text-slate-500 hover:text-indigo-600 gap-2"
          >
            <RotateCcw size={14} className="rotate-90" /> BACK TO LIST
         </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start px-4 text-slate-700">
        
        {/* Main Workspace (Form Fields) */}
        <div className="lg:col-span-9 space-y-6 h-full">
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden h-full flex flex-col">
             <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                      <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                   </div>
                   <div>
                      <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Layout & Content</CardTitle>
                      <CardDescription className="text-xs">Precision control over typography and background effects.</CardDescription>
                   </div>
                </div>
             </CardHeader>
             
             <CardContent className="p-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Left Column: Typography & Links */}
                <div className="space-y-6">
                   <div className="space-y-2">
                       <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Title <span className="text-rose-500">*</span></Label>
                       <Input 
                          value={formData.title} 
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          className="h-11 rounded-sm border-slate-200 bg-white"
                       />
                   </div>

                   <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Title Color</Label>
                      <ColorInput value={formData.titleColor} onChange={(c) => setFormData({...formData, titleColor: c})} className="w-full" />
                   </div>

                   <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description <span className="text-rose-500">*</span></Label>
                      <Textarea 
                         value={formData.description} 
                         onChange={(e) => setFormData({...formData, description: e.target.value})}
                         className="min-h-[120px] rounded-sm border-slate-200 bg-white"
                      />
                   </div>

                   <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description Color</Label>
                      <ColorInput value={formData.descriptionColor} onChange={(c) => setFormData({...formData, descriptionColor: c})} className="w-full" />
                   </div>

                   <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Button Label <span className="text-rose-500">*</span></Label>
                      <Input 
                         value={formData.buttonLabel} 
                         onChange={(e) => setFormData({...formData, buttonLabel: e.target.value})} 
                         className="h-11 rounded-sm border-slate-200" 
                      />
                   </div>

                   <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Button URL <span className="text-rose-500">*</span></Label>
                      <Select value={formData.buttonUrl} onValueChange={(v) => setFormData({...formData, buttonUrl: v})}>
                         <SelectTrigger className="h-11 rounded-sm border-slate-200 bg-white">
                            <SelectValue placeholder="Select Page" />
                         </SelectTrigger>
                         <SelectContent>
                            <SelectItem value="/events">Events Page</SelectItem>
                            <SelectItem value="/portfolio">Portfolio</SelectItem>
                            <SelectItem value="/contact">Contact Us</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>

                   <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Button Color</Label>
                      <ColorInput value={formData.buttonColor} onChange={(c) => setFormData({...formData, buttonColor: c})} className="w-full" />
                   </div>
                </div>

                {/* Right Column: Visual Effects & Image */}
                <div className="space-y-8">
                   <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-3">
                         <Label className="text-[11px] font-bold text-slate-500 uppercase">Overlay Opacity</Label>
                         <input 
                           type="range" min="0" max="100" 
                           value={formData.overlayOpacity} 
                           onChange={(e) => setFormData({...formData, overlayOpacity: parseInt(e.target.value)})}
                           className="w-full accent-indigo-600"
                         />
                         <p className="text-[10px] font-bold text-slate-400">{formData.overlayOpacity}%</p>
                      </div>

                      <div className="space-y-3">
                         <Label className="text-[11px] font-bold text-slate-500 uppercase">Image Blur</Label>
                         <input 
                           type="range" min="0" max="20" 
                           value={formData.blur} 
                           onChange={(e) => setFormData({...formData, blur: parseInt(e.target.value)})}
                           className="w-full accent-indigo-600"
                         />
                         <p className="text-[10px] font-bold text-slate-400">{formData.blur}px</p>
                      </div>

                      <div className="space-y-3">
                         <Label className="text-[11px] font-bold text-slate-500 uppercase">Image Brightness</Label>
                         <input 
                           type="range" min="0" max="200" 
                           value={formData.brightness} 
                           onChange={(e) => setFormData({...formData, brightness: parseInt(e.target.value)})}
                           className="w-full accent-indigo-600"
                         />
                         <p className="text-[10px] font-bold text-slate-400">{formData.brightness}%</p>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Content Alignment</Label>
                      <Select value={formData.alignment} onValueChange={(v: any) => setFormData({...formData, alignment: v})}>
                         <SelectTrigger className="h-11 rounded-sm border-slate-200 bg-white">
                            <SelectValue placeholder="Select alignment" />
                         </SelectTrigger>
                         <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>

                   <div className="space-y-3">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Slider Image <span className="text-rose-500">*</span></Label>
                      <div 
                         onClick={() => !formData.image && fileInputRef.current?.click()}
                         className={cn(
                           "w-full aspect-video rounded-2xl border-2 border-dashed transition-all relative overflow-hidden group flex flex-col items-center justify-center bg-white",
                           formData.image ? "border-indigo-500/20" : "border-slate-200"
                         )}
                      >
                         {formData.image ? (
                            <>
                               <Image src={formData.image} alt="Slider" fill className="object-cover" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                                  <Button variant="destructive" size="icon" onClick={(e) => { e.stopPropagation(); setFormData({...formData, image: ""}); }} className="w-10 h-10 rounded-sm">
                                     <X size={20} />
                                  </Button>
                               </div>
                            </>
                         ) : (
                            <div className="text-center">
                               <Upload size={32} className="text-slate-300 mx-auto mb-2" />
                               <p className="text-[10px] font-bold text-indigo-600 uppercase">choose image</p>
                               <p className="text-[10px] text-slate-400 mt-1">Recommended: 1800 x 900 px</p>
                            </div>
                         )}
                         <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                      </div>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Action Panel Right */}
        <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8">
           <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
             <PersistenceActions 
               onSave={handleSave}
               onReset={isEditing ? resetForm : undefined}
               onCancel={() => router.push("/website/home-slider/advance-slider")}
               onPreview={() => setPreviewOpen(true)}
               saveLabel={isEditing ? "UPDATE SLIDER" : "SAVE SLIDER"}
             />
           </div>

            {/* Status Card */}
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 space-y-6">
               <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                     <SelectTrigger className="h-10 rounded-sm border-slate-200 bg-white">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div className="flex items-center gap-3">
                  <Checkbox 
                     id="active" 
                     checked={formData.isActive} 
                     onCheckedChange={(v: boolean) => setFormData({...formData, isActive: v})}
                  />
                  <Label htmlFor="active" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Active</Label>
               </div>
            </Card>

            {/* High-Fidelity Preview */}
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden">
               <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                        <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                     </div>
                     <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">Live Preview</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="p-5">
                  <div className="relative aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center shadow-2xl">
                     {formData.image && (
                        <Image 
                           src={formData.image} 
                           alt="Live" fill 
                           className="object-cover transition-all duration-500" 
                           style={{ 
                             filter: `blur(${formData.blur}px) brightness(${formData.brightness}%)` 
                           }} 
                        />
                     )}
                     
                     {/* Dark Overlay */}
                     <div 
                       className="absolute inset-0 bg-black transition-opacity duration-300"
                       style={{ opacity: formData.overlayOpacity / 100 }}
                     />
                     
                     {/* Content Layer */}
                     <div 
                       className={cn(
                         "relative z-10 w-full px-6 flex flex-col gap-3 transition-all duration-500",
                         formData.alignment === 'left' ? "items-start text-left" : formData.alignment === 'right' ? "items-end text-right" : "items-center text-center"
                       )}
                     >
                        <h3 
                         className="text-xl font-black uppercase tracking-tighter leading-none" 
                         style={{ color: formData.titleColor }}
                        >
                          {formData.title || "Your Title Here"}
                        </h3>
                        <p 
                         className="text-[10px] font-medium leading-relaxed opacity-90"
                         style={{ color: formData.descriptionColor }}
                        >
                          {formData.description || "The description will appear here..."}
                        </p>
                        {formData.buttonLabel && (
                           <Button 
                              style={{ backgroundColor: formData.buttonColor }}
                              className="h-8 px-6 rounded-full text-white text-[9px] font-black uppercase tracking-widest shadow-xl mt-2"
                           >
                              {formData.buttonLabel}
                           </Button>
                        )}
                     </div>
                  </div>
               </CardContent>
            </Card>
        </div>
      </div>

      {/* Table Section Removed - Now on separate page */}
      
      {/* Full Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[1200px] border-none shadow-2xl p-0 aspect-[16/9] overflow-hidden rounded-[3rem] bg-black">
          <DialogTitle className="sr-only">Advance Slider Preview</DialogTitle>
           {previewData && (
             <div className="relative w-full h-full flex flex-col justify-center">
                {previewData.image && (
                  <Image 
                    src={previewData.image} alt="Full" fill 
                    className="object-cover transition-all" 
                    style={{ 
                      filter: `blur(${previewData.blur}px) brightness(${previewData.brightness}%)` 
                    }} 
                  />
                )}
                <div 
                  className="absolute inset-0 bg-black"
                  style={{ opacity: previewData.overlayOpacity / 100 }}
                />

                <div className={cn(
                  "relative z-10 px-20 flex flex-col gap-6",
                  previewData.alignment === 'left' ? "items-start text-left" : previewData.alignment === 'right' ? "items-end text-right" : "items-center text-center"
                )}>
                   <h2 className="text-6xl font-black uppercase tracking-tighter drop-shadow-2xl animate-in slide-in-from-bottom-10 duration-1000" style={{ color: previewData.titleColor }}>{previewData.title}</h2>
                   <p className="max-w-3xl text-xl font-medium opacity-90 animate-in slide-in-from-bottom-6 duration-1000 delay-200" style={{ color: previewData.descriptionColor }}>{previewData.description}</p>
                   {previewData.buttonLabel && (
                      <Button style={{ backgroundColor: previewData.buttonColor }} className="h-16 px-16 rounded-full text-white font-black text-sm tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all animate-in zoom-in duration-1000 delay-500 uppercase">
                        {previewData.buttonLabel}
                      </Button>
                   )}
                </div>

                <Button onClick={() => setPreviewOpen(false)} variant="secondary" size="icon" className="absolute top-10 right-10 w-12 h-12 rounded-2xl bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-3xl border-none transition-all shadow-2xl z-50">
                   <X size={24} />
                </Button>
             </div>
           )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Color Input Helper matching the style
function ColorInput({ value, onChange, className }: { value: string, onChange: (c: string) => void, className?: string }) {
  return (
    <div className={cn("flex items-center gap-0 border border-slate-200 rounded-sm overflow-hidden bg-white shadow-sm w-fit", className)}>
       <div className="relative w-11 h-11 border-r border-slate-200">
          <div className="absolute inset-0" style={{ backgroundColor: value }} />
          <input 
             type="color" 
             value={value} 
             onChange={(e) => onChange(e.target.value)}
             className="absolute inset-0 opacity-0 cursor-pointer"
          />
       </div>
       <Input 
         value={value}
         onChange={(e) => onChange(e.target.value)}
         className="w-24 border-none h-11 text-[11px] font-mono font-bold uppercase focus-visible:ring-0 bg-transparent"
       />
    </div>
  );
}
