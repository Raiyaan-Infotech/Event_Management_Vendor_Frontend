"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Grid3X3, List, Filter, Check, ChevronRight,
  MapPin, Plus, Edit2, Trash2, Image as ImageIcon, MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/common/PageHeader";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface GalleryItem {
  id: string;
  eventName: string;
  city: string;
  images: string[];
  imgView: 'public' | 'private';
  isActive: number;
  createdAt: string;
}

interface GalleryListProps {
  galleryItems: GalleryItem[];
  onDelete: (id: string) => void;
  onEdit: (item: GalleryItem) => void;
  onToggleStatus: (id: string) => void;
  loading?: boolean;
}

export default function GalleryList({
  galleryItems,
  onDelete,
  onEdit,
  onToggleStatus,
  loading = false,
}: GalleryListProps) {
  const router = useRouter();

  const [viewMode,       setViewMode]       = useState<"grid" | "list">("grid");
  const [searchQuery,    setSearchQuery]    = useState("");
  const [sortOrder,      setSortOrder]      = useState<"asc" | "desc" | null>(null);
  const [selectedCity,   setSelectedCity]   = useState<string | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [currentPage,    setCurrentPage]    = useState(1);
  const [itemToDelete,   setItemToDelete]   = useState<GalleryItem | null>(null);
  const [openMenuId,      setOpenMenuId]      = useState<string | null>(null);
  const [carouselIndexes, setCarouselIndexes] = useState<Record<string, number>>({});
  const menuRef = useRef<HTMLDivElement>(null);

  const getCarouselIndex = (id: string) => carouselIndexes[id] ?? 0;
  const prevSlide = (id: string, total: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCarouselIndexes((prev) => ({ ...prev, [id]: (getCarouselIndex(id) - 1 + total) % total }));
  };
  const nextSlide = (id: string, total: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCarouselIndexes((prev) => ({ ...prev, [id]: (getCarouselIndex(id) + 1) % total }));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const itemsPerPage = 10;

  const cities = Array.from(new Set(galleryItems.map((item) => item.city))).sort();

  const filtered = galleryItems.filter((item) => {
    const matchesSearch =
      item.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = !selectedCity || item.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === "asc")  return a.eventName.localeCompare(b.eventName);
    if (sortOrder === "desc") return b.eventName.localeCompare(a.eventName);
    return 0;
  });

  const totalPages   = Math.ceil(sorted.length / itemsPerPage);
  const currentItems = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearchChange = (val: string) => { setSearchQuery(val); setCurrentPage(1); };
  const handlePageChange   = (page: number) => setCurrentPage(page);

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    onDelete(itemToDelete.id);
    setItemToDelete(null);
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-86px)] flex items-center justify-center bg-[#F8FAFC] dark:bg-black/40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto custom-scrollbar bg-[#F8FAFC] dark:bg-black/40">
      <div className="max-w-[1700px] mx-auto px-6 py-8">

        <PageHeader
          title="GALLERY"
          subtitle="Manage your visual history and event memories."
          total={galleryItems.length}
          rightContent={
            <Button
              onClick={() => router.push("gallery/add")}
              className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[12px] font-bold shadow-lg shadow-emerald-500/30 flex items-center gap-3 transition-all hover:-translate-y-0.5 active:scale-95 border-none uppercase"
            >
              <Plus size={16} strokeWidth={3} /> ADD GALLERY
            </Button>
          }
        />

        {/* ── Toolbar ── */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center mt-8">

          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search events by name or city..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-[5px] text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all bg-card focus:bg-muted"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* View toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`h-10 px-4 flex items-center gap-2 rounded-[5px] text-[13px] font-bold uppercase transition-all ${
                viewMode === "grid"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-card text-muted-foreground border border-border hover:text-foreground"
              }`}
            >
              <Grid3X3 size={16} /> Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`h-10 px-4 flex items-center gap-2 rounded-[5px] text-[13px] font-bold uppercase transition-all ${
                viewMode === "list"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-card text-muted-foreground border border-border hover:text-foreground"
              }`}
            >
              <List size={16} /> List
            </button>
          </div>

          {/* Filter / Sort */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`h-10 px-4 flex items-center gap-2 rounded-[5px] text-[13px] font-bold uppercase transition-all ${
                sortOrder || selectedCity
                  ? "bg-primary text-white shadow-sm"
                  : "bg-card text-muted-foreground border border-border hover:text-foreground"
              }`}
            >
              <Filter size={16} /> Filter
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-[5px] shadow-lg z-50 max-h-[280px] overflow-y-auto">
                <button
                  onClick={() => { setSelectedCity(null); setShowFilterMenu(false); setCurrentPage(1); }}
                  className="w-full px-4 py-3 text-left text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground font-medium transition-all flex items-center justify-between"
                >
                  <span>All Cities</span>
                  {!selectedCity && <Check size={16} className="text-primary" />}
                </button>
                {cities.map((city) => (
                  <div key={city}>
                    <div className="h-px bg-border" />
                    <button
                      onClick={() => { setSelectedCity(city); setShowFilterMenu(false); setCurrentPage(1); }}
                      className="w-full px-4 py-3 text-left text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground font-medium transition-all flex items-center justify-between"
                    >
                      <span>{city}</span>
                      {selectedCity === city && <Check size={16} className="text-primary" />}
                    </button>
                  </div>
                ))}
                <div className="h-[2px] bg-primary/20" />
                <button
                  onClick={() => { setSortOrder("asc"); setShowFilterMenu(false); setCurrentPage(1); }}
                  className="w-full px-4 py-3 text-left text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground font-medium transition-all flex items-center justify-between"
                >
                  <span>Sort A–Z</span>
                  {sortOrder === "asc" && <Check size={16} className="text-primary" />}
                </button>
                <div className="h-px bg-border" />
                <button
                  onClick={() => { setSortOrder("desc"); setShowFilterMenu(false); setCurrentPage(1); }}
                  className="w-full px-4 py-3 text-left text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground font-medium transition-all flex items-center justify-between"
                >
                  <span>Sort Z–A</span>
                  {sortOrder === "desc" && <Check size={16} className="text-primary" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Count line ── */}
        <p className="text-[12px] text-muted-foreground font-medium mt-4">
          Showing{" "}
          <span className="font-bold text-foreground">
            {sorted.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, sorted.length)}
          </span>{" "}
          of <span className="font-bold text-foreground">{sorted.length}</span> events
          {searchQuery   && ` • "${searchQuery}"`}
          {selectedCity  && ` • ${selectedCity}`}
          {sortOrder     && ` • ${sortOrder === "asc" ? "A–Z" : "Z–A"}`}
        </p>

        {/* ── Grid View ── */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-[5px] border border-border overflow-hidden shadow-sm hover:shadow-md transition-all group relative"
              >
                <div className="aspect-[16/10] bg-muted overflow-hidden relative">
                  {/* ── Carousel ── */}
                  {item.images.length > 0 ? (
                    <>
                      <Image
                        src={item.images[getCarouselIndex(item.id)]}
                        alt={item.eventName}
                        fill
                        className="object-cover transition-all duration-500"
                      />
                      {/* prev / next */}
                      {item.images.length > 1 && (
                        <>
                          <button onClick={(e) => prevSlide(item.id, item.images.length, e)}
                            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white z-10 transition-all">
                            <ChevronRight size={13} className="rotate-180" />
                          </button>
                          <button onClick={(e) => nextSlide(item.id, item.images.length, e)}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white z-10 transition-all">
                            <ChevronRight size={13} />
                          </button>
                          {/* dots */}
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                            {item.images.map((_, i) => (
                              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === getCarouselIndex(item.id) ? "bg-white" : "bg-white/40"}`} />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ImageIcon size={32} />
                    </div>
                  )}

                  {/* ── Top-left: img_view switch ── */}
                  <div
                    onClick={() => onToggleStatus(item.id)}
                    className={`absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full shadow cursor-pointer select-none transition-all z-10 ${
                      item.imgView === "public" ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  >
                    <div className={`relative w-7 h-4 rounded-full transition-colors ${item.imgView === "public" ? "bg-emerald-300/60" : "bg-rose-300/60"}`}>
                      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all duration-200 ${item.imgView === "public" ? "left-[14px]" : "left-0.5"}`} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none">
                      {item.imgView === "public" ? "Public" : "Private"}
                    </span>
                  </div>

                  {/* ── Top-right: three-dot menu ── */}
                  <div className="absolute top-2 right-2" ref={openMenuId === item.id ? menuRef : null}>
                    <button
                      onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                      className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-all"
                    >
                      <MoreVertical size={15} />
                    </button>
                    {openMenuId === item.id && (
                      <div className="absolute right-0 top-full mt-1 w-32 bg-card border border-border rounded-[5px] shadow-lg z-50 overflow-hidden">
                        <button
                          onClick={() => { onEdit(item); setOpenMenuId(null); }}
                          className="w-full px-4 py-2.5 flex items-center gap-2 text-[12px] font-bold text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <div className="h-px bg-border" />
                        <button
                          onClick={() => { setItemToDelete(item); setOpenMenuId(null); }}
                          className="w-full px-4 py-2.5 flex items-center gap-2 text-[12px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 text-center">
                  <h4 className="text-foreground text-[14px] font-bold mb-2 uppercase tracking-wide">
                    {item.eventName}
                  </h4>
                  <div className="w-[30px] h-[2px] bg-primary mx-auto mb-2" />
                  <div className="flex items-center justify-center gap-1 text-muted-foreground">
                    <MapPin size={13} />
                    <span className="text-[12px] font-medium italic">{item.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── List View ── */}
        {viewMode === "list" && (
          <div className="space-y-3 mt-6">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-[5px] border border-border p-4 flex gap-4 hover:shadow-md transition-all group"
              >
                <div className="w-[120px] h-[80px] bg-muted overflow-hidden rounded-[3px] shrink-0 relative">
                  {item.images.length > 0 ? (
                    <Image
                      src={item.images[0]}
                      alt={item.eventName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ImageIcon size={24} />
                    </div>
                  )}
                  {item.images.length > 1 && (
                    <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                      +{item.images.length - 1}
                    </div>
                  )}
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <h4 className="text-foreground text-[14px] font-bold uppercase tracking-wide mb-2">
                      {item.eventName}
                    </h4>
                    <div className="flex items-center gap-1">
                      <MapPin size={13} className="text-muted-foreground" />
                      <span className="text-muted-foreground text-[12px] font-medium">{item.city}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <button
                      onClick={() => onEdit(item)}
                      className="w-9 h-9 rounded-[5px] border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => setItemToDelete(item)}
                      className="w-9 h-9 rounded-[5px] border border-border flex items-center justify-center text-muted-foreground hover:text-rose-600 hover:border-rose-200 transition-all"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {sorted.length === 0 && (
          <div className="text-center py-20">
            <ImageIcon size={48} className="mx-auto text-muted mb-4" />
            <p className="text-muted-foreground text-[14px] font-medium">No events found</p>
            <p className="text-muted-foreground text-[12px] mt-1">
              Try adjusting your search or filter
            </p>
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-10 pb-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center border border-border rounded-[5px] text-muted-foreground hover:text-primary hover:border-primary disabled:opacity-50 disabled:hover:text-muted-foreground disabled:hover:border-border transition-all"
            >
              <ChevronRight size={18} className="rotate-180" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`w-10 h-10 flex items-center justify-center rounded-[5px] text-[13px] font-bold transition-all ${
                  currentPage === i + 1
                    ? "bg-primary text-white shadow-sm"
                    : "bg-card text-muted-foreground border border-border hover:text-foreground hover:border-primary"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center border border-border rounded-[5px] text-muted-foreground hover:text-primary hover:border-primary disabled:opacity-50 disabled:hover:text-muted-foreground disabled:hover:border-border transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <DialogContent className="sm:max-w-[420px] rounded-[40px] p-0 overflow-hidden border-none shadow-2xl shadow-rose-900/10">
          <div className="bg-gradient-to-b from-rose-50 to-white dark:from-rose-500/10 dark:to-[#111827] p-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-white dark:bg-gray-800 flex items-center justify-center text-rose-500 shadow-[0_15px_30px_-10px_rgba(225,29,72,0.3)] mb-8 animate-in zoom-in duration-500">
              <Trash2 size={40} strokeWidth={2.5} />
            </div>
            <DialogTitle className="text-2xl font-black text-gray-800 dark:text-gray-100 uppercase tracking-tighter">
              Delete Gallery Item?
            </DialogTitle>
            <DialogDescription className="mt-4 text-gray-500 dark:text-gray-400 font-bold text-sm leading-relaxed max-w-[280px]">
              You are about to permanently delete{" "}
              <span className="text-rose-600 underline underline-offset-4 decoration-rose-200">
                {itemToDelete?.eventName}
              </span>
              .
            </DialogDescription>
          </div>
          <DialogFooter className="p-8 bg-gray-50/50 dark:bg-gray-900 flex flex-row gap-4 border-t border-gray-50 dark:border-gray-800">
            <Button
              variant="ghost"
              onClick={() => setItemToDelete(null)}
              className="flex-1 h-12 rounded-2xl font-bold text-[12px] uppercase tracking-widest text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-[0_10px_20px_-5px_rgba(225,29,72,0.4)] hover:-translate-y-1 active:scale-95 transition-all"
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
