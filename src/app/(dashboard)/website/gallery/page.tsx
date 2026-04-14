"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Images, 
  MapPin, 
  Plus, 
  Trash2, 
  Edit2, 
  Camera,
  Image as ImageIcon,
  Upload,
  Download,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import { DataTable, Column } from "@/components/common/DataTable";
import { DataTableSearch } from "@/components/common/DataTableSearch";
import { ColumnToggle } from "@/components/common/ColumnToggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GalleryItem {
  id: string;
  eventName: string;
  city: string;
  image: string;
  createdAt: string;
}

export default function GalleryPage() {
  const [view, setView] = useState<'list' | 'add'>('list');
  const [searchQuery, setSearchQuery] = useState("");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    {
      id: "1",
      eventName: "Grand Wedding Gala",
      city: "Tirunelveli",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552",
      createdAt: "2024-03-20"
    },
    {
      id: "2",
      eventName: "Tech Conference 2024",
      city: "Chennai",
      image: "https://images.unsplash.com/photo-1540575861501-7ad0582373f1",
      createdAt: "2024-03-15"
    }
  ]);

  const [formData, setFormData] = useState({
    eventName: "",
    city: "",
    image: ""
  });

  const [visibleColumns, setVisibleColumns] = useState<string[]>(["preview", "eventName", "city", "createdAt", "actions"]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Column definitions for DataTable
  const galleryColumns: Column<GalleryItem>[] = [
    {
      key: "preview",
      label: "Preview",
      sortable: false,
      render: (item) => (
        <div className="relative w-24 h-16 rounded-xl overflow-hidden shadow-sm border border-slate-100 group-hover:scale-105 transition-transform duration-300">
          <Image src={item.image} alt={item.eventName} fill className="object-cover" />
        </div>
      )
    },
    {
      key: "eventName",
      label: "Event Name",
      sortable: true,
      render: (item) => (
        <span className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
          {item.eventName}
        </span>
      )
    },
    {
      key: "city",
      label: "City / Location",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2 text-slate-500 font-bold text-[12px] uppercase tracking-widest">
           <MapPin size={14} className="text-emerald-500" />
           {item.city}
        </div>
      )
    },
    {
      key: "createdAt",
      label: "Upload Date",
      sortable: true,
      render: (item) => (
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-800">
          {item.createdAt}
        </span>
      )
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (item) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 transition-all">
            <Edit2 size={16} />
          </Button>
          <Button 
            onClick={() => deleteItem(item.id)}
            variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 transition-all"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, image: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.eventName || !formData.city || !formData.image) {
      return toast.error("Please fill all fields and upload an image.");
    }

    const newItem: GalleryItem = {
      id: Math.random().toString(36).substr(2, 9),
      eventName: formData.eventName,
      city: formData.city,
      image: formData.image,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setGalleryItems([newItem, ...galleryItems]);
    toast.success("Gallery item added successfully!");
    setView('list');
    setFormData({ eventName: "", city: "", image: "" });
  };

  const deleteItem = (id: string) => {
    setGalleryItems(galleryItems.filter(item => item.id !== id));
    toast.success("Item removed from gallery.");
  };

  const handleExport = () => {
    if (galleryItems.length === 0) return toast.error("No data to export");
    const headers = ["ID", "Event Name", "City", "Created At"];
    const csvContent = [
      headers.join(","),
      ...galleryItems.map(item => [item.id, `"${item.eventName}"`, `"${item.city}"`, item.createdAt].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gallery_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("Gallery exported successfully!");
  };

  const handleImport = () => {
    toast.info("Import feature requires backend CSV processing.");
  };

  if (view === 'add') {
    return (
      <div className="h-[calc(100vh-86px)] overflow-y-auto custom-scrollbar bg-[#F8FAFC] dark:bg-black/40">
        <div className="max-w-[1700px] mx-auto px-6 py-8">
          <PageHeader 
            title="Add to Gallery"
            subtitle="Upload a new event memory to your public showcase."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10 items-start pb-20">
            <div className="lg:col-span-9 space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
               <Card className="border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none bg-white dark:bg-sidebar rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="p-10 pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                        <Camera size={24} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-black uppercase tracking-tighter">Gallery Details</CardTitle>
                        <CardDescription className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Fill in the event information and upload an image.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10 pt-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2 group">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Event Name</Label>
                        <Input 
                          value={formData.eventName}
                          onChange={(e) => setFormData({...formData, eventName: e.target.value})}
                          placeholder="Enter event name..."
                          className="h-14 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white transition-all font-bold"
                        />
                      </div>
                      <div className="space-y-2 group">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">City</Label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                          <Input 
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            placeholder="Location of event..."
                            className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white transition-all font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Event Image</Label>
                       <div 
                         onClick={() => fileInputRef.current?.click()}
                         className="relative h-[400px] w-full border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all overflow-hidden group"
                       >
                          {formData.image ? (
                            <>
                              <Image src={formData.image} alt="Preview" fill className="object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button variant="secondary" className="rounded-full font-bold">Change Image</Button>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center text-center px-10">
                               <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                                  <ImageIcon size={40} />
                               </div>
                               <h4 className="text-lg font-black uppercase tracking-tighter">Click to Upload</h4>
                               <p className="text-xs font-bold text-gray-400 max-w-[200px] mt-1 uppercase tracking-widest">Recommended size: 1200 x 800px</p>
                            </div>
                          )}
                       </div>
                       <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                    </div>
                  </CardContent>
               </Card>
            </div>

            <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8 animate-in fade-in slide-in-from-right duration-1000">
               <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <PersistenceActions 
                    onSave={handleSave}
                    onCancel={() => setView('list')}
                    saveLabel="Save Gallery"
                  />
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-3 bg-[#F8FAFC] dark:bg-black/40">
      <PageHeader 
        title="GALLERY"
        subtitle="Manage your visual history and event memories."
        total={galleryItems.length}
        rightContent={
          <div className="flex items-center gap-2">
            <input type="file" ref={importInputRef} onChange={handleImport} accept=".csv" className="hidden" />
            <Button variant="outline" onClick={() => importInputRef.current?.click()} className="h-10 text-[12px] font-bold gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-wider">
              <Upload size={15} strokeWidth={2.5} /> Import
            </Button>
            <Button variant="outline" onClick={handleExport} className="h-10 text-[12px] font-bold gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-wider">
              <Download size={15} strokeWidth={2.5} /> Export
            </Button>
            <Button 
                onClick={() => setView('add')}
                className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[12px] font-bold shadow-lg shadow-emerald-500/30 flex items-center gap-3 transition-all hover:-translate-y-0.5 active:scale-95 border-none uppercase"
            >
                <Plus size={16} strokeWidth={3} /> ADD GALLERY
            </Button>
          </div>
        }
      />

      <DataTableSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search gallery by event name or city..."
        isFiltered={false}
        filterContent={
          <div className="space-y-4">
             <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Location Filter</p>
                <Select defaultValue="All">
                   <SelectTrigger className="h-10 rounded-xl text-[12px] font-bold border-gray-100 bg-gray-50/50 focus:ring-0">
                      <SelectValue placeholder="All Cities" />
                   </SelectTrigger>
                   <SelectContent className="rounded-xl border-gray-100 font-bold">
                      <SelectItem value="All">All Cities</SelectItem>
                      <SelectItem value="Tirunelveli">Tirunelveli</SelectItem>
                      <SelectItem value="Chennai">Chennai</SelectItem>
                   </SelectContent>
                </Select>
             </div>
          </div>
        }
        columnToggle={
          <ColumnToggle 
            columns={galleryColumns.filter(c => c.key !== 'actions')} 
            visibleColumns={visibleColumns} 
            onChange={setVisibleColumns} 
          />
        }
      />

      <div className="flex-1 overflow-hidden">
        <DataTable 
          columns={galleryColumns}
          data={galleryItems.filter(item => 
            item.eventName.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.city.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          visibleColumns={visibleColumns}
          isLoading={false}
        />
      </div>
    </div>
  );
}
