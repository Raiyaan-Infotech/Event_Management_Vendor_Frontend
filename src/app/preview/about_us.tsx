


"use client";
import React from "react";
import Image from "next/image";
import { resolveMediaUrl } from "@/lib/utils";
import type { ThemeColors, VendorData } from "./types";

function Variant1({ vendor, colors }: { vendor?: VendorData; colors?: ThemeColors }) {
  const primary = colors?.primary_color || "#3b82f6";
  const text    = colors?.text_color    || "#1f2937";

  return (
    <section className="w-full px-8 py-14 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="space-y-5">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: primary }}>About Us</span>
        <h2 className="text-3xl font-black" style={{ color: text }}>{vendor?.company_name || "Our Company"}</h2>
        <p className="text-gray-500 leading-relaxed text-sm">
          {vendor?.about_us || vendor?.short_description || "We are dedicated to delivering exceptional experiences."}
        </p>
        {vendor?.company_contact && <p className="text-sm text-gray-500">📞 {vendor.company_contact}</p>}
        {vendor?.company_email   && <p className="text-sm text-gray-500">✉ {vendor.company_email}</p>}
        {vendor?.company_address && <p className="text-sm text-gray-500">📍 {vendor.company_address}</p>}
      </div>
      <div className="h-64 rounded-2xl flex items-center justify-center overflow-hidden" style={{ background: `${primary}15` }}>
        {vendor?.company_logo ? (
          <Image src={resolveMediaUrl(vendor.company_logo)} alt={vendor.company_name || "Logo"} width={200} height={200} className="object-contain" />
        ) : (
          <span className="text-5xl">🏢</span>
        )}
      </div>
    </section>
  );
}

function Variant2({ vendor, colors }: { vendor?: VendorData; colors?: ThemeColors }) {
  const primary = colors?.primary_color || "#3b82f6";
  const text    = colors?.text_color    || "#1f2937";

  return (
    <section className="w-full px-8 py-14 text-center space-y-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: primary }}>About Us</span>
        {vendor?.company_logo && (
          <div className="flex justify-center">
            <Image src={resolveMediaUrl(vendor.company_logo)} alt={vendor.company_name || "Logo"} width={80} height={80} className="object-contain rounded-xl" />
          </div>
        )}
        <h2 className="text-3xl font-black" style={{ color: text }}>{vendor?.company_name || "Our Company"}</h2>
        <p className="text-gray-500 leading-relaxed text-sm">
          {vendor?.about_us || vendor?.short_description || "We are dedicated to delivering exceptional experiences."}
        </p>
      </div>
      {vendor?.company_information && (
        <p className="text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">{vendor.company_information}</p>
      )}
    </section>
  );
}

export default function AboutUs({ variant, colors, vendor }: { variant: string; colors?: ThemeColors; vendor?: VendorData }) {
  if (variant === "variant_2") return <Variant2 vendor={vendor} colors={colors} />;
  return <Variant1 vendor={vendor} colors={colors} />;
}
