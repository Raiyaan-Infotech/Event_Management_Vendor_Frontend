"use client";
import React from "react";
import Image from "next/image";
import { resolveMediaUrl } from "@/lib/utils";
import type { ThemeColors, TestimonialItem } from "./types";

function Variant1({ items, colors }: { items: TestimonialItem[]; colors?: ThemeColors }) {
  const primary = colors?.primary_color || "#3b82f6";
  const text    = colors?.text_color    || "#1f2937";

  if (!items.length) return (
    <div className="py-14 text-center text-gray-400 text-sm">No testimonials added yet</div>
  );

  return (
    <section className="w-full px-8 py-14" style={{ background: `${primary}08` }}>
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: primary }}>Testimonials</span>
        <h2 className="text-2xl font-black mt-2" style={{ color: text }}>What Our Clients Say</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map(t => (
          <div key={t.id} className="bg-white rounded-2xl p-6 shadow-sm border flex flex-col gap-4" style={{ borderColor: `${primary}22` }}>
            <p className="text-3xl" style={{ color: primary }}>"</p>
            <p className="text-sm text-gray-500 leading-relaxed flex-1">{t.client_feedback}</p>
            <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: `${primary}22` }}>
              <div className="h-9 w-9 rounded-full overflow-hidden shrink-0 border flex items-center justify-center" style={{ backgroundColor: `${primary}20` }}>
                {t.customer_portrait ? (
                  <Image src={resolveMediaUrl(t.customer_portrait)} alt={t.customer_name} width={36} height={36} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-sm font-bold" style={{ color: primary }}>{t.customer_name.charAt(0)}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: text }}>{t.customer_name}</p>
                <p className="text-xs text-gray-400">{t.event_name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Variant2({ items, colors }: { items: TestimonialItem[]; colors?: ThemeColors }) {
  const [active, setActive] = React.useState(0);
  const primary = colors?.primary_color || "#3b82f6";
  const text    = colors?.text_color    || "#1f2937";

  if (!items.length) return (
    <div className="py-14 text-center text-gray-400 text-sm">No testimonials added yet</div>
  );

  const t = items[active];

  return (
    <section className="w-full px-8 py-14">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: primary }}>Testimonials</span>
        <h2 className="text-2xl font-black mt-2" style={{ color: text }}>Client Stories</h2>
      </div>
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <p className="text-5xl" style={{ color: primary }}>"</p>
        <p className="text-base text-gray-500 leading-relaxed italic">{t.client_feedback}</p>
        <div className="flex flex-col items-center gap-2">
          <div className="h-14 w-14 rounded-full overflow-hidden border flex items-center justify-center" style={{ backgroundColor: `${primary}20` }}>
            {t.customer_portrait ? (
              <Image src={resolveMediaUrl(t.customer_portrait)} alt={t.customer_name} width={56} height={56} className="object-cover w-full h-full" />
            ) : (
              <span className="text-xl font-bold" style={{ color: primary }}>{t.customer_name.charAt(0)}</span>
            )}
          </div>
          <p className="font-bold text-sm" style={{ color: text }}>{t.customer_name}</p>
          <p className="text-xs text-gray-400">{t.event_name}</p>
        </div>
        <div className="flex justify-center gap-2">
          {items.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} className="h-2 rounded-full transition-all"
              style={{ width: i === active ? 24 : 8, backgroundColor: i === active ? primary : "#d1d5db" }} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Testimonial({ variant, colors, items = [] }: { variant: string; colors?: ThemeColors; items?: TestimonialItem[] }) {
  if (variant === "variant_2") return <Variant2 items={items} colors={colors} />;
  return <Variant1 items={items} colors={colors} />;
}
