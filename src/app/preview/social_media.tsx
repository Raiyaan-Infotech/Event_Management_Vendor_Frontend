"use client";
import React from "react";
import type { ThemeColors, SocialLinkItem } from "./types";

// ─── helpers ────────────────────────────────────────────────────────────────

/** Returns a simple SVG path or letter avatar for a social platform */
function SocialIcon({ label, color }: { label: string; color: string }) {
  const name = label.toLowerCase();

  // Map common platform names to simple letter/symbol glyphs
  const glyph: Record<string, string> = {
    facebook:  "f",
    instagram: "IG",
    twitter:   "𝕏",
    x:         "𝕏",
    linkedin:  "in",
    youtube:   "▶",
    whatsapp:  "W",
    tiktok:    "TT",
    pinterest: "P",
    snapchat:  "S",
    telegram:  "T",
    github:    "GH",
  };

  const char = Object.entries(glyph).find(([k]) => name.includes(k))?.[1]
    ?? label.charAt(0).toUpperCase();

  return (
    <span
      className="flex items-center justify-center font-extrabold text-white leading-none select-none"
      style={{ fontSize: char.length > 1 ? "10px" : "14px" }}
    >
      {char}
    </span>
  );
}

// ─── Variant 1 — Icon Row ────────────────────────────────────────────────────
// Centered row of coloured circles. Clean & minimal.

function Variant1({
  items,
  colors,
}: {
  items: SocialLinkItem[];
  colors?: ThemeColors;
}) {
  const primary = colors?.primary_color || "#3b82f6";
  const text    = colors?.text_color    || "#1f2937";

  return (
    <section className="w-full px-8 py-14" style={{ background: `${primary}08` }}>
      {/* Heading */}
      <div className="text-center mb-10">
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: primary }}
        >
          Connect With Us
        </span>
        <h2 className="text-2xl font-black mt-2" style={{ color: text }}>
          Follow Our Journey
        </h2>
      </div>

      {/* Icon row */}
      {items.length === 0 ? (
        <p className="text-center text-sm text-gray-400">No social links added yet.</p>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-5">
          {items.map((link) => {
            const bg = link.icon_color || primary;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.label}
                className="group flex flex-col items-center gap-2"
              >
                {/* Circle */}
                <span
                  className="h-14 w-14 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110"
                  style={{ backgroundColor: bg }}
                >
                  <SocialIcon label={link.label} color={bg} />
                </span>
                {/* Platform name under icon */}
                <span
                  className="text-[11px] font-semibold capitalize"
                  style={{ color: text }}
                >
                  {link.label}
                </span>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}

// ─── Variant 2 — Icon + Label List ───────────────────────────────────────────
// Vertical list: coloured pill icon on left, label + URL on right.

function Variant2({
  items,
  colors,
}: {
  items: SocialLinkItem[];
  colors?: ThemeColors;
}) {
  const primary   = colors?.primary_color   || "#3b82f6";
  const secondary = colors?.secondary_color || "#1e40af";
  const text      = colors?.text_color      || "#1f2937";

  return (
    <section className="w-full px-8 py-14">
      {/* Heading */}
      <div className="text-center mb-10">
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: primary }}
        >
          Social Media
        </span>
        <h2 className="text-2xl font-black mt-2" style={{ color: text }}>
          Stay Connected
        </h2>
      </div>

      {/* List */}
      {items.length === 0 ? (
        <p className="text-center text-sm text-gray-400">No social links added yet.</p>
      ) : (
        <div className="max-w-lg mx-auto flex flex-col gap-3">
          {items.map((link) => {
            const bg = link.icon_color || primary;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border bg-white px-5 py-3.5 shadow-sm transition-all hover:shadow-md"
                style={{ borderColor: `${primary}22` }}
              >
                {/* Icon pill */}
                <span
                  className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105"
                  style={{ backgroundColor: bg }}
                >
                  <SocialIcon label={link.label} color={bg} />
                </span>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-bold capitalize"
                    style={{ color: text }}
                  >
                    {link.label}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{link.url}</p>
                </div>

                {/* Arrow */}
                <span
                  className="text-lg font-bold transition-transform group-hover:translate-x-1"
                  style={{ color: secondary }}
                >
                  →
                </span>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function SocialMedia({
  variant,
  colors,
  items = [],
}: {
  variant: string;
  colors?: ThemeColors;
  items?: SocialLinkItem[];
}) {
  if (variant === "variant_2") return <Variant2 items={items} colors={colors} />;
  return <Variant1 items={items} colors={colors} />;
}
