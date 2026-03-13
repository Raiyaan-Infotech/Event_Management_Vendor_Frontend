'use client';

import { useRef, useState } from 'react';
import {
  Activity, Shield, Bell, Edit, Lock, MapPin, Phone, Mail,
  Briefcase, ChevronRight, Check, Save, X, Download, User,
  Key, Smartphone, AlertTriangle, FileText, RefreshCw, LogIn,
  Settings, Archive, Camera,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useVendorMe, useUpdateVendorProfile, useChangeVendorPassword } from '@/hooks/use-vendors';
import { useUploadMedia } from '@/hooks/use-media';
import { resolveMediaUrl } from '@/lib/utils';

const inputClass =
  'w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all bg-muted/50 focus:bg-background';

const recentActivities = [
  { id: 1,  title: 'Password changed',           description: 'Changed from web browser (Chrome)',       date: 'March 15, 2024 10:30 AM', Icon: Key,           color: 'bg-emerald-100 text-emerald-600' },
  { id: 2,  title: 'Login from new device',       description: 'MacBook Pro - New York, USA',             date: 'March 14, 2024 3:45 PM',  Icon: LogIn,         color: 'bg-yellow-100 text-yellow-600'  },
  { id: 3,  title: 'Profile updated',             description: 'Updated contact information',             date: 'March 13, 2024 2:15 PM',  Icon: User,          color: 'bg-blue-100 text-blue-600'      },
  { id: 4,  title: 'Security settings modified',  description: 'Enabled 2FA authentication',             date: 'March 12, 2024 11:20 AM', Icon: Shield,        color: 'bg-emerald-100 text-emerald-600'},
  { id: 5,  title: 'Document downloaded',         description: 'Downloaded annual report',               date: 'March 11, 2024 9:15 AM',  Icon: FileText,      color: 'bg-orange-100 text-orange-600'  },
  { id: 6,  title: 'Failed login attempt',        description: 'Invalid credentials from unknown IP',    date: 'March 10, 2024 8:20 PM',  Icon: AlertTriangle, color: 'bg-red-100 text-red-500'        },
  { id: 7,  title: 'Account recovery initiated',  description: 'Password reset requested',               date: 'March 9, 2024 4:15 PM',   Icon: RefreshCw,     color: 'bg-yellow-100 text-yellow-600'  },
  { id: 8,  title: 'New device registered',       description: 'iPhone 13 - New York, USA',              date: 'March 8, 2024 1:30 PM',   Icon: Smartphone,    color: 'bg-blue-100 text-blue-600'      },
  { id: 9,  title: 'Security alert',              description: 'Suspicious activity detected',           date: 'March 7, 2024 10:45 AM',  Icon: AlertTriangle, color: 'bg-red-100 text-red-500'        },
  { id: 10, title: 'Backup completed',            description: 'System backup successful',               date: 'March 6, 2024 9:00 AM',   Icon: Archive,       color: 'bg-emerald-100 text-emerald-600'},
  { id: 11, title: 'New device registered',       description: 'Redmi note 5 - Tamilnadu, India',       date: 'March 8, 2024 1:30 PM',   Icon: Smartphone,    color: 'bg-blue-100 text-blue-600'      },
];

