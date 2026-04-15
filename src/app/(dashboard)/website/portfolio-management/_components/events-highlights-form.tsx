"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import {
  useEventHighlights,
  useUpdateEventHighlights,
} from "@/hooks/use-vendor-portfolio";

const MIN_ROWS = 3;
const MAX_ROWS = 5;

interface Row {
  label: string;
  value: string;
}

const emptyRow = (): Row => ({ label: "", value: "" });

export default function EventsHighlightsForm() {
  const router = useRouter();

  const { data: existing } = useEventHighlights();
  const updateEvents = useUpdateEventHighlights();

  const [rows, setRows] = useState<Row[]>(() =>
    Array.from({ length: MIN_ROWS }, emptyRow)
  );

  useEffect(() => {
    if (existing && existing.length > 0) {
      const loaded = existing.map((e) => ({ label: e.label, value: e.value }));
      while (loaded.length < MIN_ROWS) loaded.push(emptyRow());
      setRows(loaded.slice(0, MAX_ROWS));
    }
  }, [existing]);

  const updateRow = (index: number, key: keyof Row, val: string) => {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [key]: val } : r))
    );
  };

  const addRow = () => {
    if (rows.length >= MAX_ROWS) return;
    setRows((prev) => [...prev, emptyRow()]);
  };

  const removeRow = (index: number) => {
    if (rows.length <= MIN_ROWS) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const cleaned = rows.filter((r) => r.label.trim() && r.value.trim());
    if (cleaned.length < MIN_ROWS) {
      return toast.error(
        `Please fill at least ${MIN_ROWS} rows (label and value).`
      );
    }
    await updateEvents.mutateAsync(cleaned);
  };

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto custom-scrollbar bg-[#F8FAFC] dark:bg-black/40">
      <div className="max-w-[1700px] mx-auto px-6 py-8">
        <PageHeader
          title="Events Highlights"
          subtitle="Configure performance statistics shown on your website."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10 items-start pb-20">
          <div className="lg:col-span-9 space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
            <Card className="border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none bg-white dark:bg-sidebar rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-10 pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tighter">
                      Events Highlights
                    </CardTitle>
                    <CardDescription className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                      {MIN_ROWS} required, up to {MAX_ROWS} rows. Label + value
                      per highlight.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-10 pt-8 space-y-4">
                {rows.map((row, index) => {
                  const canRemove = index >= MIN_ROWS;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
                    >
                      {/* Label input — takes remaining space */}
                      <div className="flex-1">
                        <Input
                          value={row.label}
                          onChange={(e) =>
                            updateRow(index, "label", e.target.value)
                          }
                          placeholder="Label (e.g. Past Events)"
                          className="h-14 rounded-2xl border-gray-100 dark:border-white/5 bg-gray-50/30 focus:bg-white dark:bg-black/20 transition-all font-bold"
                        />
                      </div>

                      {/* Value input — fixed width */}
                      <div className="w-48 sm:w-56">
                        <Input
                          value={row.value}
                          onChange={(e) =>
                            updateRow(index, "value", e.target.value)
                          }
                          placeholder="Value"
                          className="h-14 rounded-2xl border-gray-100 dark:border-white/5 bg-gray-50/30 focus:bg-white dark:bg-black/20 transition-all font-bold text-center"
                        />
                      </div>

                      {/* Action slot — fixed width, always present */}
                      <div className="w-12 h-14 flex items-center justify-center shrink-0">
                        {canRemove && (
                          <button
                            type="button"
                            onClick={() => removeRow(index)}
                            className="w-12 h-12 rounded-2xl border border-rose-100 dark:border-rose-500/20 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center justify-center transition-all"
                            title="Remove row"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* ADD button lives below the rows, not inside them */}
                <div className="flex items-center justify-between pt-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {rows.length} / {MAX_ROWS} rows • Min {MIN_ROWS} required
                  </p>
                  <Button
                    type="button"
                    onClick={addRow}
                    disabled={rows.length >= MAX_ROWS}
                    className={cn(
                      "h-11 px-5 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-[0_10px_20px_-5px_rgba(59,130,246,0.4)] transition-all disabled:opacity-40 disabled:shadow-none",
                      "bg-blue-600 hover:bg-blue-700 text-white"
                    )}
                  >
                    <Plus size={14} className="mr-1" /> Add Row
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8 animate-in fade-in slide-in-from-right duration-1000">
            <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <PersistenceActions
                onSave={handleSave}
                onCancel={() => router.back()}
                onPreview={() => toast.info("Preview coming soon!")}
                saveLabel={updateEvents.isPending ? "Saving…" : "Save Events"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}