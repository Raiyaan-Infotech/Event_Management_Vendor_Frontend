"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Send, Globe, UserCheck, Check, ChevronDown, MailCheck, MailX, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import { cn } from "@/lib/utils";
import { useEmailCategories, useEmailTemplatesByCategory } from "@/hooks/use-email-categories";
import { useNewsletterSubscribers, useNewsletterUnsubscribers, useSendNewsletter } from "@/hooks/use-newsletter";
import { useVendorSubscription } from "@/hooks/use-vendor-subscription";

const USER_TYPE_OPTIONS = [
  { value: "Guest",      label: "Guest",      icon: Globe,      color: "blue" },
  { value: "Registered", label: "Registered", icon: UserCheck,  color: "emerald" },
] as const;

export default function SendMailContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [from, setFrom] = useState<"subscribers" | "unsubscribers">(
    (searchParams.get("from") as "subscribers" | "unsubscribers") ?? "subscribers"
  );

  const [userType,    setUserType]    = useState<"Guest" | "Registered">("Registered");
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [categoryId,  setCategoryId]  = useState<number | null>(null);
  const [templateId,  setTemplateId]  = useState<number | null>(null);

  const { data: subscriptionData } = useVendorSubscription();
  const planOptions = subscriptionData?.plans ?? [];

  const { data: categories = [], isLoading: catsLoading } = useEmailCategories();
  const { data: templates  = [], isLoading: tmplLoading  } = useEmailTemplatesByCategory(categoryId);
  const { data: subscribers = [] } = useNewsletterSubscribers();
  const { data: unsubscribers = [] } = useNewsletterUnsubscribers();
  const { mutate: sendNewsletter, isPending } = useSendNewsletter();

  // Plan-wise counts
  const planCounts = useMemo(() => {
    const allData = from === "subscribers" ? subscribers : unsubscribers;
    const registered = allData.filter(item => item.registration_type === "client");
    const counts: Record<string, number> = {};
    for (const item of registered) {
      const plan = item.plan || "";
      counts[plan] = (counts[plan] || 0) + 1;
    }
    return counts;
  }, [from, subscribers, unsubscribers]);

  // Calculate Live Stats
  const stats = useMemo(() => {
    const allData = from === "subscribers" ? subscribers : unsubscribers;

    // Filter by userType (Guest vs Registered) and plan selection
    let filtered = allData;
    if (userType === "Guest") {
      filtered = allData.filter(item => item.registration_type === "guest");
    } else {
      filtered = allData.filter(item => item.registration_type === "client");
      if (selectedPlans.length > 0) {
        filtered = filtered.filter(item => selectedPlans.includes(item.plan || ""));
      }
    }

    // Segment label
    let segment = "All Plans";
    if (userType === "Guest") {
      segment = "Guest";
    } else if (selectedPlans.length > 0) {
      segment = selectedPlans.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(", ");
    }

    return {
      totalRecipients: filtered.length,
      segment,
    };
  }, [subscribers, unsubscribers, from, userType, selectedPlans]);

  const togglePlan = (planValue: string) => {
    setSelectedPlans(prev =>
      prev.includes(planValue)
        ? prev.filter(p => p !== planValue)
        : [...prev, planValue]
    );
  };

  const handleSend = async () => {
    if (!categoryId) { toast.error("Please select an email category"); return; }
    if (!templateId) { toast.error("Please select an email template");  return; }

    sendNewsletter(
      { userType, plans: userType === "Registered" ? selectedPlans : [], categoryId, templateId, sendTo: from },
      {
        onSuccess: (data) => {
          const count = data?.count || 0;
          toast.success(`Newsletter sent to ${count} recipients!`);
          router.push("/newsletter/email");
        },
        onError: () => {
          toast.error("Failed to send newsletter");
        },
      }
    );
  };

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar bg-[#F8FAFC] dark:bg-black/40">

      {/* Header */}
      <div className="max-w-[1700px] mx-auto mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1 font-poppins">Send Newsletter</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-tight">Configure your audience and select a template to start your campaign.</p>
        </div>
        <Link href="/newsletter/email">
          <button className="flex items-center gap-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-transparent">
            <ArrowLeft size={16} className="text-blue-500" strokeWidth={3} /> Back to Email
          </button>
        </Link>
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom duration-1000 pb-10">

        {/* Left: 9 cols - Form + Stats in ONE card */}
        <div className="lg:col-span-9 relative z-0">
          <div className="bg-white dark:bg-sidebar p-8 md:p-10 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-none">
            <div className="grid grid-cols-3 gap-8">

              {/* Form Section - 2 cols */}
              <div className="col-span-2 space-y-10">

                {/* Row 1: Send To + User Type on same line */}
                <div className="grid grid-cols-2 gap-8">

                  {/* Send To */}
                  <div className="space-y-5">
                    <Label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Send To</Label>
                    <div className="inline-flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-xl">
                      {([
                        { value: "subscribers",   label: "Subscribers",   icon: MailCheck },
                        { value: "unsubscribers", label: "Unsubscribers", icon: MailX },
                      ] as const).map(({ value, label, icon: Icon }) => {
                        const isActive = from === value;
                        return (
                          <button key={value} type="button" onClick={() => setFrom(value)}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all duration-200",
                              isActive ? "bg-white dark:bg-sidebar shadow-sm text-gray-800 dark:text-white" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            )}
                          >
                            <Icon size={14} className={isActive ? "text-blue-500" : ""} />
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* User Type */}
                  <div className="space-y-5">
                    <Label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">User Type</Label>
                    <div className="inline-flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-xl">
                      {USER_TYPE_OPTIONS.map((opt) => {
                        const isActive = userType === opt.value;
                        const Icon = opt.icon;
                        return (
                          <button key={opt.value} type="button" onClick={() => setUserType(opt.value)}
                            className={cn(
                              "flex items-center gap-2 px-5 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all duration-200",
                              isActive ? "bg-white dark:bg-sidebar shadow-sm text-gray-800 dark:text-white" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            )}
                          >
                            <Icon size={14} className={isActive ? "text-blue-500" : ""} />
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Row 2: Plan Filter dropdown multi-select */}
                <div className="space-y-5">
                  <Label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Plan Filter</Label>
                  <Popover>
                    <PopoverTrigger asChild disabled={userType === "Guest"}>
                      <button className="min-h-12 w-full px-4 py-2 rounded-xl text-sm font-bold border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 transition-all border text-left flex items-center justify-between gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10">
                        {selectedPlans.length === 0 ? (
                          <span className="text-gray-500 dark:text-gray-400">All Plans</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {selectedPlans.map(name => {
                              const plan = planOptions.find(p => p.name === name);
                              return (
                                <span
                                  key={name}
                                  className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                                  style={plan?.label_color
                                    ? { backgroundColor: plan.label_color + '22', color: plan.label_color, border: `1px solid ${plan.label_color}44` }
                                    : { backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}
                                >
                                  {name}
                                </span>
                              );
                            })}
                          </div>
                        )}
                        <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2 rounded-xl border-gray-200 dark:border-white/10">
                      <div className="space-y-1 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                        {planOptions.length === 0 ? (
                          <p className="text-xs text-gray-400 px-3 py-2">No plans available</p>
                        ) : planOptions.map(o => {
                          const isSelected = selectedPlans.includes(o.name);
                          return (
                            <button key={o.id} onClick={() => togglePlan(o.name)}
                              className={cn(
                                "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold transition-all text-left",
                                isSelected ? "bg-blue-50 dark:bg-blue-500/20" : "hover:bg-gray-100 dark:hover:bg-white/10"
                              )}
                            >
                              <div className={cn(
                                "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all",
                                isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300 dark:border-gray-600"
                              )}>
                                {isSelected && <Check size={10} className="text-white" />}
                              </div>
                              <span
                                className="text-[11px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full truncate"
                                style={o.label_color
                                  ? { backgroundColor: o.label_color + '22', color: o.label_color, border: `1px solid ${o.label_color}44` }
                                  : { backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}
                              >
                                {o.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Bottom Row: Category | Template */}
                <div className="grid grid-cols-2 gap-8">

                  {/* Email Category */}
                  <div className="space-y-5">
                    <Label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Category</Label>
                    <div className="w-full">
                      <Select
                        value={categoryId ? String(categoryId) : ""}
                        onValueChange={val => { setCategoryId(Number(val)); setTemplateId(null); }}
                        disabled={catsLoading}
                      >
                        <SelectTrigger className="h-12 w-full rounded-xl text-sm font-bold border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus:ring-4 focus:ring-violet-500/10 transition-all">
                          <SelectValue placeholder={catsLoading ? "Loading..." : "Sample Category"} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl font-bold border-gray-100 dark:border-white/10">
                          {categories.length === 0 ? (
                            <SelectItem value="none" disabled>No categories found</SelectItem>
                          ) : categories.map(c => (
                            <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Email Template */}
                  <div className="space-y-5">
                    <Label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Template</Label>
                    <div className="w-full">
                      <Select
                        value={templateId ? String(templateId) : ""}
                        onValueChange={val => setTemplateId(Number(val))}
                        disabled={tmplLoading || !categoryId}
                      >
                        <SelectTrigger className="h-12 w-full rounded-xl text-sm font-bold border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus:ring-4 focus:ring-emerald-500/10 transition-all">
                          <SelectValue placeholder={tmplLoading ? "Loading..." : "Sample Template 1"} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl font-bold border-gray-100 dark:border-white/10">
                          {templates.length === 0 ? (
                            <SelectItem value="none" disabled>No templates</SelectItem>
                          ) : templates.map(t => (
                            <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                </div>

              </div>

              {/* Live Stats - 1 col */}
              <div className="col-span-1 border-l border-gray-200 dark:border-gray-700 pl-8">
                <p className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] mb-6">Live Stats</p>
                <div className="space-y-6">
                  {/* Recipients */}
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRecipients.toLocaleString()}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Recipients</p>
                  </div>
                  <div className="h-px bg-gray-200 dark:bg-gray-700"></div>

                  {/* Plan-wise counts */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-3">By Plan</p>
                    {userType === "Guest" ? (
                      <p className="text-sm font-bold text-gray-500 dark:text-gray-400">—</p>
                    ) : planOptions.length === 0 ? (
                      <p className="text-sm font-bold text-gray-500 dark:text-gray-400">No plans</p>
                    ) : (
                      <div className="space-y-2">
                        {planOptions.map(p => {
                          const count = planCounts[p.name] || 0;
                          return (
                            <div key={p.id} className="flex items-center justify-between gap-2">
                              <span
                                className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full truncate max-w-[100px]"
                                style={p.label_color
                                  ? { backgroundColor: p.label_color + '22', color: p.label_color, border: `1px solid ${p.label_color}44` }
                                  : { backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}
                              >
                                {p.name}
                              </span>
                              <span className="text-sm font-black text-gray-800 dark:text-gray-200 tabular-nums">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="h-px bg-gray-200 dark:bg-gray-700"></div>

                  {/* Segment */}
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.segment}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Segment</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-0 transition-all">
            <PersistenceActions
              onSave={handleSend}
              onCancel={() => router.push(`/newsletter/${from}`)}
              saveLabel={isPending ? "SENDING..." : "SEND"}
              cancelLabel="CANCEL"
              saveIcon={Send}
              isSubmitting={isPending}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
