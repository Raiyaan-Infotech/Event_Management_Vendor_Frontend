"use client";

import React, { useState, useRef } from "react";
import { 
  Star, 
  User, 
  Calendar, 
  MessageSquare, 
  Upload, 
  X, 
  Save, 
  Image as ImageIcon,
  Plus,
  Trash2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface TestimonialData {
  id: string;
  name: string;
  eventName: string;
  image: string;
  comment: string;
}

export default function TestimonialManagementPage() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([
    { id: Date.now().toString(), name: "", eventName: "", image: "", comment: "" }
  ]);

  const addTestimonial = () => {
    const newTestimonial = {
      id: Date.now().toString(),
      name: "",
      eventName: "",
      image: "",
      comment: ""
    };
    setTestimonials([...testimonials, newTestimonial]);
    toast.success("New form added below!");
  };

  const removeTestimonial = (id: string) => {
    if (testimonials.length === 1) {
      toast.error("At least one testimonial form must remain.");
      return;
    }
    setTestimonials(testimonials.filter((t) => t.id !== id));
    toast.info("Form removed.");
  };

  const updateTestimonial = (id: string, field: keyof TestimonialData, value: string) => {
    setTestimonials(
      testimonials.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        updateTestimonial(id, "image", event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAll = () => {
    const invalid = testimonials.some((t) => !t.name || !t.comment);
    if (invalid) {
      toast.error("Please fill in the required fields (Name and Comment) for all forms.");
      return;
    }
    toast.success(`${testimonials.length} testimonial(s) saved successfully!`);
  };

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar">
      <div className="max-w-[1000px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 shadow-sm border border-orange-500/10">
              <Star size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-poppins">Testimonial Management</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add and manage client feedback.</p>
            </div>
          </div>

          <Button 
            onClick={addTestimonial}
            className="bg-[#001720] hover:bg-[#002a3a] text-white rounded-xl h-12 px-6 font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-[#001720]/10"
          >
            <Plus className="mr-2" size={16} />
            Add Testimonial
          </Button>
        </div>

        {/* Dynamic Form List */}
        <div className="space-y-12">
          {testimonials.map((testimonial, index) => (
            <TestimonialForm 
              key={testimonial.id}
              index={index}
              data={testimonial}
              onUpdate={(field, value) => updateTestimonial(testimonial.id, field, value)}
              onRemove={() => removeTestimonial(testimonial.id)}
              onImageUpload={(e) => handleImageUpload(testimonial.id, e)}
            />
          ))}
        </div>

        {/* Global Save Action */}
        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-end pb-12">
          <Button 
            onClick={handleSaveAll}
            className="h-14 px-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-3 uppercase"
          >
            <Save size={18} />
              Save  
          </Button>
        </div>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
}

interface FormProps {
  index: number;
  data: TestimonialData;
  onUpdate: (field: keyof TestimonialData, value: string) => void;
  onRemove: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function TestimonialForm({ index, data, onUpdate, onRemove, onImageUpload }: FormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white dark:bg-sidebar rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden relative animate-in zoom-in duration-300">
      {/* Index Badge */}
      <div className="absolute top-8 left-8 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold z-20">
        {index + 1}
      </div>

      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      
      <div className="p-8 md:p-10 relative z-10">
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 ml-12">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
              <ImageIcon size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white font-poppins uppercase tracking-tight">Testimonial Details</h3>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onRemove}
            className="text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all rounded-xl"
          >
            <Trash2 size={20} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Column: Form Fields */}
          <div className="space-y-8">
            {/* Name */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 px-1">Customer Name <span className="text-rose-500">*</span></Label>
              <div className="relative group/input">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-blue-500 transition-colors" size={18} />
                <Input 
                  value={data.name}
                  onChange={(e) => onUpdate("name", e.target.value)}
                  placeholder="e.g. John Doe" 
                  className="h-14 pl-12 rounded-2xl border-gray-200 dark:border-gray-800 bg-gray-50/10 dark:bg-white/2 focus:bg-white transition-all font-medium" 
                />
              </div>
            </div>

            {/* Event Name */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 px-1">Event Name</Label>
              <div className="relative group/input">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-orange-500 transition-colors" size={18} />
                <Input 
                  value={data.eventName}
                  onChange={(e) => onUpdate("eventName", e.target.value)}
                  placeholder="e.g. Wedding Ceremony" 
                  className="h-14 pl-12 rounded-2xl border-gray-200 dark:border-gray-800 bg-gray-50/10 dark:bg-white/2 focus:bg-white transition-all font-medium" 
                />
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 px-1">Customer Comment <span className="text-rose-500">*</span></Label>
              <div className="relative group/input">
                <MessageSquare className="absolute left-4 top-5 text-gray-400 group-focus-within/input:text-emerald-500 transition-colors" size={18} />
                <Textarea 
                  value={data.comment}
                  onChange={(e) => onUpdate("comment", e.target.value)}
                  placeholder="Write feedback..." 
                  className="min-h-[160px] pl-12 pt-4 rounded-2xl border-gray-200 dark:border-gray-800 bg-gray-50/10 dark:bg-white/2 focus:bg-white transition-all font-medium leading-relaxed resize-none" 
                />
              </div>
            </div>
          </div>

          {/* Right Column: Image Upload Area */}
          <div className="space-y-4 flex flex-col h-full">
            <Label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 px-1">Customer Image</Label>
            <div 
              onClick={() => !data.image && fileInputRef.current?.click()}
              className={cn(
                "flex-1 w-full rounded-3xl border-2 border-dashed transition-all p-1 relative flex flex-col items-center justify-center overflow-hidden",
                data.image 
                  ? "border-emerald-500/30 bg-emerald-50/10 dark:bg-emerald-500/5 group" 
                  : "border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-white/2 hover:bg-gray-50/50 dark:hover:bg-white/5 cursor-pointer"
              )}
            >
              {data.image ? (
                <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
                  <Image 
                    src={data.image} 
                    alt="Customer" 
                    fill 
                    className="object-cover rounded-[20px]" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                     <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={(e) => { e.stopPropagation(); onUpdate("image", ""); }}
                      className="w-10 h-10 rounded-xl"
                     >
                       <X size={18} />
                     </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 py-12 px-6">
                  <div className="w-20 h-20 rounded-3xl bg-white dark:bg-sidebar shadow-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Upload size={32} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">Choose File</p>
                    <p className="text-[10px] font-semibold text-gray-400 mt-2 uppercase tracking-wider">PNG or JPG</p>
                  </div>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={onImageUpload} 
                className="hidden" 
                accept="image/*" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
