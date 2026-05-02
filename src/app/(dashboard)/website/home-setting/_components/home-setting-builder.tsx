"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useVendorHomeBlocks, useSaveVendorHomeBlocks } from "@/hooks/use-vendor-home-blocks";
import { useVendorAbout } from "@/hooks/use-vendors";
import { useUiBlocks } from "@/hooks/use-ui-blocks";
import type { HomeBlock } from "@/types/home-blocks";
import BlockPalette from "./block-palette";
import ComposedList from "./composed-list";
import ActionsPanel from "./actions-panel";
import { ThreePanelBuilderSkeleton } from "@/components/boneyard/three-panel-builder-skeleton";

export default function HomeSettingBuilder() {
  const { data, isLoading } = useVendorHomeBlocks();
  const { data: vendor }    = useVendorAbout();
  const { data: catalog = [], isLoading: catalogLoading } = useUiBlocks();

  const [blocks, setBlocks]   = useState<HomeBlock[]>([]);
  const [initial, setInitial] = useState<HomeBlock[]>([]);

  // Sync server data into local state on first load
  useEffect(() => {
    if (data) {
      setBlocks((_prev) => data);
      setInitial(data);
    }
  }, [data]);

  const dirty = useMemo(
    () => JSON.stringify(blocks) !== JSON.stringify(initial),
    [blocks, initial]
  );

  const { mutate: save, isPending: isSubmitting } = useSaveVendorHomeBlocks(() => {
    // After successful save, update the "initial" snapshot so dirty resets
    setInitial((_prev) => blocks);
  });

  // ── handlers ──────────────────────────────────────────────────────────────

  const handleAdd = (block_type: string) => {
    // Guard: one instance per type
    if (blocks.some((b) => b.block_type === block_type)) return;
    const defaultVariant = catalog.find((c) => c.block_type === block_type)?.variants[0]?.id ?? 'variant_1';
    setBlocks((prev) => [...prev, { block_type, variant: defaultVariant, is_visible: true }]);
  };

  const handleListChange = (updated: HomeBlock[]) => {
    setBlocks((_prev) => updated);
  };

  const handleSave = () => {
    save(blocks);
  };

  const handleReset = () => {
    setBlocks((_prev) => initial);
  };

  const handlePreview = () => {
    window.open("/website/home-setting/preview", "_blank");
  };

  const addedTypes = useMemo(
    () => new Set(blocks.map((b) => b.block_type)),
    [blocks]
  );

  // ── loading skeleton ───────────────────────────────────────────────────────

  if (isLoading || catalogLoading) {
    return <ThreePanelBuilderSkeleton />;
  }

  // ── main layout ────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-6 items-start">
      {/* Left: Palette */}
      <BlockPalette addedTypes={addedTypes} onAdd={handleAdd} catalog={catalog} />

      {/* Middle: Composed list */}
      <ComposedList blocks={blocks} onChange={handleListChange} vendor={vendor} catalog={catalog} />

      {/* Right: Actions */}
      <ActionsPanel
        onSave={handleSave}
        onReset={handleReset}
        onPreview={handlePreview}
        dirty={dirty}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
