'use client';

import { useRef, useState, useEffect } from 'react';
import {
  Activity, Shield, Bell, Edit, Lock, MapPin, Phone, Mail,
  Briefcase, ChevronRight, Check, Save, X, Download, User,
  Key, Smartphone, AlertTriangle, FileText, RefreshCw, LogIn,
  Settings, Archive, Camera, Globe, Facebook, Twitter, Linkedin,
  Github, MoreHorizontal, Image as ImageIcon, Users, Filter, Star,
  Heart, Rocket, Calendar
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useVendorMe, useUpdateVendorProfile } from '@/hooks/use-vendors';
import { useUploadMedia } from '@/hooks/use-media';
import { resolveMediaUrl } from '@/lib/utils';


const cardClass = 'bg-white rounded-[5px] border border-[#eae8f1] overflow-hidden shadow-[-8px_12px_18px_0_#dadee8] mb-6 font-["Roboto",sans-serif]';
const inputClass = 'w-full px-3 py-2 border border-[#eae8f1] rounded-[5px] text-sm focus:outline-none focus:ring-2 focus:ring-[#0162e8]/40 transition-all bg-[#f9fafc] focus:bg-white';

export function VendorProfileContent() {
  const { data: vendor, isLoading } = useVendorMe();
  const updateProfile = useUpdateVendorProfile();
  const uploadMedia = useUploadMedia();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState('about');
  const [uploading, setUploading] = useState(false);

  const initials = vendor?.name
    ? vendor.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'PC';

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadMedia.mutateAsync({ file, folder: 'vendors' });
      updateProfile.mutate({ profile: result.url });
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0162e8]" />
    </div>
  );

  return (
    <div className="bg-[#ecf0fa] min-h-screen -mt-6 -mx-6 -mb-6 p-8 font-['Roboto',sans-serif]">
      {/* External Font Link (Roboto is required for Valex) */}
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />

      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-[#1c273c] text-[24px] font-bold leading-tight uppercase">Profile</h1>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[#0162e8] text-[13px] font-medium">Pages</span>
            <span className="text-[#text-[#7987a1]] text-[13px]"> » Profile</span>
          </div>
        </div>
        <div className="flex items-center flex-wrap gap-2 mt-4 md:mt-0">
         
          <button className="h-9 px-4 flex items-center gap-2 bg-[#0162e8] text-white rounded-[5px] shadow-sm hover:brightness-110 text-[13px] font-medium whitespace-nowrap">
            14 Aug 2019 <ChevronRight size={14} className="rotate-90 translate-y-0.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* --- LEFT COLUMN --- */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className={`${cardClass} p-8 text-center`}>
            <div className="relative inline-block mb-6">
              <Avatar className="w-[124px] h-[124px] border border-[#eae8f1] p-[4px] bg-white rounded-full">
                <AvatarImage src={resolveMediaUrl(vendor?.profile || '')} className="object-cover rounded-full" />
                <AvatarFallback className="bg-gradient-to-br from-[#0162e8] to-[#0156cc] text-white font-bold text-4xl rounded-full">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <h5 className="text-[#1c273c] text-[22px] font-bold mb-1">{vendor?.name || 'Petey Cruiser'}</h5>
            <p className="text-[#7987a1] text-[13px] mb-6">{vendor?.company_name || 'Web Designer'}</p>

            <div className="text-left mb-6">
              <h6 className="text-[#1c273c] text-[15px] font-bold mb-2">Bio</h6>
              <p className="text-[#7987a1] text-[13px] leading-relaxed">
                pleasure rationally encounter but because pursue consequences that are extremely painful.occur in which toil and pain can procure him some great pleasure.. <span className="text-[#0162e8] cursor-pointer hover:underline font-medium">More</span>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-0 border-t border-[#eae8f1] pt-6 mb-6">
              <div className="text-center">
                <p className="text-[#1c273c] text-[20px] font-bold leading-none">947</p>
                <p className="text-[#7987a1] text-[12px] mt-1">Followers</p>
              </div>
              <div className="text-center border-x border-gray-100">
                <p className="text-[#1c273c] text-[20px] font-bold leading-none">583</p>
                <p className="text-[#7987a1] text-[12px] mt-1">Tweets</p>
              </div>
              <div className="text-center">
                <p className="text-[#1c273c] text-[20px] font-bold leading-none">48</p>
                <p className="text-[#7987a1] text-[12px] mt-1">Posts</p>
              </div>
            </div>

            <div className="text-left space-y-4">
              <h6 className="text-[#1c273c] text-[13px] font-bold uppercase tracking-wider">Social</h6>
              <div className="space-y-3">
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-[#f1f2f9] border border-[#f0f1f7] flex items-center justify-center text-[#0162e8] group-hover:bg-[#0162e8] group-hover:text-white transition-all"><Github size={18} /></div>
                  <div className="overflow-hidden">
                    <p className="text-[#1c273c] text-[13px] font-bold leading-tight">Github</p>
                    <p className="text-[#0162e8] text-[11px] truncate">github.com/spruko</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-[#f1f2f9] border border-[#f0f1f7] flex items-center justify-center text-[#22c55e] group-hover:bg-[#22c55e] group-hover:text-white transition-all"><Twitter size={18} /></div>
                  <div className="overflow-hidden">
                    <p className="text-[#1c273c] text-[13px] font-bold leading-tight">Twitter</p>
                    <p className="text-[#0162e8] text-[11px] truncate">twitter.com/spruko.me</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-[#f1f2f9] border border-[#f0f1f7] flex items-center justify-center text-[#fbbc05] group-hover:bg-[#fbbc05] group-hover:text-white transition-all"><Linkedin size={18} /></div>
                  <div className="overflow-hidden">
                    <p className="text-[#1c273c] text-[13px] font-bold leading-tight">Linkedin</p>
                    <p className="text-[#0162e8] text-[11px] truncate">linkedin.com/in/spruko</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-[#f1f2f9] border border-[#f0f1f7] flex items-center justify-center text-[#f10075] group-hover:bg-[#f10075] group-hover:text-white transition-all"><Globe size={18} /></div>
                  <div className="overflow-hidden">
                    <p className="text-[#1c273c] text-[13px] font-bold leading-tight">My Portfolio</p>
                    <p className="text-[#0162e8] text-[11px] truncate">spruko.com/</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${cardClass} p-8`}>
            <h6 className="text-[#1c273c] text-[15px] font-bold uppercase tracking-wider mb-6">Location</h6>
            <div className="space-y-4">
              <div className="rounded-[5px] border border-[#eae8f1] overflow-hidden bg-gray-50 aspect-video relative group cursor-pointer shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80" 
                  alt="Map Location" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-[#0162e8]/10 group-hover:bg-transparent transition-all" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center animate-bounce">
                    <MapPin size={18} className="text-[#f10075]" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#f8f9fe] p-3 rounded-[5px] border border-[#f0f3ff]">
                  <p className="text-[#7987a1] text-[10px] font-bold uppercase tracking-tight mb-0.5">Latitude</p>
                  <p className="text-[#1c273c] text-[13px] font-bold">25.1972° N</p>
                </div>
                <div className="bg-[#f8f9fe] p-3 rounded-[5px] border border-[#f0f3ff]">
                  <p className="text-[#7987a1] text-[10px] font-bold uppercase tracking-tight mb-0.5">Longitude</p>
                  <p className="text-[#1c273c] text-[13px] font-bold">55.2744° E</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-[#0162e8] text-[12px] font-medium hover:underline cursor-pointer group">
                <Globe size={14} className="group-hover:rotate-12 transition-transform" />
                View on Google Maps
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Orders', value: '1,587', icon: <FileText size={24} />, iconBg: 'bg-[#e5f0ff]', iconColor: 'text-[#0162e8]' },
              { label: 'Revenue', value: '46,782', icon: <Briefcase size={24} />, iconBg: 'bg-[#ffe5f1]', iconColor: 'text-[#f10075]' },
              { label: 'Product sold', value: '1,890', icon: <Rocket size={24} />, iconBg: 'bg-[#e1f5e6]', iconColor: 'text-[#22c55e]' },
            ].map((card, i) => (
              <div key={i} className={`${cardClass} p-8 flex items-center justify-between`}>
                <div className={`w-[60px] h-[60px] rounded-full ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0 shadow-inner`}>
                  {card.icon}
                </div>
                <div className="text-right">
                  <p className="text-[#7987a1] text-[13px] font-bold uppercase mb-1 tracking-tight">{card.label}</p>
                  <h3 className="text-[#1c273c] text-[28px] font-bold leading-tight mb-1">{card.value}</h3>
                  <p className="text-[#22c55e] text-[11px] font-medium flex items-center justify-end gap-1">
                    <span className="w-3 h-3 rounded-full bg-[#e1f5e6] flex items-center justify-center"><ChevronRight size={10} className="rotate-[-45deg] translate-y-[-0.5px] translate-x-[0.5px]" /></span>
                    increase
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* MAIN TABS CARD */}
          <div className={cardClass}>
            {/* VALEX TABS NAVIGATION */}
            <div className="bg-[#f0f3f9] p-1.5 flex gap-1">
              {[
                { id: 'about', label: 'ABOUT ME', icon: <User size={15} /> },
                { id: 'events', label: 'EVENTS', icon: <ImageIcon size={15} /> },
                { id: 'clients', label: 'CLIENTS', icon: <Users size={15} /> },
                { id: 'settings', label: 'SETTINGS', icon: <Settings size={15} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3.5 flex items-center justify-center gap-2 text-[12px] font-bold rounded-[3px] transition-all outline-none ${
                    activeTab === tab.id 
                    ? 'bg-white text-[#1c273c] shadow-sm' 
                    : 'text-[#7987a1] hover:text-[#1c273c]'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <div className="p-8 min-h-[500px]">
              {activeTab === 'about' && (
                <div className="animate-in fade-in duration-300">
                  <h6 className="text-[#1c273c] text-[16px] font-bold uppercase mb-5">Bio Data</h6>
                  <p className="text-[#7987a1] text-[14px] leading-[2] mb-10">
                    Hi I'm Petey Cruiser,has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt.Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.
                  </p>

                  <h6 className="text-[#1c273c] text-[16px] font-bold uppercase mb-6">Experience</h6>
                  <div className="space-y-8">
                    <div className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-[#0162e8] before:rounded-full">
                      <p className="text-[#0162e8] text-[15px] font-bold hover:underline cursor-pointer">Lead designer / Developer</p>
                      <p className="text-[#7987a1] text-[13px] mt-1 mb-2">websitename.com</p>
                      <p className="text-[#1c273c] font-bold text-[12px] uppercase">2010 - 2015</p>
                      <p className="text-[#7987a1] text-[14px] leading-relaxed mt-4">
                        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
                      </p>
                    </div>

                    <div className="h-px bg-[#eae8f1] w-full" />

                    <div className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-gray-300 before:rounded-full">
                      <p className="text-[#0162e8] text-[15px] font-bold hover:underline cursor-pointer">Senior Graphic Designer</p>
                      <p className="text-[#7987a1] text-[13px] mt-1 mb-2">coderthemes.com</p>
                      <p className="text-[#1c273c] font-bold text-[12px] uppercase">2007 - 2009</p>
                      <p className="text-[#7987a1] text-[14px] leading-relaxed mt-4">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type.
                      </p>
                    </div>

                    <div className="h-px bg-[#eae8f1] w-full" />

                    <div className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-gray-300 before:rounded-full">
                      <p className="text-[#0162e8] text-[15px] font-bold hover:underline cursor-pointer">Graphic Designer</p>
                      <p className="text-[#7987a1] text-[13px] mt-1 mb-2">softthemes.com</p>
                      <p className="text-[#1c273c] font-bold text-[12px] uppercase">2005 - 2007</p>
                      <p className="text-[#7987a1] text-[14px] leading-relaxed mt-4">
                        Scrambled it to make a type specimen book. Industry's standard dummy text ever since the 1500s.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'events' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in zoom-in-95 duration-300">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="bg-white rounded-[5px] border border-[#eae8f1] overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer">
                      <div className="aspect-[16/10] bg-gray-100 overflow-hidden relative">
                        <img 
                          src={`https://images.unsplash.com/photo-${[
                            '1511795409834-ef04bbd61622',
                            '1492684223066-81342ee5ff30',
                            '1533174072545-7a4b6ad7a6c3',
                            '1501281668745-f7f57925c3b4',
                            '1531050171654-af7c2f9cff6a',
                            '1470225620780-dba8ba36b745',
                            '1514525253361-b83f83ef4a2c',
                            '1540575861501-7ad0d02394e8',
                            '1505236858219-8359eb29e329',
                            '1516280440614-37939bbacd81',
                            '1519125323398-675f0ddb6308',
                            '1519741497674-611481863552'
                          ][i]}?auto=format&fit=crop&w=600&q=80`}
                          alt="events" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ImageIcon className="text-white w-8 h-8 opacity-80" />
                        </div>
                      </div>
                      <div className="p-6 text-center">
                        <h4 className="text-[#1c273c] text-[15px] font-bold mb-3 uppercase tracking-wide">Event Image</h4>
                        <div className="w-[30px] h-[2px] bg-[#0162e8] mx-auto mb-3" />
                        <p className="text-[#7987a1] text-[13px] font-medium italic">Photography</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'clients' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-300">
                  {[
                    { name: 'James Thomas', role: 'Web Designer', img: 'https://i.pravatar.cc/150?u=1' },
                    { name: 'Reynante Labares', role: 'Web Designer', img: 'https://i.pravatar.cc/150?u=2' },
                    { name: 'Owen Bongcaras', role: 'App Developer', img: 'https://i.pravatar.cc/150?u=3' },
                    { name: 'Stephen Metcalfe', role: 'Administrator', img: 'https://i.pravatar.cc/150?u=4' },
                    { name: 'Socrates Itumay', role: 'Project Manager', img: 'https://i.pravatar.cc/150?u=5' },
                    { name: 'Petey Cruiser', role: 'Web Designer', img: 'https://i.pravatar.cc/150?u=6' },
                    { name: 'Anna Mull', role: 'UI/UX Designer', img: 'https://i.pravatar.cc/150?u=7' },
                    { name: 'Barb Akew', role: 'PHP Developer', img: 'https://i.pravatar.cc/150?u=8' },
                    { name: 'Desmond Eagle', role: 'Backend Dev', img: 'https://i.pravatar.cc/150?u=9' },
                    { name: 'Eileen Sideways', role: 'Graphic Designer', img: 'https://i.pravatar.cc/150?u=10' },
                  ].map((friend, i) => (
                    <div key={i} className="bg-white rounded-[5px] border border-[#eae8f1] p-8 text-center relative group hover:shadow-md transition-all">
                      <button className="absolute top-4 right-4 text-[#7987a1] hover:text-[#1c273c]">
                        <MoreHorizontal size={18} />
                      </button>
                      <div className="mb-4 flex justify-center">
                        <Avatar className="w-[100px] h-[100px] border border-[#eae8f1] p-[2px] bg-white">
                          <AvatarImage src={friend.img} className="rounded-full" />
                          <AvatarFallback className="bg-gray-100 text-[#0162e8] font-bold">FR</AvatarFallback>
                        </Avatar>
                      </div>
                      <h5 className="text-[#1c273c] text-[16px] font-bold mb-1">{friend.name}</h5>
                      <p className="text-[#7987a1] text-[13px] mb-6">{friend.role}</p>
                      <div className="flex items-center justify-center gap-2">
                        <button className="w-9 h-9 border border-[#eae8f1] rounded-full flex items-center justify-center text-[#0162e8] hover:bg-[#0162e8] hover:text-white transition-all"><Facebook size={16} /></button>
                        <button className="w-9 h-9 border border-[#eae8f1] rounded-full flex items-center justify-center text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-all"><X size={14} /></button>
                        <button className="w-9 h-9 border border-[#eae8f1] rounded-full flex items-center justify-center text-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-all"><Linkedin size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-4 max-w-5xl">
                    <div className="space-y-2">
                      <label className="block text-[#1c273c] text-[14px] font-bold">Full Name</label>
                      <input type="text" className="w-full px-4 py-2 bg-[#fdfdfd] border border-[#eae8f1] rounded-[5px] text-[14px] text-[#7987a1] focus:outline-none focus:border-[#0162e8] transition-all" defaultValue="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[#1c273c] text-[14px] font-bold">Email</label>
                      <input type="email" className="w-full px-4 py-2 bg-[#fdfdfd] border border-[#eae8f1] rounded-[5px] text-[14px] text-[#7987a1] focus:outline-none focus:border-[#0162e8] transition-all" defaultValue="first.last@example.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[#1c273c] text-[14px] font-bold">Mobile Number</label>
                      <input type="tel" className="w-full px-4 py-2 bg-[#fdfdfd] border border-[#eae8f1] rounded-[5px] text-[14px] text-[#7987a1] focus:outline-none focus:border-[#0162e8] transition-all" defaultValue="+123 456 7890" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[#1c273c] text-[14px] font-bold">Username</label>
                      <input type="text" className="w-full px-4 py-2 bg-[#fdfdfd] border border-[#eae8f1] rounded-[5px] text-[14px] text-[#7987a1] focus:outline-none focus:border-[#0162e8] transition-all" defaultValue="john" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[#1c273c] text-[14px] font-bold">Password</label>
                      <input type="password" placeholder="6 - 15 Characters" className="w-full px-4 py-2 bg-[#fdfdfd] border border-[#eae8f1] rounded-[5px] text-[14px] text-[#7987a1] focus:outline-none focus:border-[#0162e8] transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[#1c273c] text-[14px] font-bold">Re-Password</label>
                      <input type="password" placeholder="6 - 15 Characters" className="w-full px-4 py-2 bg-[#fdfdfd] border border-[#eae8f1] rounded-[5px] text-[14px] text-[#7987a1] focus:outline-none focus:border-[#0162e8] transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[#1c273c] text-[14px] font-bold">About Me</label>
                      <textarea 
                        className="w-full px-4 py-2 bg-[#fdfdfd] border border-[#eae8f1] rounded-[5px] text-[14px] text-[#7987a1] focus:outline-none focus:border-[#0162e8] transition-all min-h-[140px] resize-none" 
                        defaultValue="Loren gypsum dolor sit mate, consecrate disciplining lit, tied diam nonunion nib modernism tincidunt it Loretta dolor manga Amalie erst solute. Ur wise denim ad minim venial, quid"
                      ></textarea>
                    </div>
                    <button className="bg-[#0162e8] text-white px-5 py-2.5 rounded-[5px] text-[13px] font-bold hover:bg-[#0156cc] transition-all shadow-sm uppercase">Save</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
