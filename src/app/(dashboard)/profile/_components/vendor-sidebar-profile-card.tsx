'use client';

import { useRef, useState } from 'react';
import { Camera,  Globe, Facebook, Twitter, Linkedin, Youtube, Instagram } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUploadMedia } from '@/hooks/use-media';
import { useUpdateVendorProfile } from '@/hooks/use-vendors';
import { resolveMediaUrl } from '@/lib/utils';

import { Vendor } from "@/hooks/use-vendors";

const cardClass = 'bg-card rounded-[5px] border border-border overflow-hidden shadow-sm dark:shadow-none mb-6 font-["Roboto",sans-serif]';

interface VendorSidebarProfileCardProps {
  vendor: Vendor | undefined;
  isEditMode?: boolean;
}

export function VendorSidebarProfileCard({ vendor, isEditMode = false }: VendorSidebarProfileCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMedia = useUploadMedia();
  const updateProfile = useUpdateVendorProfile();
  const [uploading, setUploading] = useState(false);

  const initials = vendor?.name
    ? vendor.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'VN';

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadMedia.mutateAsync({ file, folder: 'vendors' });
      updateProfile.mutate({ profile: result.url });
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`${cardClass} p-8 text-center`}>
      <div className="relative inline-block mb-6">
        <Avatar className="w-[124px] h-[124px] border border-border p-[4px] bg-card rounded-full relative">
          {uploading && (
             <div className="absolute inset-0 bg-black/20 rounded-full z-10 flex items-center justify-center animate-pulse">
                <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
             </div>
          )}
          <AvatarImage key={vendor?.profile} src={resolveMediaUrl(vendor?.profile || '')} className="object-cover rounded-full" />
          <AvatarFallback className="bg-gradient-to-br from-[#0162e8] to-[#0156cc] text-white font-bold text-4xl rounded-full">
            {initials}
          </AvatarFallback>
        </Avatar>
        {isEditMode && (
          <>
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute top-0 right-0 w-8 h-8 bg-primary text-white rounded-[50%] flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-all disabled:opacity-50 border-[3px] border-white shadow-sm"
            >
              {uploading ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Camera size={14} />}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
              className="hidden" 
              accept="image/*" 
            />
          </>
        )}
      </div>
      <h5 className="text-foreground text-[22px] font-bold mb-1">{vendor?.name || 'Vendor Name'}</h5>
      <p className="text-muted-foreground text-[13px] mb-6">{vendor?.company_name || 'Vendor Company'}</p>

      <div className="text-left mb-6">
        <h6 className="text-foreground text-[15px] font-bold mb-2">Company Email</h6>
        <p className="text-muted-foreground text-[13px] leading-relaxed truncate">
          {vendor?.company_email || vendor?.email}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-0 border-t border-border pt-6 mb-6">
        <div className="text-center border-r border-border">
          <p className="text-foreground text-[20px] font-bold leading-none">
            {vendor?.created_at ? new Date(vendor.created_at).getFullYear() : new Date().getFullYear()}
          </p>
          <p className="text-muted-foreground text-[12px] mt-1">Since</p>
        </div>
        <div className="text-center">
          <p className="text-foreground text-[20px] font-bold leading-none uppercase">{vendor?.status || 'Active'}</p>
          <p className="text-muted-foreground text-[12px] mt-1">Status</p>
        </div>
      </div>

      <div className="text-left space-y-4">
        <h6 className="text-foreground text-[13px] font-bold uppercase tracking-wider">Social</h6>
        <div className="space-y-3">
             <div className="flex items-center gap-3 group cursor-pointer" onClick={() => vendor?.website && window.open(vendor.website, '_blank')}>
            <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-[#1877f2] group-hover:bg-[#1877f2] group-hover:text-white transition-all"><Globe size={18} /></div>
            <div className="overflow-hidden">
              <p className="text-foreground text-[13px] font-bold leading-tight">Website</p>
              <p className="text-primary text-[11px] truncate">
                {vendor?.website || 'Not provided'}
              </p>
            </div>
          </div>
          {vendor?.youtube && (
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.open(vendor.youtube!, '_blank')}>
              <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-[#ff0000] group-hover:bg-[#ff0000] group-hover:text-white transition-all"><Youtube size={18} /></div>
              <div className="overflow-hidden">
                <p className="text-foreground text-[13px] font-bold leading-tight">YouTube</p>
                <p className="text-primary text-[11px] truncate">{vendor.youtube}</p>
              </div>
            </div>
          )}
          {vendor?.facebook && (
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.open(vendor.facebook!, '_blank')}>
              <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-[#1877f2] group-hover:bg-[#1877f2] group-hover:text-white transition-all"><Facebook size={18} /></div>
              <div className="overflow-hidden">
                <p className="text-foreground text-[13px] font-bold leading-tight">Facebook</p>
                <p className="text-primary text-[11px] truncate">{vendor.facebook}</p>
              </div>
            </div>
          )}
          {vendor?.instagram && (
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.open(vendor.instagram!, '_blank')}>
              <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-[#e1306c] group-hover:bg-[#e1306c] group-hover:text-white transition-all"><Instagram size={18} /></div>
              <div className="overflow-hidden">
                <p className="text-foreground text-[13px] font-bold leading-tight">Instagram</p>
                <p className="text-primary text-[11px] truncate">{vendor.instagram}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
