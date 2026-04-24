"use client";
import React from "react";
import Image from "next/image";
import { resolveMediaUrl } from "@/lib/utils";
import type { ThemeColors, PortfolioItem } from "./types";

function Variant1({ items, colors }: { items: PortfolioItem[]; colors?: ThemeColors }) {
  const primary = colors?.primary_color || "#3b82f6";
  const text    = colors?.text_color    || "#1f2937";

  if (!items.length) return (
    <div className="py-14 text-center text-gray-400 text-sm">No sponsor logos added yet</div>
  );

  return (
    <section className="w-full px-8 py-14">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: primary }}>Sponsors</span>
        <h2 className="text-2xl font-black mt-2" style={{ color: text }}>Our Proud Sponsors</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
        {items.map(item => (
          <div key={item.id} className="h-24 rounded-xl border-2 flex items-center justify-center overflow-hidden" style={{ borderColor: `${primary}33` }}>
            {item.image_path ? (
              <Image src={resolveMediaUrl(item.image_path)} alt={item.label || "Sponsor"} width={120} height={70} className="object-contain max-h-16 px-4" />
            ) : (
              <span className="font-bold text-sm text-gray-400">{item.label || "Sponsor"}</span>
            )}
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
    <div className="py-14 text-center text-gray-400 text-sm">No sponsor logos added yet</div>
  );

  return (
    <section className="w-full px-8 py-14">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: primary }}>Sponsors</span>
        <h2 className="text-2xl font-black mt-2" style={{ color: text }}>Sponsors & Partners</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border" style={{ borderColor: `${primary}22` }}>
            <div className="h-12 w-12 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border" style={{ borderColor: `${primary}33` }}>
              {item.image_path ? (
                <Image src={resolveMediaUrl(item.image_path)} alt={item.label || "Sponsor"} width={48} height={48} className="object-contain" />
              ) : (
                <span className="font-black text-lg" style={{ color: primary }}>{(item.label || "S").charAt(0)}</span>
              )}
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: text }}>{item.label || "Sponsor"}</p>
              {item.value && <p className="text-xs text-gray-400">{item.value}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function PortfolioSponsors({ variant, colors, items = [] }: { variant: string; colors?: ThemeColors; items?: PortfolioItem[] }) {
  if (variant === "variant_2") return <Variant2 items={items} colors={colors} />;
  return <Variant1 items={items} colors={colors} />;
}
