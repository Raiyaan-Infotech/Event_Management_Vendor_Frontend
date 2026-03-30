"use client";

import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  Flag, 
  Building, 
  Home, 
  Hash, 
  Camera, 
  Check, 
  X,
  ChevronRight,
  Globe,
  Eye,
  EyeOff
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Support component for Searchable Select
function SearchableSelect({ 
  value, 
  onValueChange, 
  options, 
  placeholder, 
  icon: Icon 
}: { 
  value: string, 
  onValueChange: (val: string) => void, 
  options: string[], 
  placeholder: string,
  icon: any
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative group">
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-500" size={16} />
        <Input 
          value={open ? search : (value || "")}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            setSearch("");
          }}
          onBlur={() => {
            // Delay closing to allow click selection
            setTimeout(() => setOpen(false), 200);
          }}
          placeholder={placeholder}
          className="h-12 pl-10 pr-10 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all text-[14px]" 
        />
        <ChevronRight className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 transition-all duration-300 ${open ? "rotate-90" : "rotate-0"}`} size={16} />
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-2 py-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xl max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onMouseDown={() => {
                  onValueChange(opt);
                  setSearch(opt);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-[13px] hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors ${value === opt ? "text-blue-600 font-bold bg-blue-50/50" : "text-gray-600 dark:text-gray-300"}`}
              >
                {opt}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-[12px] text-gray-400 italic">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}

