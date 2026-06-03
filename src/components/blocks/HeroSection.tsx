"use client";

import React from "react";
import Image from "next/image";
import { resolveMediaUrl } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";

const EMPTY_HERO_DEFAULT = {
  title: "",
  heading: "",
  description: "",
  button: "",
  button2: "",
  image_url: "",
  bg_image_url: "",
  stat1_val: "",
  stat1_lbl: "",
  stat1_sub: "",
  stat2_val: "",
  stat2_lbl: "",
  stat2_sub: "",
  stat3_val: "",
  stat3_lbl: "",
  stat3_sub: "",
};

export const HERO_DEFAULTS = Object.fromEntries(
  Array.from({ length: 23 }, (_, index) => [`variant_${index + 1}`, EMPTY_HERO_DEFAULT]),
) as Record<string, typeof EMPTY_HERO_DEFAULT>;

export default function HeroSection({ data, settings }: { data?: any; settings?: Record<string, any> }) {
  const colors = data?.colors || {};
  const primary   = colors.primary_color   || "#4f46e5";
  const secondary = colors.secondary_color || "#60a5fa";
  const headerCol = colors.header_color    || "#2563eb";
  const footerCol = colors.footer_color    || "#1e3a8a";
  const hoverCol  = colors.hover_color     || "#1d4ed8";
  const textCol   = colors.text_color      || "#0f172a";

  // â”€â”€â”€ Determine active variant â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Priority: settings?.variant (preview/builder) â†’ DB saved variant â†’ fallback
  const dbHero = data?.heroSection ?? data?.hero_section ?? null;
  const activeVariant: string =
    settings?.variant || dbHero?.variant || "variant_1";

  // â”€â”€â”€ Merge DB data with HERO_DEFAULTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // DB values are the content source of truth. Empty fields stay empty so the
  // hero block does not show demo text before the vendor edits it.
  const def = (HERO_DEFAULTS as any)[activeVariant] || HERO_DEFAULTS.variant_1;

  const hero = {
    title:       (dbHero?.title       ?? "") || def.title       || "",
    heading:     (dbHero?.heading     ?? "") || def.heading     || "",
    description: (dbHero?.description ?? "") || def.description || "",
    button:      (dbHero?.button      ?? "") || def.button      || "",
    button2:     (dbHero?.button2     ?? "") || def.button2     || "",
    image_url:   (dbHero?.image_url   ?? "") || def.image_url   || "",
    bg_image_url:(dbHero?.bg_image_url?? "") || def.bg_image_url|| "",
    page_id:     dbHero?.page_id  ?? null,
    page_id2:    dbHero?.page_id2 ?? null,
    stat1_val:   (dbHero?.stat1_val   ?? "") || def.stat1_val   || "",
    stat1_lbl:   (dbHero?.stat1_lbl   ?? "") || def.stat1_lbl   || "",
    stat1_sub:   (dbHero?.stat1_sub   ?? "") || def.stat1_sub   || "",
    stat2_val:   (dbHero?.stat2_val   ?? "") || def.stat2_val   || "",
    stat2_lbl:   (dbHero?.stat2_lbl   ?? "") || def.stat2_lbl   || "",
    stat2_sub:   (dbHero?.stat2_sub   ?? "") || def.stat2_sub   || "",
    stat3_val:   (dbHero?.stat3_val   ?? "") || def.stat3_val   || "",
    stat3_lbl:   (dbHero?.stat3_lbl   ?? "") || def.stat3_lbl   || "",
    stat3_sub:   (dbHero?.stat3_sub   ?? "") || def.stat3_sub   || "",
  };



  const pageId = hero.page_id;
  const getHref = () => {
    if (!pageId) return "#";
    if (data?.slug === "preview") {
      const base = data?.previewBaseUrl || "/preview";
      const [path, query = ""] = base.split("?");
      const params = new URLSearchParams(query);
      params.set("previewPage", "page");
      params.set("pageId", String(pageId));
      return `${path}?${params.toString()}`;
    }
    return data?.slug ? `/${data.slug}/pages/${pageId}` : "#";
  };

  const pageId2 = hero.page_id2;
  const getHref2 = () => {
    if (!pageId2) return "#";
    if (data?.slug === "preview") {
      const base = data?.previewBaseUrl || "/preview";
      const [path, query = ""] = base.split("?");
      const params = new URLSearchParams(query);
      params.set("previewPage", "page");
      params.set("pageId", String(pageId2));
      return `${path}?${params.toString()}`;
    }
    return data?.slug ? `/${data.slug}/pages/${pageId2}` : "#";
  };

  // ----------------------------------------------------
  // Variant 1: Default Grid Fallback
  // ----------------------------------------------------
  if (activeVariant === "variant_1") {
    let lines: string[] = [];
    if (hero.heading) {
      lines = hero.heading.split("\n").map((l: string) => l.trim()).filter(Boolean);
    }

    // Dynamic Heading Content: splits by newline to display line breaks nicely
    let headingContent;
    if (lines.length > 1) {
      headingContent = lines.map((line, idx) => (
        <span key={idx} className="block">
          {line}
        </span>
      ));
    } else {
      headingContent = <span className="block">{hero.heading}</span>;
    }

    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center overflow-hidden py-10 px-6 sm:px-8 md:px-16 lg:px-24 bg-[#FCFBF9] transition-all duration-300"
      >
        <style>{`
          @media (max-width: 1023px) {
            .variant1-gradient {
              background: linear-gradient(to bottom, #FCFBF9 0%, #FCFBF9f2 40%, #FCFBF9d9 70%, #FCFBF910 100%) !important;
            }
            .variant1-tint-gradient {
              background: linear-gradient(to bottom, ${headerCol || primary || "#ffffff"} 0%, ${headerCol || primary || "#ffffff"}e6 40%, transparent 100%) !important;
            }
          }
          @media (min-width: 1024px) {
            .variant1-gradient {
              background: linear-gradient(to right, #FCFBF9 0%, #FCFBF9f2 25%, #FCFBF9d9 45%, #FCFBF9a0 60%, #FCFBF910 85%, transparent 100%) !important;
            }
            .variant1-tint-gradient {
              background: linear-gradient(to right, ${headerCol || primary || "#ffffff"} 0%, ${headerCol || primary || "#ffffff"}e6 25%, transparent 75%) !important;
            }
          }
        `}</style>

        {/* Soft dynamic brand color tint overlayed at 4% opacity over white base, ensuring beautiful, dynamic matching while preserving high contrast */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none transition-all duration-300"
          style={{ backgroundColor: headerCol || primary, opacity: 0.04 }}
        />

        {/* Full-bleed widescreen background image on the right */}
        {hero.image_url && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src={resolveMediaUrl(hero.image_url)} 
              alt="Beauty & Events Background" 
              fill
              priority
              unoptimized
              className="object-cover object-right lg:object-center"
            />
            {/* Smooth transition gradient matching the palette's background */}
            <div 
              className="absolute inset-0 transition-all duration-300 variant1-gradient"
            />
            {/* Extra tint blend using 4% opacity of selected headerCol/primary to fade background image seamlessly */}
            <div 
              className="absolute inset-0 transition-all duration-300 variant1-tint-gradient"
              style={{
                opacity: 0.04
              }}
            />
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-center text-left py-12">
          <div className="max-w-2xl flex flex-col gap-6 md:gap-7">
            {/* Elegant upper sub-badge in primary color */}
            {hero.title && (
              <span 
                className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] md:tracking-[0.3em] inline-block animate-fade-in font-sans"
                style={{ color: primary }}
              >
                {hero.title}
              </span>
            )}
            
            {/* Elegant heading with Georgia Serif Italic highlight */}
            <h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] font-sans flex flex-col gap-1.5 select-text"
              style={{ color: textCol }}
            >
              {headingContent}
            </h1>
            
            {/* Description Paragraph */}
            {hero.description && (
              <p 
                className="text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-xl select-text font-sans"
                style={{ color: textCol, opacity: 0.85 }}
              >
                {hero.description}
              </p>
            )}
            
            {/* Two Side-by-Side CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              {/* Button 1: Solid Background */}
              {hero.button && (
                <a 
                  href={getHref()}
                  className="h-11 px-6 text-white font-bold text-sm tracking-wide rounded-sm shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 flex items-center justify-center font-sans"
                  style={{ 
                    backgroundColor: primary,
                    boxShadow: `0 4px 14px 0 ${primary}30`
                  }}
                >
                  {hero.button}
                </a>
              )}

              {/* Button 2: Outlined Border & Transparent Background */}
              {hero.button2 && (
                <a 
                  href={getHref2()}
                  className="h-11 px-6 font-bold text-sm tracking-wide rounded-sm border-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center bg-transparent font-sans"
                  style={{ 
                    color: primary,
                    borderColor: primary
                  }}
                >
                  {hero.button2}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // Variant 2: EventPress (Based on Image 1)
  // ----------------------------------------------------
  if (activeVariant === "variant_2") {
    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center justify-center overflow-hidden py-10 px-6 md:px-12"
      >
        {/* Background Image */}
        {hero.image_url && (
          <div className="absolute inset-0 z-0">
            <Image 
              src={resolveMediaUrl(hero.image_url)} 
              alt="EventPress Hero background" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-slate-950/45 lg:bg-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-slate-950/80 lg:to-transparent" />
          </div>
        )}

        {/* Content Centered */}
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6 md:space-y-8">
          {hero.title && (
            <span 
              className="text-white font-extrabold uppercase tracking-[0.2em] text-[11px] px-5 py-1.5 rounded-sm inline-block shadow-sm"
              style={{ backgroundColor: primary }}
            >
              {hero.title}
            </span>
          )}

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] font-sans">
            {hero.heading}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-200 font-medium leading-relaxed max-w-3xl mx-auto">
            {hero.description}
          </p>

          <div className="pt-4 flex justify-center">
            <a 
              href={getHref()}
              className="h-11 px-6 text-white font-bold text-sm tracking-wide rounded-sm transition-all duration-300 hover:scale-[1.02] shadow-md flex items-center justify-center uppercase active:scale-95"
              style={{ backgroundColor: primary }}
            >
              {hero.button}
            </a>
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // Variant 3: reMarkable Elegance (Based on Image 2)
  // ----------------------------------------------------
  if (activeVariant === "variant_3") {
    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center justify-center overflow-hidden py-10 px-6 sm:px-8 md:px-16 lg:px-24"
      >
        {/* Full-bleed background image with Next.js optimization */}
        {hero.bg_image_url && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src={resolveMediaUrl(hero.bg_image_url)} 
              alt="Hero Background" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
          </div>
        )}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Text / Search side */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6 md:space-y-8 max-w-2xl relative">
            
            {/* Sketchy Arrow Doodle above title */}
            <div className="absolute -top-14 right-24 hidden md:block select-none pointer-events-none">
              <svg width="74" height="49" viewBox="0 0 74 49" fill="none" className="text-yellow-500 animate-pulse">
                <path d="M1 21C20.5 25.5 35.5 15.5 31.5 5.5C27.5 -4.5 10.5 4.5 20.5 19.5C30.5 34.5 50.5 25.5 68.5 39M68.5 39L57.5 39.5M68.5 39L65.5 27.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-sans leading-[1.1] text-[#181e4b] tracking-tight">
              {hero.title && <span className="text-blue-600 dark:text-blue-500 mr-3 inline-block" style={{ color: primary }}>{hero.title}</span>}
              {hero.heading}
            </h1>
            
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
              {hero.description}
            </p>

            <div className="pt-4 flex items-center">
              <a 
                href={getHref()}
                className="h-11 px-6 text-white font-bold text-sm tracking-wide rounded-sm shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 group"
                style={{ 
                  backgroundColor: primary,
                  boxShadow: `0 4px 14px 0 ${primary}30`
                }}
              >
                {hero.button}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>

          </div>

          {/* Right Image side with floating card */}
          <div className="lg:col-span-5 flex items-center justify-center relative w-full h-[260px] sm:h-[320px] lg:h-[400px]">
            
            <div className="relative w-full h-full max-w-[360px] z-10 flex items-center justify-center">
              {hero.image_url && (
                <Image
                  src={resolveMediaUrl(hero.image_url)}
                  alt="Graphic banner cutout"
                  fill
                  priority
                  unoptimized
                  className="object-contain"
                />
              )}
            </div>
          </div>
        </div>

        {/* Small floating red dot on the far left */}
        <div className="absolute top-1/3 left-10 w-3.5 h-3.5 rounded-full bg-rose-500/80 animate-pulse hidden lg:block" />
      </section>
    );
  }

  // ----------------------------------------------------
  // Variant 4: Dark Luxury Stats-Card Layout (Premium Celebrations)
  // ----------------------------------------------------
  if (activeVariant === "variant_4") {
    // Split heading by newlines, dots, or default to single line
    let lines: string[] = [];
    if (hero.heading) {
      if (hero.heading.includes("\n")) {
        lines = hero.heading.split("\n").map((l: string) => l.trim()).filter(Boolean);
      } else if (hero.heading.includes(".")) {
        lines = hero.heading.split(".").map((l: string) => l.trim()).filter(Boolean).map((l: string, i: number, arr: string[]) => i < arr.length - 1 ? l + "." : l);
      } else {
        lines = [hero.heading];
      }
    }

    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center justify-center overflow-hidden py-10 px-6 sm:px-8 md:px-16 lg:px-24"
        style={{ backgroundColor: footerCol }}
      >
        {/* Widescreen background image */}
        {hero.image_url && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src={resolveMediaUrl(hero.image_url)} 
              alt="Luxury Background" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
            {/* Protective responsive overlay */}
            <div className="absolute inset-0 bg-slate-950/50 z-0 pointer-events-none" />
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-center text-left py-4">
          
          {/* Elegant Pill Badge */}
          {hero.title && (
            <div 
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-[11px] font-black tracking-[0.2em] uppercase w-fit animate-fade-in mb-8 shadow-sm backdrop-blur-md font-sans"
              style={{ 
                color: primary,
                borderColor: `${primary}35`,
                backgroundColor: `${primary}12`
              }}
            >
              <Sparkles size={12} className="animate-pulse" style={{ color: primary }} />
              <span>{hero.title}</span>
            </div>
          )}

          {/* Dynamic Stacked Heading */}
          <h1 
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] font-sans flex flex-col gap-2 max-w-4xl select-text"
            style={{ color: textCol }}
          >
            {lines.map((line, idx) => (
              <span key={idx} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/* Description */}
          {hero.description && (
            <p 
              className="text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl pt-4 select-text font-sans"
              style={{ color: textCol, opacity: 0.85 }}
            >
              {hero.description}
            </p>
          )}

          {/* Glassmorphic Metrics Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-3xl pt-6">
            {/* Card 1 */}
            <div 
              className="border p-4 sm:p-5 rounded-2xl flex flex-col justify-center items-center text-center transition-all duration-300 shadow-md font-sans bg-black/45 backdrop-blur-md"
              style={{ 
                borderColor: "rgba(255, 255, 255, 0.15)"
              }}
            >
              <span 
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-none select-text"
                style={{ color: "#ffffff" }}
              >
                {hero.stat1_val}
              </span>
              <span 
                className="text-xs sm:text-sm font-bold tracking-wide mt-2 select-text"
                style={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                {hero.stat1_lbl}
              </span>
            </div>

            {/* Card 2 */}
            <div 
              className="border p-4 sm:p-5 rounded-2xl flex flex-col justify-center items-center text-center transition-all duration-300 shadow-md font-sans bg-black/45 backdrop-blur-md"
              style={{ 
                borderColor: "rgba(255, 255, 255, 0.15)"
              }}
            >
              <span 
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-none select-text"
                style={{ color: "#ffffff" }}
              >
                {hero.stat2_val}
              </span>
              <span 
                className="text-xs sm:text-sm font-bold tracking-wide mt-2 select-text"
                style={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                {hero.stat2_lbl}
              </span>
            </div>

            {/* Card 3 */}
            <div 
              className="border p-4 sm:p-5 rounded-2xl col-span-2 sm:col-span-1 flex flex-col justify-center items-center text-center transition-all duration-300 shadow-md font-sans bg-black/45 backdrop-blur-md"
              style={{ 
                borderColor: "rgba(255, 255, 255, 0.15)"
              }}
            >
              <span 
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-none select-text"
                style={{ color: "#ffffff" }}
              >
                {hero.stat3_val}
              </span>
              <span 
                className="text-xs sm:text-sm font-bold tracking-wide mt-2 select-text"
                style={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                {hero.stat3_lbl}
              </span>
            </div>
          </div>

          {/* Primary CTA Button */}
          <div className="pt-6">
            <a 
              href={getHref()}
              className="h-11 px-6 font-bold text-sm tracking-wide rounded-sm shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2.5 group w-fit uppercase font-sans"
              style={{ 
                backgroundColor: primary,
                color: "#ffffff",
                boxShadow: `0 4px 14px 0 ${primary}30`
              }}
            >
              <span>{hero.button}</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" style={{ color: "#ffffff" }} />
            </a>
          </div>

        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // Variant 5: Stress-Free Organic Layout (Event Management Yellow UI)
  // ----------------------------------------------------
  if (activeVariant === "variant_5") {
    const bgUrl = hero.bg_image_url;
    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center justify-center overflow-hidden py-10 px-6 sm:px-8 md:px-16 lg:px-24"
        style={{ backgroundColor: "#f3c623" }}
      >
        {/* Full-bleed background image with Next.js optimization */}
        {bgUrl && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src={resolveMediaUrl(bgUrl)} 
              alt="Hero Background" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
          </div>
        )}
        {/* Foreground Content */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Right Text / Buttons side (Swapped on Desktop via ordering) */}
          <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col justify-center text-left space-y-6 md:space-y-8 max-w-2xl lg:pl-12 relative">
            
            {/* Title inside Heading like Variant 3 */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-sans leading-[1.1] text-[#181e4b] tracking-tight select-text">
              {hero.title && <span className="mr-3 inline-block animate-fade-in" style={{ color: primary }}>{hero.title}</span>}
              {hero.heading}
            </h1>
            
            {/* Description Paragraph like Variant 3 */}
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg select-text">
              {hero.description}
            </p>

            {/* Button size, shadow, shape, icon like Variant 3 */}
            <div className="pt-4 flex items-center">
              <a 
                href={getHref()}
                className="h-11 px-6 text-white font-bold text-sm tracking-wide rounded-sm shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 group w-fit"
                style={{ 
                  backgroundColor: primary,
                  boxShadow: `0 4px 14px 0 ${primary}30`
                }}
              >
                {hero.button}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>

          </div>

          {/* Left Cutout Image side (Swapped on Desktop via ordering) */}
          <div className="order-2 lg:order-1 lg:col-span-6 flex items-center justify-center relative w-full h-[400px] lg:h-[540px] select-none">
            <div className="relative w-full h-full max-w-[580px] z-10 flex items-center justify-center">
              {hero.image_url && (
                <Image
                  src={resolveMediaUrl(hero.image_url)}
                  alt="Event cutout theme"
                  fill
                  priority
                  unoptimized
                  className="object-contain scale-[1.1] sm:scale-[1.3] lg:scale-[1.5] transition-all duration-500 hover:scale-[1.15] sm:hover:scale-[1.35] lg:hover:scale-[1.55]"
                />
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // Variant 6: Left-Aligned Widescreen Background Layout
  // ----------------------------------------------------
  if (activeVariant === "variant_6") {
    let lines: string[] = [];
    if (hero.heading) {
      lines = hero.heading.split("\n").map((l: string) => l.trim()).filter(Boolean);
    }

    let headingContent;
    if (lines.length > 1) {
      headingContent = lines.map((line, idx) => (
        <span key={idx} className="block">
          {line}
        </span>
      ));
    } else {
      headingContent = <span className="block">{hero.heading}</span>;
    }

    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center overflow-hidden py-16 px-6 sm:px-8 md:px-16 lg:px-24 bg-slate-950"
      >
        {/* Full-bleed background image */}
        {hero.image_url && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src={resolveMediaUrl(hero.image_url)} 
              alt="Hero Background" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
            {/* Rich dark gradient overlay to ensure text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-slate-950/40 lg:bg-gradient-to-r lg:from-slate-950/90 lg:via-slate-950/65 lg:to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-center text-left py-12">
          <div className="max-w-3xl flex flex-col gap-6 md:gap-7 animate-in fade-in slide-in-from-left duration-700">
            {/* Eyebrow badge */}
            {hero.title && (
              <span 
                className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] inline-block font-sans"
                style={{ color: primary }}
              >
                {hero.title}
              </span>
            )}
            
            {/* Main heading */}
            <h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white font-sans flex flex-col gap-1.5 select-text"
            >
              {headingContent}
            </h1>
            
            {/* Description */}
            {hero.description && (
              <p 
                className="text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl select-text text-slate-200 font-sans"
              >
                {hero.description}
              </p>
            )}
            
            {/* Background image only, no buttons */}
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // Variant 7: Center-Aligned Widescreen Background Layout
  // ----------------------------------------------------
  if (activeVariant === "variant_7") {
    let lines: string[] = [];
    if (hero.heading) {
      lines = hero.heading.split("\n").map((l: string) => l.trim()).filter(Boolean);
    }

    let headingContent;
    if (lines.length > 1) {
      headingContent = lines.map((line, idx) => (
        <span key={idx} className="block">
          {line}
        </span>
      ));
    } else {
      headingContent = <span className="block">{hero.heading}</span>;
    }

    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center justify-center overflow-hidden py-16 px-6 sm:px-8 md:px-16 lg:px-24 bg-slate-950"
      >
        {/* Full-bleed background image */}
        {hero.image_url && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src={resolveMediaUrl(hero.image_url)} 
              alt="Hero Background" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
            {/* Rich dark symmetrical gradient overlay to ensure text contrast for center-aligned texts */}
            <div className="absolute inset-0 bg-slate-950/60 lg:bg-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-slate-950/90 lg:to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-center items-center text-center py-12">
          <div className="max-w-3xl flex flex-col gap-6 md:gap-7 animate-in fade-in slide-in-from-bottom duration-700 items-center">
            {/* Eyebrow badge */}
            {hero.title && (
              <span 
                className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] inline-block font-sans"
                style={{ color: primary }}
              >
                {hero.title}
              </span>
            )}
            
            {/* Main heading */}
            <h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white font-sans flex flex-col gap-1.5 select-text"
            >
              {headingContent}
            </h1>
            
            {/* Description */}
            {hero.description && (
              <p 
                className="text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl select-text text-slate-200 font-sans"
              >
                {hero.description}
              </p>
            )}
            
            {/* Background image only, no buttons */}
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // Variant 8: Right-Aligned Widescreen Background Layout
  // ----------------------------------------------------
  if (activeVariant === "variant_8") {
    let lines: string[] = [];
    if (hero.heading) {
      lines = hero.heading.split("\n").map((l: string) => l.trim()).filter(Boolean);
    }

    let headingContent;
    if (lines.length > 1) {
      headingContent = lines.map((line, idx) => (
        <span key={idx} className="block">
          {line}
        </span>
      ));
    } else {
      headingContent = <span className="block">{hero.heading}</span>;
    }

    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center justify-end overflow-hidden py-16 px-6 sm:px-8 md:px-16 lg:px-24 bg-slate-950"
      >
        {/* Full-bleed background image */}
        {hero.image_url && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src={resolveMediaUrl(hero.image_url)} 
              alt="Hero Background" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
            {/* Rich dark gradient overlay flipped to the left to ensure text contrast for right-aligned text */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-slate-950/40 lg:bg-gradient-to-l lg:from-slate-950/90 lg:via-slate-950/65 lg:to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-center items-end text-right py-12">
          <div className="max-w-3xl flex flex-col gap-6 md:gap-7 animate-in fade-in slide-in-from-right duration-700 items-end">
            {/* Eyebrow badge */}
            {hero.title && (
              <span 
                className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] inline-block font-sans"
                style={{ color: primary }}
              >
                {hero.title}
              </span>
            )}
            
            {/* Main heading */}
            <h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white font-sans flex flex-col gap-1.5 select-text"
            >
              {headingContent}
            </h1>
            
            {/* Description */}
            {hero.description && (
              <p 
                className="text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl select-text text-slate-200 font-sans"
              >
                {hero.description}
              </p>
            )}
            
            {/* Background image only, no buttons */}
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // Variant 9: Left-Aligned Widescreen Background Layout with 1 Button
  // ----------------------------------------------------
  if (activeVariant === "variant_9") {
    let lines: string[] = [];
    if (hero.heading) {
      lines = hero.heading.split("\n").map((l: string) => l.trim()).filter(Boolean);
    }

    let headingContent;
    if (lines.length > 1) {
      headingContent = lines.map((line, idx) => (
        <span key={idx} className="block">
          {line}
        </span>
      ));
    } else {
      headingContent = <span className="block">{hero.heading}</span>;
    }

    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center overflow-hidden py-16 px-6 sm:px-8 md:px-16 lg:px-24 bg-slate-950"
      >
        {/* Full-bleed background image */}
        {hero.image_url && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src={resolveMediaUrl(hero.image_url)} 
              alt="Hero Background" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
            {/* Rich dark gradient overlay to ensure text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-slate-950/40 lg:bg-gradient-to-r lg:from-slate-950/90 lg:via-slate-950/65 lg:to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-center text-left py-12">
          <div className="max-w-3xl flex flex-col gap-6 md:gap-7 animate-in fade-in slide-in-from-left duration-700">
            {/* Eyebrow badge */}
            {hero.title && (
              <span 
                className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] inline-block font-sans"
                style={{ color: primary }}
              >
                {hero.title}
              </span>
            )}
            
            {/* Main heading */}
            <h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white font-sans flex flex-col gap-1.5 select-text"
            >
              {headingContent}
            </h1>
            
            {/* Description */}
            {hero.description && (
              <p 
                className="text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl select-text text-slate-200 font-sans"
              >
                {hero.description}
              </p>
            )}
            
            {/* CTA Button */}
            {hero.button && (
              <div className="pt-4 flex">
                <a 
                  href={getHref()}
                  className="h-11 px-6 text-white font-bold text-sm tracking-wide rounded-sm shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 flex items-center justify-center font-sans"
                  style={{ 
                    backgroundColor: primary,
                    boxShadow: `0 4px 14px 0 ${primary}30`
                  }}
                >
                  {hero.button}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // Variant 10: Center-Aligned Widescreen Background Layout with 1 Button
  // ----------------------------------------------------
  if (activeVariant === "variant_10") {
    let lines: string[] = [];
    if (hero.heading) {
      lines = hero.heading.split("\n").map((l: string) => l.trim()).filter(Boolean);
    }

    let headingContent;
    if (lines.length > 1) {
      headingContent = lines.map((line, idx) => (
        <span key={idx} className="block">
          {line}
        </span>
      ));
    } else {
      headingContent = <span className="block">{hero.heading}</span>;
    }

    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center justify-center overflow-hidden py-16 px-6 sm:px-8 md:px-16 lg:px-24 bg-slate-950"
      >
        {/* Full-bleed background image */}
        {hero.image_url && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src={resolveMediaUrl(hero.image_url)} 
              alt="Hero Background" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
            {/* Rich dark symmetrical gradient overlay to ensure text contrast for center-aligned texts */}
            <div className="absolute inset-0 bg-slate-950/60 lg:bg-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-slate-950/90 lg:to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-center items-center text-center py-12">
          <div className="max-w-3xl flex flex-col gap-6 md:gap-7 animate-in fade-in slide-in-from-bottom duration-700 items-center">
            {/* Eyebrow badge */}
            {hero.title && (
              <span 
                className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] inline-block font-sans"
                style={{ color: primary }}
              >
                {hero.title}
              </span>
            )}
            
            {/* Main heading */}
            <h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white font-sans flex flex-col gap-1.5 select-text"
            >
              {headingContent}
            </h1>
            
            {/* Description */}
            {hero.description && (
              <p 
                className="text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl select-text text-slate-200 font-sans"
              >
                {hero.description}
              </p>
            )}
            
            {/* CTA Button */}
            {hero.button && (
              <div className="pt-4 flex justify-center">
                <a 
                  href={getHref()}
                  className="h-11 px-6 text-white font-bold text-sm tracking-wide rounded-sm shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 flex items-center justify-center font-sans"
                  style={{ 
                    backgroundColor: primary,
                    boxShadow: `0 4px 14px 0 ${primary}30`
                  }}
                >
                  {hero.button}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // Variant 11: Right-Aligned Widescreen Background Layout with 1 Button
  // ----------------------------------------------------
  if (activeVariant === "variant_11") {
    let lines: string[] = [];
    if (hero.heading) {
      lines = hero.heading.split("\n").map((l: string) => l.trim()).filter(Boolean);
    }

    let headingContent;
    if (lines.length > 1) {
      headingContent = lines.map((line, idx) => (
        <span key={idx} className="block">
          {line}
        </span>
      ));
    } else {
      headingContent = <span className="block">{hero.heading}</span>;
    }

    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center justify-end overflow-hidden py-16 px-6 sm:px-8 md:px-16 lg:px-24 bg-slate-950"
      >
        {/* Full-bleed background image */}
        {hero.image_url && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src={resolveMediaUrl(hero.image_url)} 
              alt="Hero Background" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
            {/* Rich dark gradient overlay flipped to the left to ensure text contrast for right-aligned text */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-slate-950/40 lg:bg-gradient-to-l lg:from-slate-950/90 lg:via-slate-950/65 lg:to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-center items-end text-right py-12">
          <div className="max-w-3xl flex flex-col gap-6 md:gap-7 animate-in fade-in slide-in-from-right duration-700 items-end">
            {/* Eyebrow badge */}
            {hero.title && (
              <span 
                className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] inline-block font-sans"
                style={{ color: primary }}
              >
                {hero.title}
              </span>
            )}
            
            {/* Main heading */}
            <h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white font-sans flex flex-col gap-1.5 select-text"
            >
              {headingContent}
            </h1>
            
            {/* Description */}
            {hero.description && (
              <p 
                className="text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl select-text text-slate-200 font-sans"
              >
                {hero.description}
              </p>
            )}
            
            {/* CTA Button */}
            {hero.button && (
              <div className="pt-4 flex justify-end">
                <a 
                  href={getHref()}
                  className="h-11 px-6 text-white font-bold text-sm tracking-wide rounded-sm shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 flex items-center justify-center font-sans"
                  style={{ 
                    backgroundColor: primary,
                    boxShadow: `0 4px 14px 0 ${primary}30`
                  }}
                >
                  {hero.button}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // Variant 12: Left-Aligned Widescreen Background Layout with 2 Buttons
  // ----------------------------------------------------
  if (activeVariant === "variant_12") {
    let lines: string[] = [];
    if (hero.heading) {
      lines = hero.heading.split("\n").map((l: string) => l.trim()).filter(Boolean);
    }

    let headingContent;
    if (lines.length > 1) {
      headingContent = lines.map((line, idx) => (
        <span key={idx} className="block">
          {line}
        </span>
      ));
    } else {
      headingContent = <span className="block">{hero.heading}</span>;
    }

    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center overflow-hidden py-16 px-6 sm:px-8 md:px-16 lg:px-24 bg-slate-950"
      >
        {/* Full-bleed background image */}
        {hero.image_url && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src={resolveMediaUrl(hero.image_url)} 
              alt="Hero Background" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
            {/* Rich dark gradient overlay to ensure text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-slate-950/40 lg:bg-gradient-to-r lg:from-slate-950/90 lg:via-slate-950/65 lg:to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-center text-left py-12">
          <div className="max-w-3xl flex flex-col gap-6 md:gap-7 animate-in fade-in slide-in-from-left duration-700">
            {/* Eyebrow badge */}
            {hero.title && (
              <span 
                className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] inline-block font-sans"
                style={{ color: primary }}
              >
                {hero.title}
              </span>
            )}
            
            {/* Main heading */}
            <h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white font-sans flex flex-col gap-1.5 select-text"
            >
              {headingContent}
            </h1>
            
            {/* Description */}
            {hero.description && (
              <p 
                className="text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl select-text text-slate-200 font-sans"
              >
                {hero.description}
              </p>
            )}
            
            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              {/* Button 1: Solid Background */}
              {hero.button && (
                <a 
                  href={getHref()}
                  className="h-11 px-6 text-white font-bold text-sm tracking-wide rounded-sm shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 flex items-center justify-center font-sans"
                  style={{ 
                    backgroundColor: primary,
                    boxShadow: `0 4px 14px 0 ${primary}30`
                  }}
                >
                  {hero.button}
                </a>
              )}

              {/* Button 2: Outlined Border & Transparent Background */}
              {hero.button2 && (
                <a 
                  href={getHref2()}
                  className="h-11 px-6 font-bold text-sm tracking-wide rounded-sm border-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center bg-transparent font-sans"
                  style={{ 
                    color: "#ffffff",
                    borderColor: "#ffffff"
                  }}
                >
                  {hero.button2}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // Variant 13: Center-Aligned Widescreen Background Layout with 2 Buttons
  // ----------------------------------------------------
  if (activeVariant === "variant_13") {
    let lines: string[] = [];
    if (hero.heading) {
      lines = hero.heading.split("\n").map((l: string) => l.trim()).filter(Boolean);
    }

    let headingContent;
    if (lines.length > 1) {
      headingContent = lines.map((line, idx) => (
        <span key={idx} className="block">
          {line}
        </span>
      ));
    } else {
      headingContent = <span className="block">{hero.heading}</span>;
    }

    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center justify-center overflow-hidden py-16 px-6 sm:px-8 md:px-16 lg:px-24 bg-slate-950"
      >
        {/* Full-bleed background image */}
        {hero.image_url && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src={resolveMediaUrl(hero.image_url)} 
              alt="Hero Background" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
            {/* Rich dark symmetrical gradient overlay to ensure text contrast for center-aligned texts */}
            <div className="absolute inset-0 bg-slate-950/60 lg:bg-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-slate-950/90 lg:to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-center items-center text-center py-12">
          <div className="max-w-3xl flex flex-col gap-6 md:gap-7 animate-in fade-in slide-in-from-bottom duration-700 items-center">
            {/* Eyebrow badge */}
            {hero.title && (
              <span 
                className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] inline-block font-sans"
                style={{ color: primary }}
              >
                {hero.title}
              </span>
            )}
            
            {/* Main heading */}
            <h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white font-sans flex flex-col gap-1.5 select-text"
            >
              {headingContent}
            </h1>
            
            {/* Description */}
            {hero.description && (
              <p 
                className="text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl select-text text-slate-200 font-sans"
              >
                {hero.description}
              </p>
            )}
            
            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              {/* Button 1: Solid Background */}
              {hero.button && (
                <a 
                  href={getHref()}
                  className="h-11 px-6 text-white font-bold text-sm tracking-wide rounded-sm shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 flex items-center justify-center font-sans"
                  style={{ 
                    backgroundColor: primary,
                    boxShadow: `0 4px 14px 0 ${primary}30`
                  }}
                >
                  {hero.button}
                </a>
              )}

              {/* Button 2: Outlined Border & Transparent Background */}
              {hero.button2 && (
                <a 
                  href={getHref2()}
                  className="h-11 px-6 font-bold text-sm tracking-wide rounded-sm border-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center bg-transparent font-sans"
                  style={{ 
                    color: "#ffffff",
                    borderColor: "#ffffff"
                  }}
                >
                  {hero.button2}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // Variant 14: Right-Aligned Widescreen Background Layout with 2 Buttons
  // ----------------------------------------------------
  if (activeVariant === "variant_14") {
    let lines: string[] = [];
    if (hero.heading) {
      lines = hero.heading.split("\n").map((l: string) => l.trim()).filter(Boolean);
    }

    let headingContent;
    if (lines.length > 1) {
      headingContent = lines.map((line, idx) => (
        <span key={idx} className="block">
          {line}
        </span>
      ));
    } else {
      headingContent = <span className="block">{hero.heading}</span>;
    }

    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center justify-end overflow-hidden py-16 px-6 sm:px-8 md:px-16 lg:px-24 bg-slate-950"
      >
        {/* Full-bleed background image */}
        {hero.image_url && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src={resolveMediaUrl(hero.image_url)} 
              alt="Hero Background" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
            {/* Rich dark gradient overlay flipped to the left to ensure text contrast for right-aligned text */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-slate-950/40 lg:bg-gradient-to-l lg:from-slate-950/90 lg:via-slate-950/65 lg:to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-center items-end text-right py-12">
          <div className="max-w-3xl flex flex-col gap-6 md:gap-7 animate-in fade-in slide-in-from-right duration-700 items-end">
            {/* Eyebrow badge */}
            {hero.title && (
              <span 
                className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] inline-block font-sans"
                style={{ color: primary }}
              >
                {hero.title}
              </span>
            )}
            
            {/* Main heading */}
            <h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white font-sans flex flex-col gap-1.5 select-text"
            >
              {headingContent}
            </h1>
            
            {/* Description */}
            {hero.description && (
              <p 
                className="text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl select-text text-slate-200 font-sans"
              >
                {hero.description}
              </p>
            )}
            
            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-end gap-4">
              {/* Button 1: Solid Background */}
              {hero.button && (
                <a 
                  href={getHref()}
                  className="h-11 px-6 text-white font-bold text-sm tracking-wide rounded-sm shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 flex items-center justify-center font-sans"
                  style={{ 
                    backgroundColor: primary,
                    boxShadow: `0 4px 14px 0 ${primary}30`
                  }}
                >
                  {hero.button}
                </a>
              )}

              {/* Button 2: Outlined Border & Transparent Background */}
              {hero.button2 && (
                <a 
                  href={getHref2()}
                  className="h-11 px-6 font-bold text-sm tracking-wide rounded-sm border-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center bg-transparent font-sans"
                  style={{ 
                    color: "#ffffff",
                    borderColor: "#ffffff"
                  }}
                >
                  {hero.button2}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // Variant 15: Left-Aligned Widescreen Background Layout (No Title)
  // ----------------------------------------------------
  if (activeVariant === "variant_15") {
    let lines: string[] = [];
    if (hero.heading) {
      lines = hero.heading.split("\n").map((l: string) => l.trim()).filter(Boolean);
    }

    let headingContent;
    if (lines.length > 1) {
      headingContent = lines.map((line, idx) => (
        <span key={idx} className="block">
          {line}
        </span>
      ));
    } else {
      headingContent = <span className="block">{hero.heading}</span>;
    }

    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center overflow-hidden py-16 px-6 sm:px-8 md:px-16 lg:px-24 bg-slate-950"
      >
        {/* Full-bleed background image */}
        {hero.image_url && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src={resolveMediaUrl(hero.image_url)} 
              alt="Hero Background" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
            {/* Rich dark gradient overlay to ensure text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-slate-950/40 lg:bg-gradient-to-r lg:from-slate-950/90 lg:via-slate-950/65 lg:to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-center text-left py-12">
          <div className="max-w-3xl flex flex-col gap-6 md:gap-7 animate-in fade-in slide-in-from-left duration-700">
            {/* Main heading */}
            <h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white font-sans flex flex-col gap-1.5 select-text"
            >
              {headingContent}
            </h1>
            
            {/* Description */}
            {hero.description && (
              <p 
                className="text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl select-text text-slate-200 font-sans"
              >
                {hero.description}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // Variant 16: Center-Aligned Widescreen Background Layout (No Title)
  // ----------------------------------------------------
  if (activeVariant === "variant_16") {
    let lines: string[] = [];
    if (hero.heading) {
      lines = hero.heading.split("\n").map((l: string) => l.trim()).filter(Boolean);
    }

    let headingContent;
    if (lines.length > 1) {
      headingContent = lines.map((line, idx) => (
        <span key={idx} className="block">
          {line}
        </span>
      ));
    } else {
      headingContent = <span className="block">{hero.heading}</span>;
    }

    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center justify-center overflow-hidden py-16 px-6 sm:px-8 md:px-16 lg:px-24 bg-slate-950"
      >
        {/* Full-bleed background image */}
        {hero.image_url && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src={resolveMediaUrl(hero.image_url)} 
              alt="Hero Background" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
            {/* Rich dark symmetrical gradient overlay to ensure text contrast for center-aligned texts */}
            <div className="absolute inset-0 bg-slate-950/60 lg:bg-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-slate-950/90 lg:to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-center items-center text-center py-12">
          <div className="max-w-3xl flex flex-col gap-6 md:gap-7 animate-in fade-in slide-in-from-bottom duration-700 items-center">
            {/* Main heading */}
            <h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white font-sans flex flex-col gap-1.5 select-text"
            >
              {headingContent}
            </h1>
            
            {/* Description */}
            {hero.description && (
              <p 
                className="text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl select-text text-slate-200 font-sans"
              >
                {hero.description}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // Variant 17: Right-Aligned Widescreen Background Layout (No Title)
  // ----------------------------------------------------
  if (activeVariant === "variant_17") {
    let lines: string[] = [];
    if (hero.heading) {
      lines = hero.heading.split("\n").map((l: string) => l.trim()).filter(Boolean);
    }

    let headingContent;
    if (lines.length > 1) {
      headingContent = lines.map((line, idx) => (
        <span key={idx} className="block">
          {line}
        </span>
      ));
    } else {
      headingContent = <span className="block">{hero.heading}</span>;
    }

    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center justify-end overflow-hidden py-16 px-6 sm:px-8 md:px-16 lg:px-24 bg-slate-950"
      >
        {/* Full-bleed background image */}
        {hero.image_url && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src={resolveMediaUrl(hero.image_url)} 
              alt="Hero Background" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
            {/* Rich dark gradient overlay flipped to the left to ensure text contrast for right-aligned text */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-slate-950/40 lg:bg-gradient-to-l lg:from-slate-950/90 lg:via-slate-950/65 lg:to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-center items-end text-right py-12">
          <div className="max-w-3xl flex flex-col gap-6 md:gap-7 animate-in fade-in slide-in-from-right duration-700 items-end">
            {/* Main heading */}
            <h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white font-sans flex flex-col gap-1.5 select-text"
            >
              {headingContent}
            </h1>
            
            {/* Description */}
            {hero.description && (
              <p 
                className="text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl select-text text-slate-200 font-sans"
              >
                {hero.description}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // Variant 18: Left-Aligned Widescreen Background Layout (No Title, with 1 Button)
  // ----------------------------------------------------
  if (activeVariant === "variant_18") {
    let lines: string[] = [];
    if (hero.heading) {
      lines = hero.heading.split("\n").map((l: string) => l.trim()).filter(Boolean);
    }

    let headingContent;
    if (lines.length > 1) {
      headingContent = lines.map((line, idx) => (
        <span key={idx} className="block">
          {line}
        </span>
      ));
    } else {
      headingContent = <span className="block">{hero.heading}</span>;
    }

    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center overflow-hidden py-16 px-6 sm:px-8 md:px-16 lg:px-24 bg-slate-950"
      >
        {/* Full-bleed background image */}
        {hero.image_url && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src={resolveMediaUrl(hero.image_url)} 
              alt="Hero Background" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
            {/* Rich dark gradient overlay to ensure text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-slate-950/40 lg:bg-gradient-to-r lg:from-slate-950/90 lg:via-slate-950/65 lg:to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-center text-left py-12">
          <div className="max-w-3xl flex flex-col gap-6 md:gap-7 animate-in fade-in slide-in-from-left duration-700">
            {/* Main heading */}
            <h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white font-sans flex flex-col gap-1.5 select-text"
            >
              {headingContent}
            </h1>
            
            {/* Description */}
            {hero.description && (
              <p 
                className="text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl select-text text-slate-200 font-sans"
              >
                {hero.description}
              </p>
            )}

            {/* CTA Button */}
            {hero.button && (
              <div className="pt-4 flex">
                <a 
                  href={getHref()}
                  className="h-11 px-6 text-white font-bold text-sm tracking-wide rounded-sm shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 flex items-center justify-center font-sans"
                  style={{ 
                    backgroundColor: primary,
                    boxShadow: `0 4px 14px 0 ${primary}30`
                  }}
                >
                  {hero.button}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // Variant 19: Center-Aligned Widescreen Background Layout (No Title, with 1 Button)
  // ----------------------------------------------------
  if (activeVariant === "variant_19") {
    let lines: string[] = [];
    if (hero.heading) {
      lines = hero.heading.split("\n").map((l: string) => l.trim()).filter(Boolean);
    }

    let headingContent;
    if (lines.length > 1) {
      headingContent = lines.map((line, idx) => (
        <span key={idx} className="block">
          {line}
        </span>
      ));
    } else {
      headingContent = <span className="block">{hero.heading}</span>;
    }

    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center justify-center overflow-hidden py-16 px-6 sm:px-8 md:px-16 lg:px-24 bg-slate-950"
      >
        {/* Full-bleed background image */}
        {hero.image_url && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src={resolveMediaUrl(hero.image_url)} 
              alt="Hero Background" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
            {/* Rich dark symmetrical gradient overlay to ensure text contrast for center-aligned texts */}
            <div className="absolute inset-0 bg-slate-950/60 lg:bg-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-slate-950/90 lg:to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-center items-center text-center py-12">
          <div className="max-w-3xl flex flex-col gap-6 md:gap-7 animate-in fade-in slide-in-from-bottom duration-700 items-center">
            {/* Main heading */}
            <h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white font-sans flex flex-col gap-1.5 select-text"
            >
              {headingContent}
            </h1>
            
            {/* Description */}
            {hero.description && (
              <p 
                className="text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl select-text text-slate-200 font-sans"
              >
                {hero.description}
              </p>
            )}

            {/* CTA Button */}
            {hero.button && (
              <div className="pt-4 flex justify-center">
                <a 
                  href={getHref()}
                  className="h-11 px-6 text-white font-bold text-sm tracking-wide rounded-sm shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 flex items-center justify-center font-sans"
                  style={{ 
                    backgroundColor: primary,
                    boxShadow: `0 4px 14px 0 ${primary}30`
                  }}
                >
                  {hero.button}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // Variant 20: Right-Aligned Widescreen Background Layout (No Title, with 1 Button)
  // ----------------------------------------------------
  if (activeVariant === "variant_20") {
    let lines: string[] = [];
    if (hero.heading) {
      lines = hero.heading.split("\n").map((l: string) => l.trim()).filter(Boolean);
    }

    let headingContent;
    if (lines.length > 1) {
      headingContent = lines.map((line, idx) => (
        <span key={idx} className="block">
          {line}
        </span>
      ));
    } else {
      headingContent = <span className="block">{hero.heading}</span>;
    }

    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center justify-end overflow-hidden py-16 px-6 sm:px-8 md:px-16 lg:px-24 bg-slate-950"
      >
        {/* Full-bleed background image */}
        {hero.image_url && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src={resolveMediaUrl(hero.image_url)} 
              alt="Hero Background" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
            {/* Rich dark gradient overlay flipped to the left to ensure text contrast for right-aligned text */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-slate-950/40 lg:bg-gradient-to-l lg:from-slate-950/90 lg:via-slate-950/65 lg:to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-center items-end text-right py-12">
          <div className="max-w-3xl flex flex-col gap-6 md:gap-7 animate-in fade-in slide-in-from-right duration-700 items-end">
            {/* Main heading */}
            <h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white font-sans flex flex-col gap-1.5 select-text"
            >
              {headingContent}
            </h1>
            
            {/* Description */}
            {hero.description && (
              <p 
                className="text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl select-text text-slate-200 font-sans"
              >
                {hero.description}
              </p>
            )}

            {/* CTA Button */}
            {hero.button && (
              <div className="pt-4 flex justify-end">
                <a 
                  href={getHref()}
                  className="h-11 px-6 text-white font-bold text-sm tracking-wide rounded-sm shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 flex items-center justify-center font-sans"
                  style={{ 
                    backgroundColor: primary,
                    boxShadow: `0 4px 14px 0 ${primary}30`
                  }}
                >
                  {hero.button}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // Variant 21: Left ALigned Widescreen Background Layout with 2 Buttons
  // ----------------------------------------------------
  if (activeVariant === "variant_21") {
    let lines: string[] = [];
    if (hero.heading) {
      lines = hero.heading.split("\n").map((l: string) => l.trim()).filter(Boolean);
    }

    let headingContent;
    if (lines.length > 1) {
      headingContent = lines.map((line, idx) => (
        <span key={idx} className="block">
          {line}
        </span>
      ));
    } else {
      headingContent = <span className="block">{hero.heading}</span>;
    }

    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center overflow-hidden py-16 px-6 sm:px-8 md:px-16 lg:px-24 bg-slate-950"
      >
        {/* Full-bleed background image */}
        {hero.image_url && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src={resolveMediaUrl(hero.image_url)} 
              alt="Hero Background" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
            {/* Rich dark gradient overlay to ensure text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-slate-950/40 lg:bg-gradient-to-r lg:from-slate-950/90 lg:via-slate-950/65 lg:to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-center text-left py-12">
          <div className="max-w-3xl flex flex-col gap-6 md:gap-7 animate-in fade-in slide-in-from-left duration-700">
           
            
            {/* Main heading */}
            <h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white font-sans flex flex-col gap-1.5 select-text"
            >
              {headingContent}
            </h1>
            
            {/* Description */}
            {hero.description && (
              <p 
                className="text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl select-text text-slate-200 font-sans"
              >
                {hero.description}
              </p>
            )}
            
            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              {/* Button 1: Solid Background */}
              {hero.button && (
                <a 
                  href={getHref()}
                  className="h-11 px-6 text-white font-bold text-sm tracking-wide rounded-sm shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 flex items-center justify-center font-sans"
                  style={{ 
                    backgroundColor: primary,
                    boxShadow: `0 4px 14px 0 ${primary}30`
                  }}
                >
                  {hero.button}
                </a>
              )}

              {/* Button 2: Outlined Border & Transparent Background */}
              {hero.button2 && (
                <a 
                  href={getHref2()}
                  className="h-11 px-6 font-bold text-sm tracking-wide rounded-sm border-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center bg-transparent font-sans"
                  style={{ 
                    color: "#ffffff",
                    borderColor: "#ffffff"
                  }}
                >
                  {hero.button2}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // Variant 22: Center-Aligned Widescreen Background Layout with 2 Buttons
  // ----------------------------------------------------
  if (activeVariant === "variant_22") {
    let lines: string[] = [];
    if (hero.heading) {
      lines = hero.heading.split("\n").map((l: string) => l.trim()).filter(Boolean);
    }

    let headingContent;
    if (lines.length > 1) {
      headingContent = lines.map((line, idx) => (
        <span key={idx} className="block">
          {line}
        </span>
      ));
    } else {
      headingContent = <span className="block">{hero.heading}</span>;
    }

    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center justify-center overflow-hidden py-16 px-6 sm:px-8 md:px-16 lg:px-24 bg-slate-950"
      >
        {/* Full-bleed background image */}
        {hero.image_url && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src={resolveMediaUrl(hero.image_url)} 
              alt="Hero Background" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
            {/* Rich dark symmetrical gradient overlay to ensure text contrast for center-aligned texts */}
            <div className="absolute inset-0 bg-slate-950/60 lg:bg-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-slate-950/90 lg:to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-center items-center text-center py-12">
          <div className="max-w-3xl flex flex-col gap-6 md:gap-7 animate-in fade-in slide-in-from-bottom duration-700 items-center">

            {/* Main heading */}
            <h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white font-sans flex flex-col gap-1.5 select-text"
            >
              {headingContent}
            </h1>
            
            {/* Description */}
            {hero.description && (
              <p 
                className="text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl select-text text-slate-200 font-sans"
              >
                {hero.description}
              </p>
            )}
            
            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              {/* Button 1: Solid Background */}
              {hero.button && (
                <a 
                  href={getHref()}
                  className="h-11 px-6 text-white font-bold text-sm tracking-wide rounded-sm shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 flex items-center justify-center font-sans"
                  style={{ 
                    backgroundColor: primary,
                    boxShadow: `0 4px 14px 0 ${primary}30`
                  }}
                >
                  {hero.button}
                </a>
              )}

              {/* Button 2: Outlined Border & Transparent Background */}
              {hero.button2 && (
                <a 
                  href={getHref2()}
                  className="h-11 px-6 font-bold text-sm tracking-wide rounded-sm border-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center bg-transparent font-sans"
                  style={{ 
                    color: "#ffffff",
                    borderColor: "#ffffff"
                  }}
                >
                  {hero.button2}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // Variant 23: Right-Aligned Widescreen Background Layout with 2 Buttons
  // ----------------------------------------------------
  if (activeVariant === "variant_23") {
    let lines: string[] = [];
    if (hero.heading) {
      lines = hero.heading.split("\n").map((l: string) => l.trim()).filter(Boolean);
    }

    let headingContent;
    if (lines.length > 1) {
      headingContent = lines.map((line, idx) => (
        <span key={idx} className="block">
          {line}
        </span>
      ));
    } else {
      headingContent = <span className="block">{hero.heading}</span>;
    }

    return (
      <section 
        id="hero-section" 
        className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] relative flex items-center justify-end overflow-hidden py-16 px-6 sm:px-8 md:px-16 lg:px-24 bg-slate-950"
      >
        {/* Full-bleed background image */}
        {hero.image_url && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image 
              src={resolveMediaUrl(hero.image_url)} 
              alt="Hero Background" 
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
            {/* Rich dark gradient overlay flipped to the left to ensure text contrast for right-aligned text */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-slate-950/40 lg:bg-gradient-to-l lg:from-slate-950/90 lg:via-slate-950/65 lg:to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col justify-center items-end text-right py-12">
          <div className="max-w-3xl flex flex-col gap-6 md:gap-7 animate-in fade-in slide-in-from-right duration-700 items-end">
            {/* Main heading */}
            <h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white font-sans flex flex-col gap-1.5 select-text"
            >
              {headingContent}
            </h1>
            
            {/* Description */}
            {hero.description && (
              <p 
                className="text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl select-text text-slate-200 font-sans"
              >
                {hero.description}
              </p>
            )}
            
            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-end gap-4">
              {/* Button 1: Solid Background */}
              {hero.button && (
                <a 
                  href={getHref()}
                  className="h-11 px-6 text-white font-bold text-sm tracking-wide rounded-sm shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 flex items-center justify-center font-sans"
                  style={{ 
                    backgroundColor: primary,
                    boxShadow: `0 4px 14px 0 ${primary}30`
                  }}
                >
                  {hero.button}
                </a>
              )}

              {/* Button 2: Outlined Border & Transparent Background */}
              {hero.button2 && (
                <a 
                  href={getHref2()}
                  className="h-11 px-6 font-bold text-sm tracking-wide rounded-sm border-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center bg-transparent font-sans"
                  style={{ 
                    color: "#ffffff",
                    borderColor: "#ffffff"
                  }}
                >
                  {hero.button2}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }




  return null;
}



