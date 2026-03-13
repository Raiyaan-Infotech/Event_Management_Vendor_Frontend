'use client';

import { useState, useMemo } from 'react';
import {
  Key, LogIn, User, Shield, FileText, RefreshCw,
  Smartphone, AlertTriangle, Archive, Search, Filter,
  Download, Calendar, ChevronLeft, ChevronRight,
  Activity, Lock, Bell, Settings,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
type ActivityCategory = 'all' | 'auth' | 'security' | 'profile' | 'system';

interface ActivityEntry {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  Icon: React.ElementType;
  color: string;
  category: ActivityCategory;
  ip?: string;
  device?: string;
}

// ── Data ───────────────────────────────────────────────────────────────────
const ALL_ACTIVITIES: ActivityEntry[] = [
  { id: 1,  title: 'Password changed',           description: 'Changed from web browser (Chrome)',        date: 'Mar 15, 2024', time: '10:30 AM', Icon: Key,           color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400', category: 'security', ip: '192.168.1.1',   device: 'Chrome on Windows' },
  { id: 2,  title: 'Login from new device',       description: 'MacBook Pro — New York, USA',              date: 'Mar 14, 2024', time: '3:45 PM',  Icon: LogIn,         color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-400',   category: 'auth',     ip: '203.0.113.42',  device: 'Safari on MacBook Pro' },
  { id: 3,  title: 'Profile updated',             description: 'Updated contact information',              date: 'Mar 13, 2024', time: '2:15 PM',  Icon: User,          color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',           category: 'profile',  ip: '192.168.1.1',   device: 'Chrome on Windows' },
  { id: 4,  title: 'Security settings modified',  description: 'Enabled 2FA authentication',              date: 'Mar 12, 2024', time: '11:20 AM', Icon: Shield,        color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400', category: 'security', ip: '192.168.1.1',   device: 'Chrome on Windows' },
  { id: 5,  title: 'Document downloaded',         description: 'Downloaded annual report',                date: 'Mar 11, 2024', time: '9:15 AM',  Icon: FileText,      color: 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400',   category: 'system',   ip: '192.168.1.1',   device: 'Firefox on Windows' },
  { id: 6,  title: 'Failed login attempt',        description: 'Invalid credentials from unknown IP',     date: 'Mar 10, 2024', time: '8:20 PM',  Icon: AlertTriangle, color: 'bg-red-100 text-red-500 dark:bg-red-950/40 dark:text-red-400',               category: 'auth',     ip: '198.51.100.7',  device: 'Unknown Browser' },
  { id: 7,  title: 'Account recovery initiated',  description: 'Password reset requested',                date: 'Mar 9, 2024',  time: '4:15 PM',  Icon: RefreshCw,     color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-400',   category: 'security', ip: '192.168.1.1',   device: 'Chrome on Windows' },
  { id: 8,  title: 'New device registered',       description: 'iPhone 13 — New York, USA',               date: 'Mar 8, 2024',  time: '1:30 PM',  Icon: Smartphone,    color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',           category: 'auth',     ip: '203.0.113.10',  device: 'Safari on iPhone' },
  { id: 9,  title: 'Security alert',              description: 'Suspicious activity detected',             date: 'Mar 7, 2024',  time: '10:45 AM', Icon: AlertTriangle, color: 'bg-red-100 text-red-500 dark:bg-red-950/40 dark:text-red-400',               category: 'security', ip: '198.51.100.99', device: 'Unknown' },
  { id: 10, title: 'Backup completed',            description: 'System backup successful',                 date: 'Mar 6, 2024',  time: '9:00 AM',  Icon: Archive,       color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400', category: 'system',   ip: '—',             device: 'System' },
  { id: 11, title: 'New device registered',       description: 'Redmi Note 5 — Tamil Nadu, India',        date: 'Mar 5, 2024',  time: '1:30 PM',  Icon: Smartphone,    color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',           category: 'auth',     ip: '103.21.245.12', device: 'Chrome on Android' },
  { id: 12, title: 'Notification settings saved', description: 'Email notifications enabled',             date: 'Mar 4, 2024',  time: '3:00 PM',  Icon: Bell,          color: 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400',   category: 'profile',  ip: '192.168.1.1',   device: 'Chrome on Windows' },
  { id: 13, title: 'Successful login',            description: 'Logged in from Chrome on Windows',        date: 'Mar 3, 2024',  time: '9:10 AM',  Icon: LogIn,         color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400', category: 'auth',     ip: '192.168.1.1',   device: 'Chrome on Windows' },
  { id: 14, title: 'Profile photo updated',       description: 'Uploaded new profile picture',            date: 'Mar 2, 2024',  time: '11:45 AM', Icon: User,          color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',           category: 'profile',  ip: '192.168.1.1',   device: 'Chrome on Windows' },
  { id: 15, title: 'Password policy accepted',    description: 'Agreed to updated security policy',       date: 'Mar 1, 2024',  time: '8:00 AM',  Icon: Lock,          color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400', category: 'security', ip: '192.168.1.1',   device: 'Chrome on Windows' },
  { id: 16, title: 'App settings changed',        description: 'Dashboard layout preference updated',     date: 'Feb 28, 2024', time: '5:20 PM',  Icon: Settings,      color: 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400',   category: 'system',   ip: '192.168.1.1',   device: 'Chrome on Windows' },
  { id: 17, title: 'Failed login attempt',        description: '3 consecutive failed logins blocked',     date: 'Feb 27, 2024', time: '2:35 PM',  Icon: AlertTriangle, color: 'bg-red-100 text-red-500 dark:bg-red-950/40 dark:text-red-400',               category: 'auth',     ip: '198.51.100.7',  device: 'Unknown Browser' },
  { id: 18, title: 'Report exported',             description: 'Quarterly sales report exported as PDF',  date: 'Feb 26, 2024', time: '10:05 AM', Icon: Download,      color: 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400',   category: 'system',   ip: '192.168.1.1',   device: 'Chrome on Windows' },
  { id: 19, title: '2FA verification passed',     description: 'OTP verified successfully',               date: 'Feb 25, 2024', time: '7:50 AM',  Icon: Shield,        color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400', category: 'security', ip: '192.168.1.1',   device: 'Chrome on Windows' },
  { id: 20, title: 'System maintenance notice',   description: 'Scheduled downtime acknowledged',         date: 'Feb 24, 2024', time: '12:00 PM', Icon: Archive,       color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-400',   category: 'system',   ip: '—',             device: 'System' },
];

const CATEGORIES: { id: ActivityCategory; label: string }[] = [
  { id: 'all',      label: 'All Activity' },
  { id: 'auth',     label: 'Authentication' },
  { id: 'security', label: 'Security' },
  { id: 'profile',  label: 'Profile' },
  { id: 'system',   label: 'System' },
];

const PAGE_SIZE = 8;

// ── Stat cards data ────────────────────────────────────────────────────────
function buildStats(data: ActivityEntry[]) {
  return [
    {
      label: 'Total Events',
      value: data.length,
      Icon: Activity,
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      icon: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Auth Events',
      value: data.filter((a) => a.category === 'auth').length,
      Icon: LogIn,
      bg: 'bg-yellow-50 dark:bg-yellow-950/30',
      icon: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      label: 'Security Events',
      value: data.filter((a) => a.category === 'security').length,
      Icon: Shield,
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      icon: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Alerts',
      value: data.filter((a) => a.Icon === AlertTriangle).length,
      Icon: AlertTriangle,
      bg: 'bg-red-50 dark:bg-red-950/30',
      icon: 'text-red-500 dark:text-red-400',
    },
  ];
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function ActivityLogPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('all');
  const [page, setPage] = useState(1);
  const [detailEntry, setDetailEntry] = useState<ActivityEntry | null>(null);

  const filtered = useMemo(() => {
    return ALL_ACTIVITIES.filter((a) => {
      const matchCat = category === 'all' || a.category === category;
      const q = search.toLowerCase();
      const matchQ =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        (a.device ?? '').toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [search, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const stats = buildStats(ALL_ACTIVITIES);

  const handleCategoryChange = (c: ActivityCategory) => {
    setCategory(c);
    setPage(1);
  };

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

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
            {/* Search */}
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

            {/* Category filter + export */}
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
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> event{filtered.length !== 1 ? 's' : ''}
              {category !== 'all' && (
                <> in <span className="font-semibold text-primary">{CATEGORIES.find((c) => c.id === category)?.label}</span></>
              )}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Last 30 days
            </span>
          </div>

          {/* Activity List */}
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <Search className="w-10 h-10 opacity-30" />
              <p className="text-sm font-medium">No activity found</p>
              <p className="text-xs">Try adjusting your search or filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {paginated.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => setDetailEntry(activity)}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-accent/30 transition-colors cursor-pointer group"
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${activity.color}`}>
                    <activity.Icon className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight">{activity.title}</p>
                    <p className="text-sm text-muted-foreground leading-tight mt-0.5">{activity.description}</p>
                    {activity.device && (
                      <p className="text-xs text-muted-foreground/60 mt-0.5">{activity.device}</p>
                    )}
                  </div>

                  {/* Category badge */}
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground capitalize shrink-0">
                    {activity.category}
                  </span>

                  {/* Date/time */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{activity.date}</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">{activity.time}</p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
      {detailEntry && (
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
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${detailEntry.color}`}>
                  <detailEntry.Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground leading-tight">{detailEntry.title}</h3>
                  <span className="text-xs text-muted-foreground capitalize">{detailEntry.category}</span>
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
                { label: 'Description', value: detailEntry.description },
                { label: 'Date',        value: detailEntry.date },
                { label: 'Time',        value: detailEntry.time },
                { label: 'Device',      value: detailEntry.device ?? '—' },
                { label: 'IP Address',  value: detailEntry.ip ?? '—' },
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
      )}
    </div>
  );
}
