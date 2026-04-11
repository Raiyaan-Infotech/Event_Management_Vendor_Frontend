"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  PenLine, 
  AlignLeft, 
  Image as ImageIcon, 
  MapPin, 
  Users, 
  Settings2, 
  Calendar, 
  Ticket,
  Upload,
  Send,
  Save,
  Bold,
  Italic,
  Underline,
  AlignLeft as AlignLeftIcon,
  AlignCenter,
  AlignRight,
  List,
  Globe,
  Monitor,
  Copy,
  Check,
  Smartphone,
  Tablet,
  Eye,
  RotateCcw
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const cardClass = "bg-white dark:bg-[#1f2937] rounded-lg border border-gray-100 dark:border-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden mb-6";
const cardHeaderClass = "px-6 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center gap-3";
const cardTitleClass = "text-[14px] font-bold text-gray-800 dark:text-gray-100";
const iconContainerClass = "text-blue-500 font-bold";

export default function CreateEventContent() {
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    eventName: "",
    eventUrl: "",
    eventType: "select-type",
    eventTopic: "select-topic",
    tags: "",
    description: "",
    timezone: "ist",
    startDate: "",
    startHour: "09",
    startMinute: "00",
    startPeriod: "AM",
    endDate: "",
    endHour: "06",
    endMinute: "00",
    endPeriod: "PM",
    registrationRequired: false,
    registrationDeadline: "",
    isPaidEvent: false,
    ticketPrice: "",
    ticketCount: "",
    paymentConfig: "",
    showRemaining: false,
    organizerName: "",
    organizerContact: "",
    locationType: "physical" as "physical" | "online",
    address: "Melapalayam Uzhavar Santhai",
    city: "Tirunelveli",
    state: "Tamil Nadu",
    country: "india",
    privacy: "public",
    latitude: "8.6982",
    longitude: "77.7169",
    onlineLink: "",
    desktopImage: "",
    tabletImage: "",
    mobileImage: "",
    organizerPhoto: "",
    organizerType: "client" as "client" | "admin",
    organizerPassword: "",
    __bold: false,
    __italic: false,
    __underline: false,
    __align: "left",
    __fontSize: "14px",
    __textColor: "#4b5563"
  });

  type StaffMember = {
    id: number;
    name: string;
    position?: string;
    empId: string;
    mobile: string;
    profilePic?: string;
  };
  const [staffList, setStaffList] = React.useState<StaffMember[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem("employees_data");
    if (saved) {
      setStaffList(JSON.parse(saved));
    }
  }, []);

  const updateForm = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-4 sm:px-6 lg:px-8 pt-2 pb-10 custom-scrollbar">
      <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Column */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Event Details Card */}
        <div className={cardClass}>
          <div className={cardHeaderClass}>
            <div className={iconContainerClass}>
              <PenLine size={16} strokeWidth={3} />
            </div>
            <h2 className={cardTitleClass}>Event Details</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest translate-x-1">Event Type</Label>
              <Select value={formData.eventType} onValueChange={(v) => updateForm("eventType", v)}>
                <SelectTrigger className="w-full h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select-type">Select type</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="webinar">Webinar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest translate-x-1">Event Topic</Label>
              <Select value={formData.eventTopic} onValueChange={(v) => updateForm("eventTopic", v)}>
                <SelectTrigger className="w-full h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10">
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select-topic">Select topic</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest translate-x-1">Event Name</Label>
              <Input 
                value={formData.eventName}
                onChange={(e) => updateForm("eventName", e.target.value)}
                placeholder="Enter event name" 
                className="h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10" 
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest translate-x-1">Event URL</Label>
              <div className="relative group">
                <Input 
                  value={formData.eventUrl}
                  onChange={(e) => updateForm("eventUrl", e.target.value)}
                  placeholder="Enter URL slug" 
                  className="h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10 pr-14" 
                />
                <button 
                  type="button"
                  onClick={() => {
                    if (formData.eventUrl) {
                      navigator.clipboard.writeText(formData.eventUrl);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }
                  }}
                  className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-blue-600 transition-colors flex items-center justify-center bg-gray-50/50 border-l border-gray-100 rounded-r-lg group-focus-within:border-blue-500/20"
                  title="Copy URL"
                >
                  {copied ? (
                    <Check size={15} strokeWidth={3} className="text-green-500 animate-in zoom-in duration-300" />
                  ) : (
                    <Copy size={15} strokeWidth={2.5} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Description Card */}
        <div className={cardClass}>
          <div className={cardHeaderClass}>
            <div className={iconContainerClass}>
              <AlignLeft size={16} strokeWidth={3} />
            </div>
            <h2 className={cardTitleClass}>Description</h2>
          </div>
          <div className="p-0">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 flex items-center flex-wrap gap-1">
              {/* Text Style */}
              <div className="flex bg-white border border-gray-200 rounded-md p-0.5 shadow-sm">
                <button 
                  onClick={() => updateForm("__bold", !formData.__bold)}
                  className={`p-1.5 rounded transition-colors ${formData.__bold ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-600"}`} 
                  title="Bold"
                >
                  <Bold size={15} strokeWidth={2.5} />
                </button>
                <button 
                  onClick={() => updateForm("__italic", !formData.__italic)}
                  className={`p-1.5 rounded transition-colors ${formData.__italic ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-600"}`} 
                  title="Italic"
                >
                  <Italic size={15} strokeWidth={2.5} />
                </button>
                <button 
                  onClick={() => updateForm("__underline", !formData.__underline)}
                  className={`p-1.5 rounded transition-colors ${formData.__underline ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-600"}`} 
                  title="Underline"
                >
                  <Underline size={15} strokeWidth={2.5} />
                </button>
              </div>

              <div className="w-[1px] h-6 bg-gray-200 mx-1" />

              {/* Alignment */}
              <div className="flex bg-white border border-gray-200 rounded-md p-0.5 shadow-sm">
                {[
                  { id: 'left', icon: AlignLeftIcon },
                  { id: 'center', icon: AlignCenter },
                  { id: 'right', icon: AlignRight }
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => updateForm("__align", item.id)}
                    className={`p-1.5 rounded transition-colors ${(formData.__align || 'left') === item.id ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-600"}`} 
                    title={`Align ${item.id}`}
                  >
                    <item.icon size={15} />
                  </button>
                ))}
              </div>

              <div className="w-[1px] h-6 bg-gray-200 mx-1" />

              {/* Text Options */}
              <div className="flex bg-white border border-gray-200 rounded-md p-0.5 shadow-sm items-center gap-1">
                <Select value={formData.__fontSize || "14px"} onValueChange={(v) => updateForm("__fontSize", v)}>
                  <SelectTrigger className="h-7 border-none bg-transparent shadow-none px-2 text-[11px] font-bold text-gray-600 hover:bg-gray-100 focus:ring-0">
                    <SelectValue placeholder="14px" />
                  </SelectTrigger>
                  <SelectContent className="min-w-[80px]">
                    <SelectItem value="12px">12px</SelectItem>
                    <SelectItem value="14px">14px</SelectItem>
                    <SelectItem value="16px">16px</SelectItem>
                    <SelectItem value="18px">18px</SelectItem>
                    <SelectItem value="20px">20px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="p-6">
              <Textarea 
                value={formData.description}
                onChange={(e) => updateForm("description", e.target.value)}
                placeholder="Enter event description" 
                className={`min-h-[220px] border-none focus-visible:ring-0 p-0 text-[15px] leading-relaxed resize-none text-gray-600 ${formData.__bold ? 'font-bold' : ''} ${formData.__italic ? 'italic' : ''} ${formData.__underline ? 'underline' : ''}`}
                style={{ 
                  textAlign: (formData.__align || 'left') as 'left' | 'center' | 'right' | 'justify', 
                  fontSize: formData.__fontSize || '15px'
                }} 
              />
            </div>
          </div>
        </div>

        {/* Date & Time Card */}
        <div className={cardClass}>
          <div className={cardHeaderClass}>
            <div className={iconContainerClass}>
              <Calendar size={16} strokeWidth={3} />
            </div>
            <h2 className={cardTitleClass}>Date & Time</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-1.5">
              <Label className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Timezone</Label>
              <Select value={formData.timezone} onValueChange={(v) => updateForm("timezone", v)}>
                <SelectTrigger className="w-full h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10">
                  <SelectValue placeholder="Select Timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ist">IST - India Standard Time (UTC+5:30)</SelectItem>
                  <SelectItem value="utc">UTC - Universal Time Coordinated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                  <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest translate-x-1">Meeting Platform</Label>
                <Input 
                  type="date" 
                  value={formData.startDate}
                  onChange={(e) => updateForm("startDate", e.target.value)}
                  className="h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest translate-x-1">Start Time</Label>
                <div className="flex gap-2">
                  <Select value={formData.startHour} onValueChange={(v) => updateForm("startHour", v)}>
                    <SelectTrigger className="h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10 flex-1">
                      <SelectValue placeholder="Hr" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                        <SelectItem key={h} value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={formData.startMinute} onValueChange={(v) => updateForm("startMinute", v)}>
                    <SelectTrigger className="h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10 flex-1">
                      <SelectValue placeholder="Min" />
                    </SelectTrigger>
                    <SelectContent>
                      {["00", "15", "30", "45"].map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={formData.startPeriod} onValueChange={(v) => updateForm("startPeriod", v)}>
                    <SelectTrigger className="h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10 flex-1">
                      <SelectValue placeholder="AM/PM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest translate-x-1">Event Category</Label>
                <Input 
                  type="date" 
                  value={formData.endDate}
                  onChange={(e) => updateForm("endDate", e.target.value)}
                  className="h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10" 
                />
              </div>
              <div className="space-y-1.5">
                  <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest translate-x-1">Online Link</Label>
                <div className="flex gap-2">
                  <Select value={formData.endHour} onValueChange={(v) => updateForm("endHour", v)}>
                    <SelectTrigger className="h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10 flex-1">
                      <SelectValue placeholder="Hr" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                        <SelectItem key={h} value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={formData.endMinute} onValueChange={(v) => updateForm("endMinute", v)}>
                    <SelectTrigger className="h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10 flex-1">
                      <SelectValue placeholder="Min" />
                    </SelectTrigger>
                    <SelectContent>
                      {["00", "15", "30", "45"].map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={formData.endPeriod} onValueChange={(v) => updateForm("endPeriod", v)}>
                    <SelectTrigger className="h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10 flex-1">
                      <SelectValue placeholder="AM/PM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Participants Access Card */}
        <div className={cardClass}>
          <div className={cardHeaderClass}>
            <div className={iconContainerClass}>
              <Users size={16} strokeWidth={3} />
            </div>
            <h2 className={cardTitleClass}>Participants Access</h2>
          </div>
          <div className="p-6 space-y-8">
            {/* Registration Required */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[14px] font-bold text-gray-700">Registration required?</Label>
                  <p className="text-[11px] text-gray-400 italic">Toggle if attendees need to register in advance.</p>
                </div>
                <Switch 
                  checked={formData.registrationRequired} 
                  onCheckedChange={(v) => updateForm("registrationRequired", v)}
                  className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-red-500 scale-90" 
                />
              </div>
              {formData.registrationRequired && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="p-4 bg-gray-50/50 rounded-lg border border-gray-100 space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest translate-x-1">Registration Deadline</Label>
                      <Input 
                        type="date" 
                        value={formData.registrationDeadline}
                        onChange={(e) => updateForm("registrationDeadline", e.target.value)}
                        className="h-11 border-gray-200 rounded-lg bg-white" 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ticketing Card */}
        <div className={cardClass}>
          <div className={cardHeaderClass}>
            <div className={iconContainerClass}>
              <Ticket size={16} strokeWidth={3} />
            </div>
            <h2 className={cardTitleClass}>Ticketing</h2>
          </div>
          <div className="p-6 space-y-8">
            {/* Paid Event */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[14px] font-bold text-gray-700">Is Paid Event?</Label>
                  <p className="text-[11px] text-gray-400 italic">Toggle if this is a paid event with tickets.</p>
                </div>
                <Switch 
                  checked={formData.isPaidEvent} 
                  onCheckedChange={(v) => updateForm("isPaidEvent", v)}
                  className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-red-500 scale-90" 
                />
              </div>
              {formData.isPaidEvent && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="p-4 bg-gray-50/50 rounded-lg border border-gray-100 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest translate-x-1">Ticket Price ($)</Label>
                        <Input 
                          type="number" 
                          value={formData.ticketPrice}
                          onChange={(e) => updateForm("ticketPrice", e.target.value)}
                          placeholder="0.00" 
                          className="h-11 border-gray-200 rounded-lg bg-white" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest translate-x-1">Number of Tickets</Label>
                        <Input 
                          type="number" 
                          value={formData.ticketCount}
                          onChange={(e) => updateForm("ticketCount", e.target.value)}
                          placeholder="e.g. 100" 
                          className="h-11 border-gray-200 rounded-lg bg-white" 
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest translate-x-1">Event Short Description</Label>
                      <Select value={formData.paymentConfig} onValueChange={(v) => updateForm("paymentConfig", v)}>
                        <SelectTrigger className="h-11 border-gray-200 rounded-lg bg-white">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between py-1 px-1">
                      <span className="text-[13px] font-medium text-gray-600">Show remaining tickets to public</span>
                      <Switch 
                        checked={formData.showRemaining} 
                        onCheckedChange={(v) => updateForm("showRemaining", v)}
                        className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-red-500 scale-90" 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Venue Card */}
        <div className={cardClass}>
          <div className={cardHeaderClass}>
            <div className={iconContainerClass}>
              <MapPin size={16} strokeWidth={3} />
            </div>
            <h2 className={cardTitleClass}>Venue</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
                <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest translate-x-1">Venue Address</Label>
              <Input 
                value={formData.address}
                onChange={(e) => updateForm("address", e.target.value)}
                placeholder="Enter address" 
                className="h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest translate-x-1">City</Label>
                <Input 
                  value={formData.city}
                  onChange={(e) => updateForm("city", e.target.value)}
                  placeholder="Enter city" 
                  className="h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest translate-x-1">State</Label>
                <Input 
                  value={formData.state}
                  onChange={(e) => updateForm("state", e.target.value)}
                  placeholder="Enter state" 
                  className="h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10" 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Country</Label>
              <Select value={formData.country} onValueChange={(v) => updateForm("country", v)}>
                <SelectTrigger className="h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="usa">USA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Location Card (Map Pin) */}
        <div className={cardClass}>
          <div className={cardHeaderClass}>
            <div className={iconContainerClass}>
              <Globe size={16} strokeWidth={3} />
            </div>
            <h2 className={cardTitleClass}>Location Pin</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Latitude</Label>
                <Input 
                  value={formData.latitude}
                  onChange={(e) => updateForm("latitude", e.target.value)}
                  placeholder="e.g. 12.9716" 
                  className="h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Longitude</Label>
                <Input 
                  value={formData.longitude}
                  onChange={(e) => updateForm("longitude", e.target.value)}
                  placeholder="e.g. 77.5946" 
                  className="h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10" 
                />
              </div>
            </div>
            <div className="aspect-[21/9] w-full bg-gray-50 rounded-lg border border-gray-100 overflow-hidden shadow-sm shadow-black/5">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4827.581712160339!2d77.71685826930855!3d8.698209010471249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b041246e72d77b7%3A0x404a3f029621c210!2sMelapalayam%20Uzhavar%20Santhai!5e0!3m2!1sen!2sin!4v1774670465438!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[0.2] contrast-[1.1]"
              />
            </div>
          </div>
        </div>

        {/* Online Card */}
        <div className={cardClass}>
          <div className={cardHeaderClass}>
            <div className={iconContainerClass}>
              <Monitor size={16} strokeWidth={3} />
            </div>
            <h2 className={cardTitleClass}>Online Link</h2>
          </div>
          <div className="p-6">
            <div className="space-y-1.5">
              <Label className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Meeting / Event Link</Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Monitor size={16} />
                </div>
                <Input 
                  type="url"
                  value={formData.onlineLink}
                  onChange={(e) => updateForm("onlineLink", e.target.value)}
                  placeholder="Enter meeting link" 
                  className="h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10 pl-10" 
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1 italic">Provide the full URL for your online event.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column */}
      <div className="w-full lg:w-[380px] space-y-6">
        {/* Cover Image Card */}
        <div className={cardClass}>
          <div className={cardHeaderClass}>
            <div className={iconContainerClass}>
              <ImageIcon size={16} strokeWidth={3} />
            </div>
            <h2 className={cardTitleClass}>Cover Image</h2>
          </div>
          <div className="p-6 space-y-4">
            {/* Desktop View */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Monitor size={14} /> Desktop View
              </Label>
              <div className="border border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-all group">
                <Upload size={20} className="text-blue-500 mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] font-bold text-gray-600">Browse Desktop Image</p>
                <p className="text-[9px] text-gray-400">1920 x 1080 recommended</p>
              </div>
            </div>

            {/* Tablet View */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Tablet size={14} /> Tablet View
              </Label>
              <div className="border border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-all group">
                <Upload size={20} className="text-blue-500 mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] font-bold text-gray-600">Browse Tablet Image</p>
                <p className="text-[9px] text-gray-400">1024 x 1366 recommended</p>
              </div>
            </div>

            {/* Mobile View */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Smartphone size={14} /> Mobile View
              </Label>
              <div className="border border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-all group">
                <Upload size={20} className="text-blue-500 mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-[11px] font-bold text-gray-600">Browse Mobile Image</p>
                <p className="text-[9px] text-gray-400">750 x 1334 recommended</p>
              </div>
            </div>
          </div>
        </div>

        {/* Organizer Details Card */}
        <div className={cardClass}>
          <div className={cardHeaderClass}>
            <div className={iconContainerClass}>
              <Users size={16} strokeWidth={3} />
            </div>
            <div className="flex-1 flex items-center justify-between">
              <h2 className={cardTitleClass}>Organizer Details</h2>
              <div className="flex items-center bg-gray-50/50 dark:bg-gray-900/50 p-1 rounded-lg border border-gray-100 dark:border-gray-800">
                <button 
                  onClick={() => updateForm("organizerType", "client")}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${formData.organizerType === "client" ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                >
                  CLIENT
                </button>
                <button 
                  onClick={() => updateForm("organizerType", "admin")}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${formData.organizerType === "admin" ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                >
                  ADMIN
                </button>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {formData.organizerType === "client" ? (
              <>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <input 
                      type="file" 
                      id="organizer-photo-upload" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          updateForm("organizerPhoto", url);
                        }
                      }}
                    />
                    <label 
                      htmlFor="organizer-photo-upload"
                      className="w-24 h-24 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 group-hover:bg-gray-100 transition-all cursor-pointer"
                    >
                      {formData.organizerPhoto ? (
                        <Image src={formData.organizerPhoto} alt="Organizer" fill className="object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <Users size={24} />
                          <span className="text-[10px] font-bold mt-1 uppercase tracking-tight">Browse</span>
                        </div>
                      )}
                    </label>
                    <label 
                      htmlFor="organizer-photo-upload"
                      className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <Upload size={14} />
                    </label>
                  </div>
                  <p className="text-[11px] text-gray-400 text-center font-medium">Click to upload organizer profile photo</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest translate-x-1">Organizer Profile Name</Label>
                    <Input 
                      value={formData.organizerName}
                      onChange={(e) => updateForm("organizerName", e.target.value)}
                      placeholder="Enter name" 
                      className="h-11 border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest translate-x-1">Mobile No</Label>
                    <Input 
                      value={formData.organizerContact}
                      onChange={(e) => updateForm("organizerContact", e.target.value)}
                      placeholder="Enter contact number" 
                      className="h-11 border-gray-200 rounded-lg" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest translate-x-1">Password</Label>
                    <Input 
                      type="password"
                      value={formData.organizerPassword}
                      onChange={(e) => updateForm("organizerPassword", e.target.value)}
                      placeholder="••••••••" 
                      className="h-11 border-gray-200 rounded-lg" 
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-4 py-2">
                   <div className="w-24 h-24 rounded-full border border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
                    {formData.organizerPhoto ? (
                      <Image src={formData.organizerPhoto} alt="Staff" fill className="object-cover" />
                    ) : (
                      <Users size={32} className="text-gray-300" />
                    )}
                   </div>
                   <Badge className="bg-blue-50 text-blue-600 font-bold border-blue-100">Staff Selection</Badge>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest translate-x-1">Select Organizer (Staff)</Label>
                  <Select 
                    onValueChange={(val) => {
                      const staff = staffList.find(s => s.empId === val);
                      if (staff) {
                        updateForm("organizerName", staff.name);
                        updateForm("organizerContact", staff.mobile);
                        updateForm("organizerPhoto", staff.profilePic || "");
                      }
                    }}
                  >
                    <SelectTrigger className="h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10">
                      <SelectValue placeholder="Browse staff members" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffList.length > 0 ? (
                        staffList.map((staff) => (
                          <SelectItem key={staff.id} value={staff.empId}>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{staff.name}</span>
                              <span className="text-[10px] text-gray-400">({staff.empId})</span>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-staff" disabled>No staff members found</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                {formData.organizerName && (
                  <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 space-y-2 animate-in fade-in duration-300">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</span>
                      <span className="text-[13px] font-bold text-gray-700">{formData.organizerName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</span>
                      <span className="text-[13px] font-bold text-gray-700">{formData.organizerContact}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tags Card */}
        <div className={cardClass}>
          <div className={cardHeaderClass}>
            <div className={iconContainerClass}>
              <List size={16} strokeWidth={3} />
            </div>
            <h2 className={cardTitleClass}>Event Tags</h2>
          </div>
          <div className="p-6">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest translate-x-1">Tags</Label>
              <Input 
                value={formData.tags}
                onChange={(e) => updateForm("tags", e.target.value)}
                placeholder="Enter tags" 
                className="h-11 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10" 
              />
              <p className="text-[10px] text-gray-400 mt-1 italic">Press enter or use commas to separate tags</p>
            </div>
          </div>
        </div>
        <div className={cardClass}>
          <div className={cardHeaderClass}>
            <div className={iconContainerClass}>
              <Settings2 size={16} strokeWidth={3} />
            </div>
            <h2 className={cardTitleClass}>Listing Settings</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Listing Privacy</Label>
              <Select value={formData.privacy} onValueChange={(v) => updateForm("privacy", v)}>
                <SelectTrigger className="h-11 border-gray-200 rounded-lg">
                  <SelectValue placeholder="Select privacy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public (Everyone can see)</SelectItem>
                  <SelectItem value="private">Private (Invite only)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full h-11 text-[13px] font-bold gap-2 bg-white border-2 border-indigo-50 text-indigo-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:border-transparent transition-all duration-300 rounded-xl shadow-sm hover:shadow-indigo-200 hover:-translate-y-0.5 active:scale-[0.98]">
                <Eye size={16} strokeWidth={2.5} /> Preview Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-none rounded-2xl bg-white focus:outline-none">
              <DialogHeader className="sr-only">
                <DialogTitle>Event Preview</DialogTitle>
                <DialogDescription>
                  Preview of the event creation form data.
                </DialogDescription>
              </DialogHeader>
              <div className="relative w-full aspect-[21/9] bg-gray-200 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 uppercase tracking-[0.2em] font-bold text-sm">
                  Banner Preview
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-8 right-8 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-blue-600 text-[10px] font-bold uppercase rounded">
                      {formData.eventType === "select-type" ? "EVENT" : formData.eventType}
                    </span>
                    <span className="text-white/80 text-[11px] font-medium flex items-center gap-1">
                      <Users size={12} /> by {formData.organizerName || "Organizer"}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold mb-1">{formData.eventName || "Your Event Title"}</h1>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 p-8 bg-white">
                <div className="flex-1 space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                      <AlignLeft size={18} className="text-blue-500" /> Event Description
                    </h3>
                    <p className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-wrap">
                      {formData.description || "Enter an event description to see it previewed here. This section highlights everything your attendees need to know."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags ? formData.tags.split(',').filter(t => t.trim()).map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">#{tag.trim()}</span>
                    )) : (
                      <p className="text-xs text-gray-400 italic font-medium tracking-tight">No tags added yet</p>
                    )}
                  </div>
                </div>

                <div className="w-full md:w-[300px] shrink-0 space-y-4">
                  <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-xl space-y-4 shadow-sm">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Calendar className="text-blue-500 mt-0.5" size={18} />
                        <div>
                          <p className="text-[11px] font-bold text-gray-400 uppercase">Date & Time</p>
                          <p className="text-[13px] font-bold text-gray-800">
                            {formData.startDate ? new Date(formData.startDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Date Not Set"}
                          </p>
                          <p className="text-[12px] text-gray-500 font-medium">
                            {formData.startHour}:{formData.startMinute} {formData.startPeriod}
                            {formData.endHour ? ` - ${formData.endHour}:${formData.endMinute} ${formData.endPeriod}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="text-blue-500 mt-0.5" size={18} />
                        <div>
                          <p className="text-[11px] font-bold text-gray-400 uppercase">Location</p>
                          <p className="text-[13px] font-bold text-gray-800 uppercase tracking-tight">
                            {formData.locationType === "online" ? "Online meeting" : (formData.address || "Location Name")}
                          </p>
                          <p className="text-[12px] text-gray-500 font-medium whitespace-nowrap">
                            {formData.locationType === "physical" ? `${formData.city || "City"}, ${formData.country === "india" ? "India" : "USA"}` : "Web Link"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Ticket className="text-blue-500 mt-0.5" size={18} />
                        <div>
                          <p className="text-[11px] font-bold text-gray-400 uppercase">Admission</p>
                          <p className="text-[13px] font-bold text-gray-800 uppercase">
                            {formData.isPaidEvent ? `$${formData.ticketPrice || "0.00"} / Person` : "Free Entrance"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-bold uppercase py-6 shadow-lg shadow-blue-500/20 rounded-xl">
                      Reserve Your Spot
                    </Button>
                  </div>
                  {formData.isPaidEvent && formData.showRemaining && (
                    <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Remaining</span>
                      <span className="text-[14px] font-bold text-blue-600">-- / {formData.ticketCount || "0"}</span>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[13px] font-bold gap-2 transition-all duration-300 shadow-lg shadow-blue-500/20 rounded-xl hover:-translate-y-0.5 active:scale-[0.98]">
            <Send size={16} strokeWidth={2.5} /> Publish Event
          </Button>
          <Button variant="outline" className="w-full h-11 bg-white border-2 border-slate-100 text-slate-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:border-transparent transition-all duration-300 rounded-xl text-[13px] font-bold gap-2 shadow-sm hover:shadow-blue-200 hover:-translate-y-0.5 active:scale-[0.98]">
            <Save size={16} strokeWidth={1.5} /> Save as Draft
          </Button>
          <button 
            type="button"
            onClick={() => setFormData({
              eventName: "",
              eventUrl: "",
              eventType: "select-type",
              eventTopic: "select-topic",
              tags: "",
              description: "",
              timezone: "ist",
              startDate: "",
              startHour: "09",
              startMinute: "00",
              startPeriod: "AM",
              endDate: "",
              endHour: "06",
              endMinute: "00",
              endPeriod: "PM",
              registrationRequired: false,
              registrationDeadline: "",
              isPaidEvent: false,
              ticketPrice: "",
              ticketCount: "",
              paymentConfig: "",
              showRemaining: false,
              organizerName: "",
              organizerContact: "",
              locationType: "physical",
              address: "Melapalayam Uzhavar Santhai",
              city: "Tirunelveli",
              state: "Tamil Nadu",
              country: "india",
              latitude: "8.6982",
              longitude: "77.7169",
              onlineLink: "",
              desktopImage: "",
              tabletImage: "",
              mobileImage: "",
              organizerPhoto: "",
              organizerType: "client",
              organizerPassword: "",
              privacy: "public",
              __bold: false,
              __italic: false,
              __underline: false,
              __align: "left",
              __fontSize: "14px",
              __textColor: "#4b5563"
            })}
            className="w-full h-11 bg-white border-2 border-red-50 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 rounded-xl flex items-center justify-center gap-1.5 text-[12px] font-bold shadow-sm hover:shadow-red-200 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <RotateCcw size={14} strokeWidth={2.5} /> Reset Form
          </button>
        </div>
      </div>
    </div>
  </div>
);
}
