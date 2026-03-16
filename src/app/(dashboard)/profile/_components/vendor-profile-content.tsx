'use client';

import { useState } from 'react';
import { ChevronRight, User, Settings, Image as ImageIcon, Users } from 'lucide-react';
import { useVendorMe } from '@/hooks/use-vendors';
import { VendorSidebarProfileCard } from './vendor-sidebar-profile-card';
import { VendorLocationCard } from './vendor-location-card';
import { ProfileStats } from './profile-stats';
import { AboutTab } from './tabs/about-tab';
import { EventsTab } from './tabs/events-tab';
import { ClientsTab } from './tabs/clients-tab';
import { SettingsTab } from './tabs/settings-tab';

const cardClass = 'bg-card rounded-[5px] border border-border overflow-hidden shadow-sm dark:shadow-none mb-6 font-["Roboto",sans-serif]';

export function VendorProfileContent() {
  const { data: vendor, isLoading } = useVendorMe();
  const [activeTab, setActiveTab] = useState('about');

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );

  return (
    <div className="bg-background min-h-screen -mt-6 -mx-6 -mb-6 p-6 font-['Roboto',sans-serif]">
      {/* Custom Scrollbar Styling */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0162e8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0156cc;
        }
      `}</style>



      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
          <h1 className="text-foreground text-[24px] font-bold leading-tight uppercase">Profile</h1>
        </div>
        <div className="flex items-center flex-wrap gap-2 mt-4 md:mt-0">
          <button className="h-9 px-4 flex items-center gap-2 bg-primary text-white rounded-[5px] shadow-sm hover:brightness-110 text-[13px] font-medium whitespace-nowrap">
            14 Aug 2019 <ChevronRight size={14} className="rotate-90 translate-y-0.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start mb-6">
        {/* --- LEFT COLUMN (1) --- */}
        <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-8 space-y-6">
          <VendorSidebarProfileCard vendor={vendor} />
          <VendorLocationCard />
        </div>

        {/* --- RIGHT COLUMN (2) --- */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* STATS CARDS */}
          <ProfileStats />

          {/* MAIN TABS CARD */}
          <div className={cardClass}>
            {/* VALEX TABS NAVIGATION */}
            <div className="bg-accent p-1.5 flex gap-1">
              {[
                { id: 'about', label: 'ABOUT ME', icon: <User size={15} /> },
                { id: 'events', label: 'EVENTS', icon: <ImageIcon size={15} /> },
                { id: 'clients', label: 'CLIENTS', icon: <Users size={15} /> },
                { id: 'settings', label: 'SETTINGS', icon: <Settings size={15} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3.5 flex items-center justify-center gap-2 text-[12px] font-bold rounded-[3px] transition-all outline-none ${activeTab === tab.id
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <div className="p-8 h-[903px] overflow-y-auto custom-scrollbar">
              {activeTab === 'about' && <AboutTab />}
              {activeTab === 'events' && <EventsTab />}
              {activeTab === 'clients' && <ClientsTab />}
              {activeTab === 'settings' && <SettingsTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
