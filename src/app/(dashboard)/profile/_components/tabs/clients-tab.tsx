'use client';

import { useMemo, useState } from 'react';
import {
  MoreHorizontal,
  Grid3X3,
  List,
  Filter,
  Check,
  ChevronRight,
  Users,
  Search,
  Mail,
  Phone,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useVendorClients } from '@/hooks/use-vendor-clients';
import { resolveMediaUrl } from '@/lib/utils';

export function ClientsTab() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: clientsRes, isLoading } = useVendorClients({ page: 1, limit: 100 });
  const allClients = useMemo(() => clientsRes?.data ?? [], [clientsRes]);

  const filteredClients = allClients.filter((client) => {
    const query = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) ||
      (client.plan || '').toLowerCase().includes(query) ||
      (client.email || '').toLowerCase().includes(query) ||
      (client.mobile || '').toLowerCase().includes(query)
    );
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortOrder === 'asc') return a.name.localeCompare(b.name);
    if (sortOrder === 'desc') return b.name.localeCompare(a.name);
    return 0;
  });

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
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search clients by name, email, phone, or plan..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-[5px] text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all bg-card focus:bg-muted"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          </div>

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

        <div className="text-[12px] text-muted-foreground font-medium">
          Showing <span className="font-bold text-foreground">{sortedClients.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedClients.length)}</span> of <span className="font-bold text-foreground">{allClients.length}</span> clients
          {searchQuery && ` • Filtered by: "${searchQuery}"`}
          {sortOrder && ` • Sorted: ${sortOrder === 'asc' ? 'Name A-Z' : 'Name Z-A'}`}
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-16 bg-card rounded-[5px] border border-border">
          <p className="text-muted-foreground text-[14px]">Loading clients...</p>
        </div>
      )}

      {!isLoading && viewMode === 'grid' && currentClients.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {currentClients.map((client) => {
            const initials = client.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
            const imageSrc = resolveMediaUrl(client.profile_pic || undefined) || undefined;
            return (
              <div key={client.id} className="bg-card rounded-[5px] border border-border p-8 text-center relative group hover:shadow-md transition-all">
                <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal size={18} />
                </button>
                <div className="mb-4 flex justify-center">
                  <div className="relative">
                    <Avatar className="w-[100px] h-[100px] border-2 border-primary/10 p-[2px] bg-card">
                      <AvatarImage src={imageSrc} className="rounded-full object-cover" />
                      <AvatarFallback className="bg-muted text-primary font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute bottom-1 right-1 w-4 h-4 border-2 border-card rounded-full ${client.is_active === 1 ? 'bg-green-500' : 'bg-gray-500'}`} />
                  </div>
                </div>
                <h5 className="text-foreground text-[16px] font-bold mb-1">{client.name}</h5>
                <p className="text-muted-foreground text-[13px] mb-2">{client.plan || client.registration_type || 'Client'}</p>
                <p className="text-muted-foreground text-[12px] mb-1">{client.email || 'No email'}</p>
                <p className="text-muted-foreground text-[12px]">{client.mobile || 'No phone'}</p>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && viewMode === 'list' && currentClients.length > 0 && (
        <div className="space-y-3">
          {currentClients.map((client) => {
            const initials = client.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
            const imageSrc = resolveMediaUrl(client.profile_pic || undefined) || undefined;
            return (
              <div key={client.id} className="bg-card rounded-[5px] border border-border p-4 flex gap-4 hover:shadow-md transition-all group cursor-pointer">
                <div className="w-[120px] h-[80px] bg-muted overflow-hidden rounded-[3px] shrink-0 relative">
                  <Avatar className="w-full h-full rounded-none">
                    <AvatarImage src={imageSrc} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <AvatarFallback className="bg-muted text-primary font-bold text-[24px] flex items-center justify-center rounded-none italic">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute top-1 right-1 w-3 h-3 border-2 border-card rounded-full ${client.is_active === 1 ? 'bg-green-500' : 'bg-gray-500'}`} />
                </div>

                <div className="flex-1 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-foreground text-[14px] font-bold uppercase tracking-wide mb-2">{client.name}</h4>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-[12px] font-medium">{client.plan || client.registration_type || 'Client'}</p>
                      <div className="flex items-center gap-2 text-muted-foreground text-[12px]">
                        <Mail size={12} />
                        <span>{client.email || 'No email'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-[12px]">
                        <Phone size={12} />
                        <span>{client.mobile || 'No phone'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && totalPages > 1 && (
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

      {!isLoading && sortedClients.length === 0 && (
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
