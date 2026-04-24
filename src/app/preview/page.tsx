"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { ThemeColors, PreviewData } from "./types";

import SimpleSlider      from "./simple_slider";
import AdvanceSlider     from "./advance_slider";
import AboutUs           from "./about_us";
import PortfolioClients  from "./portfolio_clients";
import PortfolioSponsors from "./portfolio_sponsors";
import PortfolioEvents   from "./portfolio_events";
import Gallery           from "./gallery";
import Testimonial       from "./testimonial";
import Subscription      from "./subscription";

// ─── Block dispatcher ──────────────────────────────────────────────────────

function BlockPreview({
  block,
  variant,
  colors,
  data,
}: {
  block: string;
  variant: string;
  colors?: ThemeColors;
  data?: PreviewData;
}) {
  if (block === "simple_slider")      return <SimpleSlider      variant={variant} colors={colors} sliders={data?.sliders} />;
  if (block === "advance_slider")     return <AdvanceSlider     variant={variant} colors={colors} sliders={data?.sliders} />;
  if (block === "about_us")           return <AboutUs           variant={variant} colors={colors} vendor={data?.vendor} />;
  if (block === "portfolio_clients")  return <PortfolioClients  variant={variant} colors={colors} items={data?.portfolio?.clients} />;
  if (block === "portfolio_sponsors") return <PortfolioSponsors variant={variant} colors={colors} items={data?.portfolio?.sponsors} />;
  if (block === "portfolio_events")   return <PortfolioEvents   variant={variant} colors={colors} items={data?.portfolio?.events} />;
  if (block === "gallery")            return <Gallery           variant={variant} colors={colors} groups={data?.gallery} />;
  if (block === "testimonial")        return <Testimonial       variant={variant} colors={colors} items={data?.testimonials} />;
  if (block === "subscription")       return <Subscription      variant={variant} colors={colors} plans={data?.plans} />;
  return (
    <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
      Unknown block: {block}
    </div>
  );
}

// ─── Shared vendor data hook ──────────────────────────────────────────────────

function useVendorPreviewData() {
  const [data, setData] = React.useState<PreviewData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const params = useSearchParams();
  const vendorIdParam = params.get("vendorId");

  React.useEffect(() => {
    // If vendorId is provided in URL, we use the public endpoint (bypasses cookie issues in iframes)
    // Otherwise fall back to the authenticated "me" endpoint
    const url = vendorIdParam 
      ? `${process.env.NEXT_PUBLIC_API_URL}/vendors/${vendorIdParam}/preview-data`
      : `${process.env.NEXT_PUBLIC_API_URL}/vendors/auth/preview-data`;

    fetch(url, {
      credentials: "include",
    })
      .then(r => r.json())
      .then(res => { setData(res?.data ?? res); setLoading(false); })
      .catch(() => setLoading(false));
  }, [vendorIdParam]);

  return { data, loading };
}

// ─── Full theme preview ──────────────────────────────────────────────────────

function FullThemePreview({ themeId }: { themeId: string }) {
  const [theme, setTheme] = React.useState<any>(null);
  const [themeLoading, setThemeLoading] = React.useState(true);
  const { data: vendorData, loading: vendorLoading } = useVendorPreviewData();

  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/themes/${themeId}`)
      .then(r => r.json())
      .then(res => { setTheme(res?.data ?? res); setThemeLoading(false); })
      .catch(() => setThemeLoading(false));
  }, [themeId]);

  if (themeLoading || vendorLoading) return <div className="flex items-center justify-center min-h-screen text-sm text-gray-400">Loading preview…</div>;
  if (!theme) return <div className="flex items-center justify-center min-h-screen text-sm text-red-400">Theme not found.</div>;

  const colors: ThemeColors = {
    primary_color:   theme.primary_color,
    secondary_color: theme.secondary_color,
    header_color:    theme.header_color,
    footer_color:    theme.footer_color,
    text_color:      theme.text_color,
    hover_color:     theme.hover_color,
  };

  const blocks: Array<{ block_type: string; variant: string; is_visible: boolean }> =
    Array.isArray(theme.home_blocks)
      ? theme.home_blocks
      : typeof theme.home_blocks === "string"
        ? JSON.parse(theme.home_blocks)
        : [];

  const visibleBlocks = blocks.filter(b => b.is_visible);

  return (
    <div className="min-h-screen bg-white">
      <header className="h-14 flex items-center px-8 border-b font-bold text-sm" style={{ backgroundColor: colors.header_color || "#ffffff", color: colors.text_color || "#1f2937" }}>
        {vendorData?.vendor?.company_name || theme.name || "Theme Preview"}
      </header>

      <main>
        {visibleBlocks.length === 0 ? (
          <div className="flex items-center justify-center py-24 text-gray-400 text-sm">No visible blocks configured.</div>
        ) : (
          visibleBlocks.map((block, i) => (
            <BlockPreview
              key={i}
              block={block.block_type}
              variant={block.variant || "variant_1"}
              colors={colors}
              data={vendorData ?? undefined}
            />
          ))
        )}
      </main>

      <footer className="h-12 flex items-center justify-center border-t text-xs text-gray-400" style={{ backgroundColor: colors.footer_color || "#f9fafb" }}>
        © {vendorData?.vendor?.company_name || theme.name} — All rights reserved.
      </footer>
    </div>
  );
}

// ─── Single block preview ──────────────────────────────────────────────────────

function SingleBlockPreview({ block, variant }: { block: string; variant: string }) {
  const { data: vendorData, loading } = useVendorPreviewData();

  if (loading) return <div className="flex items-center justify-center min-h-screen text-sm text-gray-400">Loading…</div>;

  return (
    <div className="min-h-screen bg-white">
      <BlockPreview block={block} variant={variant} data={vendorData ?? undefined} />
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

function PreviewPageInner() {
  const params  = useSearchParams();
  const block   = params.get("block");
  const variant = params.get("variant") || "variant_1";
  const themeId = params.get("themeId");

  if (themeId) return <FullThemePreview themeId={themeId} />;

  if (block) return <SingleBlockPreview block={block} variant={variant} />;

  return (
    <div className="flex items-center justify-center min-h-screen text-gray-400 text-sm">
      No preview params provided. Use ?block=simple_slider&variant=variant_1 or ?themeId=5
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-sm text-gray-400">Loading…</div>}>
      <PreviewPageInner />
    </Suspense>
  );
}
