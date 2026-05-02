import React from "react";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import type { PublicVendorData } from "@/hooks/use-public-vendor";
import { normalizeHomeBlocks } from "@/lib/safe-json";

type PublicBlock = {
  block_type: string;
  variant?: string;
  is_visible?: boolean;
};

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
    home_blocks: normalizeHomeBlocks(data.home_blocks),
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

export function visiblePublicBlocks(data: PublicVendorData): PublicBlock[] {
  return normalizeHomeBlocks(data.home_blocks).filter((block) => block.is_visible);
}

export default function PublicVendorShell({
  data,
  slug,
  children,
  className = "flex-1",
  fallbackShellBlocks = false,
}: PublicVendorShellProps) {
  const vendorBundle = buildPublicVendorBundle(data, slug);
  const visibleBlocks = visiblePublicBlocks(data);
  const headerBlock = visibleBlocks.find((block) => block.block_type === "header");
  const footerBlock = visibleBlocks.find((block) => block.block_type === "footer");
  const shouldRenderHeader = headerBlock || fallbackShellBlocks;
  const shouldRenderFooter = footerBlock || fallbackShellBlocks;

  return (
    <div style={publicColorStyle(data.colors)} className="flex min-h-screen flex-col bg-white">
      {shouldRenderHeader && (
        <BlockRenderer
          block_type="header"
          visible={true}
          settings={{ variant: headerBlock?.variant || "variant_1" }}
          vendorData={vendorBundle}
        />
      )}
      <main className={className}>{children}</main>
      {shouldRenderFooter && (
        <BlockRenderer
          block_type="footer"
          visible={true}
          settings={{ variant: footerBlock?.variant || "variant_1" }}
          vendorData={vendorBundle}
        />
      )}
    </div>
  );
}
