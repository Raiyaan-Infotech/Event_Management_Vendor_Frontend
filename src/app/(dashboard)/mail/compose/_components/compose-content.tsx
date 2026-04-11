'use client';

import { Paperclip, Link, Image as ImageIcon, Trash2, } from 'lucide-react';
import { MailSidebar } from '../../_components/mail-sidebar';
import { PageHeader } from '@/components/common/PageHeader';

const cardClass = 'bg-card rounded-[5px] border border-border overflow-hidden shadow-sm dark:shadow-none ';

export function ComposeContent() {
  return (
    <div className="bg-background min-h-screen -mt-6 -mx-6 -mb-6 p-6">
      <PageHeader 
        title="Compose" 
        subtitle="Draft and send a new message." 
      />

      <div className="flex flex-col lg:flex-row gap-[30px] mb-6 lg:h-[800px] items-stretch">
        {/* --- LEFT NAVIGATION --- */}
        <MailSidebar />

        {/* --- RIGHT CONTENT (COMPOSE) --- */}
        <div className="flex-1 min-w-0 flex flex-col h-full">
          <div className={`${cardClass} bg-card flex-1 flex flex-col mb-0 overflow-hidden`}>
            {/* Header Area */}
            <div className="p-6 border-b border-border">
              <h2 className="text-foreground text-[14px] font-bold uppercase tracking-wider">Compose New Message</h2>
            </div>

            {/* Form Area */}
            <div className="flex-1 p-6 overflow-y-auto chat-scrollbar">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <label className="w-16 text-[14px] font-medium text-foreground">To</label>
                  <input 
                    type="text" 
                    className="flex-1 bg-transparent border border-border rounded-[3px] px-4 py-2 text-[14px] focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="w-16 text-[14px] font-medium text-foreground">Subject</label>
                  <input 
                    type="text" 
                    className="flex-1 bg-transparent border border-border rounded-[3px] px-4 py-2 text-[14px] focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <label className="text-[14px] font-medium text-foreground">Message</label>
                  <textarea 
                    className="w-full h-[400px] bg-transparent border border-border rounded-[3px] px-4 py-4 text-[14px] focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder=""
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Footer Area */}
            <div className="p-6 border-t border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <button className="w-9 h-9 flex items-center justify-center hover:bg-muted rounded-[3px] transition-colors" title="Attach Files">
                  <Paperclip size={18} />
                </button>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-muted rounded-[3px] transition-colors" title="Add Link">
                  <Link size={18} />
                </button>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-muted rounded-[3px] transition-colors" title="Add Image">
                  <ImageIcon size={18} />
                </button>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-muted rounded-[3px] transition-colors" title="Discard">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-6 py-2 bg-[#f8f9fa] border border-border text-foreground rounded-[5px] text-[13px] font-bold hover:bg-gray-100 transition-colors">
                  Discard
                </button>
                <button className="px-6 py-2 bg-primary text-white rounded-[5px] text-[13px] font-bold hover:brightness-110 transition-colors">
                  Save
                </button>
                <button className="px-6 py-2 bg-destructive text-white rounded-[5px] text-[13px] font-bold hover:brightness-110 transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
