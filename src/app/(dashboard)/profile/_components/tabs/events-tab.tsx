'use client';

import { useState } from 'react';
import { Grid3X3, List, Filter, Check, ChevronRight, Image as ImageIcon, MapPin } from 'lucide-react';
import Image from 'next/image';

export function EventsTab() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const allEvents = [
    { imgId: '1511795409834-ef04bbd61622', name: 'Wedding Event', location: 'Chennai' },
    { imgId: '1492684223066-81342ee5ff30', name: 'Corporate Event', location: 'Coimbatore' },
    { imgId: '1533174072545-7a4b6ad7a6c3', name: 'Product Launch', location: 'Madurai' },
    { imgId: '1501281668745-f7f57925c3b4', name: 'Birthday Party', location: 'Trichy' },
    { imgId: '1492684223066-81342ee5ff30', name: 'Tech Conference', location: 'Chennai' },
    { imgId: '1470225620780-dba8ba36b745', name: 'Music Concert', location: 'Coimbatore' },
    { imgId: '1492684223066-81342ee5ff30', name: 'Art Exhibition', location: 'Madurai' },
    { imgId: '1511795409834-ef04bbd61622', name: 'Charity Gala', location: 'Trichy' },
    { imgId: '1505236858219-8359eb29e329', name: 'Fashion Show', location: 'Chennai' },
    { imgId: '1516280440614-37939bbacd81', name: 'Sports Tournament', location: 'Coimbatore' },
    { imgId: '1511795409834-ef04bbd61622', name: 'Food Festival', location: 'Madurai' },
    { imgId: '1492684223066-81342ee5ff30', name: 'Trade Fair', location: 'Trichy' }
  ];

  const filteredEvents = allEvents.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortOrder === 'asc') return a.name.localeCompare(b.name);
    if (sortOrder === 'desc') return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-300">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search events by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            <button onClick={() => setShowSortMenu(!showSortMenu)}
              className={`h-10 px-4 flex items-center justify-center gap-2 rounded-[5px] text-[13px] font-bold uppercase transition-all ${
                sortOrder ? 'bg-primary text-white shadow-sm' : 'bg-card text-muted-foreground border border-border hover:text-foreground'
              }`}
            >
              <Filter size={16} /> Sort
            </button>

            {showSortMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-[5px] shadow-lg z-50 overflow-hidden">
                <button onClick={() => { setSortOrder(null); setShowSortMenu(false); }} className="w-full px-4 py-3 text-left text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground font-medium transition-all flex items-center justify-between">
                  <span>No Sort</span>{sortOrder === null && <Check size={16} className="text-primary" />}
                </button>
                <div className="h-px bg-border" />
                <button onClick={() => { setSortOrder('asc'); setShowSortMenu(false); }} className="w-full px-4 py-3 text-left text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground font-medium transition-all flex items-center justify-between group">
                  <span>Ascending A-Z</span>{sortOrder === 'asc' && <Check size={16} className="text-primary" />}
                  <ChevronRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <div className="h-px bg-border" />
                <button onClick={() => { setSortOrder('desc'); setShowSortMenu(false); }} className="w-full px-4 py-3 text-left text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground font-medium transition-all flex items-center justify-between group">
                  <span>Descending Z-A</span>{sortOrder === 'desc' && <Check size={16} className="text-primary" />}
                  <ChevronRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="text-[12px] text-muted-foreground font-medium">
          Showing <span className="font-bold text-foreground">{sortedEvents.length}</span> of <span className="font-bold text-foreground">{allEvents.length}</span> events
          {searchQuery && ` • Filtered by: "${searchQuery}"`}
          {sortOrder && ` • Sorted: ${sortOrder === 'asc' ? 'A-Z' : 'Z-A'}`}
        </div>
      </div>

      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {sortedEvents.map((event, i) => (
            <div key={i} className="bg-card rounded-[5px] border border-border overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer">
              <div className="aspect-[16/10] bg-muted overflow-hidden relative">
                <Image src={`https://images.unsplash.com/photo-${event.imgId}?auto=format&fit=crop&w=600&q=80`} width={600} height={400} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ImageIcon className="text-white w-8 h-8 opacity-80" />
                </div>
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
          {sortedEvents.map((event, i) => (
            <div key={i} className="bg-card rounded-[5px] border border-border p-4 flex gap-4 hover:shadow-md transition-all group cursor-pointer">
              <div className="w-[120px] h-[80px] bg-muted overflow-hidden rounded-[3px] shrink-0">
                <Image src={`https://images.unsplash.com/photo-${event.imgId}?auto=format&fit=crop&w=200&q=80`} width={200} height={133} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                <ImageIcon size={20} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
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
