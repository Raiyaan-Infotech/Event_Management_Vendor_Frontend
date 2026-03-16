'use client';

import { useState, useMemo } from 'react';
import {
  Key, LogIn, LogOut, User, Shield,
  Smartphone, AlertTriangle, Search, Filter,
  Download, Calendar, ChevronLeft, ChevronRight,
  Activity, Loader2,
} from 'lucide-react';
import { useVendorActivityLog, type VendorActivityLog } from '@/hooks/use-vendors';

// ── Types ──────────────────────────────────────────────────────────────────
type ActivityCategory = 'all' | 'auth' | 'security' | 'profile' | 'system';

const CATEGORIES: { id: ActivityCategory; label: string }[] = [
  { id: 'all',      label: 'All Activity' },
  { id: 'auth',     label: 'Authentication' },
  { id: 'security', label: 'Security' },
  { id: 'profile',  label: 'Profile' },
  { id: 'system',   label: 'System' },
];

const MODULE_MAP: Record<ActivityCategory, string | undefined> = {
  all:      undefined,
  auth:     'vendor_auth',
  security: 'vendor_security',
  profile:  'vendor_profile',
  system:   'vendor_system',
};

// ── Helpers ────────────────────────────────────────────────────────────────
function getIconAndColor(action: string) {
  switch (action) {
    case 'login':
      return { Icon: LogIn,    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' };
    case 'logout':
      return { Icon: LogOut,   color: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' };
    case 'update_profile':
      return { Icon: User,     color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' };
    case 'change_password':
      return { Icon: Key,      color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' };
    case 'failed_login':
      return { Icon: AlertTriangle, color: 'bg-red-100 text-red-500 dark:bg-red-950/40 dark:text-red-400' };
    case 'new_device':
      return { Icon: Smartphone, color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' };
    case '2fa':
      return { Icon: Shield,   color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' };
    default:
      return { Icon: Activity, color: 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400' };
  }
}

function getCategoryFromModule(module: string): ActivityCategory {
  if (module === 'vendor_auth')     return 'auth';
  if (module === 'vendor_security') return 'security';
  if (module === 'vendor_profile')  return 'profile';
  return 'system';
}

function formatActionTitle(action: string): string {
  return action.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function parseDevice(userAgent: string | null): string {
  if (!userAgent) return '—';
  if (/iPhone/i.test(userAgent))  return 'Safari on iPhone';
  if (/Android/i.test(userAgent)) return 'Chrome on Android';
  if (/iPad/i.test(userAgent))    return 'Safari on iPad';
  if (/Chrome/i.test(userAgent) && /Windows/i.test(userAgent))  return 'Chrome on Windows';
  if (/Chrome/i.test(userAgent) && /Mac/i.test(userAgent))      return 'Chrome on Mac';
  if (/Firefox/i.test(userAgent)) return 'Firefox';
  if (/Safari/i.test(userAgent))  return 'Safari';
  return 'Unknown Browser';
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
  };
}

const PAGE_SIZE = 8;

// ── Page ───────────────────────────────────────────────────────────────────
export default function ActivityLogPage() {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState<ActivityCategory>('all');
  const [page, setPage]         = useState(1);
  const [detailEntry, setDetailEntry] = useState<VendorActivityLog | null>(null);

  const { data, isLoading, isError } = useVendorActivityLog({
    limit: 200,
    module: MODULE_MAP[category],
    search: search || undefined,
  });

  const activities = useMemo(() => data?.data ?? [], [data?.data]);

  // Client-side pagination over the fetched results
  const totalPages  = Math.max(1, Math.ceil(activities.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated   = activities.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Stats from full dataset
  const stats = useMemo(() => [
    {
      label: 'Total Events',
      value: data?.pagination.total ?? 0,
      Icon: Activity,
      bg:   'bg-blue-50 dark:bg-blue-950/30',
      icon: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Auth Events',
      value: activities.filter((a) => getCategoryFromModule(a.module) === 'auth').length,
      Icon: LogIn,
      bg:   'bg-yellow-50 dark:bg-yellow-950/30',
      icon: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      label: 'Security Events',
      value: activities.filter((a) => getCategoryFromModule(a.module) === 'security').length,
      Icon: Shield,
      bg:   'bg-emerald-50 dark:bg-emerald-950/30',
      icon: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Alerts',
      value: activities.filter((a) => a.action === 'failed_login').length,
      Icon: AlertTriangle,
      bg:   'bg-red-50 dark:bg-red-950/30',
      icon: 'text-red-500 dark:text-red-400',
    },
  ], [activities, data?.pagination.total]);

  const handleCategoryChange = (c: ActivityCategory) => { setCategory(c); setPage(1); };
  const handleSearch         = (v: string)            => { setSearch(v);   setPage(1); };

  return (
    <div className="bg-muted/40 -mt-6 -mx-6 -mb-6 min-h-screen">
      {/* Page Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold text-foreground">Activity Log</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          A complete record of all actions and events on your account.
        </p>
      </div>

      <div className="px-6 pt-6 pb-4">

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map(({ label, value, Icon, bg, icon }) => (
            <div key={label} className="bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
                <Icon className={`w-5 h-5 ${icon}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-border/60">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search activity…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm bg-muted/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              {CATEGORIES.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => handleCategoryChange(id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    category === id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
              <button className="ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-all">
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
            </div>
          </div>

          {/* Result count */}
          <div className="flex items-center justify-between px-6 py-2.5 bg-muted/30 border-b border-border/40">
            <span className="text-xs text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{activities.length}</span> event{activities.length !== 1 ? 's' : ''}
              {category !== 'all' && (
                <> in <span className="font-semibold text-primary">{CATEGORIES.find((c) => c.id === category)?.label}</span></>
              )}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Last 30 days
            </span>
          </div>

          {/* States */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <Loader2 className="w-8 h-8 animate-spin opacity-40" />
              <p className="text-sm">Loading activity…</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <AlertTriangle className="w-10 h-10 opacity-30" />
              <p className="text-sm font-medium">Failed to load activity</p>
              <p className="text-xs">Please try again later.</p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <Search className="w-10 h-10 opacity-30" />
              <p className="text-sm font-medium">No activity found</p>
              <p className="text-xs">Try adjusting your search or filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {paginated.map((activity) => {
                const { Icon, color } = getIconAndColor(activity.action);
                const { date, time }  = formatDate(activity.created_at);
                const cat             = getCategoryFromModule(activity.module);
                const device          = parseDevice(activity.user_agent);

                return (
                  <div
                    key={activity.id}
                    onClick={() => setDetailEntry(activity)}
                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-accent/30 transition-colors cursor-pointer group"
                  >
                    <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-tight">{formatActionTitle(activity.action)}</p>
                      <p className="text-sm text-muted-foreground leading-tight mt-0.5">{activity.description ?? '—'}</p>
                      <p className="text-xs text-muted-foreground/60 mt-0.5">{device}</p>
                    </div>

                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground capitalize shrink-0">
                      {cat}
                    </span>

                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-muted-foreground whitespace-nowrap">{date}</p>
                      <p className="text-xs text-muted-foreground/60 mt-0.5">{time}</p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/60">
              <span className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                      p === currentPage
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'border border-border text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {detailEntry && (() => {
        const { Icon, color } = getIconAndColor(detailEntry.action);
        const { date, time }  = formatDate(detailEntry.created_at);
        const cat             = getCategoryFromModule(detailEntry.module);
        const device          = parseDevice(detailEntry.user_agent);

        return (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setDetailEntry(null)}
          >
            <div
              className="bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground leading-tight">{formatActionTitle(detailEntry.action)}</h3>
                    <span className="text-xs text-muted-foreground capitalize">{cat}</span>
                  </div>
                </div>
                <button
                  onClick={() => setDetailEntry(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-0 divide-y divide-border/40">
                {[
                  { label: 'Description', value: detailEntry.description ?? '—' },
                  { label: 'Date',        value: date },
                  { label: 'Time',        value: time },
                  { label: 'Device',      value: device },
                  { label: 'IP Address',  value: detailEntry.ip_address ?? '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-3">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-medium text-foreground text-right max-w-[60%] truncate">{value}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setDetailEntry(null)}
                className="w-full mt-5 bg-muted hover:bg-accent text-foreground py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
