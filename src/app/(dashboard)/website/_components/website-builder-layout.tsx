"use client";

import type * as React from "react";
import { HelpCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface WebsiteBuilderBreadcrumbItem {
  label: string;
  href?: string;
}

interface WebsiteBuilderLayoutProps {
  title: string;
  breadcrumbs?: WebsiteBuilderBreadcrumbItem[];
  form: React.ReactNode;
  preview: React.ReactNode;
  previewTitle?: string;
  previewSubtitle?: string;
  saveLabel?: string;
  howItWorksLabel?: string;
  onSave?: () => void;
  onHowItWorks?: () => void;
  isSaving?: boolean;
  disableSave?: boolean;
  topActions?: React.ReactNode;
  previewActions?: React.ReactNode;
  leftClassName?: string;
  rightClassName?: string;
  contentClassName?: string;
  className?: string;
}

export function WebsiteBuilderLayout({
  title,
  breadcrumbs = [],
  form,
  preview,
  previewTitle = "Live Preview",
  previewSubtitle,
  saveLabel = "Save Changes",
  howItWorksLabel = "How It Works",
  onSave,
  onHowItWorks,
  isSaving = false,
  disableSave = false,
  topActions,
  previewActions,
  leftClassName,
  rightClassName,
  contentClassName,
  className,
}: WebsiteBuilderLayoutProps) {
  return (
    <div className={cn("min-h-full bg-[var(--vendor-page-bg)] px-5 py-5 lg:px-7", className)}>
      <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-black tracking-tight text-[var(--vendor-text)]">
            {title}
          </h1>
          {breadcrumbs.length ? (
            <nav
              className="mt-2 flex flex-wrap items-center gap-2 text-[13px] font-semibold text-[var(--vendor-text-muted)]"
              aria-label="Breadcrumb"
            >
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
                    {item.href && !isLast ? (
                      <a className="hover:text-[var(--vendor-primary-btn)]" href={item.href}>
                        {item.label}
                      </a>
                    ) : (
                      <span className={isLast ? "text-[var(--vendor-text)]" : undefined}>
                        {item.label}
                      </span>
                    )}
                    {!isLast ? <span className="text-[var(--vendor-text-muted)]">›</span> : null}
                  </span>
                );
              })}
            </nav>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {topActions}
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onHowItWorks}
            className="h-10 px-5"
          >
            <HelpCircle className="h-4 w-4" />
            {howItWorksLabel}
          </Button>
          <Button
            type="button"
            size="lg"
            onClick={onSave}
            disabled={disableSave || isSaving}
            className="h-10 px-5 shadow-sm"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : saveLabel}
          </Button>
        </div>
      </header>

      <div
        className={cn(
          "grid min-h-[calc(100vh-190px)] grid-cols-1 gap-5 xl:grid-cols-[minmax(560px,0.52fr)_minmax(0,1fr)]",
          contentClassName,
        )}
      >
        <aside
          className={cn(
            "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-5 shadow-sm",
            leftClassName,
          )}
        >
          {form}
        </aside>

        <section
          className={cn(
            "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-5 shadow-sm",
            rightClassName,
          )}
        >
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
                <h2 className="text-[15px] font-black tracking-tight text-[var(--vendor-text)]">
                  {previewTitle}
                </h2>
              </div>
              {previewSubtitle ? (
                <p className="ml-5 mt-2 text-[13px] font-medium leading-5 text-[var(--vendor-text-muted)]">
                  {previewSubtitle}
                </p>
              ) : null}
            </div>
            {previewActions ? <div className="shrink-0">{previewActions}</div> : null}
          </div>

          {preview}
        </section>
      </div>
    </div>
  );
}
