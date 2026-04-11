'use client';

import React, { useState } from 'react';
import { Mail, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/common/PageHeader';

const cardClass = 'bg-card rounded-[5px] border border-border overflow-hidden shadow-sm dark:shadow-none';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  status: 'Read' | 'Unread' | 'Replied';
  date: string;
  time: string;
  repliedDate?: string;
  repliedTime?: string;
}

const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 1,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '-',
    subject: 'Issue with my recent order',
    status: 'Replied',
    date: '5 Mar 2026',
    time: '09:59 AM',
    repliedDate: '6 Mar 2026',
    repliedTime: '10:30 AM'
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    subject: 'Question about your services',
    status: 'Read',
    date: '3 Mar 2026',
    time: '02:59 PM',
  },
  {
    id: 3,
    name: 'Robert Fox',
    email: 'robert.fox@example.com',
    phone: '+155501099',
    subject: 'Partnership Opportunity',
    status: 'Replied',
    date: '1 Mar 2026',
    time: '11:20 AM',
    repliedDate: '2 Mar 2026',
    repliedTime: '09:15 AM'
  },
  {
    id: 4,
    name: 'Jenny Wilson',
    email: 'jenny.w@example.com',
    phone: '+120255501',
    subject: 'Pricing Inquiry',
    status: 'Read',
    date: '28 Feb 2026',
    time: '04:45 PM',
  },
  {
    id: 5,
    name: 'Cody Fisher',
    email: 'cody.f@example.com',
    phone: '-',
    subject: 'Technical Support',
    status: 'Unread',
    date: '27 Feb 2026',
    time: '09:12 AM',
  },
  {
    id: 6,
    name: 'Bessie Cooper',
    email: 'bessie.c@example.com',
    phone: '+140455501',
    subject: 'Feedback on Website',
    status: 'Read',
    date: '25 Feb 2026',
    time: '01:30 PM',
  },
  {
    id: 7,
    name: 'Guy Hawkins',
    email: 'guy.h@example.com',
    phone: '+131255501',
    subject: 'Refund Request',
    status: 'Unread',
    date: '24 Feb 2026',
    time: '10:05 AM',
  }
];

export function CommunicationContactContent() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  const [filter, setFilter] = useState<'All' | 'Unread' | 'Read' | 'Replied'>('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Inquiry; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: keyof Inquiry) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedInquiries = (data: Inquiry[]) => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (!aValue && !bValue) return 0;
      if (!aValue) return 1;
      if (!bValue) return -1;

      // Special handling for dates
      if (sortConfig.key === 'date' || sortConfig.key === 'repliedDate') {
        const dateA = new Date(aValue as string).getTime();
        const dateB = new Date(bValue as string).getTime();
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }

      // Default alphabetical/numeric sort
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const filteredInquiries = getSortedInquiries(
    inquiries.filter(inq => {
      if (filter === 'All') return true;
      return inq.status === filter;
    })
  );

  const handleDelete = (id: number) => {
    setInquiries(prev => prev.filter(inq => inq.id !== id));
  };

  const SortIcon = ({ column }: { column: keyof Inquiry }) => {
    if (sortConfig?.key !== column) return <span className="ml-1 opacity-30">⇅</span>;
    return <span className="ml-1 text-primary">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 pt-4 pb-10 custom-scrollbar">
      <div className="space-y-6 max-w-[1700px] mx-auto">
        
        <PageHeader 
          title="Contact" 
          subtitle="Manage and reply to inquiries sent via the contact form." 
          total={inquiries.length}
          rightContent={
            <div className="flex items-center bg-muted/30 p-1 rounded-[5px] border border-border w-fit">
              <button 
                onClick={() => setFilter('All')}
                className={`px-4 py-1.5 rounded-[3px] text-[13px] font-bold transition-all ${filter === 'All' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('Unread')}
                className={`px-4 py-1.5 rounded-[3px] text-[13px] font-bold transition-all ${filter === 'Unread' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Unread
              </button>
              <button 
                onClick={() => setFilter('Read')}
                className={`px-4 py-1.5 rounded-[3px] text-[13px] font-bold transition-all ${filter === 'Read' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Read
              </button>
              <button 
                onClick={() => setFilter('Replied')}
                className={`px-4 py-1.5 rounded-[3px] text-[13px] font-bold transition-all ${filter === 'Replied' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Replied
              </button>
            </div>
          }
        />

        {/* --- TABLE --- */}
        <div className={cardClass}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th 
                    onClick={() => handleSort('name')}
                    className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-primary transition-colors select-none"
                  >
                    Name <SortIcon column="name" />
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Subject</th>
                  <th 
                    onClick={() => handleSort('status')}
                    className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-primary transition-colors select-none"
                  >
                    Status <SortIcon column="status" />
                  </th>
                  <th 
                    onClick={() => handleSort('date')}
                    className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-primary transition-colors select-none"
                  >
                    Date <SortIcon column="date" />
                  </th>
                  <th 
                    onClick={() => handleSort('repliedDate')}
                    className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-primary transition-colors select-none"
                  >
                    Replied Date <SortIcon column="repliedDate" />
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((inq, index) => (
                  <tr key={inq.id} className={`group hover:bg-muted/30 transition-all ${index !== filteredInquiries.length - 1 ? 'border-b border-border/50' : ''}`}>
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-foreground text-[14px] font-bold">{inq.name}</p>
                        <p className="text-muted-foreground text-[12px]">{inq.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-muted-foreground text-[13px] font-medium">{inq.phone}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-muted-foreground text-[13px] font-medium">{inq.subject}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center justify-center w-[70px] h-6 rounded-[3px] text-[11px] font-bold uppercase ${
                        inq.status === 'Read' ? 'bg-green-500 text-white' : 
                        inq.status === 'Replied' ? 'bg-primary text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-foreground text-[13px] font-medium">{inq.date}</p>
                        <p className="text-muted-foreground text-[11px]">{inq.time}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {inq.status === 'Replied' ? (
                        <div>
                          <p className="text-foreground text-[13px] font-medium">{inq.repliedDate}</p>
                          <p className="text-muted-foreground text-[11px]">{inq.repliedTime}</p>
                        </div>
                      ) : (
                        <p className="text-foreground text-[13px] font-bold">-</p>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/communication/contact/${inq.id}/view`}
                          className="h-8 px-3 flex items-center gap-1.5 bg-[#5e7693] text-white rounded-[4px] text-[11px] font-bold hover:brightness-110 transition-all shadow-sm"
                        >
                          <Eye size={14} /> View
                        </Link>
                        <button 
                          onClick={() => handleDelete(inq.id)}
                          className="w-8 h-8 flex items-center justify-center bg-rose-500/10 text-rose-500 rounded-[4px] border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredInquiries.length === 0 && (
            <div className="p-20 text-center">
              <Mail size={48} className="mx-auto text-muted mb-4 opacity-20" />
              <p className="text-muted-foreground text-[14px] font-bold">No inquiries found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
