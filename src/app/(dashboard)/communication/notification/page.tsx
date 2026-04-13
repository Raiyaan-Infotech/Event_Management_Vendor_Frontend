
'use client';

 

import React, { useState } from 'react';

import {

  Bell, Check, Settings, Search, Filter,

  ChevronDown, BarChart2, Ticket, MessageSquare,

  Users, Mail

} from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

 

interface NotificationItem {

  id: number;

  title: string;

  description: string;

  type: 'Ticket' | 'Message' | 'Team' | 'Email';

  date: string;

  time: string;

  status: 'unread' | 'read';

  sender?: string;

  subject?: string;

  preview?: string;

}

 

const mockNotifications: NotificationItem[] = [

  {

    id: 1,

    title: 'Adrian Monino',

    sender: 'Adrian Monino',

    subject: 'Someone who believes in you',

    preview: 'enean commodo li gula eget dolor cum socia eget dolor enean commod...',

    description: 'Adrian Monino: "Someone who believes in you"',

    type: 'Email',

    date: '3 Apr 2026',

    time: '11:30 AM',

    status: 'unread',

  },

  {

    id: 2,

    title: 'Albert Ansing',

    sender: 'Albert Ansing',

    subject: "Here's What You Missed This Week",

    preview: 'enean commodo li gula eget dolor cum socia eget dolor enean commod...',

    description: 'Albert Ansing: "Here\'s What You Missed This Week"',

    type: 'Email',

    date: '3 Apr 2026',

    time: '06:50 AM',

    status: 'unread',

  },

  {

    id: 3,

    title: 'Carla Guden',

    sender: 'Carla Guden',

    subject: '4 Ways to Optimize Your Search',

    preview: 'viva mus elemen tum semper nisi enean vulputat enean commodo li gul...',

    description: 'Carla Guden: "4 Ways to Optimize Your Search"',

    type: 'Email',

    date: '3 Apr 2026',

    time: 'Yesterday',

    status: 'read',

  },

  {

    id: 4,

    title: 'Reven Galeon',

    sender: 'Reven Galeon',

    subject: "We're Giving a Macbook for Free",

    preview: 'viva mus elemen tum semper nisi enean vulputat enean commodo li gul...',

    description: 'Reven Galeon: "We\'re Giving a Macbook for Free"',

    type: 'Email',

    date: '2 Apr 2026',

    time: 'Yesterday',

    status: 'read',

  },

  {

    id: 5,

    title: 'Elisse Tan',

    sender: 'Elisse Tan',

    subject: 'Keep Your Personal Data Safe',

    preview: 'viva mus elemen tum semper nisi enean vulputat enean commodo li gul...',

    description: 'Elisse Tan: "Keep Your Personal Data Safe"',

    type: 'Email',

    date: '13 Oct 2025',

    time: '11:45 AM',

    status: 'read',

  },

  {

    id: 6,

    title: 'Marianne Audrey',

    sender: 'Marianne Audrey',

    subject: "We've Made Some Changes",

    preview: 'viva mus elemen tum semper nisi enean vulputat enean commodo li gul...',

    description: 'Marianne Audrey: "We\'ve Made Some Changes"',

    type: 'Email',

    date: '13 Oct 2025',

    time: '10:10 AM',

    status: 'read',

  },

  {

    id: 7,

    title: 'Jane Phoebe',

    sender: 'Jane Phoebe',

    subject: 'Grab Our Holiday Deals',

    preview: 'viva mus elemen tum semper nisi enean vulputat enean commodo li gul...',

    description: 'Jane Phoebe: "Grab Our Holiday Deals"',

    type: 'Email',

    date: '12 Oct 2025',

    time: 'Oct 12',

    status: 'read',

  },

  {

    id: 8,

    title: 'Raffy Godinez',

    sender: 'Raffy Godinez',

    subject: 'Just a Few Steps Away',

    preview: 'viva mus elemen tum semper nisi enean vulputat enean commodo li gul...',

    description: 'Raffy Godinez: "Just a Few Steps Away"',

    type: 'Email',

    date: '05 Oct 2025',

    time: 'Oct 05',

    status: 'read',

  },

  {

    id: 9,

    title: 'Allan Cadungog',

    sender: 'Allan Cadungog',

    subject: 'Credit Card Promos',

    preview: 'viva mus elemen tum semper nisi enean vulputat enean commodo li gul...',

    description: 'Allan Cadungog: "Credit Card Promos"',

    type: 'Email',

    date: '04 Oct 2025',

    time: 'Oct 04',

    status: 'read',

  },

  {

    id: 10,

    title: 'Alfie Salinas',

    sender: 'Alfie Salinas',

    subject: '4 Ways to Optimize Your Search',

    preview: 'viva mus elemen tum semper nisi enean vulputat enean commodo li gul...',

    description: 'Alfie Salinas: "4 Ways to Optimize Your Search"',

    type: 'Email',

    date: '02 Oct 2025',

    time: 'Oct 02',

    status: 'unread',

  },

  {

    id: 11,

    title: 'Jove Guden',

    sender: 'Jove Guden',

    subject: 'Keep Your Personal Data Safe',

    preview: 'viva mus elemen tum semper nisi enean vulputat enean commodo li gul...',

    description: 'Jove Guden: "Keep Your Personal Data Safe"',

    type: 'Email',

    date: '02 Oct 2025',

    time: 'Oct 02',

    status: 'unread',

  }

];

 

