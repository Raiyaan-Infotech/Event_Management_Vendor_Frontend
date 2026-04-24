"use client";
import React from "react";
import Image from "next/image";
import { resolveMediaUrl } from "@/lib/utils";
import type { ThemeColors, PortfolioItem } from "./types";

function Variant1({ items, colors }: { items: PortfolioItem[]; colors?: ThemeColors }) {
  const primary = colors?.primary_color || "#3b82f6";
  const text    = colors?.text_color    || "#1f2937";

  if (!items.length) return (
    <div className="py-14 text-center text-gray-400 text-sm">No client logos added yet</div>
  );

  return (
    <section className="w-full px-8 py-14">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: primary }}>Our Clients</span>
        <h2 className="text-2xl font-black mt-2" style={{ color: text }}>Trusted by Leading Brands</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className="h-20 rounded-xl border flex items-center justify-center overflow-hidden" style={{ borderColor: `${primary}33` }}>
            {item.image_path ? (
              <Image src={resolveMediaUrl(item.image_path)} alt={item.label || "Client"} width={100} height={60} className="object-contain max-h-14 px-3" />
            ) : (
              <span className="text-sm font-bold text-gray-400">{item.label || "Client"}</span>
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
    <div className="py-14 text-center text-gray-400 text-sm">No client logos added yet</div>
  );

  return (
    <section className="w-full px-8 py-14 overflow-hidden">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: primary }}>Our Clients</span>
        <h2 className="text-2xl font-black mt-2" style={{ color: text }}>Brands That Trust Us</h2>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-2">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="inline-flex items-center justify-center h-16 px-6 rounded-full border shrink-0 overflow-hidden" style={{ borderColor: `${primary}33` }}>
            {item.image_path ? (
              <Image src={resolveMediaUrl(item.image_path)} alt={item.label || "Client"} width={80} height={40} className="object-contain max-h-10" />
            ) : (
              <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">{item.label || "Client"}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function PortfolioClients({ variant, colors, items = [] }: { variant: string; colors?: ThemeColors; items?: PortfolioItem[] }) {
  if (variant === "variant_2") return <Variant2 items={items} colors={colors} />;
  return <Variant1 items={items} colors={colors} />;
}
