"use client";
import React from "react";
import Image from "next/image";
import { resolveMediaUrl } from "@/lib/utils";
import type { ThemeColors, SliderItem } from "./types";

function Variant1({ sliders, colors }: { sliders: SliderItem[]; colors?: ThemeColors }) {
  const [active, setActive] = React.useState(0);
  const primary = colors?.primary_color || "#3b82f6";
  const text    = colors?.text_color    || "#1f2937";

  React.useEffect(() => {
    if (sliders.length < 2) return;
    const t = setInterval(() => setActive(p => (p + 1) % sliders.length), 3000);
    return () => clearInterval(t);
  }, [sliders.length]);

  if (!sliders.length) return (
    <div className="h-[380px] flex items-center justify-center text-gray-400 text-sm" style={{ background: `${primary}10` }}>
      No sliders added yet
    </div>
  );

  const slide = sliders[active];

  return (
    <section className="relative w-full h-[420px] overflow-hidden">
      {sliders.map((s, i) => (
        <div key={s.id} className={`absolute inset-0 transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0"}`}>
          <Image src={resolveMediaUrl(s.image_path)} alt={s.title} fill className="object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)" }} />
        </div>
      ))}
      <div className="absolute bottom-12 left-0 right-0 text-center px-8 z-10">
        <h2 className="text-4xl font-black text-white leading-tight mb-3">{slide.title}</h2>
        {slide.description && <p className="text-white/80 text-base max-w-xl mx-auto">{slide.description}</p>}
        <button className="mt-6 px-8 py-3 rounded-full font-bold text-white shadow-lg" style={{ backgroundColor: slide.button_color || primary }}>
          {slide.button_label}
        </button>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {sliders.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} className="h-2 rounded-full transition-all"
            style={{ width: i === active ? 24 : 8, backgroundColor: i === active ? "white" : "rgba(255,255,255,0.4)" }} />
        ))}
      </div>
    </section>
  );
}

function Variant2({ sliders, colors }: { sliders: SliderItem[]; colors?: ThemeColors }) {
  const primary   = colors?.primary_color   || "#3b82f6";
  const secondary = colors?.secondary_color || "#1e40af";
  const text      = colors?.text_color      || "#1f2937";
  const slide     = sliders[0];

  if (!slide) return (
    <div className="h-[380px] flex items-center justify-center text-gray-400 text-sm" style={{ background: `${primary}10` }}>
      No sliders added yet
    </div>
  );

  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 min-h-[380px]">
      <div className="flex flex-col justify-center px-10 py-12 gap-5" style={{ backgroundColor: `${primary}11` }}>
        <h2 className="text-3xl font-black leading-tight" style={{ color: text }}>{slide.title}</h2>
        {slide.description && <p className="text-gray-500 leading-relaxed text-sm">{slide.description}</p>}
        <button className="self-start px-6 py-2.5 rounded-lg text-white text-sm font-bold" style={{ backgroundColor: slide.button_color || primary }}>
          {slide.button_label}
        </button>
      </div>
      <div className="relative min-h-[280px]">
        <Image src={resolveMediaUrl(slide.image_path)} alt={slide.title} fill className="object-cover" />
      </div>
    </section>
  );
}

export default function SimpleSlider({ variant, colors, sliders = [] }: { variant: string; colors?: ThemeColors; sliders?: SliderItem[] }) {
  if (variant === "variant_2") return <Variant2 sliders={sliders} colors={colors} />;
  return <Variant1 sliders={sliders} colors={colors} />;
}
