"use client";

import React, { useState, useEffect } from "react";
import {
  Plus, Save, X, GripVertical, ChevronRight, ChevronDown,
  Trash2, FileText, Layout, Search, Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useVendorAbout, useUpdateVendorAbout, NavMenuItem } from "@/hooks/use-vendors";
import { useVendorPages } from "@/hooks/use-vendor-pages";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavChild {
  page_id: number;
  label: string;
  order: number;
}

interface MenuNavItem {
  id: string;          // temp UI id
  label: string;       // parent heading
  page_ids: number[];  // selected page IDs
  order: number;
  children: NavChild[];
  isOpen: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MenuManagementContent() {
  const { data: vendor } = useVendorAbout();
  const updateMutation = useUpdateVendorAbout('Menu saved successfully');
  const { data: pagesData } = useVendorPages({ limit: 100 });
  const vendorPages = pagesData?.data ?? [];

  const [menuItems, setMenuItems] = useState<MenuNavItem[]>([]);
  const [menuLoaded, setMenuLoaded] = useState(false);

  // ── Load nav_menu from vendor on mount ────────────────────────────────────
  useEffect(() => {
    if (menuLoaded || !vendor) return;
    setMenuLoaded(true);
    const raw = vendor.nav_menu;
    if (raw?.length) {
      setMenuItems(
        raw.map((item, i) => ({
          id: `m${i}-loaded`,
          label: item.label,
          page_ids: item.page_ids,
          order: item.order,
          children: item.children,
          isOpen: false,
        }))
      );
    }
  }, [vendor, menuLoaded]);

  // ── Form state ────────────────────────────────────────────────────────────
  const [parentLabel, setParentLabel] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filteredPages = vendorPages.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const togglePage = (id: number) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const clearForm = () => {
    setParentLabel("");
    setSelectedIds([]);
    setSearch("");
    setEditingId(null);
  };

  // ── Enter edit mode ───────────────────────────────────────────────────────
  const handleEdit = (item: MenuNavItem) => {
    setEditingId(item.id);
    setParentLabel(item.label);
    setSelectedIds([...item.page_ids]);
    setSearch("");
  };

  // ── Create new item ───────────────────────────────────────────────────────
  const handleCreate = () => {
    if (!parentLabel.trim()) { toast.error("Enter a heading"); return; }
    if (selectedIds.length === 0) { toast.error("Select at least one page"); return; }

    const children: NavChild[] = selectedIds.map((pid, order) => {
      const page = vendorPages.find((p) => p.id === pid);
      return { page_id: pid, label: page?.name ?? `Page #${pid}`, order };
    });

    const newItem: MenuNavItem = {
      id: `m-${Date.now()}`,
      label: parentLabel.trim(),
      page_ids: selectedIds,
      order: menuItems.length,
      children,
      isOpen: true,
    };

    setMenuItems((prev) => [...prev, newItem]);
    toast.success(`Menu item "${parentLabel}" created`);
    clearForm();
  };

  // ── Update existing item ──────────────────────────────────────────────────
  const handleUpdate = () => {
    if (!parentLabel.trim()) { toast.error("Enter a heading"); return; }
    if (selectedIds.length === 0) { toast.error("Select at least one page"); return; }

    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id !== editingId) return item;
        const children: NavChild[] = selectedIds.map((pid, order) => {
          const page = vendorPages.find((p) => p.id === pid);
          return { page_id: pid, label: page?.name ?? `Page #${pid}`, order };
        });
        return { ...item, label: parentLabel.trim(), page_ids: selectedIds, children };
      })
    );
    toast.success(`Menu item "${parentLabel}" updated`);
    clearForm();
  };

  const handleDelete = (id: string) =>
    setMenuItems((prev) => prev.filter((item) => item.id !== id));

  const toggleOpen = (id: string) =>
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isOpen: !item.isOpen } : item))
    );

  // ── Drag reorder ──────────────────────────────────────────────────────────
  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const updated = [...menuItems];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, moved);
    setMenuItems(updated.map((item, i) => ({ ...item, order: i })));
    setDraggedIndex(null);
  };

  // ── Child reorder ─────────────────────────────────────────────────────────
  const moveChild = (menuId: string, childIndex: number, direction: "up" | "down") => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id !== menuId) return item;
        const children = [...item.children];
        const targetIndex = direction === "up" ? childIndex - 1 : childIndex + 1;
        if (targetIndex < 0 || targetIndex >= children.length) return item;
        [children[childIndex], children[targetIndex]] = [children[targetIndex], children[childIndex]];
        return { ...item, children: children.map((c, i) => ({ ...c, order: i })) };
      })
    );
  };

  // ── Save to API ───────────────────────────────────────────────────────────
  const handleSave = async () => {
    const nav_menu: NavMenuItem[] = menuItems.map((item, i) => ({
      label: item.label,
      page_ids: item.page_ids,
      order: i,
      children: item.children.map((c, j) => ({ ...c, order: j })),
    }));

    try {
      await updateMutation.mutateAsync({ nav_menu } as never);
      toast.success("Menu saved successfully");
    } catch {
      toast.error("Failed to save menu");
    }
  };

  const handleReset = () => {
    const raw = vendor?.nav_menu;
    if (raw?.length) {
      setMenuItems(
        raw.map((item, i) => ({
          id: `m${i}-reset`,
          label: item.label,
          page_ids: item.page_ids,
          order: item.order,
          children: item.children,
          isOpen: false,
        }))
      );
    } else {
      setMenuItems([]);
    }
    toast.info("Reset to last saved state");
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

      {/* ── LEFT: Create Menu Item ──────────────────────────────────────────── */}
      <div className="flex flex-col space-y-4 animate-in fade-in slide-in-from-left duration-700">
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <Layout className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {editingId ? "Edit Menu Item" : "Create Menu Item"}
                </CardTitle>
                <CardDescription className="text-xs">
                  {editingId ? "Update the heading or add/remove pages, then click Update." : "Type a heading, select pages, then click Create."}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            {/* Heading */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Menu Heading</Label>
              <Input
                placeholder="e.g. Services, About, Company"
                value={parentLabel}
                onChange={(e) => setParentLabel(e.target.value)}
                className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50"
              />
            </div>

            {/* Page search */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Select Pages</Label>
              <div className="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden bg-white/50 dark:bg-slate-900/50">
                <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-white/5">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-3.5" />
                    <input
                      placeholder="Search pages..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full h-9 pl-9 pr-3 bg-white dark:bg-sidebar border border-gray-200 dark:border-gray-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="max-h-[260px] overflow-y-auto custom-scrollbar p-1.5">
                  {filteredPages.length === 0 && (
                    <p className="text-center text-xs text-slate-400 py-6">No pages found</p>
                  )}
                  {filteredPages.map((page) => {
                    const checked = selectedIds.includes(page.id);
                    return (
                      <div
                        key={page.id}
                        onClick={() => togglePage(page.id)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all select-none",
                          checked
                            ? "bg-primary/5 border border-primary/20"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-transparent"
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-all",
                          checked ? "bg-primary border-primary text-white" : "border-gray-300 dark:border-gray-700 bg-white dark:bg-sidebar"
                        )}>
                          {checked && <span className="text-white text-[9px] font-black">✓</span>}
                        </div>
                        <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 flex-1">{page.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {selectedIds.length > 0 && (
                <p className="text-[11px] font-semibold text-primary px-1">{selectedIds.length} page{selectedIds.length > 1 ? "s" : ""} selected</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action row */}
        <div className="flex gap-3">
          <Button
            onClick={editingId ? handleUpdate : handleCreate}
            className="flex-[2] h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-[13px] tracking-[0.1em] uppercase rounded-2xl shadow-lg shadow-blue-500/25 border-none transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
          >
            {editingId ? <Pencil className="size-4" /> : <Plus className="size-4" />}
            {editingId ? "UPDATE" : "CREATE MENU"}
          </Button>
          <Button
            variant="outline"
            onClick={clearForm}
            className="flex-1 h-12 bg-white hover:bg-rose-600 border-2 border-red-500 text-red-500 hover:text-white transition-all duration-300 rounded-xl text-[13px] font-bold gap-2 active:scale-[0.98] flex items-center justify-center"
          >
            <X className="size-4" strokeWidth={2.5} />
            {editingId ? "CANCEL" : "CLEAR"}
          </Button>
        </div>
      </div>

      {/* ── RIGHT: Menu Hierarchy ───────────────────────────────────────────── */}
      <div className="flex flex-col space-y-4 animate-in fade-in slide-in-from-right duration-700 delay-300">
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                <GripVertical className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">Menu Structure</CardTitle>
                <CardDescription className="text-xs">Drag to reorder top-level items. Use arrows to reorder children.</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            {menuItems.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center gap-2">
                <p className="text-sm font-bold text-slate-400">No menu items yet</p>
                <p className="text-xs text-slate-400">Create your first menu item on the left.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                  >
                    {/* Parent row */}
                    <div className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 group transition-all cursor-move",
                      "bg-white dark:bg-slate-900 hover:border-blue-200 dark:hover:border-blue-900",
                      "shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]",
                    )}>
                      <GripVertical size={16} className="text-slate-300 dark:text-slate-700 group-hover:text-slate-500 flex-shrink-0" />

                      <button
                        onClick={() => toggleOpen(item.id)}
                        className="text-slate-400 hover:text-blue-500 transition-colors flex-shrink-0"
                      >
                        {item.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>

                      <span className="flex-1 text-sm font-bold text-slate-700 dark:text-slate-200 tracking-tight truncate">{item.label}</span>

                      <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full flex-shrink-0">
                        {item.children.length} page{item.children.length !== 1 ? "s" : ""}
                      </span>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 flex-shrink-0"
                        onClick={() => handleEdit(item)}
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex-shrink-0"
                        onClick={() => setDeleteTargetId(item.id)}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>

                    {/* Children */}
                    {item.isOpen && item.children.length > 0 && (
                      <div className="ml-8 mt-1.5 space-y-1.5 animate-in slide-in-from-top-1 duration-200">
                        {item.children.map((child, ci) => (
                          <div
                            key={child.page_id}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50"
                          >
                            <FileText size={13} className="text-slate-400 flex-shrink-0" />
                            <span className="flex-1 text-sm font-medium text-slate-600 dark:text-slate-300 truncate">{child.label}</span>
                            <div className="flex gap-0.5">
                              <button
                                disabled={ci === 0}
                                onClick={() => moveChild(item.id, ci, "up")}
                                className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                              >
                                <ChevronRight size={12} className="-rotate-90" />
                              </button>
                              <button
                                disabled={ci === item.children.length - 1}
                                onClick={() => moveChild(item.id, ci, "down")}
                                className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                              >
                                <ChevronRight size={12} className="rotate-90" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30 text-center">
              <p className="text-xs text-slate-400 font-medium italic">
                Drag parent items to reorder · Use arrows to reorder child pages
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action row */}
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="flex-[2] h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-[13px] tracking-[0.1em] uppercase rounded-2xl shadow-lg shadow-blue-500/25 border-none transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
          >
            <Save className="size-4" />
            {updateMutation.isPending ? "SAVING..." : "SAVE MENU"}
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1 h-12 bg-white hover:bg-rose-600 border-2 border-red-500 text-red-500 hover:text-white transition-all duration-300 rounded-xl text-[13px] font-bold gap-2 active:scale-[0.98] flex items-center justify-center"
          >
            <X className="size-4" strokeWidth={2.5} />
            RESET
          </Button>
        </div>
      </div>
    </div>

    {/* ── Delete Confirmation Dialog ─────────────────────────────────────── */}
    <Dialog open={!!deleteTargetId} onOpenChange={(open) => { if (!open) setDeleteTargetId(null); }}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
            Delete Menu Item
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            &ldquo;{menuItems.find((m) => m.id === deleteTargetId)?.label}&rdquo;
          </span>
          ? This action cannot be undone.
        </p>
        <DialogFooter className="gap-2 mt-2">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => setDeleteTargetId(null)}
          >
            Cancel
          </Button>
          <Button
            className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white border-none"
            onClick={() => {
              if (deleteTargetId) handleDelete(deleteTargetId);
              setDeleteTargetId(null);
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