export function AddClientContent() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    address: "",
    country: "India",
    state: "",
    district: "",
    city: "",
    locality: "",
    pincode: "",
  });

  const handleSave = () => {
    // Check all fields
    const requiredFields = [
      { key: 'name', label: 'Full Name' },
      { key: 'mobile', label: 'Mobile Number' },
      { key: 'email', label: 'Email Address' },
      { key: 'password', label: 'Password' },
      { key: 'address', label: 'Street Address' },
      { key: 'country', label: 'Country' },
      { key: 'state', label: 'State' },
      { key: 'district', label: 'District' },
      { key: 'city', label: 'City' },
      { key: 'locality', label: 'Locality' },
      { key: 'pincode', label: 'Pincode' },
    ];

    for (const field of requiredFields) {
      if (!formData[field.key as keyof typeof formData]) {
        alert(`${field.label} is mandatory.`);
        return;
      }
    }

    if (!profilePic) {
      alert("Please upload a profile picture.");
      return;
    }

    // Get existing clients
    const existingClients = JSON.parse(localStorage.getItem("clients_data") || "[]");
    
    // Create new client object
    const newClient = {
      id: existingClients.length > 0 ? Math.max(...existingClients.map((c: any) => c.id)) + 1 : 1,
      clientId: `CLI-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      city: formData.city,
      plan: "Standard",
      status: "Active",
      events: 0,
      profilePic: profilePic // Now saving the profile pic too
    };

    // Save and redirect
    const updatedClients = [newClient, ...existingClients];
    localStorage.setItem("clients_data", JSON.stringify(updatedClients));
    
    // Redirect via browser
    window.location.href = "/clients";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 10MB limit (10 * 1024 * 1024 bytes)
      if (file.size > 10 * 1024 * 1024) {
        alert("Image size exceeds 10MB. Please upload a smaller file.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 uppercase tracking-tight flex items-center gap-2">
            Add New Client
            <Badge variant="outline" className="text-[10px] font-bold border-indigo-200 text-indigo-600 ml-1">
              REGISTRATION
            </Badge>
          </h1>
          <p className="text-sm text-gray-400 mt-1 italic tracking-tight">Enter the client&apos;s personal and contact information to create a new profile.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="h-9 px-4 flex items-center gap-2 bg-white border border-gray-100 dark:border-gray-800 text-gray-400 rounded-xl shadow-sm text-[12px] font-medium whitespace-nowrap ml-1 transition-all">
            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} <ChevronRight size={14} className="rotate-90 translate-y-0.5" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Form Area */}
        <div className="flex-[2] space-y-6">
          <div className="bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
             <div className="space-y-8">
                {/* Section Title */}
                <div className="flex items-center gap-3 border-b border-gray-50 dark:border-gray-800/50 pb-4 mb-6">
                   <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center">
                      <User size={20} />
                   </div>
                   <div>
                      <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 uppercase tracking-widest">Primary Information</h2>
                      <p className="text-[11px] text-gray-400 font-medium">Basic details of the client account</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                   {/* Name */}
                   <div className="space-y-2 group">
                      <Label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider translate-x-1">
                        Full Name <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                         <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-500" size={16} />
                         <Input 
                           value={formData.name}
                           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                           placeholder="e.g. John Doe" 
                           className="h-12 pl-10 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all text-[14px]" 
                         />
                      </div>
                   </div>

                   {/* Mobile */}
                   <div className="space-y-2 group">
                      <Label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider translate-x-1">
                        Mobile Number <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                         <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-500" size={16} />
                         <Input 
                           value={formData.mobile}
                           onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                           placeholder="9876543210" 
                           className="h-12 pl-10 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all text-[14px]" 
                         />
                      </div>
                   </div>

                   {/* Email */}
                   <div className="space-y-2 group">
                      <Label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider translate-x-1">
                        Email Address <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-500" size={16} />
                         <Input 
                           value={formData.email}
                           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                           placeholder="john.doe@email.com" 
                           className="h-12 pl-10 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all text-[14px]" 
                         />
                      </div>
                   </div>

                   {/* Password */}
                   <div className="space-y-2 group">
                      <Label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider translate-x-1">
                        Password <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                         <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-500" size={16} />
                         <Input 
                           type={showPassword ? "text" : "password"}
                           value={formData.password}
                           onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                           placeholder="••••••••" 
                           className="h-12 pl-10 pr-10 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all text-[14px]" 
                         />
                         <button 
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                         >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                         </button>
                      </div>
                   </div>
                </div>

                {/* Section Title: Address */}
                <div className="flex items-center gap-3 border-b border-gray-50 dark:border-gray-800/50 pb-4 mb-6 pt-4">
                   <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 flex items-center justify-center">
                      <MapPin size={20} />
                   </div>
                   <div>
                      <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 uppercase tracking-widest">Address Details</h2>
                      <p className="text-[11px] text-gray-400 font-medium">Physical location and correspondence info</p>
                   </div>
                </div>

                <div className="space-y-6">
                   {/* Address Line */}
                   <div className="space-y-2 group">
                      <Label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider translate-x-1">
                        Street Address <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                         <Home className="absolute left-3 top-3 text-gray-300 transition-colors group-focus-within:text-blue-500" size={16} />
                         <textarea 
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Enter full address..." 
                            className="w-full pl-10 pr-3 py-3 border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-[14px] min-h-[100px] resize-none" 
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      {/* Country */}
                      <div className="space-y-2">
                         <Label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider translate-x-1">
                            Country <span className="text-red-500 ml-1">*</span>
                         </Label>
                         <SearchableSelect 
                            value={formData.country} 
                            onValueChange={(val) => setFormData({ ...formData, country: val })}
                            options={["India", "USA", "UK", "UAE", "Australia", "Canada", "Singapore"]}
                            placeholder="Select Country"
                            icon={Flag}
                         />
                      </div>

                      {/* State */}
                      <div className="space-y-2">
                         <Label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider translate-x-1">
                            State <span className="text-red-500 ml-1">*</span>
                         </Label>
                         <SearchableSelect 
                            value={formData.state} 
                            onValueChange={(val) => setFormData({ ...formData, state: val })}
                            options={["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Maharashtra", "Delhi", "Telangana", "Gujarat", "Rajasthan"]}
                            placeholder="Select State"
                            icon={Globe}
                         />
                      </div>

                      {/* District */}
                      <div className="space-y-2">
                         <Label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider translate-x-1">
                            District <span className="text-red-500 ml-1">*</span>
                         </Label>
                         <SearchableSelect 
                            value={formData.district} 
                            onValueChange={(val) => setFormData({ ...formData, district: val })}
                            options={["Tirunelveli", "Chennai", "Coimbatore", "Madurai", "Tuticorin", "Kanyakumari", "Salem", "Erode", "Vellore"]}
                            placeholder="Select District"
                            icon={Building}
                         />
                      </div>

                      {/* City */}
                      <div className="space-y-2">
                         <Label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider translate-x-1">
                            City <span className="text-red-500 ml-1">*</span>
                         </Label>
                         <SearchableSelect 
                            value={formData.city} 
                            onValueChange={(val) => setFormData({ ...formData, city: val })}
                            options={["Tirunelveli", "Palayamkottai", "Tenkasi", "Chennai", "Madurai", "Nagercoil", "Bangalore", "Mumbai", "Hyderabad"]}
                            placeholder="Select City"
                            icon={Building}
                         />
                      </div>

                      {/* Locality */}
                      <div className="space-y-2 group">
                         <Label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider translate-x-1">
                            Locality <span className="text-red-500 ml-1">*</span>
                         </Label>
                         <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-500" size={16} />
                            <Input 
                              value={formData.locality}
                              onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                              placeholder="e.g. Vannarpettai" 
                              className="h-12 pl-10 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all text-[14px]" 
                            />
                         </div>
                      </div>

                      {/* Pincode */}
                      <div className="space-y-2 group">
                         <Label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider translate-x-1">
                            Pincode <span className="text-red-500 ml-1">*</span>
                         </Label>
                         <div className="relative">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-500" size={16} />
                            <Input 
                              value={formData.pincode}
                              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                              placeholder="6-digit ZIP code" 
                              className="h-12 pl-10 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all text-[14px]" 
                            />
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Actions Area */}
        <div className="flex-1 space-y-6">
           {/* Photo Card */}
           <div className="bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] text-center">
              <div className="relative w-32 h-32 mx-auto mb-6 group cursor-pointer">
                 <div className="absolute inset-0 rounded-3xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-all duration-300" />
                 <Avatar className="w-full h-full rounded-3xl border-4 border-white dark:border-gray-800 shadow-xl transition-transform duration-300 group-hover:scale-[1.02]">
                    <AvatarImage src={profilePic || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-none transition-all">
                       <User size={48} className="text-gray-300" />
                    </AvatarFallback>
                 </Avatar>
                 <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-700 transition-all border-4 border-white dark:border-[#1f2937] active:scale-95">
                    <Camera size={18} />
                    <input 
                       type="file" 
                       className="hidden" 
                       onChange={handleFileChange}
                       accept="image/*"
                    />
                 </label>
              </div>
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 uppercase tracking-widest">
                Profile Picture <span className="text-red-500 ml-1">*</span>
              </h3>
              <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-tighter italic font-medium">Upload high quality portrait photo</p>
           </div>

           {/* Action Buttons */}
           <div className="bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-3">
              <Link href="/clients" className="block w-full">
                <Button className="w-full h-12 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white transition-all duration-300 rounded-xl text-[13px] font-bold gap-2 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5 active:scale-[0.98]">
                   <X size={18} strokeWidth={2.5} /> Cancel
                </Button>
              </Link>
              <Button 
                onClick={handleSave}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[13px] font-bold gap-2 transition-all duration-300 shadow-lg shadow-blue-500/20 rounded-xl hover:-translate-y-0.5 hover:shadow-blue-500/40 active:scale-[0.98]"
              >
                 <Check size={18} strokeWidth={2.5} /> SAVE CLIENT RECORD
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}

// Support components
function CheckCircle2({ size, className }: any) {
  return <Check size={size} className={className} />;
}
