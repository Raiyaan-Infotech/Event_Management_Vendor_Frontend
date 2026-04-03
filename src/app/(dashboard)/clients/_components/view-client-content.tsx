"use client";

import React, { useEffect, useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  Building, 
  Home, 
  Hash, 
  Trash2, 
  Edit2, 
  ArrowLeft,
  ChevronRight,
  Plus,
  Globe,
  Eye,
  EyeOff
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog";

interface Client {
  id: number;
  clientId: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  plan: string;
  status: string;
  events: number;
  profilePic?: string;
  address?: string;
  country?: string;
  state?: string;
  district?: string;
  locality?: string;
  pincode?: string;
  registrationType?: string;
  registrationDate?: string;
}

import { useVendorClient, useDeleteVendorClient } from "@/hooks/use-vendor-clients";

const planLabels: Record<string, string> = {
  "silver": "Silver Plan",
  "gold": "Gold Plan",
  "platinum": "Platinum Plan",
  "standard": "Standard",
  "not_subscribed": "Not Subscribed",
};

export default function ViewClientContent() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: client, isLoading, isError } = useVendorClient(id);
  const deleteMutation = useDeleteVendorClient();

  useEffect(() => {
    if (isError) {
      toast.error("Client not found.");
      router.push("/clients");
    }
  }, [isError, router]);

  const handleDelete = async () => {
    if (!client) return;
    await deleteMutation.mutateAsync(client.id);
    router.push("/clients");
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!client) return null;

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-4 sm:px-6 lg:px-8 pt-2 pb-10 custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb & Actions Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">

        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setDeleteDialogOpen(true)}
            className="h-10 px-6 rounded-xl border-gray-100 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all font-bold text-[12px] uppercase tracking-wider flex items-center gap-2 shadow-sm"
          >
            <Trash2 size={16} /> Delete
          </Button>
          <Link href={`/clients/edit/${client.id}`}>
            <Button 
                variant="outline" 
                className="h-10 px-6 rounded-xl border-gray-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all font-bold text-[12px] uppercase tracking-wider flex items-center gap-2 shadow-sm"
            >
                <Edit2 size={16} /> Edit Client
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="flex items-center gap-4">
         <h1 className="text-3xl font-black text-gray-800 dark:text-gray-100 uppercase tracking-tighter">VIEW CLIENT</h1>
         <Badge className="bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 border-none px-3 py-1 font-black text-[10px] tracking-widest uppercase rounded-lg">
            REGISTRATION
         </Badge>
      </div>
      <p className="text-sm font-medium text-gray-400 -mt-6">Client&apos;s professional profile and account details.</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Information Cards */}
        <div className="flex-[2] space-y-6">
          {/* PRIMARY INFORMATION */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
            <div className="flex items-center gap-4 border-b border-gray-50 dark:border-gray-700/50 pb-5 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-600/10 text-blue-600 flex items-center justify-center">
                 <User size={24} />
              </div>
              <div>
                 <h3 className="text-sm font-black text-gray-800 dark:text-gray-100 uppercase tracking-widest">PRIMARY INFORMATION</h3>
                 <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">Basic details of the client account</p>
              </div>
            </div>

            <div className="space-y-6">
               <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Contact</p>
               
               <div className="space-y-4">
                  {[
                    { icon: User, label: "Full Name", value: client.name },
                    { icon: Phone, label: "Mobile Number", value: client.mobile },
                    { icon: Mail, label: "Email Address", value: client.email, isEmail: true },
                    { icon: Lock, label: "Password", value: "••••••••" },
                  ].map((item, idx) => (
                     <div key={idx} className="flex flex-col md:flex-row md:items-center py-4 border-b border-gray-50 dark:border-gray-700/30 last:border-0 hover:bg-gray-50/50 transition-colors px-3 rounded-xl group/row">
                        <div className="flex items-center gap-3 md:w-64">
                           <item.icon size={15} className="text-gray-300 group-hover/row:text-blue-500 transition-colors" />
                           <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                        </div>
                        <span className={`text-[15px] font-bold tracking-tight ${item.isEmail ? "text-blue-600 underline underline-offset-4 decoration-blue-200" : "text-gray-800 dark:text-gray-200"}`}>{item.value}</span>
                     </div>
                   ))}
               </div>
            </div>
          </div>

          {/* ADDRESS DETAILS */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
            <div className="flex items-center gap-4 border-b border-gray-50 dark:border-gray-700/50 pb-5 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-600/10 text-orange-600 flex items-center justify-center">
                 <MapPin size={24} />
              </div>
              <div>
                 <h3 className="text-sm font-black text-gray-800 dark:text-gray-100 uppercase tracking-widest">ADDRESS DETAILS</h3>
                 <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">Physical location and correspondence info</p>
              </div>
            </div>

            <div className="space-y-8">
               <div>
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Location</p>
                  <div className="space-y-4">
                     <div className="flex flex-col md:flex-row md:items-start py-5 border-b border-gray-50 dark:border-gray-700/30 hover:bg-gray-50/50 transition-colors px-3 rounded-xl group/row">
                        <div className="flex items-center gap-3 md:w-64">
                           <Home size={15} className="text-gray-300 group-hover/row:text-orange-500 transition-colors" />
                           <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Street Address</span>
                        </div>
                        <span className="text-[15px] font-bold text-gray-800 dark:text-gray-200 leading-relaxed">{client.address || "No address provided"}</span>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                         {[
                           { icon: Globe, label: "Country", value: client.country },
                           { icon: Building, label: "State", value: client.state },
                           { icon: Building, label: "District", value: client.district },
                           { icon: Building, label: "City", value: client.city },
                         ].map((item, idx) => (
                            <div key={idx} className="flex items-center py-4 border-b border-gray-50 dark:border-gray-700/30 hover:bg-gray-50/50 transition-colors px-3 rounded-xl group/row">
                               <div className="flex items-center gap-3 min-w-[130px]">
                                  <item.icon size={15} className="text-gray-300 group-hover/row:text-orange-500 transition-colors" />
                                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                               </div>
                               <span className="text-[15px] font-bold text-gray-800 dark:text-gray-200 ml-4 tracking-tight">{item.value || "N/A"}</span>
                            </div>
                         ))}
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                         {[
                           { icon: MapPin, label: "Locality", value: client.locality },
                           { icon: Hash, label: "Pincode", value: client.pincode },
                         ].map((item, idx) => (
                            <div key={idx} className="flex items-center py-4 hover:bg-gray-50/50 transition-colors px-3 rounded-xl group/row">
                               <div className="flex items-center gap-3 min-w-[130px]">
                                  <item.icon size={15} className="text-gray-300 group-hover/row:text-orange-500 transition-colors" />
                                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                               </div>
                               <span className="text-[15px] font-bold text-gray-800 dark:text-gray-200 ml-4 tracking-tight">{item.value || "N/A"}</span>
                            </div>
                         ))}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Support Cards */}
        <div className="flex-1 space-y-6">
          {/* Profile Quick Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm text-center space-y-6">
             <div className="relative w-32 h-32 mx-auto scale-110">
                <Avatar className="w-full h-full rounded-full border-4 border-white dark:border-gray-700 shadow-2xl">
                    <AvatarImage src={client.profile_pic || undefined} />
                    <AvatarFallback className="bg-blue-50 text-blue-600 text-3xl font-black">{client.name.charAt(0)}</AvatarFallback>
                </Avatar>
             </div>
             <div>
                <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 uppercase tracking-tighter">{client.name}</h2>
                <p className="text-sm font-bold text-gray-400">{client.email}</p>
             </div>
             <div className="flex items-center justify-center gap-2">
                <Badge className="bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 border-none px-4 py-1.5 font-black text-[10px] tracking-widest uppercase rounded-lg">
                   {client.registration_type}
                </Badge>
                <Badge className={`${client.is_active === 1 ? "bg-emerald-500/10 text-emerald-500" : client.is_active === 0 ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"} hover:opacity-80 border-none px-4 py-1.5 font-black text-[10px] tracking-widest uppercase rounded-lg flex items-center gap-1.5`}>
                   <div className={`w-1.5 h-1.5 rounded-full ${client.is_active === 1 ? "bg-emerald-500 animate-pulse" : client.is_active === 0 ? "bg-amber-500" : "bg-rose-500"}`} />
                   {client.is_active === 1 ? "Active" : client.is_active === 0 ? "Inactive" : "Blocked"}
                </Badge>
             </div>
          </div>

          {/* SUBSCRIPTION TYPE Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm space-y-6">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-600/10 text-blue-600 flex items-center justify-center">
                    <Plus size={16} />
                </div>
                <h3 className="text-[12px] font-black text-gray-800 dark:text-gray-100 uppercase tracking-[0.2em]">SUBSCRIPTION TYPE</h3>
             </div>

             <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-50 dark:border-gray-800">
                <Button variant="ghost" disabled={client.registration_type !== "guest"} className={`h-11 rounded-xl font-black text-[11px] uppercase tracking-widest gap-2 ${client.registration_type === "guest" ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm border border-gray-100 dark:border-gray-700" : "text-gray-400 opacity-50"}`}>
                   <User size={14} /> Guest
                </Button>
                <Button variant="ghost" disabled={client.registration_type !== "client"} className={`h-11 rounded-xl font-black text-[11px] uppercase tracking-widest gap-2 ${client.registration_type === "client" ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm border border-gray-100 dark:border-gray-700" : "text-gray-400 opacity-50"}`}>
                   <Building size={14} /> Client
                </Button>
             </div>

             <div className="space-y-4 mt-6">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">SELECTED PLAN</p>
                <div className="h-14 px-6 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                            <Building size={16} />
                        </div>
                        <span className="text-[14px] font-black text-gray-800 dark:text-gray-200">{planLabels[client.plan] || client.plan}</span>
                    </div>
                    <Badge className="bg-emerald-500 text-white font-black text-[9px] px-2 rounded-md uppercase tracking-widest">Active</Badge>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 mt-2 ml-1 italic">
                   <ChevronRight size={14} className="text-gray-300" />
                   Registered: 31 Mar 2026
                </div>
             </div>
          </div>

          {/* CLIENT ID Detail Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
             <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CLIENT ID</p>
                <h3 className="text-2xl font-black text-gray-800 dark:text-gray-100 uppercase tracking-tighter">{client.client_id}</h3>
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic pt-2">Record No. #{client.id.toString().padStart(2, '0')}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-[40px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-gradient-to-b from-rose-50 to-white dark:from-rose-900/10 dark:to-gray-900 p-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-white dark:bg-gray-800 flex items-center justify-center text-rose-500 shadow-xl mb-8 animate-bounce">
              <Trash2 size={40} strokeWidth={2.5} />
            </div>
            <DialogTitle className="text-2xl font-black text-gray-800 dark:text-gray-100 uppercase tracking-tighter">Discard Record?</DialogTitle>
            <DialogDescription className="mt-4 text-gray-500 dark:text-gray-400 font-bold text-sm leading-relaxed max-w-[280px]">
               Are you certain you want to delete <span className="text-rose-600">{client.name}</span>? This operation cannot be undone.
            </DialogDescription>
          </div>
          <DialogFooter className="p-8 bg-gray-50/50 dark:bg-gray-900 flex flex-row gap-4 border-t border-gray-50 dark:border-gray-800">
            <Button 
                variant="ghost" 
                onClick={() => setDeleteDialogOpen(false)} 
                className="flex-1 h-12 rounded-2xl font-bold text-[12px] uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all"
            >
                Cancel
            </Button>
            <Button 
                onClick={handleDelete}
                className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-lg shadow-rose-500/30 transition-all"
            >
                Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>
);
}
