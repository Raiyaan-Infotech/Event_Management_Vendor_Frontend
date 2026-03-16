'use client';

import { ChevronRight } from 'lucide-react';
import { ChatList } from './chat-list';
import { ChatArea } from './chat-area';
import { ChatContactDetails } from './chat-contact-details';

export function VendorMessagesContent() {
  return (
    <div className="bg-background h-[calc(100vh-64px)] flex flex-col overflow-hidden -mt-6 -mx-6 -mb-6 p-6 font-['Roboto',sans-serif]">


      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-foreground text-[24px] font-bold leading-tight uppercase">Chat</h1>
        </div>
        <div className="flex items-center flex-wrap gap-2 mt-4 md:mt-0">
          <button className="h-9 px-4 flex items-center gap-2 bg-primary text-white rounded-[5px] shadow-sm hover:brightness-110 text-[13px] font-medium whitespace-nowrap ml-1">
            14 Aug 2019 <ChevronRight size={14} className="rotate-90 translate-y-0.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-[30px] items-stretch flex-1 min-h-0">
        <ChatList />
        <ChatArea />
        <ChatContactDetails />
      </div>
    </div>
  );
}
