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
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-3">
      {/* Page Header */}
      <div className="shrink-0">
        <h1 className="text-2xl font-bold text-foreground uppercase tracking-tight">Activity Log</h1>
        <p className="text-muted-foreground text-sm mt-1 italic tracking-tight font-medium">A complete record of all actions and events on your account.</p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col space-y-4 px-1">
        {/* Stats Row */}
        <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, Icon, bg, icon }) => (
            <div key={label} className="bg-card border border-border rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                <Icon className={`w-5 h-5 ${icon}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mt-1.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div className="flex-1 min-h-0 bg-card rounded-3xl border border-border overflow-hidden flex flex-col shadow-[0_8px_40px_rgba(0,0,0,0.03)]">
          {/* Toolbar */}
          <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-border/60 bg-muted/10">
            <div className="relative w-full sm:w-72 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                placeholder="Search activity…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm bg-muted/30 focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-medium"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0 mr-1" />
              {CATEGORIES.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => handleCategoryChange(id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    category === id
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
              <div className="h-6 w-px bg-border mx-1" />
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
            </div>
          </div>

          {/* Result count strip */}
          <div className="shrink-0 flex items-center justify-between px-6 py-2.5 bg-muted/20 border-b border-border/40">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Showing <span className="text-foreground">{activities.length}</span> Results
              {category !== 'all' && (
                <> IN <span className="text-primary">{CATEGORIES.find((c) => c.id === category)?.label}</span></>
              )}
            </span>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              Last 30 days
            </span>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 min-h-0 overflow-auto custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <Loader2 className="w-8 h-8 animate-spin opacity-40" />
                <p className="text-sm font-medium italic">Loading activity records...</p>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <AlertTriangle className="w-10 h-10 text-rose-500 opacity-30" />
                <p className="text-sm font-bold uppercase tracking-wider">Failed to load activity</p>
                <button onClick={() => window.location.reload()} className="text-xs text-primary font-bold underline">Try again</button>
              </div>
            ) : paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <Search className="w-10 h-10 opacity-30" />
                <p className="text-sm font-bold uppercase tracking-wider">No activity found</p>
                <p className="text-xs italic">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {paginated.map((activity) => {
                  const { Icon, color } = getIconAndColor(activity.action);
                  const { date, time }  = formatDate(activity.created_at);
                  const cat             = getCategoryFromModule(activity.module);
                  const device          = parseDevice(activity.user_agent);

                  return (
                    <div
                      key={activity.id}
                      onClick={() => setDetailEntry(activity)}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-primary/[0.02] transition-colors cursor-pointer group border-l-4 border-transparent hover:border-primary/30"
                    >
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${color}`}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{formatActionTitle(activity.action)}</p>
                        <p className="text-[13px] text-muted-foreground leading-snug mt-1 font-medium">{activity.description ?? '—'}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">{device}</span>
                          <span className="size-1 rounded-full bg-border" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">{cat}</span>
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs font-bold text-foreground/80 tabular-nums">{date}</p>
                        <p className="text-[10px] font-bold text-muted-foreground/60 mt-1 tabular-nums uppercase tracking-tighter">{time}</p>
                      </div>

                      <ChevronRight className="w-5 h-5 text-muted-foreground/20 group-hover:text-primary/40 transition-all group-hover:translate-x-0.5 shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          {!isLoading && totalPages > 1 && (
            <div className="shrink-0 flex items-center justify-between px-6 py-4 border-t border-border/60 bg-muted/5">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Page <span className="text-foreground">{currentPage}</span> of {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-black transition-all ${
                      p === currentPage
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                        : 'border border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 transition-all animate-in fade-in duration-200"
            onClick={() => setDetailEntry(null)}
          >
            <div
              className="bg-card border border-border rounded-3xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-current/10 ${color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground leading-tight">{formatActionTitle(detailEntry.action)}</h3>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mt-1.5 block">{cat}</span>
                  </div>
                </div>
                <button
                  onClick={() => setDetailEntry(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
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
                  <div key={label} className="flex flex-col py-4 first:pt-0 last:pb-0">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">{label}</span>
                    <span className="text-sm font-bold text-foreground leading-relaxed">{value}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setDetailEntry(null)}
                className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
              >
                Done
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
