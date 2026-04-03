'use client';

import { useState, useEffect } from 'react';
import { useVendorMe, useUpdateVendorProfile, Vendor } from '@/hooks/use-vendors';
import { toast } from 'sonner';

export function SettingsTab() {
  const { data: vendor, isLoading } = useVendorMe();
  const updateProfile = useUpdateVendorProfile();
  
  const [formData, setFormData] = useState<Partial<Vendor>>({
    name: '',
    email: '',
    company_name: '',
    company_contact: '',
    company_address: '',
    website: '',
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || '',
        email: vendor.email || '',
        company_name: vendor.company_name || '',
        company_contact: vendor.company_contact || '',
        company_address: vendor.company_address || '',
        website: vendor.website || '',
      });
    }
  }, [vendor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData);
  };

  if (isLoading) return <div className="animate-pulse space-y-4 pt-10">
    <div className="h-10 bg-muted rounded w-full"></div>
    <div className="h-10 bg-muted rounded w-full"></div>
    <div className="h-40 bg-muted rounded w-full"></div>
  </div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
        <div className="space-y-2">
          <label className="block text-foreground text-[14px] font-bold">Full Name</label>
          <input 
            name="name"
            type="text" 
            value={formData.name || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-background border border-border rounded-[5px] text-[14px] text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm" 
          />
        </div>
        <div className="space-y-2">
          <label className="block text-foreground text-[14px] font-bold">Company Name</label>
          <input 
            name="company_name"
            type="text" 
            value={formData.company_name || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-background border border-border rounded-[5px] text-[14px] text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm" 
          />
        </div>
        <div className="space-y-2">
          <label className="block text-foreground text-[14px] font-bold">Contact Number</label>
          <input 
            name="company_contact"
            type="tel" 
            value={formData.company_contact || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-background border border-border rounded-[5px] text-[14px] text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm" 
          />
        </div>
        <div className="space-y-2">
          <label className="block text-foreground text-[14px] font-bold">Email Address</label>
          <input 
            value={formData.email || ''}
            type="email" 
            className="w-full px-4 py-2 bg-muted border border-border rounded-[5px] text-[14px] text-muted-foreground cursor-not-allowed shadow-none" 
            readOnly 
          />
        </div>
        <div className="space-y-2">
          <label className="block text-foreground text-[14px] font-bold">Website URL</label>
          <input 
            name="website"
            type="text" 
            value={formData.website || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-background border border-border rounded-[5px] text-[14px] text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm" 
            placeholder="https://..."
          />
        </div>
        <div className="space-y-2">
          <label className="block text-foreground text-[14px] font-bold">About Company / Address</label>
          <textarea
            name="company_address"
            value={formData.company_address || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-background border border-border rounded-[5px] text-[14px] text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[140px] resize-none shadow-sm"
          ></textarea>
        </div>
        <button 
          type="submit" 
          disabled={updateProfile.isPending}
          className="bg-primary text-white px-8 py-3 rounded-[5px] text-[13px] font-bold hover:bg-primary/90 transition-all shadow-md uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
        >
          {updateProfile.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
