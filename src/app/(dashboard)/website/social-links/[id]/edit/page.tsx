'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Icon } from '@iconify/react';
import * as LucideIcons from 'lucide-react';
import { Share2, LayoutGrid, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PersistenceActions } from '@/components/common/PersistenceActions';
import { IconPickerDialog } from '@/components/common/icon-picker-dialog';
import { useVendorSocialLinkItem, useUpdateSocialLink } from '@/hooks/use-vendor-social-links';
import { WebsiteSettingsPageSkeleton } from '@/components/boneyard/website-settings-page-skeleton';

// ─── Icon renderer ────────────────────────────────────────────────────────────
const lucideMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = Object.fromEntries(
  Object.entries(LucideIcons)
    .filter(([k]) => /^[A-Z]/.test(k))
    .map(([k, v]) => [k.toLowerCase(), v as React.ComponentType<{ className?: string; style?: React.CSSProperties }>])
);

function DynamicIcon({ name, color, size = 'h-7 w-7' }: { name?: string; color?: string; size?: string }) {
  if (!name) return <Share2 className={`${size} text-gray-400`} />;
  const style = color ? { color } : undefined;
  if (name.includes(':')) return <Icon icon={name} className={size} style={style} />;
  const LucideIcon = lucideMap[name.toLowerCase()];
  if (!LucideIcon) return <Share2 className={`${size} text-gray-400`} />;
  return <LucideIcon className={size} style={style} />;
}

export default function EditSocialLinkPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [pickerOpen, setPickerOpen] = useState(false);
  const [icon, setIcon]           = useState('');
  const [iconColor, setIconColor] = useState('#3b82f6');
  const [label, setLabel]         = useState('');
  const [url, setUrl]             = useState('');
  const [isActive, setIsActive]   = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const { data: link, isLoading } = useVendorSocialLinkItem(id);
  const updateMutation = useUpdateSocialLink(() => router.push('/website/social-links'));

  // Populate from API
  useEffect(() => {
    if (!link) return;
    setIcon(link.icon || '');
    setIconColor(link.icon_color || '#3b82f6');
    setLabel(link.label);
    setUrl(link.url);
    setIsActive(link.is_active === 1);
    setSortOrder(link.sort_order);
  }, [link]);

  const handleSave = () => {
    if (!label.trim() || !url.trim()) return;
    updateMutation.mutate({
      id:         Number(id),
      icon:       icon || undefined,
      icon_color: iconColor || undefined,
      label:      label.trim(),
      url:        url.trim(),
      is_active:  isActive ? 1 : 0,
      sort_order: sortOrder,
    });
  };

  const handleReset = () => {
    if (!link) return;
    setIcon(link.icon || '');
    setIconColor(link.icon_color || '#3b82f6');
    setLabel(link.label);
    setUrl(link.url);
    setIsActive(link.is_active === 1);
    setSortOrder(link.sort_order);
  };

  if (isLoading) return <WebsiteSettingsPageSkeleton />;

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar">
      <div className="max-w-[1700px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1">Edit Social Link</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Update your social media link details.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-9">
            <div className="bg-white dark:bg-sidebar p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 dark:border-gray-800 space-y-6">

              {/* Icon preview + picker */}
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Icon</Label>
                <div className="flex items-start gap-4">
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 hover:border-primary/50 transition-colors"
                    title="Browse icons"
                  >
                    <DynamicIcon name={icon} color={iconColor} />
                    {!icon && (
                      <span className="text-[9px] text-gray-400 leading-none">Browse</span>
                    )}
                  </button>

                  <div className="flex-1 space-y-2">
                    <div className="relative">
                      <Input
                        value={icon}
                        onChange={e => setIcon(e.target.value)}
                        placeholder="e.g. Share2, mdi:instagram, lucide:facebook"
                        className="pr-8 h-11"
                      />
                      {icon && (
                        <button
                          type="button"
                          onClick={() => setIcon('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Icon color */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Icon Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={iconColor}
                    onChange={e => setIconColor(e.target.value)}
                    className="h-11 w-11 cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent p-0.5"
                  />
                  <Input
                    value={iconColor}
                    onChange={e => setIconColor(e.target.value)}
                    placeholder="#3b82f6"
                    className="flex-1 h-11"
                  />
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center border border-gray-100 dark:border-gray-800 flex-shrink-0"
                    style={{ background: `${iconColor}18` }}
                  >
                    <DynamicIcon name={icon || 'Share2'} color={iconColor} size="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Label *</Label>
                <Input
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  placeholder="e.g. Instagram, WhatsApp, LinkedIn"
                  className="h-11"
                />
              </div>

              {/* URL */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">URL *</Label>
                <Input
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="h-11"
                />
              </div>

              {/* Sort order + Active row */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Sort Order</Label>
                  <Input
                    type="number"
                    min={0}
                    value={sortOrder}
                    onChange={e => setSortOrder(Number(e.target.value))}
                    className="h-11 w-28"
                  />
                  <p className="text-[11px] text-gray-400">Lower = shown first</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Active</Label>
                  <div className="flex items-center gap-3 h-11">
                    <Switch
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                    <span className={`text-sm font-semibold ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                      {isActive ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 lg:sticky lg:top-8 space-y-4">
            {/* Live preview */}
            <div className="bg-white dark:bg-sidebar p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Preview</p>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: iconColor ? `${iconColor}18` : '#f1f5f9' }}
                >
                  <DynamicIcon name={icon || 'Share2'} color={iconColor} size="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {label || 'Label'}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">{url || 'https://...'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-sidebar/50 p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
              <PersistenceActions
                onSave={handleSave}
                onPreview={() => window.open('/preview?block=social_media', '_blank')}
                onReset={handleReset}
                onCancel={() => router.push('/website/social-links')}
                saveLabel={updateMutation.isPending ? 'SAVING...' : 'UPDATE'}
                isSubmitting={updateMutation.isPending}
              />
            </div>
          </div>
        </div>
      </div>

      <IconPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={setIcon}
      />
    </div>
  );
}
