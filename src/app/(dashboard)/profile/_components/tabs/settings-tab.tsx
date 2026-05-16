'use client';

import { useState, useEffect } from 'react';
import { useVendorMe, useUpdateVendorProfile, useChangeVendorPassword, Vendor } from '@/hooks/use-vendors';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';
import { PasswordInput } from '@/components/ui/password-input';
import { PasswordHint } from '@/components/common/PasswordHint';
import { validateMobile, validatePassword } from '@/lib/validation';

export function SettingsTab() {
  const { data: vendor, isLoading } = useVendorMe();
  const updateProfile = useUpdateVendorProfile();
  const changePassword = useChangeVendorPassword();
  
  const [formData, setFormData] = useState<Partial<Vendor>>({
    name: '',
    email: '',
    company_name: '',
    company_contact: '',
    company_address: '',
    website: '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

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
    if (!formData.name?.trim())            { toast.error("Full name is required"); return; }
    if (!formData.company_name?.trim())    { toast.error("Company name is required"); return; }
    const mobileErr = validateMobile(formData.company_contact || '');
    if (mobileErr) { toast.error(mobileErr); return; }
    updateProfile.mutate(formData);
  };

  const setPasswordField = (key: keyof typeof passwordData, value: string) => {
    setPasswordData((prev) => ({ ...prev, [key]: value }));
    if (passwordErrors[key]) setPasswordErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!passwordData.current_password) nextErrors.current_password = 'Current password is required';

    const passwordErr = validatePassword(passwordData.new_password);
    if (passwordErr) nextErrors.new_password = passwordErr;

    if (!passwordData.confirm_password) {
      nextErrors.confirm_password = 'Confirm password is required';
    } else if (passwordData.confirm_password !== passwordData.new_password) {
      nextErrors.confirm_password = 'Passwords do not match';
    }

    if (passwordData.current_password && passwordData.current_password === passwordData.new_password) {
      nextErrors.new_password = 'New password must be different from current password';
    }

    if (Object.keys(nextErrors).length) {
      setPasswordErrors(nextErrors);
      toast.error('Please correct the highlighted password fields');
      return;
    }

    await changePassword.mutateAsync({
      current_password: passwordData.current_password,
      new_password: passwordData.new_password,
    });
    setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    setPasswordErrors({});
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
          <label className="block text-foreground text-[14px] font-bold">Full Name <span className="text-red-500">*</span></label>
          <input 
            name="name"
            type="text" 
            placeholder='enter full name'
            value={formData.name || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-background border border-border rounded-[5px] text-[14px] text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm" 
          />
        </div>
        <div className="space-y-2">
          <label className="block text-foreground text-[14px] font-bold">Company Name <span className="text-red-500">*</span></label>
          <input 
            name="company_name"
            type="text" 
              placeholder='enter company name'
            value={formData.company_name || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-background border border-border rounded-[5px] text-[14px] text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm" 
          />
        </div>
        <div className="space-y-2">
          <label className="block text-foreground text-[14px] font-bold">Contact Number <span className="text-red-500">*</span></label>
          <input 
            name="company_contact"
            type="tel" 
            placeholder='enter contact number'
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
              placeholder='enter email address'
            className="w-full px-4 py-2 bg-muted border border-border rounded-[5px] text-[14px] text-muted-foreground cursor-not-allowed shadow-none" 
            readOnly 
          />
        </div>
        <div className="space-y-2">
          <label className="block text-foreground text-[14px] font-bold">Website URL</label>
          <input 
            name="website"
            type="text" 
              placeholder='enter website url'
            value={formData.website || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-background border border-border rounded-[5px] text-[14px] text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm" 
          />
        </div>
        <div className="space-y-2">
          <label className="block text-foreground text-[14px] font-bold">About Company / Address</label>
          <textarea
            name="company_address"
            value={formData.company_address || ''}
            onChange={handleChange}
            placeholder='enter company address or about info'
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

      <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-5xl border-t border-border pt-6">
        <div>
          <h3 className="flex items-center gap-2 text-[15px] font-bold text-foreground">
            <Lock className="h-4 w-4 text-primary" /> Change Password
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">Update the vendor portal login password.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-foreground text-[14px] font-bold">Current Password <span className="text-red-500">*</span></label>
            <PasswordInput
              value={passwordData.current_password}
              onChange={(e) => setPasswordField('current_password', e.target.value)}
              placeholder="Enter current password"
              className={`h-10 rounded-[5px] ${passwordErrors.current_password ? 'border-rose-500' : ''}`}
            />
            {passwordErrors.current_password ? <p className="text-xs font-bold text-rose-600">{passwordErrors.current_password}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="block text-foreground text-[14px] font-bold">New Password <span className="text-red-500">*</span></label>
            <PasswordInput
              value={passwordData.new_password}
              onChange={(e) => setPasswordField('new_password', e.target.value)}
              placeholder="Enter new password"
              className={`h-10 rounded-[5px] ${passwordErrors.new_password ? 'border-rose-500' : ''}`}
            />
            {passwordErrors.new_password ? <p className="text-xs font-bold text-rose-600">{passwordErrors.new_password}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="block text-foreground text-[14px] font-bold">Confirm Password <span className="text-red-500">*</span></label>
            <PasswordInput
              value={passwordData.confirm_password}
              onChange={(e) => setPasswordField('confirm_password', e.target.value)}
              placeholder="Confirm new password"
              className={`h-10 rounded-[5px] ${passwordErrors.confirm_password ? 'border-rose-500' : ''}`}
            />
            {passwordErrors.confirm_password ? <p className="text-xs font-bold text-rose-600">{passwordErrors.confirm_password}</p> : null}
          </div>
        </div>

        <PasswordHint password={passwordData.new_password} alwaysShow />

        <button
          type="submit"
          disabled={changePassword.isPending}
          className="bg-primary text-white px-8 py-3 rounded-[5px] text-[13px] font-bold hover:bg-primary/90 transition-all shadow-md uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
        >
          {changePassword.isPending ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
