'use client';

import { useState } from 'react';
import { 
  MoreHorizontal, 
  Facebook, 
  X, 
  Linkedin, 
  Grid3X3, 
  List, 
  Filter, 
  Check, 
  ChevronRight, 
  Users,
  Search,
  MessageSquare,
  Mail,
  Phone
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

export function ClientsTab() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const allClients = [
    { name: 'James Thomas', role: 'Web Designer', img: '/images/user-avatar-1.jpg', email: 'james.thomas@example.com', phone: '+1 234 567 890' },
    { name: 'Reynante Labares', role: 'Web Designer', img: '/images/user-avatar-2.jpg', email: 'reynante.l@example.com', phone: '+1 234 567 891' },
    { name: 'Owen Bongcaras', role: 'App Developer', img: '/images/user-avatar-3.jpg', email: 'owen.b@example.com', phone: '+1 234 567 892' },
    { name: 'Stephen Metcalfe', role: 'Administrator', img: '/images/user-avatar-4.jpg', email: 'stephen.m@example.com', phone: '+1 234 567 893' },
    { name: 'Socrates Itumay', role: 'Project Manager', img: '/images/user-avatar-5.jpg', email: 'socrates.i@example.com', phone: '+1 234 567 894' },
    { name: 'Petey Cruiser', role: 'Web Designer', img: '/images/user-avatar-6.jpg', email: 'petey.c@example.com', phone: '+1 234 567 895' },
    { name: 'Anna Mull', role: 'UI/UX Designer', img: '/images/user-avatar-7.jpg', email: 'anna.m@example.com', phone: '+1 234 567 896' },
    { name: 'Barb Akew', role: 'PHP Developer', img: '/images/user-avatar-8.jpg', email: 'barb.a@example.com', phone: '+1 234 567 897' },
    { name: 'Desmond Eagle', role: 'Backend Dev', img: '/images/user-avatar-9.jpg', email: 'desmond.e@example.com', phone: '+1 234 567 898' },
    { name: 'Eileen Sideways', role: 'Graphic Designer', img: '/images/user-avatar-10.jpg', email: 'eileen.s@example.com', phone: '+1 234 567 899' },
    { name: 'Justin Case', role: 'Software Engineer', img: '/images/user-avatar-1.jpg', email: 'justin.c@example.com', phone: '+1 234 567 900' },
    { name: 'Anita Job', role: 'Product Owner', img: '/images/user-avatar-2.jpg', email: 'anita.j@example.com', phone: '+1 234 567 901' },
    { name: 'Phil McRev', role: 'Marketing Manager', img: '/images/user-avatar-3.jpg', email: 'phil.m@example.com', phone: '+1 234 567 902' },
    { name: 'Rose Bush', role: 'Content Writer', img: '/images/user-avatar-4.jpg', email: 'rose.b@example.com', phone: '+1 234 567 903' },
  ];

  const filteredClients = allClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortOrder === 'asc') return a.name.localeCompare(b.name);
    if (sortOrder === 'desc') return b.name.localeCompare(a.name);
    return 0;
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedClients.length / itemsPerPage);
  const currentClients = sortedClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-300">
      <div className="space-y-4">
        {/* Controls Row */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search clients by name or role..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-[5px] text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all bg-card focus:bg-muted"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          </div>

          {/* View Toggles */}
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`h-10 px-4 flex items-center justify-center gap-2 rounded-[5px] text-[13px] font-bold uppercase transition-all ${
                viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'bg-card text-muted-foreground border border-border hover:text-foreground'
              }`}
            >
              <Grid3X3 size={16} /> Grid
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`h-10 px-4 flex items-center justify-center gap-2 rounded-[5px] text-[13px] font-bold uppercase transition-all ${
                viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'bg-card text-muted-foreground border border-border hover:text-foreground'
              }`}
            >
              <List size={16} /> List
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowSortMenu(!showSortMenu)}
              className={`h-10 px-4 flex items-center justify-center gap-2 rounded-[5px] text-[13px] font-bold uppercase transition-all ${
                sortOrder ? 'bg-primary text-white shadow-sm' : 'bg-card text-muted-foreground border border-border hover:text-foreground'
              }`}
            >
              <Filter size={16} /> Sort
            </button>

            {showSortMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-[5px] shadow-lg z-50">
                <button 
                  onClick={() => { setSortOrder(null); setShowSortMenu(false); setCurrentPage(1); }} 
                  className="w-full px-4 py-3 text-left text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground font-medium transition-all flex items-center justify-between"
                >
                  <span>Default</span>{sortOrder === null && <Check size={16} className="text-primary" />}
                </button>
                <div className="h-px bg-border" />
                <button 
                  onClick={() => { setSortOrder('asc'); setShowSortMenu(false); setCurrentPage(1); }} 
                  className="w-full px-4 py-3 text-left text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground font-medium transition-all flex items-center justify-between"
                >
                  <span>Name A-Z</span>{sortOrder === 'asc' && <Check size={16} className="text-primary" />}
                </button>
                <div className="h-px bg-border" />
                <button 
                  onClick={() => { setSortOrder('desc'); setShowSortMenu(false); setCurrentPage(1); }} 
                  className="w-full px-4 py-3 text-left text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground font-medium transition-all flex items-center justify-between"
                >
                  <span>Name Z-A</span>{sortOrder === 'desc' && <Check size={16} className="text-primary" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Text */}
        <div className="text-[12px] text-muted-foreground font-medium">
          Showing <span className="font-bold text-foreground">{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedClients.length)}</span> of <span className="font-bold text-foreground">{allClients.length}</span> clients
          {searchQuery && ` • Filtered by: "${searchQuery}"`}
          {sortOrder && ` • Sorted: ${sortOrder === 'asc' ? 'Name A-Z' : 'Name Z-A'}`}
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {currentClients.map((client, i) => (
            <div key={i} className="bg-card rounded-[5px] border border-border p-8 text-center relative group hover:shadow-md transition-all">
              <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal size={18} />
              </button>
              <div className="mb-4 flex justify-center">
                <div className="relative">
                  <Avatar className="w-[100px] h-[100px] border-2 border-primary/10 p-[2px] bg-card">
                    <AvatarImage src={client.img} className="rounded-full object-cover" />
                    <AvatarFallback className="bg-muted text-primary font-bold">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-card rounded-full" />
                </div>
              </div>
              <h5 className="text-foreground text-[16px] font-bold mb-1">{client.name}</h5>
              <p className="text-muted-foreground text-[13px] mb-6">{client.role}</p>
              
              <div className="flex items-center justify-center gap-2">
                <button className="w-9 h-9 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                  <Facebook size={16} />
                </button>
                <button className="w-9 h-9 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-all shadow-sm">
                  <X size={14} />
                </button>
                <button className="w-9 h-9 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-all shadow-sm">
                  <Linkedin size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'list' && (
        <div className="space-y-3">
          {currentClients.map((client, i) => (
            <div key={i} className="bg-card rounded-[5px] border border-border p-4 flex gap-4 hover:shadow-md transition-all group cursor-pointer">
              <div className="w-[120px] h-[80px] bg-muted overflow-hidden rounded-[3px] shrink-0 relative">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage src={client.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <AvatarFallback className="bg-muted text-primary font-bold text-[24px] flex items-center justify-center rounded-none italic">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute top-1 right-1 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
              </div>
              
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <h4 className="text-foreground text-[14px] font-bold uppercase tracking-wide mb-2">{client.name}</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <p className="text-muted-foreground text-[12px] font-medium">{client.role}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                    <Facebook size={14} />
                  </button>
                  <button className="w-8 h-8 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-all shadow-sm">
                    <X size={12} />
                  </button>
                  <button className="w-8 h-8 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-all shadow-sm">
                    <Linkedin size={14} />
                  </button>
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

      {/* Empty State */}
      {sortedClients.length === 0 && (
        <div className="text-center py-16 bg-card rounded-[5px] border border-border border-dashed">
          <Users size={48} className="mx-auto text-muted mb-4 opacity-20" />
          <p className="text-foreground text-[16px] font-bold">No clients found</p>
          <p className="text-muted-foreground text-[13px] mt-1 max-w-[250px] mx-auto">We couldn't find any clients matching your current search or filters.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSortOrder(null); }}
            className="mt-6 text-primary font-bold text-[13px] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
