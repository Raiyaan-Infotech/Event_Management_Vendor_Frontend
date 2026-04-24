"use client";
import React from "react";
import type { ThemeColors, SubscriptionPlan } from "./types";

interface SubscriptionProps {
  variant: string;
  colors?: ThemeColors;
  plans?: SubscriptionPlan[];
}

const DEFAULT_PLANS = [
  { name: "Starter",      price: "$29",  features: "5 Events/year\nBasic Support\nStandard Templates",                               popular: false },
  { name: "Professional", price: "$79",  features: "Unlimited Events\nPriority Support\nPremium Templates\nAnalytics Dashboard",    popular: true  },
  { name: "Enterprise",   price: "$149", features: "Everything in Pro\nDedicated Manager\nCustom Branding\nAPI Access",             popular: false },
];

function Variant1({ colors, plans }: { colors?: ThemeColors; plans: any[] }) {
  const primary = colors?.primary_color || "#3b82f6";
  const text    = colors?.text_color    || "#1f2937";

  return (
    <section className="w-full px-8 py-14">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: primary }}>Pricing</span>
        <h2 className="text-2xl font-black mt-2" style={{ color: text }}>Choose Your Plan</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {plans.map((plan, i) => {
          const isPopular = plan.popular || i === 1; // Fallback popular to middle one
          const features = typeof plan.features === "string" ? plan.features.split("\n") : [];

          return (
            <div key={plan.id || plan.name} className="rounded-2xl p-6 border-2 flex flex-col gap-4"
              style={{ borderColor: isPopular ? primary : `${primary}33`, background: isPopular ? `${primary}08` : "white" }}>
              {isPopular && <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full text-white self-start" style={{ backgroundColor: primary }}>Most Popular</span>}
              <div>
                <p className="font-black text-lg" style={{ color: text }}>{plan.name}</p>
                <div className="flex items-end gap-1 mt-1">
                  <span className="text-3xl font-black" style={{ color: primary }}>${plan.discounted_price || plan.price}</span>
                  <span className="text-xs text-gray-400 mb-1">/mo</span>
                </div>
              </div>
              <ul className="space-y-2 flex-1">
                {features.map((f: string) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="h-4 w-4 rounded-full flex items-center justify-center text-white text-[10px] shrink-0" style={{ backgroundColor: primary }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-2.5 rounded-lg text-sm font-bold border-2"
                style={{ borderColor: primary, backgroundColor: isPopular ? primary : "transparent", color: isPopular ? "white" : primary }}>
                Get Started
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Variant2({ colors, plans }: { colors?: ThemeColors; plans: any[] }) {
  const primary = colors?.primary_color || "#3b82f6";
  const text    = colors?.text_color    || "#1f2937";

  return (
    <section className="w-full px-8 py-14 overflow-x-auto">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: primary }}>Pricing</span>
        <h2 className="text-2xl font-black mt-2" style={{ color: text }}>Compare Plans</h2>
      </div>
      <table className="w-full min-w-[560px] border-collapse">
        <thead>
          <tr>
            <th className="text-left p-3 text-sm text-gray-400 font-semibold">Feature</th>
            {plans.map((p, i) => (
              <th key={p.id || p.name} className="p-3 text-center text-sm font-black" style={{ color: i === 1 ? primary : text }}>
                {p.name}<br /><span className="text-xs font-normal text-gray-400">${p.price}/mo</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
           {/* Summary of features table logic — can be enhanced further */}
           {plans[0]?.features?.split("\n").map((feat: string, ri: number) => (
             <tr key={ri} className={ri % 2 === 0 ? "bg-gray-50" : ""}>
               <td className="p-3 text-sm text-gray-600">{feat}</td>
               {plans.map((p, ci) => (
                 <td key={ci} className="p-3 text-center text-sm font-semibold"
                   style={{ color: ci === 1 ? primary : text }}>✓</td>
               ))}
             </tr>
           ))}
        </tbody>
      </table>
    </section>
  );
}

export default function Subscription({ variant, colors, plans }: SubscriptionProps) {
  const activePlans = plans && plans.length > 0 ? plans : DEFAULT_PLANS;

  if (variant === "variant_2") return <Variant2 colors={colors} plans={activePlans} />;
  return <Variant1 colors={colors} plans={activePlans} />;
}
