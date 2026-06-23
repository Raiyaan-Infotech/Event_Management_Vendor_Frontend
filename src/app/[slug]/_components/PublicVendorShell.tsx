import React from "react";
import type { PublicVendorData } from "@/hooks/use-public-vendor";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicFooter } from "@/components/public/PublicFooter";

interface PublicVendorShellProps {
  data: PublicVendorData;
  slug: string;
  children: React.ReactNode;
  className?: string;
  fallbackShellBlocks?: boolean;
}

export function buildPublicVendorBundle(data: PublicVendorData, slug: string) {
  return {
    ...data,
    pages: data.pages || [],
    slug,
  };
}

export function publicColorStyle(colors: PublicVendorData["colors"]): React.CSSProperties {
  return {
    "--color-primary": colors?.primary_color || "#2563eb",
    "--color-secondary": colors?.secondary_color || "#1d4ed8",
    "--color-header": colors?.header_color || "#ffffff",
    "--color-footer": colors?.footer_color || "#1e293b",
    "--color-text": colors?.text_color || "#1e293b",
    "--color-hover": colors?.hover_color || "#dbeafe",
  } as React.CSSProperties;
}

export default function PublicVendorShell({
  data,
  slug,
  children,
  className = "flex-1",
  fallbackShellBlocks = false,
}: PublicVendorShellProps) {
  const shouldRenderShell = fallbackShellBlocks;

  return (
    <div style={publicColorStyle(data.colors)} className="flex min-h-screen flex-col bg-white">
      {shouldRenderShell && (
        <PublicNavbar vendor={data.vendor} colors={data.colors} slug={slug} />
      )}
      <main className={className}>{children}</main>
      {shouldRenderShell && (
        <PublicFooter
          vendor={data.vendor}
          colors={data.colors}
          socialLinks={[]}
        />
      )}
    </div>
  );
}
