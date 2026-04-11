'use client';

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Calendar, 
  MapPin, 
  Eye,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter, useParams } from "next/navigation";
import { useVendorClient } from "@/hooks/use-vendor-clients";

// --- Types ---
interface ClientEvent {
  id: number;
  eventId: string;
  eventName: string;
  startDate: string;
  endDate: string;
  city: string;
  pinCode: string;
  plan: string;
  status: "Active" | "Completed" | "Pending";
}

// --- Sample Data ---
const SAMPLE_EVENTS: ClientEvent[] = [
  {
    id: 1,
    eventId: "EV0050",
    eventName: "Rasik Wedding",
    startDate: "09-04-2026",
    endDate: "10-04-2026",
    city: "Tvl - Town",
    pinCode: "6270001",
    plan: "Basic plan",
    status: "Active",
  },
];

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  Completed: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  Pending: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
};

const statusIcons = {
  Active: <CheckCircle2 size={12} className="mr-1.5" />,
  Completed: <CheckCircle2 size={12} className="mr-1.5" />,
  Pending: <Clock size={12} className="mr-1.5" />,
};

export default function ClientEventsList() {
  const router = useRouter();
  const params = useParams();
  const clientIdFromUrl = params?.id;
  
  const [searchQuery, setSearchQuery] = useState("");
  const { data: clientRes } = useVendorClient(clientIdFromUrl as string);
  const clientName = clientRes?.name || "Client";


  const filteredEvents = SAMPLE_EVENTS.map(event => ({
    ...event,
    eventName: `${clientName}'s Wedding`, // Tailor to clicked client
  })).filter(e => 
    e.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.eventId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-3">
      {/* Header Section */}
      <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 uppercase tracking-tight flex items-center gap-2">
            Client Events - {clientName}
            <Badge variant="outline" className="text-[11px] font-extrabold border-blue-200 text-blue-600 bg-blue-50/50 px-2.5 py-0.5 ml-1">
              {filteredEvents.length} TOTAL
            </Badge>
          </h1>
          <p className="text-sm text-gray-400 mt-1 italic tracking-tight font-medium">Viewing all events for {clientName} (ID: #{clientIdFromUrl})</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push("/clients")}
          className="h-10 text-[12px] font-bold gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-wider"
        >
          <ArrowLeft size={15} strokeWidth={2.5} /> Back to Client
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="shrink-0 bg-white dark:bg-gray-800/40 backdrop-blur-md rounded-3xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full md:w-auto group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-500">
            <Search size={18} />
          </div>
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by event name or ID..." 
            className="h-12 w-full pl-12 border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/10 rounded-2xl focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium"
          />
        </div>
        <Button variant="outline" className="h-12 px-6 border-gray-100 dark:border-gray-700 text-gray-400 hover:bg-gray-100 transition-all rounded-2xl gap-2 font-black text-[11px] uppercase tracking-widest">
          <Filter size={16} /> Filters
        </Button>
      </div>

      {/* Table Card */}
      <div className="flex-1 min-h-0 bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col mb-4">
        <div className="flex-1 overflow-auto custom-scrollbar relative">
          <table className="w-full text-left border-separate border-spacing-0 min-w-[1200px]">
            <thead className="sticky top-0 z-20 bg-white dark:bg-[#1f2937] shadow-sm">
              <tr className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100/50 dark:border-gray-800">
                {[
                  { key: "id", label: "Id"},
                  { key: "eventId", label: "Event Id"},
                  { key: "eventName", label: "Event Name"},
                  { key: "startDate", label: "Start Date"},
                  { key: "endDate", label: "End Date"},
                  { key: "city", label: "City"},
                  { key: "pinCode", label: "Pin Code"},
                  { key: "plan", label: "Plan"},
                  { key: "status", label: "Status"},
                ].map((header) => (
                  <th 
                    key={header.key} 
                    className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer group active:opacity-70 select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-2">
                      {header.label}
                      <ArrowUpDown size={12} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </th>
                ))}
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/30">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <tr key={event.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-500/[0.03] transition-all relative overflow-hidden">
                    <td className="px-6 py-5">
                      <span className="text-[12px] font-black text-gray-400 group-hover:text-blue-500 transition-colors tracking-tighter">#{event.id}</span>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="outline" className="font-mono text-[10px] font-bold border-gray-200/60 dark:border-gray-800 text-gray-500 bg-white dark:bg-gray-800/50 py-0.5">
                        {event.eventId}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[14px] font-black text-gray-800 dark:text-gray-100 leading-none group-hover:text-blue-600 transition-colors uppercase tracking-tight">{event.eventName}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[13px] font-bold text-gray-700 dark:text-gray-300 tracking-tight flex items-center gap-2">
                        <Calendar size={13} className="text-gray-300" /> {event.startDate}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                       <p className="text-[13px] font-bold text-gray-700 dark:text-gray-300 tracking-tight flex items-center gap-2">
                        <Calendar size={13} className="text-gray-300" /> {event.endDate}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[13px] font-black text-gray-700 dark:text-gray-300 tracking-tight flex items-center gap-2">
                        <MapPin size={13} className="text-gray-300" /> {event.city}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[13px] font-bold text-gray-500 dark:text-gray-400 tracking-tight">{event.pinCode}</p>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="outline" className="text-[10px] font-black border-orange-200 text-orange-600 bg-orange-50/50">
                        {event.plan}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${statusStyles[event.status]}`}>
                        {statusIcons[event.status]}
                        {event.status}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <Button variant="outline" size="sm" className="h-8 rounded-xl border-blue-100 text-blue-600 hover:bg-blue-50 text-[11px] font-black gap-1.5">
                         <Eye size={14} /> VIEW
                       </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-20 text-center text-gray-400 font-medium italic">
                    No events found for this client.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
