'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, Mail } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { useVendorMailNotifications, useMarkVendorNotificationsRead, type MailNotification } from '@/hooks/use-vendor-mail';

const cardClass = 'bg-card rounded-[5px] border border-border overflow-hidden shadow-sm dark:shadow-none';

type FilterType = 'All' | 'Unread' | 'Read';

export default function NotificationPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('All');
  const { data, isLoading } = useVendorMailNotifications();
  const markAllRead = useMarkVendorNotificationsRead();

  const notifications: MailNotification[] = data?.notifications ?? [];
  const unreadCount = data?.unread_count ?? 0;

  const filtered = notifications.filter((n) => {
    if (filter === 'Unread') return n.is_read === 0;
    if (filter === 'Read') return n.is_read === 1;
    return true;
  });

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 pt-4 pb-10 custom-scrollbar">
      <div className="space-y-6 max-w-[1700px] mx-auto">

        <PageHeader
          title="Notifications"
          subtitle="Stay updated with your latest mail activity."
          total={notifications.length}
          rightContent={
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-muted/30 p-1 rounded-[5px] border border-border w-fit">
                {(['All', 'Unread', 'Read'] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-[3px] text-[13px] font-bold transition-all ${
                      filter === f ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {f}
                    {f === 'Unread' && unreadCount > 0 && (
                      <span className="ml-1.5 text-[10px] bg-rose-500 text-white rounded-full px-1.5 py-0.5">{unreadCount}</span>
                    )}
                  </button>
                ))}
              </div>

              <Button
                onClick={() => markAllRead.mutate()}
                disabled={markAllRead.isPending || unreadCount === 0}
                className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 rounded-[5px] h-9 px-4"
              >
                <Check className="w-4 h-4" />
                <span className="font-semibold text-sm">Mark All as Read</span>
              </Button>
            </div>
          }
        />

        <div className={cardClass}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">From</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-muted-foreground text-sm">Loading…</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="py-16 flex flex-col items-center justify-center text-muted-foreground gap-3">
                        <Bell className="w-10 h-10 opacity-20" />
                        <p className="text-sm font-medium">No notifications found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((n) => (
                    <tr key={n.id} onClick={() => router.push(`/mail?mailId=${n.mail_id}`)} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="shrink-0 w-8 h-8 rounded-[5px] bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center">
                            <Mail className="w-3.5 h-3.5" />
                          </div>
                          <span className={`text-[13px] font-semibold truncate ${n.is_read === 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {n.mail?.subject || 'No subject'}
                          </span>
                          {n.is_read === 0 && (
                            <span className="size-1.5 bg-indigo-500 rounded-full shrink-0" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[12px] text-muted-foreground capitalize">
                          {n.mail?.sender_type ?? '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] text-foreground">
                          {new Date(n.mail?.sent_at ?? n.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <span className={`inline-flex items-center justify-center w-[64px] h-6 rounded-[3px] text-[11px] font-bold uppercase ${
                            n.is_read === 0 ? 'bg-rose-500 text-white' : 'bg-green-500 text-white'
                          }`}>
                            {n.is_read === 0 ? 'Unread' : 'Read'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
