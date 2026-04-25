'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import * as LucideIcons from 'lucide-react';
import { Edit2, Trash2, Share2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/common/PageHeader';

import { DataTable, Column } from '@/components/common/DataTable';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  useVendorSocialLinks,
  useToggleSocialLink,
  useDeleteSocialLink,
  type VendorSocialLink,
} from '@/hooks/use-vendor-social-links';

// ─── Icon renderer ────────────────────────────────────────────────────────────
const lucideMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = Object.fromEntries(
  Object.entries(LucideIcons)
    .filter(([k]) => /^[A-Z]/.test(k))
    .map(([k, v]) => [k.toLowerCase(), v as React.ComponentType<{ className?: string; style?: React.CSSProperties }>])
);

function DynamicIcon({ name, color }: { name?: string | null; color?: string | null }) {
  if (!name) return <Share2 className="h-4 w-4 text-gray-400" />;
  const style = color ? { color } : undefined;
  if (name.includes(':')) return <Icon icon={name} className="h-5 w-5" style={style} />;
  const LucideIcon = lucideMap[name.toLowerCase()];
  if (!LucideIcon) return <Share2 className="h-4 w-4 text-gray-400" />;
  return <LucideIcon className="h-5 w-5" style={style} />;
}

export default function SocialLinksPage() {
  const router = useRouter();
  const { data: links = [], isLoading } = useVendorSocialLinks();
  const toggleMutation  = useToggleSocialLink();
  const deleteMutation  = useDeleteSocialLink();
  const [deleteItem, setDeleteItem] = useState<VendorSocialLink | null>(null);

  const columns: Column<VendorSocialLink>[] = [
    {
      key: 'sort_order',
      label: '#',
      sortable: true,
      render: (item) => (
        <span className="text-[12px] font-black text-gray-400 tracking-tighter">
          {item.sort_order}
        </span>
      ),
    },
    {
      key: 'icon',
      label: 'Icon',
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: item.icon_color ? `${item.icon_color}20` : '#f1f5f9' }}
          >
            <DynamicIcon name={item.icon} color={item.icon_color} />
          </div>
          {item.icon_color && (
            <span
              className="w-4 h-4 rounded-full border border-white/30 shadow-sm"
              style={{ background: item.icon_color }}
              title={item.icon_color}
            />
          )}
        </div>
      ),
    },
    {
      key: 'label',
      label: 'Label',
      sortable: true,
      render: (item) => (
        <span className="text-[13px] font-bold text-gray-800 dark:text-gray-100">{item.label}</span>
      ),
    },
    {
      key: 'url',
      label: 'URL',
      sortable: false,
      render: (item) => (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] font-medium text-blue-500 hover:underline truncate max-w-[220px] block"
        >
          {item.url}
        </a>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={item.is_active === 1}
            onCheckedChange={() => toggleMutation.mutate(item.id)}
            disabled={toggleMutation.isPending}
          />
          <Badge
            variant="outline"
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0 ${
              item.is_active === 1
                ? 'bg-green-50 text-green-600 border-green-200 dark:bg-green-500/10 dark:border-green-500/30'
                : 'bg-gray-50 text-gray-400 border-gray-200 dark:bg-white/5'
            }`}
          >
            {item.is_active === 1 ? 'Active' : 'Hidden'}
          </Badge>
        </div>
      ),
    },
  ];

  const handleConfirmDelete = () => {
    if (!deleteItem) return;
    deleteMutation.mutate(deleteItem.id);
    setDeleteItem(null);
  };

  return (
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-3">
      <PageHeader
        title="SOCIAL LINKS"
        subtitle="Manage your social media and web presence links."
        total={links.length}
        rightContent={
          <Button
            onClick={() => router.push('/website/social-links/add')}
            className="h-10 px-5 text-[12px] font-bold gap-2 rounded-xl uppercase tracking-wider"
          >
            <Plus size={15} strokeWidth={2.5} /> Add Link
          </Button>
        }
      />

      <DataTable
        data={links}
        columns={columns}
        visibleColumns={columns.map(c => c.key)}
        selectedIds={[]}
        rowIdKey="id"
        loading={isLoading}
        onSelect={() => {}}
        onSelectAll={() => {}}
        onSort={() => {}}
        sortConfig={{ key: 'sort_order', order: 'asc' }}
        actionContent={(item) => (
          <>
            <DropdownMenuItem
              onClick={() => router.push(`/website/social-links/${item.id}/edit`)}
              className="gap-2.5 rounded-lg py-2 cursor-pointer text-gray-600"
            >
              <Edit2 size={15} className="text-emerald-500" />
              <span className="text-[13px] font-semibold">Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteItem(item)}
              className="gap-2.5 rounded-lg py-2 cursor-pointer text-rose-500 focus:bg-rose-50"
            >
              <Trash2 size={15} />
              <span className="text-[13px] font-semibold">Delete</span>
            </DropdownMenuItem>
          </>
        )}
        emptyContent={
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <Share2 size={36} className="text-gray-200 dark:text-gray-700" />
            <p className="text-gray-400 font-semibold">No social links yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/website/social-links/add')}
              className="gap-2"
            >
              <Plus size={14} /> Add your first link
            </Button>
          </div>
        }
      />

      {/* Delete Confirmation */}
      <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <DialogContent className="sm:max-w-[420px] rounded-[40px] p-0 overflow-hidden border-none shadow-2xl shadow-rose-900/10">
          <div className="bg-gradient-to-b from-rose-50 to-white dark:from-rose-500/10 dark:to-[#111827] p-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-white dark:bg-gray-800 flex items-center justify-center text-rose-500 shadow-[0_15px_30px_-10px_rgba(225,29,72,0.3)] mb-8">
              <Trash2 size={40} strokeWidth={2.5} />
            </div>
            <DialogTitle className="text-2xl font-black text-gray-800 dark:text-gray-100 uppercase tracking-tighter">Delete Social Link?</DialogTitle>
            <DialogDescription className="mt-4 text-gray-500 dark:text-gray-400 font-bold text-sm leading-relaxed max-w-[280px]">
              This will permanently remove{' '}
              <span className="text-rose-600 underline underline-offset-4 decoration-rose-200">{deleteItem?.label}</span>{' '}
              from your social links.
            </DialogDescription>
          </div>
          <DialogFooter className="p-8 bg-gray-50/50 dark:bg-gray-900 flex flex-row gap-4 border-t border-gray-50 dark:border-gray-800">
            <Button
              variant="ghost"
              onClick={() => setDeleteItem(null)}
              className="flex-1 h-12 rounded-2xl font-bold text-[12px] uppercase tracking-widest text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-[0_10px_20px_-5px_rgba(225,29,72,0.4)]"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
