'use client';

import React, { useState } from 'react';
import { Mail, Trash2, ArrowLeft, MousePointer2, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const cardClass = 'bg-card rounded-[5px] border border-border overflow-hidden shadow-sm dark:shadow-none font-["Roboto",sans-serif]';

interface InquiryDetail {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  time: string;
  status: boolean;
}

export function ContactViewContent({ id }: { id: string }) {
  const router = useRouter();
  const [isRead, setIsRead] = useState(true);
  const [isReplying, setIsReplying] = useState(false);

  // Mock data fetching based on ID
  const inquiry: InquiryDetail = {
    id: parseInt(id),
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    subject: 'Issue with my recent order',
    message: "Hi,\n\nMy recent order #12345 hasn't arrived yet. It was supposed to be delivered yesterday. Can you check the status?\n\nRegards,\nJane",
    date: '5 Mar 2026',
    time: '09:59',
    status: true
  };

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 pt-4 pb-10 custom-scrollbar">
      <div className="max-w-[1700px] mx-auto space-y-6">
        
        {/* --- HEADER --- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-[32px] font-bold text-foreground leading-tight">{inquiry.subject}</h1>
              <p className="text-muted-foreground text-[14px]">From: <span className="font-bold text-foreground">{inquiry.name}</span> &lt;{inquiry.email}&gt;</p>
            </div>
            <button className="h-10 px-5 flex items-center gap-2 bg-rose-500 text-white rounded-[5px] text-[13px] font-bold hover:brightness-110 transition-all shadow-sm">
               <Trash2 size={16} /> Delete
            </button>
          </div>

          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary font-bold text-[13px] transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {/* --- MAIN CONTENT CARD --- */}
        <div className={cardClass}>
          <div className="p-6 border-b border-border flex items-center justify-between bg-muted/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[18px] border border-primary/20">
                {inquiry.name.charAt(0)}
              </div>
              <div>
                <p className="text-foreground text-[14px] font-bold">{inquiry.name}</p>
                <p className="text-muted-foreground text-[12px]">{inquiry.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-muted-foreground font-medium">Read</span>
                <button 
                  onClick={() => setIsRead(!isRead)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${isRead ? 'bg-green-500' : 'bg-muted'}`}
                >
                  <span className="absolute left-1.5 top-1 font-bold text-[8px] text-white select-none">{isRead ? 'ON' : ''}</span>
                  <span className="absolute right-1.5 top-1 font-bold text-[8px] text-muted-foreground select-none">{!isRead ? 'OFF' : ''}</span>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isRead ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="text-right">
                <p className="text-foreground text-[13px] font-bold flex items-center gap-2 justify-end">
                  <Mail size={14} className="text-muted-foreground" /> {inquiry.date}
                </p>
                <p className="text-muted-foreground text-[11px]">{inquiry.time}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="text-foreground text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
              {inquiry.message}
            </div>
          </div>
        </div>

        {/* --- REPLY SECTION --- */}
        {!isReplying ? (
          <div className={cardClass + " p-6"}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-[5px] bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-foreground text-[16px] font-bold">Send a Reply</h3>
                  <p className="text-muted-foreground text-[13px]">Compose an email response to the user.</p>
                </div>
              </div>

              <button 
                onClick={() => setIsReplying(true)}
                className="h-10 px-6 flex items-center gap-2 bg-[#5e7693] text-white rounded-[5px] text-[13px] font-bold hover:brightness-110 transition-all shadow-sm"
              >
                <Send size={16} className="-rotate-45 -translate-y-0.5" /> Write Reply
              </button>
            </div>
          </div>
        ) : (
          <div className="border border-primary/30 rounded-[5px] bg-primary/[0.02] p-4 animation-in slide-in-from-bottom-5 duration-300">
            <div className="p-6 bg-card rounded-[5px] border border-border shadow-md">
              {/* Header Info */}
              <div className="space-y-4 mb-6">
                 <div className="flex items-center gap-2 border-b border-border pb-3">
                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                     <Mail size={20} />
                   </div>
                   <div>
                     <h3 className="text-foreground text-[16px] font-bold">Send a Reply</h3>
                     <p className="text-muted-foreground text-[13px]">Compose an email response to the user.</p>
                   </div>
                 </div>

                 <div className="space-y-3 px-2">
                    <div className="flex items-center gap-3">
                      <span className="w-16 text-[13px] text-muted-foreground font-medium">From:</span>
                      <span className="text-[13px] text-foreground font-bold italic">Admin</span>
                    </div>
                    <div className="flex items-center gap-3 py-2 border-b border-border/50">
                      <span className="w-16 text-[13px] text-muted-foreground font-medium">To:</span>
                      <span className="text-[13px] text-foreground font-bold">{inquiry.name} <span className="font-normal text-muted-foreground">&lt;{inquiry.email}&gt;</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-16 text-[13px] text-muted-foreground font-medium">Subject:</span>
                      <span className="text-[13px] text-foreground font-bold italic">Re: {inquiry.subject}</span>
                    </div>
                 </div>
              </div>

              {/* Toolbar */}
              <div className="bg-muted/30 border border-border rounded-t-[5px] p-2 flex items-center gap-1">
                {['B', 'I', 'U', 'H1', 'H2', 'Link', 'Img', 'Undo', 'Redo'].map((btn) => (
                  <button key={btn} className="h-8 w-8 flex items-center justify-center rounded-[3px] text-muted-foreground hover:bg-muted hover:text-primary transition-all font-bold text-[13px]">
                    {btn}
                  </button>
                ))}
              </div>
              
              {/* Textarea */}
              <div className="relative">
                <textarea 
                  className="w-full h-[250px] p-6 text-[15px] border border-t-0 border-border rounded-b-[5px] focus:outline-none focus:bg-muted/10 transition-colors placeholder:text-muted-foreground font-medium"
                  placeholder="Type your response here..."
                ></textarea>
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                   <button 
                     onClick={() => setIsReplying(false)}
                     className="px-6 py-2 text-[13px] font-bold text-muted-foreground hover:text-foreground transition-all"
                   >
                     Cancel
                   </button>
                   <button className="h-10 px-8 flex items-center gap-2 bg-primary text-white rounded-[5px] text-[13px] font-bold hover:brightness-110 transition-all shadow-md">
                     <Send size={16} className="-rotate-45" /> Send Email
                   </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
