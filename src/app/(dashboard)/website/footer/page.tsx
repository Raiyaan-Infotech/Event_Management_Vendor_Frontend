"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Phone, Mail, MapPin, Facebook, Twitter, Youtube, Instagram, Linkedin, Image as ImageIcon, Upload, Trash2, Layout, Check, Search, Copyright, Eye } from "lucide-react";
import { toast } from "sonner";
import { WEBSITE_CONTENT_PAGES } from "@/lib/data";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface QuickLinkItem {
  id: string;
  pageName: string;
  url: string;
}

interface QuickLinkColumn {
  id: string;
  title: string;
  links: QuickLinkItem[];
}

interface ContactInfo {
  type: "default" | "alternate";
  defaultMobile: string;
  defaultEmail: string;
  defaultAddress: string;
  mobile: string;
  email: string;
  address: string;
}

const PLATFORMS = [
  { name: "Facebook", icon: Facebook },
  { name: "Twitter", icon: Twitter },
  { name: "Instagram", icon: Instagram },
  { name: "LinkedIn", icon: Linkedin },
  { name: "YouTube", icon: Youtube },
];

export default function FooterPage() {
  const router = useRouter();
  // Brand Identity State
  const [logo, setLogo] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { id: "1", platform: "Facebook", url: "#" },
    { id: "2", platform: "Twitter", url: "#" },
    { id: "3", platform: "YouTube", url: "#" },
    { id: "4", platform: "LinkedIn", url: "#" },
  ]);

  // Quick Links State
  const [columns, setColumns] = useState<QuickLinkColumn[]>([
    { 
      id: "c1", 
      title: "", 
      links: [
        { id: "l1", pageName: "", url: "#" },
      ]
    }
  ]);

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    type: "default",
    defaultMobile: "+91 00000 00000",
    defaultEmail: "support@shofymart.com",
    defaultAddress: "79 Sleepy Hollow St. Jamaica, New York 1432",
    mobile: "",
    email: "",
    address: ""
  });

  // Dropdown/Search state for columns
  const [pageSearchByCol, setPageSearchByCol] = useState<{ [key: string]: string }>({});

  // Footer Bottom State
  const [copyright, setCopyright] = useState<string>("");
  const [poweredBy, setPoweredBy] = useState<string>("");



  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Brand Handlers ---
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addSocialLink = () => {
    if (socialLinks.length >= 6) return toast.error("Max 6 social links.");
    setSocialLinks([...socialLinks, { id: Date.now().toString(), platform: "Facebook", url: "" }]);
  };

  const removeSocialLink = (id: string) => setSocialLinks(socialLinks.filter(l => l.id !== id));

  const updateSocialLink = (id: string, field: keyof SocialLink, value: string) => {
    setSocialLinks(socialLinks.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  // --- Quick Links Handlers ---
  const addColumn = () => {
    if (columns.length >= 2) return toast.error("only two columns maximum");
    setColumns([...columns, { 
      id: Date.now().toString(), 
      title: "", 
      links: [{ id: Date.now().toString(), pageName: "", url: "#" }]
    }]);
  };

  const removeColumn = (id: string) => setColumns(columns.filter(c => c.id !== id));

  const updateColumnTitle = (id: string, title: string) => {
    setColumns(columns.map(c => c.id === id ? { ...c, title } : c));
  };

  const updateContactInfo = (field: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    toast.success("All footer settings saved successfully!");
  };

  const handleReset = () => {
    setLogo("");
    setCompanyName("");
    setDescription("");
    setSocialLinks([]);
    setColumns([{ id: "c1", title: "", links: [{ id: "l1", pageName: "", url: "#" }] }]);
    setContactInfo({
      type: "default",
      defaultMobile: "+91 00000 00000",
      defaultEmail: "support@shofymart.com",
      defaultAddress: "79 Sleepy Hollow St. Jamaica, New York 1432",
      mobile: "",
      email: "",
      address: ""
    });
    setCopyright("");
    setPoweredBy("");
    toast.info("All settings reset.");
  };

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar">
      <div className="max-w-[1700px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-poppins mb-1">Footer Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage both brand identity and quick navigation links in a single view.</p>
        </div>

        

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Editors */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* Section 1: Brand Identity */}
            <div className="bg-white dark:bg-sidebar p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
              <div className="flex items-center gap-3 border-b pb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
                   <ImageIcon size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-poppins">Footer Company Info</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Left side: Name & Description */}
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <Label className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">COMPANY NAME</Label>
                       <Input 
                         value={companyName} 
                         onChange={e => setCompanyName(e.target.value)} 
                         placeholder="Enter company name..." 
                         className="h-12 border-gray-200 dark:border-gray-800 rounded-xl" 
                       />
                    </div>
                     <div className="space-y-2">
                        <Label className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">SHORT DESCRIPTION</Label>
                        <Textarea 
                          value={description} 
                          onChange={e => setDescription(e.target.value)} 
                          placeholder="Write short company description here..." 
                          className="min-h-[150px] border-gray-200 dark:border-gray-800 rounded-xl resize-none focus:bg-white bg-gray-50/30 transition-all font-medium leading-relaxed" 
                        />
                     </div>
                 </div>

                 {/* Right side: Logo Upload Area */}
                 <div className="space-y-2">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="h-full min-h-[250px] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-all p-8 relative group"
                    >
                       {logo ? (
                         <div className="relative h-32 w-full">
                           <Image src={logo} alt="Logo" fill className="object-contain transition-transform group-hover:scale-105" />
                         </div>
                       ) : (
                         <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-sidebar shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                               <Upload size={24} />
                            </div>
                            <div className="text-center">
                               <p className="text-sm font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">UPLOAD LOGO</p>
                               <p className="text-[10px] font-semibold text-gray-400 mt-1 uppercase tracking-wider">PNG, JPG up to 5MB</p>
                            </div>
                         </div>
                       )}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                 </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4 pt-4 border-t">
                 <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold uppercase tracking-wider text-gray-400">Social Links</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addSocialLink} className="h-8 text-xs font-bold gap-1">
                      <Plus size={14} /> Add link
                    </Button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {socialLinks.map(link => (
                      <div key={link.id} className="flex gap-2 items-center bg-gray-50/50 dark:bg-white/5 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                        <select 
                          value={link.platform} 
                          onChange={e => updateSocialLink(link.id, "platform", e.target.value)}
                          className="bg-transparent text-sm font-semibold outline-none w-24"
                        >
                           {PLATFORMS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                        </select>
                        <Input 
                          value={link.url} 
                          onChange={e => updateSocialLink(link.id, "url", e.target.value)} 
                          placeholder="URL" 
                          className="h-8 text-xs border-none bg-white dark:bg-sidebar shadow-none" 
                        />
                        <button onClick={() => removeSocialLink(link.id)} className="text-gray-400 hover:text-red-500 px-2 transition-colors">
                           <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* Section 2: Quick Links Columns */}
            <div className="bg-white dark:bg-sidebar p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
               <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600">
                       <Layout size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white font-poppins">Footer Top List</h3>
                  </div>
                  <Button 
                    onClick={addColumn} 
                    className="bg-green-600 hover:bg-green-700 text-white h-9 text-xs font-bold px-4 gap-2 shadow-sm shadow-green-500/10 active:scale-95 transition-all"
                  >
                     <Plus size={14} /> Add Column
                  </Button>
               </div>

               <div className="space-y-8">
                  {columns.map((col) => (
                    <div key={col.id} className="p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/5 space-y-4">
                       <div className="flex items-center justify-between">
                          <div className="flex-1 max-w-[300px]">
                            <Input 
                              value={col.title} 
                              onChange={e => updateColumnTitle(col.id, e.target.value)}
                              placeholder="Type Heading Here..."
                              className="font-bold text-base h-10 bg-white dark:bg-sidebar border-gray-200 dark:border-gray-800"
                            />
                          </div>
                          <button onClick={() => removeColumn(col.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                             <Trash2 size={16} />
                          </button>
                       </div>

                       <div className="space-y-4">
                          <div className="space-y-3">
                             <div className="flex items-center justify-between px-1">
                                <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Select Navigation Pages</Label>
                             </div>

                             <div className="bg-white dark:bg-sidebar border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                <div className="p-3 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-white/5">
                                   <div className="relative">
                                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-3.5" />
                                      <input 
                                        placeholder="Search pages..."
                                        value={pageSearchByCol[col.id] || ""}
                                        onChange={e => setPageSearchByCol({ ...pageSearchByCol, [col.id]: e.target.value })}
                                        className="w-full h-9 pl-9 pr-3 bg-white dark:bg-sidebar border border-gray-200 dark:border-gray-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                                      />
                                   </div>
                                </div>

                                <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-1.5 bg-white dark:bg-sidebar">
                                   {WEBSITE_CONTENT_PAGES.filter(p => p.name.toLowerCase().includes((pageSearchByCol[col.id] || "").toLowerCase())).map(page => {
                                      const isSelected = col.links.some(l => l.pageName === page.name);
                                      return (
                                         <div 
                                           key={page.id}
                                           onClick={(e) => {
                                              e.preventDefault();
                                              if (isSelected) {
                                                 const linkToRemove = col.links.find(l => l.pageName === page.name);
                                                 if (linkToRemove) {
                                                    setColumns(prev => prev.map(c => {
                                                       if (c.id === col.id) {
                                                          return { ...c, links: c.links.filter(l => l.id !== linkToRemove.id) };
                                                       }
                                                       return c;
                                                    }));
                                                 }
                                              } else {
                                                 setColumns(prev => prev.map(c => {
                                                    if (c.id === col.id) {
                                                       return {
                                                          ...c,
                                                          links: [...c.links, { id: `l-${Date.now()}-${Math.random()}`, pageName: page.name, url: `/website/pages/view/${page.id}` }]
                                                       };
                                                    }
                                                    return c;
                                                 }));
                                              }
                                           }}
                                           className={`px-3 py-1.5 rounded-lg border border-transparent hover:border-primary/10 hover:bg-primary/5 dark:hover:bg-primary/10 cursor-pointer group transition-all flex items-center gap-3 mb-0.5 select-none ${isSelected ? "bg-primary/5 border-primary/20" : ""}`}
                                         >
                                            <div className={`w-4 h-4 rounded-md border flex flex-shrink-0 items-center justify-center transition-all ${isSelected ? "bg-primary border-primary text-white" : "border-gray-300 dark:border-gray-700 bg-white dark:bg-sidebar group-hover:border-primary/50"}`}>
                                               {isSelected && <Check size={10} />}
                                            </div>
                                            <span className={`text-[13px] font-bold transition-colors ${isSelected ? "text-primary" : "text-gray-700 dark:text-gray-200 group-hover:text-primary"}`}>
                                               {page.name}
                                            </span>
                                         </div>
                                      );
                                   })}
                                </div>
                             </div>
                          </div>
                          {col.links.length === 0 && <p className="text-xs text-gray-400 italic py-2 pl-2">No links in this column yet.</p>}
                       </div>
                    </div>
                  ))}

                   {/* Contact Information [Multi-Mode selection] */}
                   <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 space-y-6 shadow-sm">
                     <h3 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1">Contact Info</h3>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {/* Default Mode Selector */}
                       <div 
                         onClick={() => updateContactInfo('type', 'default')}
                         className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                           contactInfo.type === "default" 
                           ? "border-primary bg-white dark:bg-sidebar shadow-md shadow-primary/5 scale-[1.01]" 
                           : "border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/5 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 hover:border-gray-200"
                         }`}
                       >
                         <div className="flex items-center gap-3 mb-6">
                           <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                             contactInfo.type === "default" ? "border-primary bg-primary" : "border-gray-300 dark:border-gray-600"
                           }`}>
                             {contactInfo.type === "default" && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
                           </div>
                           <span className={`text-sm font-bold font-poppins transition-colors ${contactInfo.type === "default" ? "text-primary" : "text-gray-500"}`}>Default Contact Info</span>
                         </div>
 
                         <div className="space-y-4">
                           <div className="space-y-1">
                             <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                                <Phone size={10} /> MOBILE
                             </Label>
                             <Input 
                               value={contactInfo.defaultMobile} 
                               onChange={(e) => updateContactInfo('defaultMobile', e.target.value)}
                               placeholder="Enter Mobile Number..."
                               className="h-10 text-xs bg-white dark:bg-[#121212] border-gray-100 dark:border-gray-800 rounded-lg font-medium" 
                             />
                           </div>
                           <div className="space-y-1">
                             <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                                <Mail size={10} /> EMAIL
                             </Label>
                             <Input 
                               value={contactInfo.defaultEmail} 
                               onChange={(e) => updateContactInfo('defaultEmail', e.target.value)}
                               placeholder="Enter Email ID..."
                               className="h-10 text-xs bg-white dark:bg-[#121212] border-gray-100 dark:border-gray-800 rounded-lg font-medium" 
                             />
                           </div>
                           <div className="space-y-1">
                             <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                                <MapPin size={10} /> ADDRESS
                             </Label>
                             <Textarea 
                               value={contactInfo.defaultAddress} 
                               onChange={(e) => updateContactInfo('defaultAddress', e.target.value)}
                               placeholder="Enter Address..."
                               className="min-h-[80px] text-xs bg-white dark:bg-[#121212] border-gray-100 dark:border-gray-800 rounded-lg resize-none leading-relaxed font-medium" 
                             />
                           </div>
                         </div>
                       </div>
 
                       {/* Alternative Mode Selector */}
                       <div 
                         onClick={() => updateContactInfo('type', 'alternate')}
                         className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                           contactInfo.type === "alternate" 
                           ? "border-primary bg-white dark:bg-sidebar shadow-md shadow-primary/5 scale-[1.01]" 
                           : "border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/5 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 hover:border-gray-200"
                         }`}
                       >
                         <div className="flex items-center gap-3 mb-6">
                           <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                             contactInfo.type === "alternate" ? "border-primary bg-primary" : "border-gray-300 dark:border-gray-600"
                           }`}>
                             {contactInfo.type === "alternate" && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
                           </div>
                           <span className={`text-sm font-bold font-poppins transition-colors ${contactInfo.type === "alternate" ? "text-primary" : "text-gray-500"}`}>Alternative Contact Info</span>
                         </div>
 
                         <div className="space-y-4">
                           <div className="space-y-1">
                             <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                                <Phone size={10} /> MOBILE
                             </Label>
                             <Input 
                               value={contactInfo.mobile}
                               onChange={(e) => updateContactInfo('mobile', e.target.value)}
                               placeholder="Enter Mobile Number..." 
                               className="h-10 text-xs bg-white dark:bg-[#121212] border-gray-100 dark:border-gray-800 rounded-lg font-medium" 
                             />
                           </div>
                           <div className="space-y-1">
                             <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                                <Mail size={10} /> EMAIL
                             </Label>
                             <Input 
                               value={contactInfo.email}
                               onChange={(e) => updateContactInfo('email', e.target.value)}
                               placeholder="Enter Email ID..." 
                               className="h-10 text-xs bg-white dark:bg-[#121212] border-gray-100 dark:border-gray-800 rounded-lg font-medium" 
                             />
                           </div>
                           <div className="space-y-1">
                             <Label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-2">
                                <MapPin size={10} /> ADDRESS
                             </Label>
                             <Textarea 
                               value={contactInfo.address}
                               onChange={(e) => updateContactInfo('address', e.target.value)}
                               placeholder="Enter Address..." 
                               className="min-h-[80px] text-xs bg-white dark:bg-[#121212] border-gray-100 dark:border-gray-800 rounded-lg resize-none leading-relaxed font-medium" 
                             />
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                  {columns.length === 0 && (
                    <div className="py-12 text-center border-2 border-dashed border-gray-100 dark:border-gray-800/50 rounded-2xl">
                        <p className="text-sm text-gray-400">Click &quot;Add Column&quot; to start building your footer link structure.</p>
                    </div>
                  )}
               </div>
            </div>

            {/* Section 3: Footer Bottom */}
            <div className="bg-white dark:bg-sidebar p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
               <div className="flex items-center gap-3 border-b pb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600">
                     <Copyright size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white font-poppins">Footer Bottom</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <Label className="text-sm font-semibold">Copyright Text</Label>
                     <Input value={copyright} onChange={e => setCopyright(e.target.value)} placeholder="Type Copyright Text..." className="h-11 border-gray-200 dark:border-gray-800" />
                  </div>
                  <div className="space-y-2">
                     <Label className="text-sm font-semibold">Powered By</Label>
                     <Input value={poweredBy} onChange={e => setPoweredBy(e.target.value)} placeholder="Type Powered By text..." className="h-11 border-gray-200 dark:border-gray-800" />
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Floating Preview & Global Actions */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8">
            <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">

                 <Button 
                   variant="outline" 
                   className="w-full h-14 border-emerald-200 dark:border-emerald-500/30 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 font-bold text-[13px] tracking-[0.1em] uppercase rounded-2xl border-2 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
                 >
                   <Eye className="size-4" />
                   PREVIEW
                 </Button>

                <Button 
                  onClick={handleSave} 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-[13px] tracking-[0.1em] uppercase rounded-2xl shadow-lg shadow-blue-500/25 border-none transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
                >
                  <Plus className="size-4" />
                  UPDATE
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="w-full h-11 font-bold text-[12px] tracking-wide uppercase rounded-xl"
                >
                  Reset
                </Button>
                <Button 
                  onClick={() => router.push("/website/management")} 
                  variant="outline" 
                  className="w-full h-12 bg-white hover:bg-rose-600 border-2 border-red-500 text-red-500 hover:text-white transition-all duration-300 rounded-xl text-[13px] font-bold gap-2 shadow-sm hover:shadow-red-500/30 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center"
                >
                  <X className="size-4" strokeWidth={2.5} />
                  CANCEL
                </Button>
            </div>


          </div>
        </div>
      </div>


    </div>
  );
}
