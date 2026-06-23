"use client";

import {
  CalendarDays,
  CalendarClock,
  Users,
  UserSquare2,
  IndianRupee,
  TrendingUp,
  Plus,
  ChevronDown,
  Globe,
  LayoutTemplate,
  Link2,
  Send,
  ArrowRight,
  CalendarPlus,
  UserPlus,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import Link from "next/link";
import { useVendorClients } from "@/hooks/use-vendor-clients";
import { resolveMediaUrl } from "@/lib/utils";

const AVATAR_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ec4899", "#3b82f6"];

// ── Hardcoded demo data ──────────────────────────────────────────────────────
const STATS = [
  { label: "Total Events", value: "24", delta: "12% from last week", icon: CalendarDays, tint: "#eef2ff", color: "#6366f1" },
  { label: "Upcoming Events", value: "8", link: "View all upcoming", icon: CalendarClock, tint: "#ecfdf5", color: "#10b981" },
  { label: "Total Clients", value: "156", delta: "18% from last week", icon: Users, tint: "#fff7ed", color: "#f59e0b" },
  { label: "Total Guests", value: "2,450", delta: "22% from last week", icon: UserSquare2, tint: "#eff6ff", color: "#3b82f6" },
  { label: "Revenue", value: "₹1,24,500", delta: "16% from last week", icon: IndianRupee, tint: "#fdf2f8", color: "#ec4899" },
];

const CHART_DATA = [
  { day: "Mon 12", created: 6, attended: 4 },
  { day: "Tue 13", created: 9, attended: 5 },
  { day: "Wed 14", created: 8, attended: 6 },
  { day: "Thu 15", created: 12, attended: 7 },
  { day: "Fri 16", created: 17, attended: 9 },
  { day: "Sat 17", created: 13, attended: 8 },
  { day: "Sun 18", created: 15, attended: 10 },
];

const CHART_FOOTER = [
  { value: "24", label: "Events Created" },
  { value: "18", label: "Events Attended" },
  { value: "2,450", label: "Guests Invited" },
  { value: "1,283", label: "Guests Attended" },
];

const UPCOMING = [
  { name: "Rahul & Priya Wedding", date: "May 24, 2025 · 6:00 PM", place: "The Grand Hyatt, Mumbai", guests: "356", status: "Upcoming", statusColor: "#6366f1" },
  { name: "Annual Corporate Gala 2025", date: "May 17, 2025 · 7:00 PM", place: "Grand Hyatt, Bengaluru", guests: "210", status: "Live", statusColor: "#10b981" },
  { name: "Product Launch Event", date: "May 10, 2025 · 11:00 AM", place: "Taj Lands End, Mumbai", guests: "189", status: "Completed", statusColor: "#94a3b8" },
  { name: "Mehta Family Reunion", date: "May 03, 2025 · 1:00 PM", place: "Green Meadows Resort", guests: "142", status: "Completed", statusColor: "#94a3b8" },
];

const FEATURES = [
  { title: "Sub Domain (Website)", desc: "Create and manage your branded event websites.", link: "acme.eventinvit.com", linkLabel: "Manage Website", badge: "Published", icon: Globe, color: "#6366f1" },
  { title: "Templates", desc: "Create beautiful event templates and save time.", linkLabel: "View Templates", icon: LayoutTemplate, color: "#f59e0b" },
  { title: "Invitations & Links", desc: "Share your events and track invitation activity.", linkLabel: "Manage Links", icon: Link2, color: "#10b981" },
  { title: "Communications", desc: "Send emails, SMS and WhatsApp to your guests.", linkLabel: "Send Message", icon: Send, color: "#ec4899" },
];

const ACTIVITY = [
  { icon: CalendarPlus, text: 'New event "Rahul & Priya Wedding" has been created.', meta: "By You · 2 minutes ago" },
  { icon: UserPlus, text: 'New client "Elite Experiences" has been added.', meta: "By You · 1 hour ago" },
];

const card = "rounded-[var(--vendor-radius-panel)] border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]";

export default function DashboardPage() {
  const { data: clientsRes } = useVendorClients({
    page: 1,
    limit: 5,
    sort_by: "created_at",
    sort_order: "DESC",
  });
  const clients = clientsRes?.data ?? [];

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 pt-5 pb-10 custom-scrollbar bg-slate-50/60">
      <div className="space-y-6 max-w-[1700px] mx-auto">
        {/* ── Welcome header ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-800">Welcome back, Rohan! 👋</h1>
            <p className="mt-0.5 text-[11px] text-slate-500">Here&apos;s what&apos;s happening with your events today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-[var(--vendor-radius-control)] border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm">
              <CalendarDays className="h-4 w-4 text-slate-400" />
              May 12 – May 18, 2025
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
            <button className="flex items-center gap-2 rounded-[var(--vendor-radius-control)] bg-[var(--vendor-primary-btn)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[var(--vendor-primary-btn-hover)]">
              <Plus className="h-4 w-4" /> Create Event
            </button>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STATS.map((s) => (
            <div key={s.label} className={`${card} p-3.5`}>
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--vendor-radius-control)]" style={{ backgroundColor: s.tint }}>
                  <s.icon className="h-[18px] w-[18px]" style={{ color: s.color }} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold text-slate-500">{s.label}</p>
                  <p className="text-base font-extrabold text-slate-800 leading-tight">{s.value}</p>
                </div>
              </div>
              {s.delta ? (
                <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <TrendingUp className="h-3 w-3" /> {s.delta}
                </p>
              ) : (
                <p className="mt-2 text-[11px] font-semibold text-[var(--vendor-primary-btn)]">{s.link}</p>
              )}
            </div>
          ))}
        </div>

        {/* ── Chart + Upcoming + Clients ── */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {/* Event overview chart */}
          <div className={`${card} p-4 xl:col-span-1`}>
            <div className="flex items-center justify-between">
              <h2 className="text-[12px] font-bold text-slate-800">Event Overview</h2>
              <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500">
                This Week <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-3 text-[10px] font-semibold text-slate-500">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[var(--vendor-primary-btn)]" /> Events Created</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-sky-400" /> Events Attended</span>
            </div>
            <div className="mt-3 h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CHART_DATA} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="created" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="attended" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {CHART_FOOTER.map((f) => (
                <div key={f.label} className="rounded-[var(--vendor-radius-control)] bg-slate-50 px-2 py-2 text-center">
                  <div>
                  <span className="text-[10px] font-extrabold text-slate-800">{f.value}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming events */}
          <div className={`${card} p-4`}>
            <div className="flex items-center justify-between">
              <h2 className="text-[12px] font-bold text-slate-800">Upcoming Events</h2>
              <a className="text-[10px] font-semibold text-[var(--vendor-primary-btn)]">View All</a>
            </div>
            <div className="mt-3 space-y-2">
              {UPCOMING.map((e) => (
                <div key={e.name} className="flex items-center gap-2.5 rounded-[var(--vendor-radius-control)] border border-slate-100 p-2">
                  <span className="h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br from-indigo-100 to-sky-100" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-[10px] font-bold text-slate-800">{e.name}</span>
                      <span className="shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase text-white" style={{ backgroundColor: e.statusColor }}>{e.status}</span>
                    </div>
                    <div>
                    <span className="truncate text-[10px] font-medium text-slate-500">{e.date}</span>
                    </div>
                    <span className="truncate text-[10px] text-slate-400">{e.place}</span>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[11px] font-extrabold text-slate-700">{e.guests}</p>
                    <span className="text-[10px] text-slate-400">Guests</span>
                  </div>
                </div>
              ))}
            </div>
            <a className="mt-3 flex items-center justify-center gap-1 text-[10px] font-bold text-[var(--vendor-primary-btn)]">View All Events <ArrowRight className="h-3.5 w-3.5" /></a>
          </div>

          {/* Clients */}
          <div className={`${card} p-4`}>
            <div className="flex items-center justify-between">
              <h2 className="text-[12px] font-bold text-slate-800">Clients</h2>
              <a className="text-[10px] font-semibold text-[var(--vendor-primary-btn)]">View All</a>
            </div>
            <div className="mt-3 space-y-2">
              {clients.length === 0 ? (
                <p className="py-6 text-center text-[11px] text-slate-400">No clients yet</p>
              ) : (
                clients.map((c, i) => {
                  const pic = resolveMediaUrl(c.profile_pic || undefined);
                  const initials = (c.name || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
                  const isGuest = String((c as any).registration_type || "").toLowerCase() === "guest";
                  const planLabel = isGuest ? "Guest" : (c.plan || "No Plan");
                  return (
                    <div key={c.id} className="flex items-center gap-2.5 rounded-[var(--vendor-radius-control)] border border-slate-100 p-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white overflow-hidden relative" style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                        {pic ? <img src={pic} alt="" className="absolute inset-0 h-full w-full object-cover" /> : initials}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10px] font-bold text-slate-800 uppercase">{c.name}</p>
                        <p className="truncate text-[10px] text-slate-400">{c.email}</p>
                      </div>
                      <span className="shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase" style={isGuest ? { backgroundColor: "#f3f4f6", color: "#6b7280" } : { backgroundColor: "#eff6ff", color: "#2563eb" }}>
                        {planLabel}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
            <Link href="/clients" className="mt-3 flex items-center justify-center gap-1 text-[10px] font-bold text-[var(--vendor-primary-btn)]">View All Clients <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
        </div>

        {/* ── Feature cards ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className={`${card} p-5`}>
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-[var(--vendor-radius-control)]" style={{ backgroundColor: f.color + "1a" }}>
                  <f.icon className="h-5 w-5" style={{ color: f.color }} />
                </span>
                {f.badge ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-600">{f.badge}</span>
                ) : null}
              </div>
              <h3 className="mt-3 text-[12px] font-bold text-slate-800">{f.title}</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{f.desc}</p>
              {f.link ? <p className="mt-2 text-[11px] font-semibold text-[var(--vendor-primary-btn)]">{f.link}</p> : null}
              <a className="mt-3 flex items-center gap-1 text-[10px] font-bold text-[var(--vendor-primary-btn)]">{f.linkLabel} <ArrowRight className="h-3.5 w-3.5" /></a>
            </div>
          ))}
        </div>

        {/* ── Activity feed + Plan usage ── */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className={`${card} p-5`}>
            <h2 className="text-[12px] font-bold text-slate-800">Activity Feed</h2>
            <div className="mt-4 space-y-4">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]">
                    <a.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[12px] font-semibold text-slate-700">{a.text}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{a.meta}</p>
                  </div>
                </div>
              ))}
            </div>
            <a className="mt-4 flex items-center justify-center gap-1 text-[10px] font-bold text-[var(--vendor-primary-btn)]">View All Activity <ArrowRight className="h-3.5 w-3.5" /></a>
          </div>

          <div className={`${card} p-5`}>
            <div className="flex items-center justify-between">
              <h2 className="text-[12px] font-bold text-slate-800">Plan Usage</h2>
              <span className="text-[11px] font-semibold text-slate-400">Renews on Jun 12, 2025</span>
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between text-sm font-bold text-slate-700">
                <span>Premium Plan</span>
              </div>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[var(--vendor-primary-btn)]" style={{ width: "78%" }} />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-[11px] text-slate-500">You have used 78% of your plan</p>
                <a className="flex items-center gap-1 text-[10px] font-bold text-[var(--vendor-primary-btn)]">View Billing <ArrowRight className="h-3.5 w-3.5" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
