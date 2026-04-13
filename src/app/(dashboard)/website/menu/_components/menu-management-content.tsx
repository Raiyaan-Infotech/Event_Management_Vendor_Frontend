"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Save, 
  X, 
  GripVertical, 
  ChevronRight, 
  ChevronDown, 
  Trash2,
  FileText,
  Layout,
  Settings2,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { WEBSITE_CONTENT_PAGES } from "@/lib/data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PageItem {
  id: string;
  name: string;
  selected: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  children?: MenuItem[];
  isOpen?: boolean;
}

export default function MenuManagementContent() {
  const [parentMenuName, setParentMenuName] = useState("");
  const [pages, setPages] = useState<PageItem[]>(() => {
    const specialPages = [
      { id: "about-company", name: "About Company", selected: false },
      { id: "footer", name: "Footer", selected: false },
    ];
    
    const dynamicPages = WEBSITE_CONTENT_PAGES.map(p => ({
      id: p.id.toString(),
      name: p.name,
      selected: false
    }));

    return [...specialPages, ...dynamicPages];
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedMenu = localStorage.getItem("website-menu-hierarchy");
    if (savedMenu) {
      try {
        setMenuItems(JSON.parse(savedMenu));
      } catch (e) {
        setMenuItems([{ id: "m1", label: "Our Clients" }]);
      }
    } else {
      setMenuItems([{ id: "m1", label: "Our Clients" }]);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever menuItems changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("website-menu-hierarchy", JSON.stringify(menuItems));
    }
  }, [menuItems, isLoaded]);

  const togglePageSelection = (id: string) => {
    setPages(prev => prev.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
  };

  const handleCreateMenu = () => {
    const selectedPages = pages.filter(p => p.selected);
    
    if (selectedPages.length === 0) {
      toast.error("Please select at least one page");
      return;
    }

    if (parentMenuName.trim()) {
      // Create Parent Menu with sub-menus
      const newItem: MenuItem = {
        id: `m-${Date.now()}`,
        label: parentMenuName,
        isOpen: true,
        children: selectedPages.map(p => ({
          id: `m-${Date.now()}-${p.id}`,
          label: p.name
        }))
      };
      setMenuItems(prev => [...prev, newItem]);
      toast.success(`Created menu "${parentMenuName}" with ${selectedPages.length} sub-menus`);
    } else {
      // Create selected pages as Top Level menus
      const newItems: MenuItem[] = selectedPages.map(p => ({
        id: `m-${Date.now()}-${p.id}`,
        label: p.name
      }));
      setMenuItems(prev => [...prev, ...newItems]);
      toast.success(`Added ${selectedPages.length} page(s) to the menu hierarchy`);
    }

    // Reset Form
    setParentMenuName("");
    setPages(prev => prev.map(p => ({ ...p, selected: false })));
  };

  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    
    const updatedItems = [...menuItems];
    const [movedItem] = updatedItems.splice(draggedItemIndex, 1);
    updatedItems.splice(index, 0, movedItem);
    
    setMenuItems(updatedItems);
    setDraggedItemIndex(null);
    toast.info("Menu order updated");
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(prev => {
      const deleteRecursive = (items: MenuItem[]): MenuItem[] => {
        return items
          .filter(item => item.id !== id)
          .map(item => ({
            ...item,
            children: item.children ? deleteRecursive(item.children) : undefined
          }));
      };
      return deleteRecursive(prev);
    });
    toast.success("Item removed from menu");
  };

  const toggleSubMenu = (id: string) => {
    setMenuItems(prev => {
      const updateItems = (items: MenuItem[]): MenuItem[] => {
        return items.map(item => {
          if (item.id === id) {
            return { ...item, isOpen: !item.isOpen };
          }
          if (item.children) {
            return { ...item, children: updateItems(item.children) };
          }
          return item;
        });
      };
      return updateItems(prev);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
      {/* Left Section: Create Menu */}
      <div className="flex flex-col h-full space-y-6 animate-in fade-in slide-in-from-left duration-700">
        <Card className="flex-1 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <Layout className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">Create Menu Entry</CardTitle>
                <CardDescription className="text-xs">Define a new parent menu and select associated pages.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 space-y-3">
            <div className="space-y-2 max-w-md">
              <Label htmlFor="parentMenu" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Parent Menu Name</Label>
              <Input 
                id="parentMenu" 
                placeholder="Enter parent menu name (e.g. Services)" 
                value={parentMenuName}
                onChange={(e) => setParentMenuName(e.target.value)}
                className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div className="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden bg-white/50 dark:bg-slate-900/50">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50 uppercase tracking-wider">
                  <TableRow className="border-b border-slate-100 dark:border-slate-800">
                    <TableHead className="w-12 text-center"></TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Menu Name / Page Title</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((page) => (
                    <TableRow key={page.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                      <TableCell className="text-center py-3">
                        <Checkbox 
                          checked={page.selected} 
                          onCheckedChange={() => togglePageSelection(page.id)}
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-[4px]"
                        />
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{page.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Settings2 className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Action Sidebar Left */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-4">
          <div className="flex flex-col sm:flex-row lg:flex-row gap-3">
            <Button 
              variant="outline" 
              className="flex-1 h-12 border-emerald-200 dark:border-emerald-500/30 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 font-bold text-[13px] tracking-[0.1em] uppercase rounded-xl border-2 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
              onClick={() => toast.info("Opening menu preview...")}
            >
              <Eye className="w-4 h-4" />
              PREVIEW
            </Button>
            <Button 
              onClick={handleCreateMenu}
              className="flex-[1.5] h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-[13px] tracking-[0.1em] uppercase rounded-2xl shadow-lg shadow-blue-500/25 border-none transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
            >
              <Plus className="size-4" />
              CREATE MENU
            </Button>
            <Button 
              variant="outline" 
              onClick={() => { setParentMenuName(""); setPages(prev => prev.map(p => ({ ...p, selected: false }))); }}
              className="flex-1 h-12 bg-white hover:bg-rose-600 border-2 border-red-500 text-red-500 hover:text-white transition-all duration-300 rounded-xl text-[13px] font-bold gap-2 shadow-sm hover:shadow-red-500/30 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center"
            >
              <X className="size-4" strokeWidth={2.5} />
              CANCEL
            </Button>
          </div>
        </Card>
      </div>

      {/* Right Section: Menu Hierarchy */}
      <div className="flex flex-col h-full space-y-6 animate-in fade-in slide-in-from-right duration-700 delay-300">
        <Card className="flex-1 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                <GripVertical className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">Menu Hierarchy & Order</CardTitle>
                <CardDescription className="text-xs">Drag and drop items to reorder. Nest items by dragging them under parent menus.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <div 
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  className="cursor-move"
                >
                  <MenuOrderItem 
                    item={item} 
                    onToggle={() => toggleSubMenu(item.id)}
                    onDelete={handleDeleteMenuItem}
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30 flex flex-col items-center justify-center text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">
                Tip: Drag to change the menu order
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Sidebar Right */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-4">
          <div className="flex flex-col sm:flex-row lg:flex-row gap-3">
            <Button 
              variant="outline" 
              className="flex-1 h-12 border-emerald-200 dark:border-emerald-500/30 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 font-bold text-[13px] tracking-[0.1em] uppercase rounded-xl border-2 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
              onClick={() => toast.info("Opening menu preview...")}
            >
              <Eye className="w-4 h-4" />
              PREVIEW
            </Button>
            <Button 
              onClick={() => toast.success("Menu order saved successfully")}
              className="flex-[1.5] h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-[13px] tracking-[0.1em] uppercase rounded-2xl shadow-lg shadow-blue-500/25 border-none transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
            >
              <Save className="size-4" />
              SAVE
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 h-12 bg-white hover:bg-rose-600 border-2 border-red-500 text-red-500 hover:text-white transition-all duration-300 rounded-xl text-[13px] font-bold gap-2 shadow-sm hover:shadow-red-500/30 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center"
            >
              <X className="size-4" strokeWidth={2.5} />
              CANCEL
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function MenuOrderItem({ item, depth = 0, onToggle, onDelete }: { item: MenuItem, depth?: number, onToggle?: () => void, onDelete: (id: string) => void }) {
  const hasChildren = item.children && item.children.length > 0;
  
  return (
    <div className="space-y-2">
      <div 
        className={cn(
          "flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 group transition-all",
          "bg-white dark:bg-slate-900 hover:border-blue-200 dark:hover:border-blue-900",
          "shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]",
          depth > 0 && "ml-10 bg-slate-50/50 dark:bg-slate-950/50"
        )}
      >
        <div className="text-slate-300 dark:text-slate-700 group-hover:text-slate-500 dark:group-hover:text-slate-500 transition-colors">
          <GripVertical size={16} />
        </div>
        
        <div className="flex-1 flex items-center gap-2">
          {hasChildren ? (
            <button onClick={onToggle} className="text-slate-400 hover:text-blue-500 transition-colors">
              {item.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <div className="w-3.5" />
          )}
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200 tracking-tight">{item.label}</span>
          
          <div className="ml-auto flex items-center gap-1 transition-all">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
            >
              <Trash2 size={13} />
            </Button>
          </div>
        </div>
      </div>
      
      {hasChildren && item.isOpen && (
        <div className="space-y-2 animate-in slide-in-from-top-1 duration-200">
          {item.children!.map((child) => (
            <MenuOrderItem key={child.id} item={child} depth={depth + 1} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
