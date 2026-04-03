'use client';

import { useState, useEffect } from 'react';
import { useVendorMe, useUpdateVendorProfile, Vendor } from '@/hooks/use-vendors';
import { VendorSidebarProfileCard } from './vendor-sidebar-profile-card';
import { VendorLocationCard } from './vendor-location-card';
import { toast } from 'sonner';

const cardClass = 'bg-card rounded-[5px] border border-border overflow-hidden shadow-sm dark:shadow-none mb-6 font-["Roboto",sans-serif]';

export function VendorEditProfileContent() {
  const { data: vendor, isLoading } = useVendorMe();
  const updateProfile = useUpdateVendorProfile();
  
  const [formData, setFormData] = useState<Partial<Vendor>>({
    name: '',
    email: '',
    company_name: '',
    company_contact: '',
    company_email: '',
    company_address: '',
    website: '',
    youtube: '',
    facebook: '',
    instagram: '',
    profile: '',
    bank_name: '',
    acc_no: '',
    ifsc_code: '',
    acc_type: '' as any,
    branch: '',
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || '',
        email: vendor.email || '',
        company_name: vendor.company_name || '',
        company_contact: vendor.company_contact || '',
        company_email: vendor.company_email || '',
        company_address: vendor.company_address || '',
        website: vendor.website || '',
        youtube: vendor.youtube || '',
        facebook: vendor.facebook || '',
        instagram: vendor.instagram || '',
        profile: vendor.profile || '',
        bank_name: vendor.bank_name || '',
        acc_no: vendor.acc_no || '',
        ifsc_code: vendor.ifsc_code || '',
        acc_type: (vendor.acc_type || '') as any,
        branch: vendor.branch || '',
      });
    }
  }, [vendor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );

  return (
    <div className="bg-background min-h-screen -mt-6 -mx-6 -mb-6 p-6 font-['Roboto',sans-serif]">
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="w-full lg:w-[380px] shrink-0 space-y-6">
          <VendorSidebarProfileCard vendor={vendor} isEditMode />
          <VendorLocationCard />
        </div>

        <div className="flex-1 min-w-0 lg:max-h-[1234px] flex flex-col">
          <div className={`${cardClass} flex-1 flex flex-col mb-0 overflow-hidden`}>
            <div className="flex-1 overflow-y-auto p-8 chat-scrollbar">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* NAME */}
                <div>
                  <h6 className="text-foreground text-[13px] font-bold uppercase tracking-wider mb-5 mt-2">PERSONAL INFO</h6>
                  <div className="space-y-[18px]">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">Full Name</label>
                      <div className="md:col-span-3">
                        <input name="name" type="text" value={formData.name || ''} onChange={handleChange} className="w-full px-4 py-[9px] border border-border bg-card text-foreground rounded-[3px] text-[14px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Vendor Full Name" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">Company Name</label>
                      <div className="md:col-span-3">
                        <input name="company_name" type="text" value={formData.company_name || ''} onChange={handleChange} className="w-full px-4 py-[9px] border border-border bg-card text-foreground rounded-[3px] text-[14px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Company Name" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* CONTACT INFO */}
                <div>
                  <h6 className="text-foreground text-[13px] font-bold uppercase tracking-wider mb-5 mt-2">CONTACT INFO</h6>
                  <div className="space-y-[18px]">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">Company Contact</label>
                      <div className="md:col-span-3">
                        <input name="company_contact" type="text" value={formData.company_contact || ''} onChange={handleChange} className="w-full px-4 py-[9px] border border-border bg-card text-foreground rounded-[3px] text-[14px] focus:outline-none focus:border-primary transition-all" placeholder="Contact number" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">Company Email</label>
                      <div className="md:col-span-3">
                        <input name="company_email" type="email" value={formData.company_email || ''} onChange={handleChange} className="w-full px-4 py-[9px] border border-border bg-card text-foreground rounded-[3px] text-[14px] focus:outline-none focus:border-primary transition-all" placeholder="Company Email" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">Email(required)</label>
                      <div className="md:col-span-3">
                        <input name="email" type="email" value={formData.email || ''} readOnly className="w-full px-4 py-[9px] border border-border bg-muted/50 text-muted-foreground rounded-[3px] text-[14px] cursor-not-allowed" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1 mt-[9px]">Company Address</label>
                      <div className="md:col-span-3">
                        <textarea name="company_address" value={formData.company_address || ''} onChange={handleChange} className="w-full px-4 py-[9px] border border-border bg-card text-foreground rounded-[3px] text-[14px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[90px] resize-none" placeholder="Company Address" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SOCIAL INFO */}
                <div>
                  <h6 className="text-foreground text-[13px] font-bold uppercase tracking-wider mb-5 mt-2">SOCIAL & WEB</h6>
                  <div className="space-y-[18px]">
                     <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">Website URL</label>
                      <div className="md:col-span-3">
                        <input name="website" type="text" value={formData.website || ''} onChange={handleChange} className="w-full px-4 py-[9px] border border-border bg-card text-foreground rounded-[3px] text-[14px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="https://..." />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">Youtube Channel</label>
                      <div className="md:col-span-3">
                        <input name="youtube" type="text" value={formData.youtube || ''} onChange={handleChange} className="w-full px-4 py-[9px] border border-border bg-card text-foreground rounded-[3px] text-[14px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="YouTube Link" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">Facebook Profile</label>
                      <div className="md:col-span-3">
                        <input name="facebook" type="text" value={formData.facebook || ''} onChange={handleChange} className="w-full px-4 py-[9px] border border-border bg-card text-foreground rounded-[3px] text-[14px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Facebook Link" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">Instagram Profile</label>
                      <div className="md:col-span-3">
                        <input name="instagram" type="text" value={formData.instagram || ''} onChange={handleChange} className="w-full px-4 py-[9px] border border-border bg-card text-foreground rounded-[3px] text-[14px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Instagram Link" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* BANK INFO */}
                <div>
                  <h6 className="text-foreground text-[13px] font-bold uppercase tracking-wider mb-5 mt-2">BANK INFORMATION</h6>
                  <div className="space-y-[18px]">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">Bank Name</label>
                      <div className="md:col-span-3">
                        <input name="bank_name" type="text" value={formData.bank_name || ''} onChange={handleChange} className="w-full px-4 py-[9px] border border-border bg-card text-foreground rounded-[3px] text-[14px] focus:outline-none focus:border-primary transition-all" placeholder="Bank Name" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">Account Number</label>
                      <div className="md:col-span-3">
                        <input name="acc_no" type="text" value={formData.acc_no || ''} onChange={handleChange} className="w-full px-4 py-[9px] border border-border bg-card text-foreground rounded-[3px] text-[14px] focus:outline-none focus:border-primary transition-all" placeholder="Account Number" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">IFSC Code</label>
                      <div className="md:col-span-3">
                        <input name="ifsc_code" type="text" value={formData.ifsc_code || ''} onChange={handleChange} className="w-full px-4 py-[9px] border border-border bg-card text-foreground rounded-[3px] text-[14px] focus:outline-none focus:border-primary transition-all" placeholder="IFSC Code" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">Account Type</label>
                      <div className="md:col-span-3">
                         <select 
                           name="acc_type" 
                           value={formData.acc_type || ''} 
                           onChange={handleChange}
                           className="w-full px-4 py-[9px] border border-border bg-card text-foreground rounded-[3px] text-[14px] focus:outline-none focus:border-primary transition-all"
                         >
                           <option value="">Select Account Type</option>
                           <option value="savings">Savings</option>
                           <option value="current">Current</option>
                           <option value="overdraft">Overdraft</option>
                         </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">Branch</label>
                      <div className="md:col-span-3">
                        <input name="branch" type="text" value={formData.branch || ''} onChange={handleChange} className="w-full px-4 py-[9px] border border-border bg-card text-foreground rounded-[3px] text-[14px] focus:outline-none focus:border-primary transition-all" placeholder="Branch Name" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-border pt-6">
                  <button 
                    type="submit"
                    disabled={updateProfile.isPending}
                    className="bg-primary text-white px-[30px] py-[12px] text-[14px] font-bold rounded-[5px] hover:bg-primary/90 transition-all disabled:opacity-70 shadow-lg shadow-primary/20 flex items-center gap-2"
                  >
                    {updateProfile.isPending ? 'Updating...' : 'Update Vendor Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