export default function NotificationPage() {

  const [searchTerm, setSearchTerm] = useState('');

  const [notifications, setNotifications] = useState(mockNotifications);

 

  const filteredNotifications = notifications.filter(n =>

    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||

    n.description.toLowerCase().includes(searchTerm.toLowerCase())

  );

 

  const getTypeIcon = (type: NotificationItem['type']) => {

    switch(type) {

      case 'Ticket': return <Ticket className="w-4 h-4 text-white" />;

      case 'Message': return <MessageSquare className="w-4 h-4 text-white" />;

      case 'Team': return <Users className="w-4 h-4 text-white" />;

      case 'Email': return <Mail className="w-4 h-4 text-white" />;

      default: return <Bell className="w-4 h-4 text-white" />;

    }

  };

 

  const getIconBg = (type: NotificationItem['type']) => {

    switch(type) {

      case 'Ticket': return 'bg-blue-500';

      case 'Message': return 'bg-emerald-500';

      case 'Team': return 'bg-purple-500';

      case 'Email': return 'bg-indigo-500';

      default: return 'bg-gray-500';

    }

  };

 

  const markAllRead = () => {

    setNotifications(notifications.map(n => ({ ...n, status: 'read' })));

  };

 

  return (

    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 pt-4 pb-10 custom-scrollbar ">

      <div className="space-y-6 max-w-[1700px] mx-auto">

        <PageHeader

          title="Notifications"

          subtitle="Stay updated with your latest activities and messages"

          rightContent={

            <div className="flex items-center gap-3">

              <Button

                onClick={markAllRead}

                className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 rounded-[8px] h-10 px-4 transition-all duration-200"

              >

                <Check className="w-4 h-4" />

                <span className="font-semibold text-sm">Mark All as Read</span>

              </Button>

              <Button

                variant="outline"

                className="border-[#e2e8f0] text-gray-700 bg-white hover:bg-gray-50 rounded-[8px] h-10 px-4 flex items-center gap-2 transition-all duration-200"

              >

                <Settings className="w-4 h-4" />

                <span className="font-semibold text-sm">Settings</span>

              </Button>

            </div>

          }

        />

 

        {/* Toolbar */}

        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">

          <div className="relative flex-1 w-full">

            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <Input

              placeholder="Search notifications..."

              className="pl-11 h-11 bg-white border-gray-200 rounded-[8px] focus-visible:ring-primary focus-visible:border-primary w-full"

              value={searchTerm}

              onChange={(e) => setSearchTerm(e.target.value)}

            />

          </div>

          <div className="flex items-center gap-3 shrink-0">

            <Button variant="outline" className="h-11 border-gray-200 bg-white hover:bg-gray-50 text-gray-600 rounded-[8px] px-4 flex items-center gap-2">

              <Filter className="w-4 h-4" />

              <span className="font-medium text-sm">Filter</span>

              <ChevronDown className="w-3 h-3 text-gray-400" />

            </Button>

            <Button variant="outline" className="h-11 border-gray-200 bg-white hover:bg-gray-50 text-gray-600 rounded-[8px] px-4 flex items-center gap-2">

              <Bell className="w-4 h-4" />

              <span className="font-medium text-sm">Type</span>

              <ChevronDown className="w-3 h-3 text-gray-400" />

            </Button>

            <Button variant="outline" className="h-11 border-gray-200 bg-white hover:bg-gray-50 text-gray-600 rounded-[8px] px-4 flex items-center gap-2">

              <BarChart2 className="w-4 h-4" />

              <span className="font-medium text-sm">Analytics</span>

            </Button>

          </div>

        </div>

 

        {/* List Content */}

        <div className="bg-white rounded-[12px] border border-gray-100 shadow-sm overflow-hidden mb-10">

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Notification</th>
                <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-center">Type</th>
                <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-center">Date</th>
                <th className="py-4 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifications.map((n) => (
                <tr key={n.id} className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors group`}>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className={`shrink-0 w-10 h-10 rounded-[8px] ${getIconBg(n.type)} flex items-center justify-center shadow-sm`}>
                        {getTypeIcon(n.type)}
                      </div>
                      <div className="min-w-0">
                        {n.type === 'Email' ? (
                          <div className="space-y-0.5">
                            <h4 className="text-[14px] font-bold text-gray-800 group-hover:text-primary transition-colors truncate">{n.sender}</h4>
                            <p className="text-[13px] font-semibold text-gray-700 truncate">{n.subject}</p>
                            <p className="text-[12px] text-gray-500 line-clamp-1 italic">{n.preview}</p>
                          </div>
                        ) : (
                          <>
                            <h4 className="text-[14px] font-bold text-gray-800 mb-0.5 group-hover:text-primary transition-colors truncate">{n.title}</h4>
                            <p className="text-[13px] text-gray-500 line-clamp-1">{n.description}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex justify-center">
                      <span className="text-[12px] font-semibold text-gray-600 px-3 py-1 bg-gray-100 rounded-full">{n.type}</span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-foreground text-[13px] font-medium">{n.date}</p>
                      <p className="text-muted-foreground text-[11px]">{n.time}</p>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex justify-end">
                      <span className={`inline-flex items-center justify-center w-[70px] h-6 rounded-[3px] text-[11px] font-bold uppercase ${
                        n.status === 'read' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {n.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredNotifications.length === 0 && (

            <div className="py-20 flex flex-col items-center justify-center text-gray-400">

              <Bell className="w-12 h-12 mb-4 opacity-20" />

              <p className="text-sm font-medium">No notifications found.</p>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}

 

