'use client';

import { useState } from 'react';
import { Grid3X3, List, Filter, Check, ChevronRight, Image as ImageIcon, MapPin } from 'lucide-react';
import Image from 'next/image';

export function EventsTab() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showCityMenu, setShowCityMenu] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const allEvents = [
    { imgId: 'wedding-event', name: 'Wedding Event', location: 'Chennai' },
    { imgId: 'corporate-event', name: 'Corporate Event', location: 'Coimbatore' },
    { imgId: 'product-launch', name: 'Product Launch', location: 'Madurai' },
    { imgId: 'birthday-party', name: 'Birthday Party', location: 'Trichy' },
    { imgId: 'corporate-event', name: 'Tech Conference', location: 'Chennai' },
    { imgId: 'music-concert', name: 'Music Concert', location: 'Coimbatore' },
    { imgId: 'corporate-event', name: 'Art Exhibition', location: 'Madurai' },
    { imgId: 'wedding-event', name: 'Charity Gala', location: 'Trichy' },
    { imgId: 'fashion-show', name: 'Fashion Show', location: 'Chennai' },
    { imgId: 'sports-tournament', name: 'Sports Tournament', location: 'Coimbatore' },
    { imgId: 'wedding-event', name: 'Food Festival', location: 'Madurai' },
    { imgId: 'corporate-event', name: 'Trade Fair', location: 'Trichy' },
    { imgId: 'wedding-event', name: 'Music Festival', location: 'Chennai' },
    { imgId: 'product-launch', name: 'Startup Pitch', location: 'Bangalore' },
  ];

  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = !selectedCity || event.location === selectedCity;
    return matchesSearch && matchesCity;
  });

  const cities = Array.from(new Set(allEvents.map(event => event.location))).sort();

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortOrder === 'asc') return a.name.localeCompare(b.name);
    if (sortOrder === 'desc') return b.name.localeCompare(a.name);
    return 0;
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);
  const currentEvents = sortedEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: 'smooth' }); // Smooth scroll back to top of section
  };

  // Reset to first page on search/filter
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-300">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search events by name or location..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-[5px] text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all bg-card focus:bg-muted"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setViewMode('grid')}
              className={`h-10 px-4 flex items-center justify-center gap-2 rounded-[5px] text-[13px] font-bold uppercase transition-all ${
                viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'bg-card text-muted-foreground border border-border hover:text-foreground'
              }`}
            >
              <Grid3X3 size={16} /> Grid
            </button>
            <button onClick={() => setViewMode('list')}
              className={`h-10 px-4 flex items-center justify-center gap-2 rounded-[5px] text-[13px] font-bold uppercase transition-all ${
                viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'bg-card text-muted-foreground border border-border hover:text-foreground'
              }`}
            >
              <List size={16} /> List
            </button>
          </div>

          <div className="relative">
            <button onClick={() => { setShowSortMenu(!showSortMenu); setShowCityMenu(false); }}
              className={`h-10 px-4 flex items-center justify-center gap-2 rounded-[5px] text-[13px] font-bold uppercase transition-all ${
                sortOrder ? 'bg-primary text-white shadow-sm' : 'bg-card text-muted-foreground border border-border hover:text-foreground'
              }`}
            >
              <Filter size={16} /> Sort
            </button>

            {showSortMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-[5px] shadow-lg z-50 max-h-[250px] overflow-y-auto custom-scrollbar">
                <button onClick={() => { setSelectedCity(null); setShowSortMenu(false); setCurrentPage(1); }} className="w-full px-4 py-3 text-left text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground font-medium transition-all flex items-center justify-between">
                  <span>All Cities</span>{selectedCity === null && <Check size={16} className="text-primary" />}
                </button>
                {cities.map(city => (
                  <div key={city}>
                    <div className="h-px bg-border" />
                    <button 
                      onClick={() => { setSelectedCity(city); setShowSortMenu(false); setCurrentPage(1); }} 
                      className="w-full px-4 py-3 text-left text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground font-medium transition-all flex items-center justify-between group"
                    >
                      <span>{city}</span>{selectedCity === city && <Check size={16} className="text-primary" />}
                    </button>
                  </div>
                ))}
                
                <div className="h-[2px] bg-primary/20" /> {/* Distinct Separator */}
                
                <button onClick={() => { setSortOrder('asc'); setShowSortMenu(false); setCurrentPage(1); }} className="w-full px-4 py-3 text-left text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground font-medium transition-all flex items-center justify-between group">
                  <span>Sort A-Z</span>{sortOrder === 'asc' && <Check size={16} className="text-primary" />}
                </button>
                <div className="h-px bg-border" />
                <button onClick={() => { setSortOrder('desc'); setShowSortMenu(false); setCurrentPage(1); }} className="w-full px-4 py-3 text-left text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground font-medium transition-all flex items-center justify-between group">
                  <span>Sort Z-A</span>{sortOrder === 'desc' && <Check size={16} className="text-primary" />}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="text-[12px] text-muted-foreground font-medium">
          Showing <span className="font-bold text-foreground">{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedEvents.length)}</span> of <span className="font-bold text-foreground">{allEvents.length}</span> events
          {searchQuery && ` • Filtered by: "${searchQuery}"`}
          {selectedCity && ` • City: ${selectedCity}`}
          {sortOrder && ` • Sorted: ${sortOrder === 'asc' ? 'Name A-Z' : 'Name Z-A'}`}
        </div>
      </div>

      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {currentEvents.map((event, i) => (
            <div key={i} className="bg-card rounded-[5px] border border-border overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer">
              <div className="aspect-[16/10] bg-muted overflow-hidden relative">
                <Image src={`/images/${event.imgId}-600.jpg`} width={600} height={400} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 text-center">
                <h4 className="text-foreground text-[15px] font-bold mb-3 uppercase tracking-wide">{event.name}</h4>
                <div className="w-[30px] h-[2px] bg-primary mx-auto mb-3" />
                <p className="text-muted-foreground text-[13px] font-medium italic">{event.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'list' && (
        <div className="space-y-3">
          {currentEvents.map((event, i) => (
            <div key={i} className="bg-card rounded-[5px] border border-border p-4 flex gap-4 hover:shadow-md transition-all group cursor-pointer">
              <div className="w-[120px] h-[80px] bg-muted overflow-hidden rounded-[3px] shrink-0">
                <Image src={`/images/${event.imgId}-600.jpg`} width={200} height={133} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <h4 className="text-foreground text-[14px] font-bold uppercase tracking-wide mb-2">{event.name}</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-muted-foreground" />
                      <p className="text-muted-foreground text-[12px] font-medium">{event.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
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
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-card text-muted-foreground border border-border hover:text-foreground hover:border-primary'
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

      {sortedEvents.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon size={48} className="mx-auto text-muted mb-4" />
          <p className="text-muted-foreground text-[14px] font-medium">No events found</p>
          <p className="text-muted-foreground text-[12px] mt-1">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
