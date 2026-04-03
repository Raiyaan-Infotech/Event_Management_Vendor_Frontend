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
    : 'PC';

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
        <Avatar className="w-[124px] h-[124px] border border-border p-[4px] bg-card rounded-full">
          <AvatarImage src={resolveMediaUrl(vendor?.profile || '')} className="object-cover rounded-full" />
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
      <h5 className="text-foreground text-[22px] font-bold mb-1">{vendor?.name || 'Petey Cruiser'}</h5>
      <p className="text-muted-foreground text-[13px] mb-6">{vendor?.company_name || 'Web Designer'}</p>

      <div className="text-left mb-6">
        <h6 className="text-foreground text-[15px] font-bold mb-2">Bio</h6>
        <p className="text-muted-foreground text-[13px] leading-relaxed">
          pleasure rationally encounter but because pursue consequences that are extremely painful.occur in which toil and pain can procure him some great pleasure.. <span className="text-primary cursor-pointer hover:underline font-medium">More</span>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-0 border-t border-border pt-6 mb-6">
        <div className="text-center">
          <p className="text-foreground text-[20px] font-bold leading-none">947</p>
          <p className="text-muted-foreground text-[12px] mt-1">Clients</p>
        </div>
        <div className="text-center border-x border-border">
          <p className="text-foreground text-[20px] font-bold leading-none">583</p>
          <p className="text-muted-foreground text-[12px] mt-1">Tweets</p>
        </div>
        <div className="text-center">
          <p className="text-foreground text-[20px] font-bold leading-none">48</p>
          <p className="text-muted-foreground text-[12px] mt-1">Posts</p>
        </div>
      </div>

      <div className="text-left space-y-4">
        <h6 className="text-foreground text-[13px] font-bold uppercase tracking-wider">Social</h6>
        <div className="space-y-3">
             <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-[#1877f2] group-hover:bg-[#1877f2] group-hover:text-white transition-all"><Globe size={18} /></div>
            <div className="overflow-hidden">
              <p className="text-foreground text-[13px] font-bold leading-tight">Website</p>
              <a
                href="https://spruko.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-[11px] truncate"
              >
                spruko.com
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-[#ff0000] group-hover:bg-[#ff0000] group-hover:text-white transition-all"><Youtube size={18} /></div>
            <div className="overflow-hidden">
              <p className="text-foreground text-[13px] font-bold leading-tight">YouTube</p>
              <a
                href="https://youtube.com/spruko"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-[11px] truncate"
              >
                youtube.com/spruko
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-[#1877f2] group-hover:bg-[#1877f2] group-hover:text-white transition-all"><Facebook size={18} /></div>
            <div className="overflow-hidden">
              <p className="text-foreground text-[13px] font-bold leading-tight">Facebook</p>
              <a
                href="https://facebook.com/spruko"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-[11px] truncate"
              >
                facebook.com/spruko
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-[#1da1f2] group-hover:bg-[#1da1f2] group-hover:text-white transition-all"><Twitter size={18} /></div>
            <div className="overflow-hidden">
              <p className="text-foreground text-[13px] font-bold leading-tight">Twitter</p>
              <a
                href="https://twitter.com/spruko.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-[11px] truncate"
              >
                twitter.com/spruko.me
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-[#0a66c2] group-hover:bg-[#0a66c2] group-hover:text-white transition-all"><Linkedin size={18} /></div>
            <div className="overflow-hidden">
              <p className="text-foreground text-[13px] font-bold leading-tight">LinkedIn</p>
              <a
                href="https://linkedin.com/in/spruko"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-[11px] truncate"
              >
                linkedin.com/in/spruko
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-[#e1306c] group-hover:bg-[#e1306c] group-hover:text-white transition-all"><Instagram size={18} /></div>
            <div className="overflow-hidden">
              <p className="text-foreground text-[13px] font-bold leading-tight">Instagram</p>
              <a
                href="https://instagram.com/spruko"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-[11px] truncate"
              >
                instagram.com/spruko
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
