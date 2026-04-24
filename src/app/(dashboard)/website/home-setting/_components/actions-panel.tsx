"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Eye, ExternalLink, Palette, Layers, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ActionsPanelProps {
  onSave: () => void;
  onReset: () => void;
  onPreview: () => void;
  dirty: boolean;
  isSubmitting: boolean;
}

export default function ActionsPanel({
  onSave,
  onReset,
  onPreview,
  dirty,
  isSubmitting,
}: ActionsPanelProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3">
      {/* Save / Reset */}
      <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          Actions
        </p>
        <Button
          id="home-setting-save-btn"
          onClick={onSave}
          disabled={!dirty || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Saving…" : "Save Layout"}
        </Button>
        <Button
          id="home-setting-reset-btn"
          variant="outline"
          onClick={onReset}
          disabled={!dirty || isSubmitting}
          className="w-full"
        >
          Reset
        </Button>
      </div>

      {/* Preview */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Preview
        </p>
        <Button
          id="home-setting-preview-btn"
          variant="outline"
          className="w-full gap-2"
          onClick={onPreview}
        >
          <Eye className="size-4" />
          Preview Site
          <ExternalLink className="size-3 ml-auto opacity-50" />
        </Button>
      </div>

      {/* Quick navigation */}
      <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col gap-1.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          Quick Links
        </p>
        {[
          { label: "Theme",      href: "/website/theme",  icon: Palette   },
          { label: "Edit Menu",  href: "/website/menu",   icon: Layers    },
          { label: "Edit Pages", href: "/website/pages",  icon: FileText  },
          { label: "Edit Footer",href: "/website/footer", icon: FileText  },
        ].map(({ label, href, icon: Icon }) => (
          <Button
            key={href}
            id={`home-setting-link-${href.replace(/\//g, "-")}`}
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-sm"
            onClick={() => router.push(href)}
          >
            <Icon className="size-3.5 shrink-0" />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
