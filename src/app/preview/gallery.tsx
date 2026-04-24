"use client";
import React from "react";
import Image from "next/image";
import { resolveMediaUrl } from "@/lib/utils";
import type { ThemeColors, GalleryGroup } from "./types";

function Variant1({ groups, colors }: { groups: GalleryGroup[]; colors?: ThemeColors }) {
  const primary = colors?.primary_color || "#3b82f6";
  const text    = colors?.text_color    || "#1f2937";
  const allImages = groups.flatMap(g => (g.images || []).map(img => ({ src: img, group: g.event_name })));

  if (!allImages.length) return (
    <div className="py-14 text-center text-gray-400 text-sm">No gallery images added yet</div>
  );

  return (
    <section className="w-full px-8 py-14">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: primary }}>Gallery</span>
        <h2 className="text-2xl font-black mt-2" style={{ color: text }}>Event Gallery</h2>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {allImages.slice(0, 9).map((img, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer">
            <Image src={resolveMediaUrl(img.src)} alt={img.group} fill className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}

function Variant2({ groups, colors }: { groups: GalleryGroup[]; colors?: ThemeColors }) {
  const primary = colors?.primary_color || "#3b82f6";
  const text    = colors?.text_color    || "#1f2937";
  const allImages = groups.flatMap(g => (g.images || []).map(img => ({ src: img, group: g.event_name })));

  if (!allImages.length) return (
    <div className="py-14 text-center text-gray-400 text-sm">No gallery images added yet</div>
  );

  const heights = [160, 220, 180, 240, 160, 200, 180];

  return (
    <section className="w-full px-8 py-14">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: primary }}>Gallery</span>
        <h2 className="text-2xl font-black mt-2" style={{ color: text }}>Moments & Memories</h2>
      </div>
      <div className="columns-2 md:columns-3 gap-3 space-y-3">
        {allImages.slice(0, 7).map((img, i) => (
          <div key={i} className="break-inside-avoid rounded-xl overflow-hidden relative mb-3 hover:scale-105 transition-transform cursor-pointer"
            style={{ height: heights[i % heights.length] }}>
            <Image src={resolveMediaUrl(img.src)} alt={img.group} fill className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Gallery({ variant, colors, groups = [] }: { variant: string; colors?: ThemeColors; groups?: GalleryGroup[] }) {
  if (variant === "variant_2") return <Variant2 groups={groups} colors={colors} />;
  return <Variant1 groups={groups} colors={colors} />;
}