export function VendorProfileContent() {
  const { data: vendor, isLoading } = useVendorMe();
  const updateProfile = useUpdateVendorProfile();
  const changePassword = useChangeVendorPassword();
  const uploadMedia = useUploadMedia();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState('activity');
  const [basicInfoEdit, setBasicInfoEdit] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [twoFAModal, setTwoFAModal] = useState(false);
  const [sessionModal, setSessionModal] = useState(false);

  const [basicInfo, setBasicInfo] = useState({ name: '', contact: '', address: '', company_name: '' });
  const [syncedVendorId, setSyncedVendorId] = useState<number | null>(null);

  // Sync basicInfo from vendor data once loaded
  if (vendor && vendor.id !== syncedVendorId) {
    setBasicInfo({ name: vendor.name ?? '', contact: vendor.contact ?? '', address: vendor.address ?? '', company_name: vendor.company_name ?? '' });
    setSyncedVendorId(vendor.id);
  }

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [twoFAStatus, setTwoFAStatus] = useState(true);
  const [twoFAVerification, setTwoFAVerification] = useState('');

  const [activeSessions] = useState([
    { id: 1, device: 'Chrome on Windows',        location: 'New York, USA',        lastActive: '2 hours ago', current: true  },
    { id: 2, device: 'Safari on MacBook Pro',     location: 'San Francisco, USA',   lastActive: '1 day ago',   current: false },
    { id: 3, device: 'Chrome Mobile on iPhone',   location: 'New York, USA',        lastActive: '3 days ago',  current: false },
  ]);

  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true, securityAlerts: true, marketingEmails: false, systemNotifications: true,
  });

  const securityStatus = { lastPasswordChange: '7 days ago', securityScore: '95/100' };

  const handleBasicInfoChange = (field: string, value: string) =>
    setBasicInfo((prev) => ({ ...prev, [field]: value }));

  const handleSaveBasicInfo = () => {
    updateProfile.mutate(
      { name: basicInfo.name, contact: basicInfo.contact, address: basicInfo.address, company_name: basicInfo.company_name },
      {
        onSuccess: () => {
          setEditSuccess(true);
          setTimeout(() => { setEditSuccess(false); setBasicInfoEdit(false); }, 2000);
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setBasicInfo({ name: vendor?.name ?? '', contact: vendor?.contact ?? '', address: vendor?.address ?? '', company_name: vendor?.company_name ?? '' });
    setBasicInfoEdit(false);
  };

  const handlePasswordChange = () => {
    if (!passwordForm.currentPassword) { alert('Please enter your current password'); return; }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { alert('New passwords do not match'); return; }
    if (passwordForm.newPassword.length < 6) { alert('Password must be at least 6 characters'); return; }
    changePassword.mutate(
      { current_password: passwordForm.currentPassword, new_password: passwordForm.newPassword },
      { onSuccess: () => { setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); setPasswordModal(false); } }
    );
  };

  const handleToggleTwoFA = () => {
    if (!twoFAStatus) {
      setTwoFAModal(true);
    } else {
      if (window.confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
        setTwoFAStatus(false);
      }
    }
  };

  const handleEnableTwoFA = () => {
    if (twoFAVerification.length === 6) {
      setTwoFAStatus(true);
      setTwoFAVerification('');
      setTwoFAModal(false);
    } else {
      alert('Please enter a valid 6-digit code');
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadMedia.mutateAsync({ file, folder: 'vendors' });
      updateProfile.mutate({ profile: result.url });
    } finally {
      setUploading(false);
    }
  };

  const initials = vendor?.name
    ? vendor.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'V';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="bg-muted/40 -mt-6 -mx-6 -mb-6 min-h-screen">
      {/* Page Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your profile settings and account preferences.</p>
      </div>

      {/* Main Content */}
      <div className="px-6 pt-6 pb-4 min-h-[calc(100vh-120px)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="bg-card rounded-xl border border-border overflow-hidden flex-1">

              {/* Avatar & Name */}
              <div className="flex flex-col items-center text-center px-6 pt-8 pb-6 border-b border-border/60">
                <div className="relative cursor-pointer group mb-3" onClick={() => fileInputRef.current?.click()}>
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={resolveMediaUrl(vendor?.profile || '')} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-2xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {uploading
                      ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      : <Camera className="h-5 w-5 text-white" />}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
                <h2 className="text-xl font-bold text-foreground">{vendor?.name ?? '—'}</h2>
                <p className="text-muted-foreground text-sm mt-0.5">{vendor?.company_name ?? 'Vendor'}</p>
              </div>

              {/* Basic Information */}
              <div className="px-6 py-5 border-b border-border/60">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold text-foreground text-sm">Basic Information</span>
                  </div>
                  {!basicInfoEdit && (
                    <button
                      onClick={() => setBasicInfoEdit(true)}
                      className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                  )}
                </div>

                {basicInfoEdit ? (
                  <div className="space-y-3">
                    {[
                      { label: 'Full Name',    field: 'name',         type: 'text'  },
                      { label: 'Phone',        field: 'contact',      type: 'tel'   },
                      { label: 'Address',      field: 'address',      type: 'text'  },
                      { label: 'Company',      field: 'company_name', type: 'text'  },
                    ].map(({ label, field, type }) => (
                      <div key={field}>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
                        <input
                          type={type}
                          value={basicInfo[field as keyof typeof basicInfo]}
                          onChange={(e) => handleBasicInfoChange(field, e.target.value)}
                          className={inputClass}
                          placeholder={label}
                        />
                      </div>
                    ))}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={handleSaveBasicInfo}
                        disabled={updateProfile.isPending}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60"
                      >
                        <Save className="w-3.5 h-3.5" /> {updateProfile.isPending ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 bg-muted hover:bg-accent text-foreground py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                    </div>
                    {editSuccess && (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                        <Check className="w-4 h-4" /> Changes saved successfully!
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-0 divide-y divide-border/40">
                    {[
                      { Icon: Mail,      label: 'Email',   value: vendor?.email },
                      { Icon: Phone,     label: 'Phone',   value: vendor?.contact || '—' },
                      { Icon: MapPin,    label: 'Location',value: vendor?.address || '—' },
                      { Icon: Briefcase, label: 'Company', value: vendor?.company_name },
                    ].map(({ Icon, label, value }) => (
                      <div key={label} className="flex items-center justify-between py-2.5">
                        <div className="flex items-center gap-2.5 text-muted-foreground">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="text-sm text-muted-foreground">{label}</span>
                        </div>
                        <span className="text-sm font-medium text-foreground text-right max-w-[55%] truncate">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Security Status */}
              <div className="px-6 py-5 border-b border-border/60">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold text-foreground text-sm">Security Status</span>
                  </div>
                  <button
                    onClick={() => setPasswordModal(true)}
                    className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                  >
                    Change Password
                  </button>
                </div>
                <div className="space-y-0 divide-y divide-border/40">
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-muted-foreground">2FA Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${twoFAStatus ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {twoFAStatus ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-muted-foreground">Last Password Change</span>
                    <span className="text-sm font-medium text-foreground">{securityStatus.lastPasswordChange}</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-muted-foreground">Security Score</span>
                    <span className="text-sm font-medium text-foreground">{securityStatus.securityScore}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="px-6 py-5">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold text-foreground text-sm">Quick Actions</span>
                </div>
                <div className="space-y-2">
                  {[
                    { Icon: Edit,     label: 'Edit Profile',    onClick: () => setBasicInfoEdit(true) },
                    { Icon: Lock,     label: 'Change Password', onClick: () => setPasswordModal(true) },
                    { Icon: Download, label: 'Download Data',   onClick: () => alert('Downloading your profile data...') },
                  ].map(({ Icon, label, onClick }) => (
                    <button
                      key={label}
                      onClick={onClick}
                      className="w-full flex items-center justify-between px-4 py-3 border border-border rounded-lg hover:bg-accent hover:border-border/80 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-sm font-medium text-foreground">{label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-muted-foreground/80 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Tab Navigation */}
            <div className="bg-card rounded-xl border border-border mb-4 overflow-hidden sticky top-6">
              <div className="flex">
                {[
                  { id: 'activity',      label: 'Activity',      Icon: Activity },
                  { id: 'security',      label: 'Security',      Icon: Shield   },
                  { id: 'notifications', label: 'Notifications', Icon: Bell     },
                ].map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-all ${
                      activeTab === id
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── ACTIVITY TAB ── */}
            {activeTab === 'activity' && (
              <div className="bg-card rounded-xl border border-border overflow-hidden flex-1">
                <div className="flex justify-between items-center px-6 py-4 border-b border-border/60">
                  <h3 className="text-base font-semibold text-foreground">Recent Activity</h3>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">View All</button>
                </div>
                <div className="divide-y divide-border/40">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-accent/30 transition-colors">
                      <div className={`flex-shrink-0 w-9 h-9 rounded-full ${activity.color} flex items-center justify-center`}>
                        <activity.Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground leading-tight">{activity.title}</p>
                        <p className="text-sm text-muted-foreground leading-tight mt-0.5">{activity.description}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs text-muted-foreground whitespace-nowrap">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SECURITY TAB ── */}
            {activeTab === 'security' && (
              <div className="bg-card rounded-xl border border-border overflow-hidden flex-1">
                <div className="px-6 py-4 border-b border-border/60">
                  <h3 className="text-base font-semibold text-foreground">Security Settings</h3>
                </div>
                <div className="divide-y divide-border/60">
                  {/* Two-Factor Auth */}
                  <div className="px-6 py-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Smartphone className="w-4 h-4 text-muted-foreground" />
                          <h4 className="font-semibold text-foreground text-sm">Two-Factor Authentication</h4>
                        </div>
                        <p className="text-sm text-muted-foreground ml-6">Add an extra layer of security to your account.</p>
                        <div className="ml-6 mt-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${twoFAStatus ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${twoFAStatus ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                            {twoFAStatus ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleToggleTwoFA}
                        className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors shrink-0 ${twoFAStatus ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}
                      >
                        {twoFAStatus ? 'Disable 2FA' : 'Enable 2FA'}
                      </button>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="px-6 py-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Key className="w-4 h-4 text-muted-foreground" />
                          <h4 className="font-semibold text-foreground text-sm">Password</h4>
                        </div>
                        <p className="text-sm text-muted-foreground ml-6">Change your password regularly to keep your account secure.</p>
                        <p className="text-xs text-muted-foreground/60 ml-6 mt-2">Last changed: {securityStatus.lastPasswordChange}</p>
                      </div>
                      <button
                        onClick={() => setPasswordModal(true)}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors shrink-0"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div className="px-6 py-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Activity className="w-4 h-4 text-muted-foreground" />
                          <h4 className="font-semibold text-foreground text-sm">Active Sessions</h4>
                        </div>
                        <p className="text-sm text-muted-foreground ml-6">Manage devices that have access to your account.</p>
                        <p className="text-xs text-muted-foreground/60 ml-6 mt-2">{activeSessions.length} active sessions</p>
                      </div>
                      <button
                        onClick={() => setSessionModal(true)}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors shrink-0"
                      >
                        View Sessions ({activeSessions.length})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS TAB ── */}
            {activeTab === 'notifications' && (
              <div className="bg-card rounded-xl border border-border overflow-hidden flex-1">
                <div className="px-6 py-4 border-b border-border/60">
                  <h3 className="text-base font-semibold text-foreground">Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Control how and when you receive notifications.</p>
                </div>
                <div className="divide-y divide-border/60">
                  {[
                    { field: 'emailNotifications',  label: 'Email Notifications',  desc: 'Receive email updates about important activities' },
                    { field: 'securityAlerts',       label: 'Security Alerts',       desc: 'Get notified of suspicious activities'            },
                    { field: 'marketingEmails',      label: 'Marketing Emails',      desc: 'Receive news and updates from our team'            },
                    { field: 'systemNotifications',  label: 'System Notifications',  desc: 'Get notified about system maintenance and updates' },
                  ].map(({ field, label, desc }) => (
                    <label key={field} className="flex items-center justify-between px-6 py-4 hover:bg-accent/30 cursor-pointer transition-colors">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                      </div>
                      <div className="relative ml-4 shrink-0">
                        <input
                          type="checkbox"
                          checked={notificationPrefs[field as keyof typeof notificationPrefs]}
                          onChange={() => setNotificationPrefs((prev) => ({ ...prev, [field]: !prev[field as keyof typeof prev] }))}
                          className="sr-only peer"
                        />
                        <div className={`w-10 h-6 rounded-full transition-colors ${notificationPrefs[field as keyof typeof notificationPrefs] ? 'bg-primary' : 'bg-muted'}`} />
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notificationPrefs[field as keyof typeof notificationPrefs] ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── PASSWORD MODAL ── */}
      {passwordModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-lg font-bold text-foreground">Change Password</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Choose a strong, unique password.</p>
              </div>
              <button onClick={() => setPasswordModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Current Password', field: 'currentPassword' },
                { label: 'New Password',     field: 'newPassword'     },
                { label: 'Confirm Password', field: 'confirmPassword' },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
                  <input
                    type="password"
                    value={passwordForm[field as keyof typeof passwordForm]}
                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }))}
                    className={inputClass}
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handlePasswordChange}
                disabled={changePassword.isPending}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60"
              >
                {changePassword.isPending ? 'Changing...' : 'Change Password'}
              </button>
              <button onClick={() => setPasswordModal(false)} className="flex-1 bg-muted hover:bg-accent text-foreground py-2.5 rounded-xl font-semibold text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 2FA MODAL ── */}
      {twoFAModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-lg font-bold text-foreground">Enable Two-Factor Auth</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Scan the QR code with your authenticator app.</p>
              </div>
              <button onClick={() => setTwoFAModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-muted border border-border p-6 rounded-xl mb-5 flex items-center justify-center h-44">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">QR Code</p>
                <p className="text-4xl tracking-widest">■□■□■</p>
                <p className="text-xs text-muted-foreground mt-2">Scan with Google Authenticator</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Enter 6-digit verification code</label>
              <input
                type="text"
                maxLength={6}
                value={twoFAVerification}
                onChange={(e) => setTwoFAVerification(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-center text-2xl tracking-[0.5em] font-mono bg-muted/50"
                placeholder="000000"
              />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleEnableTwoFA} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-xl font-semibold text-sm transition-colors">
                Verify & Enable
              </button>
              <button onClick={() => setTwoFAModal(false)} className="flex-1 bg-muted hover:bg-accent text-foreground py-2.5 rounded-xl font-semibold text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SESSIONS MODAL ── */}
      {sessionModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-lg font-bold text-foreground">Active Sessions</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{activeSessions.length} device{activeSessions.length !== 1 ? 's' : ''} currently signed in</p>
              </div>
              <button onClick={() => setSessionModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {activeSessions.map((session) => (
                <div key={session.id} className="border border-border rounded-xl p-4 hover:border-border/80 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <Smartphone className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm flex items-center gap-2">
                          {session.device}
                          {session.current && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">Current</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{session.location}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Last active: {session.lastActive}</p>
                      </div>
                    </div>
                    {!session.current && (
                      <button className="text-red-500 hover:text-red-600 text-xs font-semibold px-2 py-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setSessionModal(false)} className="w-full mt-4 bg-muted hover:bg-accent text-foreground py-2.5 rounded-xl font-semibold text-sm transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
