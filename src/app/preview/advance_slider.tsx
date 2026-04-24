"use client";
import React from "react";
import Image from "next/image";
import { resolveMediaUrl } from "@/lib/utils";
import type { ThemeColors, SliderItem } from "./types";

function Variant1({ sliders, colors }: { sliders: SliderItem[]; colors?: ThemeColors }) {
  const [active, setActive] = React.useState(0);
  const primary   = colors?.primary_color   || "#3b82f6";
  const secondary = colors?.secondary_color || "#1e40af";

  React.useEffect(() => {
    if (sliders.length < 2) return;
    const t = setInterval(() => setActive(p => (p + 1) % sliders.length), 3000);
    return () => clearInterval(t);
  }, [sliders.length]);

  if (!sliders.length) return (
    <div className="h-[500px] flex items-center justify-center text-gray-400 text-sm" style={{ background: `linear-gradient(160deg, ${secondary}, ${primary})` }}>
      <p className="text-white/60">No sliders added yet</p>
    </div>
  );

  const slide = sliders[active];

  return (
    <section className="relative w-full min-h-[500px] overflow-hidden">
      <Image src={resolveMediaUrl(slide.image_path)} alt={slide.title} fill className="object-cover" />
      <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${(slide.overlay_opacity ?? 40) / 100})` }} />
      <div className={`absolute inset-0 flex flex-col justify-end pb-14 px-10 z-10 ${slide.content_alignment === "center" ? "items-center text-center" : slide.content_alignment === "right" ? "items-end text-right" : "items-start text-left"}`}>
        <h1 className="text-5xl font-black leading-tight mb-4 max-w-2xl" style={{ color: slide.title_color || "#ffffff" }}>{slide.title}</h1>
        {slide.description && (
          <p className="text-base max-w-lg mb-8" style={{ color: slide.description_color || "rgba(255,255,255,0.75)" }}>{slide.description}</p>
        )}
        <button className="px-8 py-3 bg-white font-bold rounded-lg text-sm" style={{ color: slide.button_color || primary }}>
          {slide.button_label}
        </button>
      </div>
    </section>
  );
}

function Variant2({ sliders, colors }: { sliders: SliderItem[]; colors?: ThemeColors }) {
  const [active, setActive] = React.useState(0);
  const primary = colors?.primary_color || "#3b82f6";

  if (!sliders.length) return (
    <div className="h-[420px] flex items-center justify-center text-gray-400 text-sm bg-gray-50">No sliders added yet</div>
  );

  return (
    <section className="w-full">
      <div className="relative h-[340px] overflow-hidden">
        <Image src={resolveMediaUrl(sliders[active].image_path)} alt={sliders[active].title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h2 className="text-4xl font-black text-white text-center px-8">{sliders[active].title}</h2>
        </div>
      </div>
      <div className="flex gap-2 p-3 bg-gray-50 border-t overflow-x-auto">
        {sliders.map((s, i) => (
          <button key={i} onClick={() => setActive(i)}
            className="flex-shrink-0 h-16 w-28 rounded-md overflow-hidden border-2 transition-all relative"
            style={{ borderColor: i === active ? primary : "transparent" }}>
            <Image src={resolveMediaUrl(s.image_path)} alt={s.title} fill className="object-cover" />
          </button>
        ))}
      </div>
    </section>
  );
}

export default function AdvanceSlider({ variant, colors, sliders = [] }: { variant: string; colors?: ThemeColors; sliders?: SliderItem[] }) {
  if (variant === "variant_2") return <Variant2 sliders={sliders} colors={colors} />;
  return <Variant1 sliders={sliders} colors={colors} />;
}
