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
  ChevronDown,
  Search,
  Check,
  Sliders,
  Image as ImageIcon,
  Layout,
  Settings2
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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

interface Slider {
  id: string;
  title: string;
  buttonLabel: string;
  buttonUrl: string;
  buttonColor: string;
  image: string;
  status: string;
  isActive: boolean;
}

const DEFAULT_COLOR = "#3b82f6"; // Switched to a more standard blue matching the menu page gradients

export default function SimpleSliderContent() {
  const router = useRouter();
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    buttonLabel: "",
    buttonUrl: "",
    buttonColor: DEFAULT_COLOR,
    image: "",
    status: "Published",
    isActive: true
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<Slider | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  useEffect(() => {
    const saved = localStorage.getItem("vendor_sliders_data");
    let sliderData: Slider[] = [];
    if (saved) {
      sliderData = JSON.parse(saved);
      setSliders(sliderData);
    } else {
      const initial = [
        { id: "1", title: "learn", buttonLabel: "click new", buttonUrl: "/events", buttonColor: "#3b82f6", image: "", status: "Published", isActive: true },
        { id: "2", title: "property", buttonLabel: "view", buttonUrl: "/portfolio", buttonColor: "#3b82f6", image: "", status: "Published", isActive: true },
        { id: "3", title: "villa", buttonLabel: "checkout", buttonUrl: "/contact", buttonColor: "#3b82f6", image: "", status: "Published", isActive: true },
      ];
      sliderData = initial;
      setSliders(initial);
      localStorage.setItem("vendor_sliders_data", JSON.stringify(initial));
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

  const resetForm = () => {
    setFormData({
      title: "",
      buttonLabel: "",
      buttonUrl: "",
      buttonColor: DEFAULT_COLOR,
      image: "",
      status: "Published",
      isActive: true
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.buttonLabel || !formData.buttonUrl) {
      return toast.error("Button Label and URL are required.");
    }

    let updatedSliders;
    if (isEditing && editingId) {
      updatedSliders = sliders.map(s => s.id === editingId ? { ...formData, id: editingId } : s);
      toast.success("Slider updated successfully");
    } else {
      const newSlider = { ...formData, id: Date.now().toString() };
      updatedSliders = [...sliders, newSlider];
      toast.success("New slider added successfully");
    }

    setSliders(updatedSliders);
    localStorage.setItem("vendor_sliders_data", JSON.stringify(updatedSliders));
    resetForm();
    router.push("/website/home-slider/simple-slider");
  };

  const handleEdit = (slider: Slider) => {
    setFormData(slider);
    setIsEditing(true);
    setEditingId(slider.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    const updated = sliders.filter(s => s.id !== id);
    setSliders(updated);
    localStorage.setItem("vendor_sliders_data", JSON.stringify(updated));
    toast.success("Slider removed");
  };

  const filteredSliders = useMemo(() => {
    return sliders.filter(s => 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.buttonLabel.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sliders, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-black p-6 space-y-6 flex flex-col animate-in fade-in duration-700">
      


      <div className="px-4 pb-2 flex items-center justify-between">
         <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1">
            {isEditing ? "Edit Simple Slider" : "Add Simple Slider"}
         </h1>
         <Button 
            variant="ghost" 
            onClick={() => router.push("/website/home-slider/simple-slider")}
            className="text-[12px] font-bold text-slate-500 hover:text-blue-600 gap-2"
          >
            <RotateCcw size={14} className="rotate-90" /> BACK TO LIST
         </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start px-4">
        
        {/* Main Content Area (Form Fields) */}
        <div className="lg:col-span-9 space-y-6 h-full">
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden h-full flex flex-col">
             <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <Layout className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                   </div>
                   <div>
                      <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Slider Details</CardTitle>
                      <CardDescription className="text-xs">Configure your slider content and target links.</CardDescription>
                   </div>
                </div>
             </CardHeader>
             
             <CardContent className="p-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Text Fields Column */}
                <div className="space-y-6">
                   <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Title</Label>
                      <Input 
                         value={formData.title} 
                         onChange={(e) => setFormData({...formData, title: e.target.value})}
                         className="h-11 rounded-sm border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                      />
                   </div>

                   <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Button Label <span className="text-rose-500">*</span></Label>
                      <Input 
                         value={formData.buttonLabel} 
                         onChange={(e) => setFormData({...formData, buttonLabel: e.target.value})}
                         className="h-11 rounded-sm border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                      />
                   </div>

                   <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Button URL <span className="text-rose-500">*</span></Label>
                      <Select value={formData.buttonUrl} onValueChange={(v) => setFormData({...formData, buttonUrl: v})}>
                         <SelectTrigger className="h-11 rounded-sm border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 font-medium text-slate-500">
                            <SelectValue placeholder="Select Page" />
                         </SelectTrigger>
                         <SelectContent className="rounded-sm border-slate-100">
                            <SelectItem value="/events">Events Page</SelectItem>
                            <SelectItem value="/portfolio">Portfolio</SelectItem>
                            <SelectItem value="/contact">Contact Us</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>

                   <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Button Background Color</Label>
                      <div className="flex items-center gap-0 border border-slate-200 dark:border-slate-800 rounded-sm overflow-hidden w-fit bg-slate-50/50 dark:bg-slate-950/50">
                         <div className="relative w-11 h-11 border-r border-slate-200 dark:border-slate-800">
                            <div className="absolute inset-0 transition-colors" style={{ backgroundColor: formData.buttonColor }} />
                            <input 
                               type="color" 
                               value={formData.buttonColor} 
                               onChange={(e) => setFormData({...formData, buttonColor: e.target.value})}
                               className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                         </div>
                         <Input 
                           value={formData.buttonColor}
                           onChange={(e) => setFormData({...formData, buttonColor: e.target.value})}
                           className="w-28 border-none h-11 text-[13px] font-mono font-bold uppercase focus-visible:ring-0 bg-transparent text-slate-700 dark:text-slate-300"
                         />
                         <Button variant="ghost" size="icon" onClick={() => setFormData({...formData, buttonColor: DEFAULT_COLOR})} className="h-11 w-11 text-slate-400 border-l border-slate-200 dark:border-slate-800 rounded-none hover:bg-white transition-colors">
                            <RotateCcw size={14} />
                         </Button>
                      </div>
                   </div>
                </div>

                {/* Slider Image Column */}
                <div className="space-y-4">
                   <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Slider Image <span className="text-rose-500">*</span></Label>
                   <div 
                      onClick={() => !formData.image && fileInputRef.current?.click()}
                      className={cn(
                        "w-full aspect-[16/10] rounded-2xl border-2 border-dashed transition-all relative overflow-hidden group flex flex-col items-center justify-center p-2",
                        formData.image 
                         ? "border-blue-500/20 bg-blue-50/5" 
                         : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 cursor-pointer"
                      )}
                   >
                      {formData.image ? (
                        <>
                           <Image src={formData.image} alt="Slider" fill className="object-cover rounded-sm" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button variant="destructive" size="icon" onClick={(e) => { e.stopPropagation(); setFormData({...formData, image: ""}); }} className="w-10 h-10 rounded-sm shadow-xl">
                                 <X size={20} />
                              </Button>
                           </div>
                        </>
                      ) : (
                        <div className="text-center space-y-4">
                           <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm inline-block text-blue-500 group-hover:scale-110 transition-transform duration-500">
                             <Upload size={28} />
                           </div>
                           <div>
                             <p className="text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">Choose Image</p>
                             <p className="text-[10px] font-medium text-slate-400 mt-1">Recommended: 1800 x 900 px</p>
                           </div>
                        </div>
                      )}
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Right Sidebar Area (Actions & Preview) */}
        <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8">
           
           {/* Action Buttons */}
           <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
             <PersistenceActions 
               onSave={handleSave}
               onReset={isEditing ? resetForm : undefined}
               onCancel={() => router.push("/website/home-slider/simple-slider")}
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
                     id="simple-active" 
                     checked={formData.isActive} 
                     onCheckedChange={(v: boolean) => setFormData({...formData, isActive: v})}
                  />
                  <Label htmlFor="simple-active" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Active</Label>
               </div>
            </Card>

            {/* Live Preview Card */}
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden">
               <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                        <ImageIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                     </div>
                     <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">Live Preview</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="p-5 space-y-4">
                  <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-950 rounded-sm overflow-hidden flex items-center justify-center border border-slate-100 dark:border-slate-800">
                     {formData.image ? (
                        <Image src={formData.image} alt="Preview" fill className="object-cover" />
                     ) : (
                        <ImageIcon className="w-10 h-10 text-slate-300 opacity-50" />
                     )}
                     
                     {formData.buttonLabel && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                           <Button 
                             style={{ backgroundColor: formData.buttonColor }}
                             className="h-9 px-8 rounded-full text-white text-[11px] font-bold shadow-xl animate-in zoom-in duration-300 tracking-wider uppercase"
                           >
                             {formData.buttonLabel}
                           </Button>
                        </div>
                     )}
                  </div>
                  <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest italic">Desktop Visualization</p>
               </CardContent>
            </Card>

        </div>
      </div>

      {/* Table Section Removed - Now on separate page */}
      
      {/* Full Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[1100px] border-none shadow-2xl p-0 aspect-[16/9] overflow-hidden rounded-3xl bg-slate-950 backdrop-blur-xl">
          <DialogTitle className="sr-only">Simple Slider Preview</DialogTitle>
           {previewData && (
             <div className="relative w-full h-full">
                {previewData.image ? (
                  <Image src={previewData.image} alt="Full" fill className="object-cover opacity-80" />
                ) : null}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-black/20">
                   <h2 className="text-white text-5xl font-black uppercase tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] animate-in slide-in-from-top-4 duration-700">{previewData.title}</h2>
                   <Button style={{ backgroundColor: previewData.buttonColor }} className="h-14 px-16 rounded-full text-white font-black text-sm tracking-[0.3em] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95 transition-all">
                      {previewData.buttonLabel.toUpperCase()}
                   </Button>
                </div>
                <Button onClick={() => setPreviewOpen(false)} variant="secondary" size="icon" className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-xl border-none transition-all shadow-xl">
                   <X size={20} />
                </Button>
             </div>
           )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
