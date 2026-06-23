"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { resolveMediaUrl } from "@/lib/utils";
import { PublicVendorData } from "@/hooks/use-public-vendor";

interface PublicNavbarProps {
  vendor: PublicVendorData["vendor"];
  colors: PublicVendorData["colors"];
  slug: string;
}

export function PublicNavbar({ vendor, colors, slug }: PublicNavbarProps) {
  if (!vendor) return null;

  const navMenu: { label: string; href: string }[] = [];

  const headerBg = colors?.header_color || "#ffffff";
  const textColor = colors?.text_color || "#1f2937";
  const primaryColor = colors?.primary_color || "#3b82f6";

  return (
    <header
      className="w-full sticky top-0 z-50 shadow-sm"
      style={{ backgroundColor: headerBg }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Company Name */}
          <Link href={`/${slug}`} className="flex items-center gap-3 no-underline">
            {vendor.company_logo && (
              <div className="relative h-10 w-10 overflow-hidden rounded-md">
                <Image
                  src={resolveMediaUrl(vendor.company_logo)}
                  alt={vendor.company_name}
                  fill
                  className="object-contain"
                  priority
                  unoptimized
                />
              </div>
            )}
            <div className="flex flex-col justify-center">
              <span
                className="text-xl font-extrabold tracking-tight leading-none"
                style={{ color: primaryColor }}
              >
                {vendor.company_name || ''}
              </span>
              {((vendor as any).locality?.name || (vendor as any).district?.name || (vendor as any).company_address) && (
                <span className="text-[10px] uppercase font-bold tracking-widest mt-1 opacity-70" style={{ color: textColor }}>
                  {[
                    (vendor as any).locality?.name, 
                    // (vendor as any).district?.name
                  ].filter(Boolean).join(', ') || (vendor as any).company_address?.split(',')[0]}
                </span>
              )}
            </div>
          </Link>

          {/* Nav Links & Actions */}
          <div className="flex items-center gap-8">
            {navMenu.length > 0 && (
              <nav className="hidden md:flex items-center gap-6">
                {navMenu.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href || '#'}
                    className="text-sm font-semibold transition-colors hover:opacity-70"
                    style={{ color: textColor }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}

            {/* Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <Link 
                href={`/${slug}/login`} 
                className="text-sm font-semibold transition-colors hover:opacity-70 px-2 py-2"
                style={{ color: textColor }}
              >
                Login
              </Link>
              <Link 
                href={`/${slug}/register`} 
                className="text-sm font-bold px-5 py-2 rounded-full transition-all hover:scale-105 active:scale-95 shadow-sm"
                style={{ backgroundColor: primaryColor, color: '#ffffff' }}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
