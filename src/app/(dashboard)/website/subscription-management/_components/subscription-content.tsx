"use client";

import { CreditCard, Star, Clock, Zap } from "lucide-react";
import { useVendorSubscription, SubscriptionPlan } from "@/hooks/use-vendor-subscription";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/common/PageHeader";

const formatPrice = (price: string | null) => {
  if (!price || Number(price) === 0) return "Free";
  return `₹${Number(price).toLocaleString("en-IN")}`;
};

// ── Plan Card ────────────────────────────────────────────────────────────────

function PlanCard({ plan, isCustom }: { plan: SubscriptionPlan; isCustom: boolean }) {
  const hasDiscount = plan.discounted_price && Number(plan.discounted_price) > 0;

  return (
    <div className={`relative bg-white dark:bg-sidebar rounded-[2.5rem] border overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-none transition-all ${
      isCustom ? "border-purple-200 dark:border-purple-500/30" : "border-border"
    }`}>
      {/* Top accent bar */}
      <div className={`h-1.5 w-full ${isCustom ? "bg-gradient-to-r from-purple-500 to-violet-500" : "bg-gradient-to-r from-primary to-blue-500"}`} />

      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isCustom ? "bg-purple-500/10 text-purple-600" : "bg-primary/10 text-primary"
            }`}>
              {isCustom ? <Star size={22} strokeWidth={2.5} /> : <CreditCard size={22} strokeWidth={2.5} />}
            </div>
            <div>
              <h3 className="text-[18px] font-black uppercase tracking-tight text-foreground">{plan.name}</h3>
              {plan.description && (
                <p className="text-[12px] text-muted-foreground font-medium mt-0.5">{plan.description}</p>
              )}
            </div>
          </div>

          {/* Badge */}
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
            isCustom
              ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
              : "bg-primary/10 text-primary"
          }`}>
            {isCustom ? "Custom Plan" : "Common Plan"}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-end gap-3 mb-6">
          <span className={`text-4xl font-black tracking-tight ${isCustom ? "text-purple-600" : "text-primary"}`}>
            {formatPrice(plan.discounted_price ?? plan.price)}
          </span>
          {hasDiscount && (
            <span className="text-[16px] font-bold text-muted-foreground line-through mb-1">
              {formatPrice(plan.price)}
            </span>
          )}
          {plan.validity && (
            <span className="text-[12px] font-bold text-muted-foreground mb-1">/ {plan.validity} days</span>
          )}
        </div>

        {/* Validity pill */}
        {plan.validity && (
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full">
              <Clock size={13} className="text-muted-foreground" />
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                Valid for {plan.validity} days
              </span>
            </div>
          </div>
        )}

        {/* Features */}
        {plan.features && (
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Features Included
            </p>
            <div
              className={`prose prose-sm max-w-none text-foreground [&_p]:text-[13px] [&_p]:font-medium [&_p]:my-1 [&_ul]:space-y-1 [&_li]:text-[13px] [&_li]:font-medium ${
                isCustom ? "[&_a]:text-purple-600" : "[&_a]:text-primary"
              }`}
              dangerouslySetInnerHTML={{ __html: plan.features }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function SubscriptionContent() {
  const { data, isLoading, isError } = useVendorSubscription();

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-86px)] overflow-y-auto bg-[#F8FAFC] dark:bg-black/40">
        <div className="max-w-[1700px] mx-auto px-6 py-8 space-y-8">
          <Skeleton className="h-12 w-64 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-72 rounded-[2.5rem]" />)}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="h-[calc(100vh-86px)] flex items-center justify-center bg-[#F8FAFC] dark:bg-black/40">
        <div className="text-center">
          <Zap size={40} className="mx-auto text-muted mb-3" />
          <p className="text-[14px] font-bold text-muted-foreground">Failed to load subscription</p>
        </div>
      </div>
    );
  }

  const isCustom = data.type === "custom";

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto custom-scrollbar bg-[#F8FAFC] dark:bg-black/40">
      <div className="max-w-[1700px] mx-auto px-6 py-8">

        <PageHeader
          title="Subscription"
          subtitle={
            isCustom
              ? "You have a custom plan assigned to your account."
              : "Choose from our available subscription plans."
          }
          total={data.plans.length}
        />

        {/* Info banner for custom plan */}
        {isCustom && (
          <div className="mt-6 flex items-center gap-3 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-2xl px-5 py-3">
            <Star size={16} className="text-purple-500 shrink-0" />
            <p className="text-[13px] font-bold text-purple-700 dark:text-purple-300">
              This is a custom plan exclusively assigned to your account by the administrator.
            </p>
          </div>
        )}

        {/* Plan cards */}
        <div className={`mt-8 grid gap-6 ${
          data.plans.length === 1
            ? "grid-cols-1 max-w-[520px]"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}>
          {data.plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} isCustom={isCustom} />
          ))}
        </div>

      </div>
    </div>
  );
}
