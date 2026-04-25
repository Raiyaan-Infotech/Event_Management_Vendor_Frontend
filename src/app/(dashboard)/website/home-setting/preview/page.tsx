"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useVendorHomeBlocks } from "@/hooks/use-vendor-home-blocks";
import { useVendorAbout } from "@/hooks/use-vendors";
import { useUiBlocks } from "@/hooks/use-ui-blocks";
import { resolveIcon, type BlockCatalogEntry } from "@/types/home-blocks";
import { resolveMediaUrl } from "@/lib/utils";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import type { NavMenuItem, VendorAbout } from "@/hooks/use-vendors";

// ─── Header ─────────────────────────────────────────────────────────────────

const DEFAULT_NAV: NavMenuItem[] = [
  { label: "Home",       page_ids: [], order: 0, children: [] },
  { label: "About Us",   page_ids: [], order: 1, children: [] },
  { label: "Contact Us", page_ids: [], order: 2, children: [] },
];

function PreviewHeader({ vendor }: { vendor?: VendorAbout }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navItems = vendor?.nav_menu?.length ? vendor.nav_menu : DEFAULT_NAV;
  const city = vendor?.district?.name ?? vendor?.locality?.name ?? null;

  return (
    <header className="flex items-center px-6 py-3 border-b bg-white dark:bg-zinc-900 gap-4 sticky top-0 z-40 shadow-sm">
      {/* Logo + name */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-md border bg-muted flex items-center justify-center overflow-hidden shrink-0">
          {vendor?.company_logo ? (
            <Image src={resolveMediaUrl(vendor.company_logo)} alt="Logo" width={40} height={40} className="object-contain" />
          ) : (
            <span className="text-sm font-bold text-muted-foreground">
              {vendor?.company_name?.charAt(0)?.toUpperCase() ?? "V"}
            </span>
          )}
        </div>
        <div>
          <p className="text-sm font-bold leading-tight">{vendor?.company_name ?? "Company Name"}</p>
          {city && <p className="text-[11px] text-muted-foreground">{city}</p>}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-1 ml-6">
        {navItems.slice(0, 6).map((item) => {
          const hasChildren = item.children?.length > 0;
          const isOpen = openMenu === item.label;
          return (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => hasChildren && setOpenMenu(item.label)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <span className="flex items-center gap-0.5 px-3 py-2 rounded text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground transition-colors cursor-default select-none">
                {item.label}
                {hasChildren && (
                  <ChevronDown className={`size-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                )}
              </span>
              {hasChildren && isOpen && (
                <div className="absolute top-full left-0 mt-1 min-w-[180px] rounded-md border bg-card shadow-xl py-2 z-50">
                  {item.children.map((child) => (
                    <div key={child.page_id} className="px-4 py-2 hover:bg-accent cursor-default">
                      <p className="text-sm font-semibold text-foreground">{child.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </header>
  );
}

// ─── Block placeholder ───────────────────────────────────────────────────────

function BlockPlaceholder({ block_type, visible, catalog }: { block_type: string; visible: boolean; catalog: BlockCatalogEntry[] }) {
  const entry = catalog.find((c) => c.block_type === block_type);
  const Icon = entry ? resolveIcon(entry.icon) : null;

  return (
    <section
      className={`border-2 border-dashed rounded-xl mx-6 my-4 px-8 py-10 flex flex-col items-center justify-center gap-3 transition-opacity ${
        visible ? "border-border opacity-100" : "border-muted opacity-40"
      }`}
    >
      {Icon && <Icon className="size-8 text-muted-foreground/50" />}
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground/70">{entry?.label ?? block_type}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{entry?.description}</p>
      </div>
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
        visible
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-muted text-muted-foreground"
      }`}>
        {visible ? "Visible" : "Hidden"}
      </span>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function PreviewFooter({ vendor }: { vendor?: VendorAbout }) {
  const columns   = vendor?.footer_links ?? [];
  const copywrite = vendor?.copywrite ?? `© ${vendor?.company_name ?? "Your Company"}. All rights reserved.`;
  const poweredby = vendor?.poweredby ?? null;
  const socials   = vendor?.social_visibility ?? {};

  const socialLinks = [
    { key: "facebook",  label: "f",  url: vendor?.facebook  },
    { key: "twitter",   label: "𝕏",  url: vendor?.twitter   },
    { key: "instagram", label: "ig", url: vendor?.instagram  },
    { key: "youtube",   label: "▶",  url: vendor?.youtube   },
    { key: "linkedin",  label: "in", url: vendor?.linkedin   },
    { key: "whatsapp",  label: "w",  url: vendor?.whatsapp  },
  ].filter((s) => s.url && socials[s.key as keyof typeof socials] !== false);

  return (
    <footer className="border-t bg-white dark:bg-zinc-900 mt-6">
      <div className="flex flex-row gap-8 px-8 py-8 items-start">
        {/* Col 1 — Brand */}
        <div className="flex flex-col gap-3 w-56 shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded border bg-muted flex items-center justify-center overflow-hidden shrink-0">
              {vendor?.company_logo ? (
                <Image src={resolveMediaUrl(vendor.company_logo)} alt="Logo" width={36} height={36} className="object-contain" />
              ) : (
                <span className="text-sm font-bold text-muted-foreground">
                  {vendor?.company_name?.charAt(0)?.toUpperCase() ?? "V"}
                </span>
              )}
            </div>
            <p className="text-sm font-bold">{vendor?.company_name ?? "Company Name"}</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {vendor?.short_description ?? "Your company short description."}
          </p>
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {socialLinks.map((s) => (
                <span key={s.key} className="h-7 w-7 rounded border text-[10px] font-bold flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  {s.label}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="w-px self-stretch bg-border shrink-0" />

        {/* Middle — footer link columns */}
        <div className="flex flex-row gap-10 flex-1">
          {columns.length > 0 ? (
            columns.slice(0, 3).map((col, i) => (
              <div key={i} className="flex flex-col gap-2">
                <p className="text-sm font-bold">{col.heading}</p>
                {col.page_ids.length > 0 ? (
                  col.page_ids.slice(0, 6).map((pid) => (
                    <span key={pid} className="text-xs text-muted-foreground hover:text-foreground cursor-default">
                      Page #{pid}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground/50 italic">No pages</span>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground/50 italic">No footer columns configured.</p>
          )}
        </div>

        <div className="w-px self-stretch bg-border shrink-0" />

        {/* Contact col */}
        <div className="flex flex-col gap-2 w-48 shrink-0">
          <p className="text-sm font-bold">Contact</p>
          {(vendor?.company_contact || vendor?.contact) && (
            <p className="text-xs text-muted-foreground">📞 {vendor.company_contact ?? vendor.contact}</p>
          )}
          {(vendor?.company_email || vendor?.email) && (
            <p className="text-xs text-muted-foreground break-all">✉ {vendor.company_email ?? vendor.email}</p>
          )}
          {(vendor?.company_address || vendor?.address) && (
            <p className="text-xs text-muted-foreground leading-relaxed">📍 {vendor.company_address ?? vendor.address}</p>
          )}
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t px-8 py-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{copywrite}</span>
        {poweredby && <span>Powered by {poweredby}</span>}
      </div>
    </footer>
  );
}

// ─── Preview page ─────────────────────────────────────────────────────────────

export default function HomeSettingPreviewPage() {
  const { data: blocks = [], isLoading: blocksLoading } = useVendorHomeBlocks();
  const { data: vendor, isLoading: vendorLoading }      = useVendorAbout();
  const { data: catalog = [], isLoading: catalogLoading } = useUiBlocks();

  const [showHidden, setShowHidden] = useState(true);

  const visibleBlocks = showHidden ? blocks : blocks.filter((b) => b.is_visible);

  if (blocksLoading || vendorLoading || catalogLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground text-sm">
        Loading preview…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Preview toolbar */}
      <div className="sticky top-0 z-50 bg-zinc-900 text-white px-4 py-2 flex items-center gap-4 text-xs">
        <span className="font-semibold tracking-wide uppercase">Home Preview</span>
        <span className="text-zinc-400">·</span>
        <span className="text-zinc-400">{blocks.length} blocks configured</span>
        <button
          onClick={() => setShowHidden((v) => !v)}
          className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-700 hover:bg-zinc-600 transition-colors"
        >
          {showHidden ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
          {showHidden ? "Showing hidden blocks" : "Hiding hidden blocks"}
        </button>
        <button
          onClick={() => window.close()}
          className="px-3 py-1 rounded bg-zinc-700 hover:bg-zinc-600 transition-colors"
        >
          Close
        </button>
      </div>

      {/* Site preview */}
      <div className="flex-1 bg-background shadow-2xl max-w-5xl mx-auto w-full my-4 rounded-xl overflow-hidden border">
        <PreviewHeader vendor={vendor} />

        <main className="py-2">
          {visibleBlocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
              <p className="text-sm font-medium">No blocks to preview</p>
              <p className="text-xs">Add blocks in Home Setting and save to see them here.</p>
            </div>
          ) : (
            visibleBlocks.map((block) => (
              <BlockPlaceholder
                key={block.block_type}
                block_type={block.block_type}
                visible={block.is_visible}
                catalog={catalog}
              />
            ))
          )}
        </main>

        <PreviewFooter vendor={vendor} />
      </div>
    </div>
  );
}
