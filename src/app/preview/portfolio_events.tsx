"use client";
import React from "react";
import Image from "next/image";
import { resolveMediaUrl } from "@/lib/utils";
import type { ThemeColors, PortfolioItem } from "./types";

function Variant1({ items, colors }: { items: PortfolioItem[]; colors?: ThemeColors }) {
  const primary = colors?.primary_color || "#3b82f6";
  const text    = colors?.text_color    || "#1f2937";

  if (!items.length) return (
    <div className="py-14 text-center text-gray-400 text-sm">No event highlights added yet</div>
  );

  return (
    <section className="w-full px-8 py-14">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: primary }}>Portfolio</span>
        <h2 className="text-2xl font-black mt-2" style={{ color: text }}>Our Event Highlights</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map(item => (
          <div key={item.id} className="rounded-2xl overflow-hidden border hover:shadow-md transition-shadow">
            <div className="h-40 relative bg-gray-100">
              {item.image_path ? (
                <Image src={resolveMediaUrl(item.image_path)} alt={item.label || "Event"} fill className="object-cover" />
              ) : (
                <div className="h-full flex items-center justify-center text-3xl" style={{ background: `${primary}15` }}>🎊</div>
              )}
            </div>
            <div className="p-4">
              <p className="font-bold text-sm" style={{ color: text }}>{item.label || "Event"}</p>
              {item.value && <p className="text-xs text-gray-400 mt-0.5">{item.value}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Variant2({ items, colors }: { items: PortfolioItem[]; colors?: ThemeColors }) {
  const primary = colors?.primary_color || "#3b82f6";
  const text    = colors?.text_color    || "#1f2937";

  if (!items.length) return (
    <div className="py-14 text-center text-gray-400 text-sm">No event highlights added yet</div>
  );

  return (
    <section className="w-full px-8 py-14">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: primary }}>Portfolio</span>
        <h2 className="text-2xl font-black mt-2" style={{ color: text }}>Event Showcase</h2>
      </div>
      <div className="flex flex-col gap-4">
        {items.map((item, i) => (
          <div key={item.id} className="flex items-center gap-5 p-4 rounded-xl border hover:shadow-sm transition-shadow" style={{ borderColor: `${primary}22` }}>
            <div className="h-16 w-20 rounded-lg overflow-hidden relative shrink-0 bg-gray-100">
              {item.image_path ? (
                <Image src={resolveMediaUrl(item.image_path)} alt={item.label || "Event"} fill className="object-cover" />
              ) : (
                <div className="h-full flex items-center justify-center text-2xl" style={{ background: `${primary}15` }}>🎉</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate" style={{ color: text }}>{item.label || "Event"}</p>
              {item.value && <p className="text-xs text-gray-400">{item.value}</p>}
            </div>
            <span className="text-lg font-black shrink-0 opacity-20" style={{ color: primary }}>
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function PortfolioEvents({ variant, colors, items = [] }: { variant: string; colors?: ThemeColors; items?: PortfolioItem[] }) {
  if (variant === "variant_2") return <Variant2 items={items} colors={colors} />;
  return <Variant1 items={items} colors={colors} />;
}
