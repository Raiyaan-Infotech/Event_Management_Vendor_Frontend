"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Edit, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import { toast } from "sonner";
import {
  useEventHighlights,
  useUpdateEventHighlights,
} from "@/hooks/use-vendor-portfolio";

const REQUIRED_ROWS = 4;

interface Row {
  label: string;
  value: string;
}

const emptyRow = (): Row => ({ label: "", value: "" });

export default function EventsHighlightsForm() {
  const router = useRouter();

  const { data: existing } = useEventHighlights();
  const updateEvents = useUpdateEventHighlights();

  const [header, setHeader] = useState("");
  const [detail, setDetail] = useState("");
  const [rows, setRows] = useState<Row[]>(() =>
    Array.from({ length: REQUIRED_ROWS }, emptyRow)
  );
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<{
    header?: string;
    detail?: string;
    rows?: Array<{ label?: string; value?: string }>;
  }>({});

  // Quick lookup for inline red borders
  const rowErr = (i: number, key: "label" | "value") => errors.rows?.[i]?.[key];

  useEffect(() => {
    if (existing && existing.length > 0) {
      // Extract Header and Detail if they exist as special labels
      const h = existing.find((e) => e.label === "Header")?.value || "";
      const d = existing.find((e) => e.label === "Detail")?.value || "";
      setHeader(h);
      setDetail(d);

      // Remaining are highlights
      const highlights = existing.filter(
        (e) => e.label !== "Header" && e.label !== "Detail"
      );
      const loaded = highlights.map((e) => ({ label: e.label, value: e.value }));
      while (loaded.length < REQUIRED_ROWS) loaded.push(emptyRow());
      setRows(loaded.slice(0, REQUIRED_ROWS));
    }
  }, [existing]);

  const updateRow = (index: number, key: keyof Row, val: string) => {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [key]: val } : r))
    );
    if (errors.rows?.[index]?.[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        if (next.rows) {
          next.rows = next.rows.map((row, i) =>
            i === index ? { ...row, [key]: "" } : row
          );
        }
        return next;
      });
    }
  };

  const handleReset = () => {
    if (!existing || existing.length === 0) {
      setHeader("");
      setDetail("");
      setRows(Array.from({ length: REQUIRED_ROWS }, emptyRow));
    } else {
      const h = existing.find((e) => e.label === "Header")?.value || "";
      const d = existing.find((e) => e.label === "Detail")?.value || "";
      setHeader(h);
      setDetail(d);
      const highlights = existing.filter((e) => e.label !== "Header" && e.label !== "Detail");
      const loaded = highlights.map((e) => ({ label: e.label, value: e.value }));
      while (loaded.length < REQUIRED_ROWS) loaded.push(emptyRow());
      setRows(loaded.slice(0, REQUIRED_ROWS));
    }
    toast.info("Reset to last saved values.");
  };

  const handleSave = async () => {
    const newErrors: typeof errors = { rows: [] };
    if (!header.trim()) newErrors.header = "Header is required";
    if (!detail.trim()) newErrors.detail = "Detail is required";
    const rowErrs = rows.map((r) => ({
      label: r.label.trim() ? "" : "Required",
      value: r.value.trim() ? "" : "Required",
    }));
    newErrors.rows = rowErrs;
    const hasAnyRowErr = rowErrs.some((e) => e.label || e.value);

    if (newErrors.header || newErrors.detail || hasAnyRowErr) {
      setErrors(newErrors);
      toast.error("Please fill all mandatory fields.");
      return;
    }
    setErrors({});

    const allItems = [
      { label: "Header", value: header.trim() },
      { label: "Detail", value: detail.trim() },
      ...rows.map((row) => ({ label: row.label.trim(), value: row.value.trim() })),
    ];

    await updateEvents.mutateAsync(allItems);
    setIsEditing(false);
  };

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto custom-scrollbar bg-[#F8FAFC] dark:bg-black/40">
      <div className="max-w-[1700px] mx-auto px-6 py-8">
        <PageHeader
          title="Edit Events Highlights"
          subtitle="Configure performance statistics shown on your website."
          rightContent={
            <Button
              type="button"
              variant="outline"
              onClick={() => window.open("/preview?block=portfolio_events", "_blank")}
              className="h-10 rounded-[var(--vendor-radius-control)] gap-2 font-black text-[12px] uppercase tracking-wide"
            >
              <ExternalLink size={15} /> Preview
            </Button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10 items-start pb-20">
          <div className="lg:col-span-9 space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
            <Card className="border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none bg-white dark:bg-sidebar rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-10 pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[var(--vendor-radius-panel)] bg-blue-500/10 flex items-center justify-center text-[var(--vendor-primary-btn)]">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-[var(--vendor-title-text)] font-bold uppercase tracking-tighter">
                      Events Highlights
                    </CardTitle>
                    <CardDescription className="text-xs font-bold text-[var(--vendor-text-muted)] uppercase tracking-wide mt-1">
                      Header, Detail, and {REQUIRED_ROWS} required highlights (Label
                      + Value).
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-10 pt-8 space-y-4">
                {/* Header and Detail Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-[var(--vendor-border)] dark:border-white/5 mb-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--vendor-text-muted)] uppercase tracking-[0.2em] ml-1">
                      Header <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={header}
                      disabled={!isEditing}
                      onChange={(e) => {
                        setHeader(e.target.value);
                        if (errors.header) setErrors((p) => ({ ...p, header: "" }));
                      }}
                      placeholder="e.g. Our Success Stories"
                      className={cn(
                        "h-14 rounded-[var(--vendor-radius-panel)] dark:border-white/5 bg-gray-50/30 focus:bg-white dark:bg-black/20 transition-all font-bold disabled:opacity-70",
                        errors.header
                          ? "border-rose-500 ring-4 ring-rose-500/5"
                          : "border-[var(--vendor-border)]"
                      )}
                    />
                    {errors.header && (
                      <p className="text-[11px] font-semibold text-rose-500 ml-1">{errors.header}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--vendor-text-muted)] uppercase tracking-[0.2em] ml-1">
                       Detail <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={detail}
                      disabled={!isEditing}
                      onChange={(e) => {
                        setDetail(e.target.value);
                        if (errors.detail) setErrors((p) => ({ ...p, detail: "" }));
                      }}
                      placeholder="e.g. Statistics of our best events"
                      className={cn(
                        "h-14 rounded-[var(--vendor-radius-panel)] dark:border-white/5 bg-gray-50/30 focus:bg-white dark:bg-black/20 transition-all font-bold disabled:opacity-70",
                        errors.detail
                          ? "border-rose-500 ring-4 ring-rose-500/5"
                          : "border-[var(--vendor-border)]"
                      )}
                    />
                    {errors.detail && (
                      <p className="text-[11px] font-semibold text-rose-500 ml-1">{errors.detail}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4 ml-1">
                  <p className="text-[var(--vendor-control-text)] font-semibold text-[var(--vendor-primary-btn)] uppercase tracking-[0.2em]">
                    Highlights Statistics
                  </p>
                  <div className="h-[1px] flex-1 bg-blue-50 dark:bg-blue-900/20" />
                </div>

                {rows.map((row, index) => (
                    <div key={index} className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-3 px-1">
                        <label className="flex-1 text-[10px] font-black text-[var(--vendor-text-muted)] uppercase tracking-[0.2em]">
                          Highlight {index + 1} Label <span className="text-rose-500 ml-1">*</span>
                        </label>
                        <label className="w-48 sm:w-56 text-[10px] font-black text-[var(--vendor-text-muted)] uppercase tracking-[0.2em]">
                          Value <span className="text-rose-500 ml-1">*</span>
                        </label>
                        <div className="w-12 shrink-0" />
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <Input
                            value={row.label}
                            disabled={!isEditing}
                            onChange={(e) => updateRow(index, "label", e.target.value)}
                            placeholder="Label (e.g. Past Events)"
                            aria-label={`Highlight ${index + 1} label`}
                            className={cn(
                              "h-14 rounded-[var(--vendor-radius-panel)] dark:border-white/5 bg-gray-50/30 focus:bg-white dark:bg-black/20 transition-all font-bold disabled:opacity-70",
                              rowErr(index, "label")
                                ? "border-rose-500 ring-4 ring-rose-500/5"
                                : "border-[var(--vendor-border)]"
                            )}
                          />
                          {rowErr(index, "label") && (
                            <p className="text-[11px] font-semibold text-rose-500 mt-1 ml-1">{rowErr(index, "label")}</p>
                          )}
                        </div>

                        <div className="w-48 sm:w-56">
                          <Input
                            value={row.value}
                            disabled={!isEditing}
                            onChange={(e) => updateRow(index, "value", e.target.value)}
                            placeholder="Value"
                            aria-label={`Highlight ${index + 1} value`}
                            className={cn(
                              "h-14 rounded-[var(--vendor-radius-panel)] dark:border-white/5 bg-gray-50/30 focus:bg-white dark:bg-black/20 transition-all font-bold text-center disabled:opacity-70",
                              rowErr(index, "value")
                                ? "border-rose-500 ring-4 ring-rose-500/5"
                                : "border-[var(--vendor-border)]"
                            )}
                          />
                          {rowErr(index, "value") && (
                            <p className="text-[11px] font-semibold text-rose-500 mt-1 ml-1">{rowErr(index, "value")}</p>
                          )}
                        </div>

                        <div className="w-12 h-14 shrink-0" />
                      </div>
                    </div>
                ))}

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[10px] font-bold text-[var(--vendor-text-muted)] uppercase tracking-wide">
                    {REQUIRED_ROWS} / {REQUIRED_ROWS} required highlights
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8 animate-in fade-in slide-in-from-right duration-1000">
            <div className="bg-[var(--vendor-panel-bg)] backdrop-blur-md p-6 rounded-[2.5rem] border border-[var(--vendor-border)] dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
              <Button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={cn(
                  "w-full h-12 font-bold text-[13px] tracking-[0.1em] uppercase rounded-[var(--vendor-radius-panel)] shadow-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-3",
                  isEditing
                    ? "bg-amber-500 text-white border-none hover:bg-amber-600 shadow-amber-500/20"
                    : "bg-white dark:bg-[#1e293b] text-[var(--vendor-text)] border border-[var(--vendor-border)] dark:border-[var(--vendor-border)] hover:bg-gray-50 dark:hover:bg-gray-800/50"
                )}
              >
                <Edit className="size-4" />
                EDIT
              </Button>
              <PersistenceActions
                onSave={handleSave}
                onReset={handleReset}
                onCancel={() => router.back()}
                onPreview={() => window.open("/preview?block=portfolio_events", "_blank")}
                saveLabel={updateEvents.isPending ? "Saving..." : "Update Events"}
                saveIcon={Edit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
