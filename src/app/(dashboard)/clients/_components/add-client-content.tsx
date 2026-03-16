'use client';

import { ChevronRight, Camera, MapPin, User, Check, Edit, Globe, Plus } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const cardClass = 'bg-card rounded-[5px] border border-border overflow-hidden shadow-sm dark:shadow-none mb-6 font-["Roboto",sans-serif]';

export function AddClientContent() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [mapUrl, setMapUrl] = useState<string>('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15774.649406022643!2d77.65316343283229!3d8.723576470830025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b041155f6b7c95d%3A0x6d92cee22878c849!2sPettai%2C%20Tamil%20Nadu%20627004!5e0!3m2!1sen!2sin!4v1773463883440!5m2!1sen!2sin');
  const [isEditingMap, setIsEditingMap] = useState(false);
  const [tempMapUrl, setTempMapUrl] = useState('');

  const handleSaveMap = () => {
    if (tempMapUrl.includes('iframe') || tempMapUrl.startsWith('http')) {
      const match = tempMapUrl.match(/src="([^"]+)"/);
      const url = match ? match[1] : tempMapUrl;
      setMapUrl(url);
      setIsEditingMap(false);
      setTempMapUrl('');
    }
  };

  return (
    <div className="bg-background min-h-screen -mt-6 -mx-6 -mb-6 p-6 font-['Roboto',sans-serif]">


      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
          <h1 className="text-foreground text-[24px] font-bold leading-tight uppercase">Add Client</h1>
        </div>
        <div className="flex items-center flex-wrap gap-2 mt-4 md:mt-0">
          <button className="h-9 px-4 flex items-center gap-2 bg-primary text-white rounded-[5px] shadow-sm hover:brightness-110 text-[13px] font-medium whitespace-nowrap ml-1">
            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} <ChevronRight size={14} className="rotate-90 translate-y-0.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* --- LEFT COLUMN (Profile Picture & Location Preview) --- */}
        <div className="w-full lg:w-[380px] shrink-0 space-y-6">
          <div className={`${cardClass} p-8 text-center`}>
            <div className="relative w-[120px] h-[120px] mx-auto mb-4 group">
              <Avatar className="w-full h-full border-4 border-background shadow-md">
                {profilePic ? (
                  <AvatarImage src={profilePic} className="object-cover" />
                ) : null}
                <AvatarFallback className="bg-muted text-muted-foreground text-2xl">
                  <User size={40} />
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform border-4 border-card">
                <Camera size={14} />
                <input type="file" className="hidden" onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setProfilePic(URL.createObjectURL(e.target.files[0]));
                  }
                }} />
              </label>
            </div>
            <h3 className="text-lg font-bold text-foreground">Client Profile Picture</h3>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Upload a clear photo</p>
          </div>

          <div className={`${cardClass} p-8`}>
            <div className="flex items-center justify-between mb-6">
              <h6 className="text-foreground text-[15px] font-bold uppercase tracking-wider mb-0">Location</h6>
              {mapUrl && !isEditingMap && (
                <button
                  type="button"
                  onClick={() => { setIsEditingMap(true); setTempMapUrl(mapUrl); }}
                  className="flex items-center gap-1.5 text-primary text-[12px] font-bold uppercase transition-all hover:opacity-70"
                >
                  <Edit size={14} /> Edit
                </button>
              )}
            </div>

            <div className="space-y-4">
              {isEditingMap ? (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="bg-muted/30 p-4 rounded-[5px] border border-border">
                    <label className="block text-foreground text-[12px] font-bold mb-2 uppercase tracking-wide">Paste Google Maps Embed URL/Iframe</label>
                    <textarea
                      value={tempMapUrl}
                      onChange={(e) => setTempMapUrl(e.target.value)}
                      placeholder='<iframe src="..." ...></iframe>'
                      className="w-full px-3 py-2 bg-card border border-border rounded-[5px] text-[12px] text-muted-foreground focus:outline-none focus:border-primary min-h-[80px] resize-none mb-3"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSaveMap}
                        className="flex-1 py-2 bg-primary text-white text-[11px] font-bold rounded-[3px] uppercase shadow-sm hover:bg-primary/90"
                      >
                        Save Location
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingMap(false)}
                        className="px-4 py-2 border border-border text-muted-foreground text-[11px] font-bold rounded-[3px] uppercase hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : mapUrl ? (
                <div className="rounded-[5px] border border-border overflow-hidden bg-gray-50 aspect-video relative shadow-sm group">
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              ) : (
                <div className="rounded-[5px] border border-dashed border-border bg-muted/30 aspect-video flex flex-col items-center justify-center text-center p-6 group transition-all hover:bg-primary/10">
                  <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground mb-3 group-hover:scale-110 transition-transform">
                    <MapPin size={24} />
                  </div>
                  <p className="text-foreground text-[13px] font-bold mb-1">No Location Added</p>
                  <p className="text-muted-foreground text-[11px] mb-4">Add the client&apos;s location for easy navigation.</p>
                  <button
                    type="button"
                    onClick={() => setIsEditingMap(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-card border border-primary text-primary text-[11px] font-bold rounded-[3px] uppercase hover:bg-primary hover:text-white transition-all"
                  >
                    <Plus size={14} /> Add Location
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 text-primary text-[12px] font-medium hover:underline cursor-pointer group">
                <Globe size={14} className="group-hover:rotate-12 transition-transform" />
                View on Google Maps
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN (Form Fields) --- */}
        <div className="flex-1 min-w-0">
          <div className={`${cardClass} p-8`}>
            <form className="space-y-6">
                <div>
                  <h6 className="text-foreground text-[13px] font-bold uppercase tracking-wider mb-5">PRIMARY ACCOUNT DETAILS</h6>
                  <div className="space-y-[18px]">
                      {/* Full Name */}
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-semibold md:col-span-1">Full Name</label>
                        <div className="md:col-span-3">
                          <input type="text" placeholder="John Doe" className="w-full px-4 py-[11px] border border-border bg-muted/40 text-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                        </div>
                      </div>
                      
                      {/* Email */}
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-semibold md:col-span-1">Email</label>
                        <div className="md:col-span-3">
                          <input type="email" placeholder="first.last@example.com" className="w-full px-4 py-[11px] border border-border bg-muted/40 text-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                        </div>
                      </div>

                      {/* Mobile Number */}
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-semibold md:col-span-1">Mobile Number</label>
                        <div className="md:col-span-3">
                          <input type="text" placeholder="+123 456 7890" className="w-full px-4 py-[11px] border border-border bg-muted/40 text-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                        </div>
                      </div>

                      {/* Username */}
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-semibold md:col-span-1">Username</label>
                        <div className="md:col-span-3">
                          <input type="text" placeholder="john" className="w-full px-4 py-[11px] border border-border bg-muted/40 text-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-semibold md:col-span-1">Password</label>
                        <div className="md:col-span-3">
                          <input type="password" placeholder="6 - 15 Characters" className="w-full px-4 py-[11px] border border-border bg-muted/40 text-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                        </div>
                      </div>

                      {/* Re-Password */}
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-semibold md:col-span-1">Re-Password</label>
                        <div className="md:col-span-3">
                          <input type="password" placeholder="6 - 15 Characters" className="w-full px-4 py-[11px] border border-border bg-muted/40 text-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                        </div>
                      </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <h6 className="text-foreground text-[13px] font-bold uppercase tracking-wider mb-5 mt-2">ADDRESS & LOCATION</h6>
                  <div className="space-y-[18px]">
                      {/* Address */}
                      <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-semibold md:col-span-1 mt-[11px]">Address</label>
                        <div className="md:col-span-3">
                          <textarea className="w-full px-4 py-[11px] border border-border bg-muted/40 text-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[100px] resize-none" placeholder="123 Luxury Ave, Suite 500..." />
                        </div>
                      </div>

                      {/* Location URL */}
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <label className="text-[14px] text-foreground font-semibold md:col-span-1">Location Link</label>
                        <div className="md:col-span-3">
                          <input type="text" placeholder="Google Maps URL" className="w-full px-4 py-[11px] border border-border bg-muted/40 text-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                        </div>
                      </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                    <h6 className="text-foreground text-[13px] font-bold uppercase tracking-wider mb-5 mt-2">ABOUT THE CLIENT</h6>
                    <textarea className="w-full px-4 py-[14px] border border-border bg-muted/40 text-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[160px] resize-none" placeholder="Enter a brief biograhpy about the client..." />
                </div>

                <div className="pt-6">
                    <button type="submit" className="bg-primary text-white px-10 py-3 text-[14px] font-bold rounded-[3px] hover:brightness-110 active:scale-95 transition-all shadow-[0_6px_20px_rgba(1,98,232,0.3)] flex items-center justify-center gap-2 group">
                        <Check size={18} className="group-hover:scale-125 transition-transform" />
                        SAVE CLIENT
                    </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
