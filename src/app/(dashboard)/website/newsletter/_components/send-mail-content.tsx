"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Send, Globe, UserCheck, Check, ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import { cn } from "@/lib/utils";
import { useEmailCategories, useEmailTemplatesByCategory } from "@/hooks/use-email-categories";
import { useNewsletterSubscribers, useNewsletterUnsubscribers, useSendNewsletter } from "@/hooks/use-newsletter";

const USER_TYPE_OPTIONS = [
  { value: "Guest",      label: "Guest",      icon: Globe,      color: "blue" },
  { value: "Registered", label: "Registered", icon: UserCheck,  color: "emerald" },
] as const;

const PLAN_OPTIONS = [
  { value: "silver",   label: "Silver Plan" },
  { value: "gold",     label: "Gold Plan" },
  { value: "platinum", label: "Platinum Plan" },
  { value: "standard", label: "Standard" },
];

export default function SendMailContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const from         = searchParams.get("from") ?? "subscribers";

  const [userType,    setUserType]    = useState<"Guest" | "Registered">("Registered");
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [categoryId,  setCategoryId]  = useState<number | null>(null);
  const [templateId,  setTemplateId]  = useState<number | null>(null);

  const { data: categories = [], isLoading: catsLoading } = useEmailCategories();
  const { data: templates  = [], isLoading: tmplLoading  } = useEmailTemplatesByCategory(categoryId);
  const { data: subscribers = [] } = useNewsletterSubscribers();
  const { data: unsubscribers = [] } = useNewsletterUnsubscribers();
  const { mutate: sendNewsletter, isPending } = useSendNewsletter();

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

    // Active subscribers count
    const activeCount = filtered.filter(item => item.is_active === 1).length;

    // Segment label
    let segment = "All Plans";
    if (userType === "Guest") {
      segment = "Guest";
    } else if (selectedPlans.length > 0) {
      segment = selectedPlans.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(", ");
    }

    return {
      totalRecipients: filtered.length,
      activeCount,
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
      { userType, plans: userType === "Registered" ? selectedPlans : [], categoryId, templateId },
      {
        onSuccess: (data) => {
          const count = data?.count || 0;
          toast.success(`Newsletter sent to ${count} recipients!`);
          router.push("/website/newsletter/mail-status");
        },
        onError: () => {
          toast.error("Failed to send newsletter");
        },
      }
    );
  };

  const selectedCategory = categories.find(c => c.id === categoryId);
  const selectedTemplate = templates.find(t => t.id === templateId);

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar bg-[#F8FAFC] dark:bg-black/40">

      {/* Header */}
      <div className="max-w-[1700px] mx-auto mb-8">
        <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1 font-poppins">Send Newsletter</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-tight">Configure your audience and select a template to start your campaign.</p>
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom duration-1000 pb-10">

        {/* Left: 9 cols - Form + Stats in ONE card */}
        <div className="lg:col-span-9 relative z-0">
          <div className="bg-white dark:bg-sidebar p-8 md:p-10 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border-none">
            <div className="grid grid-cols-3 gap-8">

              {/* Form Section - 2 cols */}
              <div className="col-span-2 space-y-10">

                {/* Top Row: User Type | Plan Filter */}
                <div className="grid grid-cols-2 gap-8">

                  {/* User Type */}
                  <div className="space-y-5">
                    <Label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">User Type</Label>
                    <div className="inline-flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-xl">
                      {USER_TYPE_OPTIONS.map((opt) => {
                        const isActive = userType === opt.value;
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setUserType(opt.value)}
                            className={cn(
                              "flex items-center gap-2 px-5 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all duration-200",
                              isActive
                                ? "bg-white dark:bg-sidebar shadow-sm text-gray-800 dark:text-white"
                                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            )}
                          >
                            <Icon size={14} className={isActive ? "text-blue-500" : ""} />
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Plan Filter - Dropdown Multi Select */}
                  <div className="space-y-5">
                    <Label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Plan Filter</Label>
                    <Popover>
                      <PopoverTrigger asChild disabled={userType === "Guest"}>
                        <button className="h-12 w-full px-4 rounded-xl text-sm font-bold border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus:ring-4 focus:ring-amber-500/10 transition-all border text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10">
                          <span className={selectedPlans.length === 0 ? "text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-white"}>
                            {selectedPlans.length === 0
                              ? "All Plans"
                              : selectedPlans.length === PLAN_OPTIONS.length
                              ? "All Plans Selected"
                              : `${selectedPlans.length} Plan${selectedPlans.length !== 1 ? 's' : ''} Selected`}
                          </span>
                          <ChevronDown size={16} className="text-gray-400" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-2 rounded-xl border-gray-200 dark:border-white/10">
                        <div className="space-y-1">
                          {PLAN_OPTIONS.map(o => (
                            <button
                              key={o.value}
                              onClick={() => togglePlan(o.value)}
                              className={cn(
                                "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold transition-all text-left",
                                selectedPlans.includes(o.value)
                                  ? "bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300"
                                  : "hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-400"
                              )}
                            >
                              <div className={cn(
                                "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all",
                                selectedPlans.includes(o.value)
                                  ? "bg-blue-500 border-blue-500"
                                  : "border-gray-300 dark:border-gray-600"
                              )}>
                                {selectedPlans.includes(o.value) && (
                                  <Check size={12} className="text-white" />
                                )}
                              </div>
                              <span>{o.label}</span>
                            </button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

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

                  {/* Active Subscribers */}
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeCount.toLocaleString()}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Active subscribers</p>
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
              onCancel={() => router.push(`/website/newsletter/${from}`)}
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
