'use client';

import { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { useVendorMe } from '@/hooks/use-vendors';
import { VendorSidebarProfileCard } from './vendor-sidebar-profile-card';
import { VendorLocationCard } from './vendor-location-card';


const cardClass = 'bg-card rounded-[5px] border border-border overflow-hidden shadow-sm dark:shadow-none mb-6 font-["Roboto",sans-serif]';

export function VendorEditProfileContent() {
  const { data: vendor, isLoading } = useVendorMe();
  const [pref1, setPref1] = useState(true);
  const [pref2, setPref2] = useState(true);


  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );

  return (
    <div className="bg-background min-h-screen -mt-6 -mx-6 -mb-6 p-6 font-['Roboto',sans-serif]">


      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
          <h1 className="text-foreground text-[24px] font-bold leading-tight uppercase">Edit Profile</h1>
        </div>
        <div className="flex items-center flex-wrap gap-2 mt-4 md:mt-0">
          <button className="h-9 px-4 flex items-center gap-2 bg-primary text-white rounded-[5px] shadow-sm hover:brightness-110 text-[13px] font-medium whitespace-nowrap ml-1">
            14 Aug 2019 <ChevronRight size={14} className="rotate-90 translate-y-0.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* --- LEFT COLUMN (1) --- */}
        <div className="w-full lg:w-[380px] shrink-0 space-y-6">
          <VendorSidebarProfileCard vendor={vendor} isEditMode />
          <VendorLocationCard />
        </div>

        {/* --- RIGHT COLUMN (2) --- Form Content */}
        <div className="flex-1 min-w-0 lg:max-h-[1234px] flex flex-col">
          <div className={`${cardClass} flex-1 flex flex-col mb-0 overflow-hidden`}>
            <div className="flex-1 overflow-y-auto p-8 chat-scrollbar">
              <form className="space-y-6">

                {/* NAME */}
                <div>
                  <h6 className="text-foreground text-[13px] font-bold uppercase tracking-wider mb-5 mt-2">NAME</h6>
                  <div className="space-y-[18px]">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">User Name</label>
                      <div className="md:col-span-3">
                        <input type="text" className="w-full px-4 py-[9px] border border-border bg-muted text-muted-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all" defaultValue="Petey Cruiser" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">Full Name</label>
                      <div className="md:col-span-3">
                        <input type="text" className="w-full px-4 py-[9px] border border-border bg-muted text-muted-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all" defaultValue="Petey" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">Job Title</label>
                      <div className="md:col-span-3">
                        <input type="text" className="w-full px-4 py-[9px] border border-border bg-muted text-muted-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all" defaultValue="Web Designer" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* CONTACT INFO */}
                <div>
                  <h6 className="text-foreground text-[13px] font-bold uppercase tracking-wider mb-5 mt-2">CONTACT INFO</h6>
                  <div className="space-y-[18px]">
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">Mobile Number</label>
                      <div className="md:col-span-3">
                        <input type="text" className="w-full px-4 py-[9px] border border-border bg-muted text-muted-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all" defaultValue="+245 354 654" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1 mt-[9px]">Email<span className="italic text-[13px]">(required)</span></label>
                      <div className="md:col-span-3">
                        <input type="email" className="w-full px-4 py-[9px] border border-border bg-muted text-muted-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all" defaultValue="info@Valex.in" />
                      </div>
                    </div>
              
                    <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1 mt-[9px]">Address</label>
                      <div className="md:col-span-3">
                        <textarea className="w-full px-4 py-[9px] border border-border bg-muted text-muted-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[90px] resize-none" defaultValue="San Francisco, CA" />
                      </div>
                    </div>
                  </div>
                </div>

                 {/* SOCIAL INFO */}
                <div>
                  <h6 className="text-foreground text-[13px] font-bold uppercase tracking-wider mb-5 mt-2">SOCIAL INFO</h6>
                  <div className="space-y-[18px]">
                     <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">Website</label>
                      <div className="md:col-span-3">
                        <input type="text" className="w-full px-4 py-[9px] border border-border bg-muted text-muted-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all" defaultValue="spruko.com" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">Youtube</label>
                      <div className="md:col-span-3">
                        <input type="text" className="w-full px-4 py-[9px] border border-border bg-muted text-muted-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all" defaultValue="youtube.com/spruko" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">Facebook</label>
                      <div className="md:col-span-3">
                        <input type="text" className="w-full px-4 py-[9px] border border-border bg-muted text-muted-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all" defaultValue="facebook.com/spruko" />
                      </div>
                    </div>
                
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">Twitter</label>
                      <div className="md:col-span-3">
                        <input type="text" className="w-full px-4 py-[9px] border border-border bg-muted text-muted-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all" defaultValue="twitter.com/spruko" />
                      </div>
                    </div>
                   <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">LinkedIn</label>
                      <div className="md:col-span-3">
                        <input type="text" className="w-full px-4 py-[9px] border border-border bg-muted text-muted-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all" defaultValue="linkedin.com/spruko" />
                      </div>
                    </div>
                
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1">Instagram</label>
                      <div className="md:col-span-3">
                        <input type="text" className="w-full px-4 py-[9px] border border-border bg-muted text-muted-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all" defaultValue="instagram.com/spruko" />
                      </div>
                    </div>
                  </div>
                </div>

                 {/* ABOUT YOURSELF */}
                <div>
                  <h6 className="text-foreground text-[13px] font-bold uppercase tracking-wider mb-5 mt-2">ABOUT YOURSELF</h6>
                  <div className="space-y-[18px]">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1 mt-[9px]">Biographical Info</label>
                      <div className="md:col-span-3">
                        <textarea className="w-full px-4 py-[9px] border border-border bg-muted text-muted-foreground rounded-[3px] text-[14px] focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[100px] resize-none" defaultValue="pleasure rationally encounter but because pursue consequences that are extremely painful.occur in which toil and pain can procure him some great pleasure.." />
                      </div>
                    </div>
                  </div>
                </div>

                 {/* EMAIL PREFERENCES */}
                <div>
                  <h6 className="text-foreground text-[13px] font-bold uppercase tracking-wider mb-5 mt-2">EMAIL PREFERENCES</h6>
                  <div className="space-y-[18px]">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-2 md:gap-4">
                      <label className="text-[14px] text-foreground font-normal md:col-span-1 mt-1">Verified User</label>
                      <div className="md:col-span-3 flex flex-col gap-3">
                         <label 
                           className="flex items-center gap-2 cursor-pointer group select-none"
                           onClick={() => setPref1(!pref1)}
                         >
                            <div className={`relative flex items-center justify-center w-[18px] h-[18px] rounded-[3px] border transition-all ${pref1 ? 'bg-primary border-primary' : 'bg-transparent border-gray-300 dark:border-gray-600'}`}>
                               {pref1 && <Check size={12} className="text-white" />}
                            </div>
                            <span className="text-[14px] text-muted-foreground">Accept to receive post or page notification emails</span>
                         </label>
                         <label 
                           className="flex items-center gap-2 cursor-pointer group select-none"
                           onClick={() => setPref2(!pref2)}
                         >
                            <div className={`relative flex items-center justify-center w-[18px] h-[18px] rounded-[3px] border transition-all ${pref2 ? 'bg-primary border-primary' : 'bg-transparent border-gray-300 dark:border-gray-600'}`}>
                               {pref2 && <Check size={12} className="text-white" />}
                            </div>
                            <span className="text-[14px] text-muted-foreground">Accept to receive email sent to multiple recipients</span>
                         </label>
                      </div>
                    </div>
                  </div>
                </div>

              </form>

              <div className="mt-8">
                <button className="bg-primary text-white px-[20px] py-[10px] text-[13px] font-medium rounded-[5px] hover:bg-primary/90 transition-all">
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
