"use client";

import React from "react";
import { Palette, Quote, Star, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeColors {
  header: string;
  footer: string;
  primary: string;
  secondary: string;
  hover: string;
  text: string;
}

interface ThemePreviewProps {
  themeId: number | string;
  colors?: ThemeColors;
  className?: string;
  isFullPage?: boolean;
}

export const MiniNavbar = ({ colors, isFullPage }: { colors?: ThemeColors, isFullPage?: boolean }) => {
  const links = (
    <div className={cn("hidden min-[450px]:flex items-center", isFullPage ? "gap-8" : "gap-4")}>
        <span 
            className={cn(
                "font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all", 
                isFullPage ? "text-[12px]" : "text-[9px]",
                !colors?.primary && "text-gray-900 border-blue-600"
            )}
            style={{ 
                color: colors?.primary || undefined, 
                borderBottomColor: colors?.primary || undefined 
            }}
        >
            Home
        </span>
        <span className={cn("font-bold text-gray-500 uppercase tracking-wider hover:text-gray-900 cursor-pointer", isFullPage ? "text-[12px]" : "text-[9px]")}>Events</span>
        <span className={cn("font-bold text-gray-500 uppercase tracking-wider hover:text-gray-900 cursor-pointer", isFullPage ? "text-[12px]" : "text-[9px]")}>About</span>
    </div>
  );

  return (
    <div className={cn(
      "flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-20 transition-all",
      isFullPage ? "px-10 py-4" : "px-4 py-2"
    )}>
      {/* Left Side: Logo & Optional Links */}
      <div className={cn("flex items-center", !isFullPage && "gap-8")}>
          {/* Logo & Company Name */}
          <div className="flex items-center gap-3">
            <div 
              className={cn(
                  "rounded-[8px] flex items-center justify-center shadow-lg transition-all", 
                  isFullPage ? "size-10" : "size-7",
                  !colors?.primary && "bg-blue-600"
              )}
              style={{ 
                backgroundColor: colors?.primary || undefined, 
                boxShadow: colors?.primary ? `0 10px 15px -3px ${colors.primary}33` : undefined 
              }}
            >
              <Palette size={isFullPage ? 20 : 14} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className={cn("font-black uppercase text-gray-900 tracking-tighter", isFullPage ? "text-[18px]" : "text-[12px]")}>Sample</span>
              <span className={cn("font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap", isFullPage ? "text-[10px]" : "text-[7px]")}>Company Name</span>
            </div>
          </div>

          {!isFullPage && links}
      </div>

      {/* Right Section: Optional Links & Auth Buttons */}
      <div className={cn("flex items-center", isFullPage ? "gap-10" : "gap-2")}>
          {isFullPage && links}
          <div className={cn("flex items-center", isFullPage ? "gap-4" : "gap-2")}>
              <div 
                  className={cn("rounded-lg shadow-md transition-all cursor-pointer flex items-center justify-center", isFullPage ? "px-6 py-2.5" : "px-3 py-1.5", !colors?.primary && "bg-blue-600")}
                  style={{ 
                      backgroundColor: colors?.primary || undefined,
                      boxShadow: colors?.primary ? `0 4px 6px -1px ${colors.primary}1A` : undefined 
                  }}
              >
                 <span className={cn("font-black text-white uppercase tracking-widest", isFullPage ? "text-[11px]" : "text-[8px]")}>Register</span>
              </div>
              <div className={cn("border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer group flex items-center justify-center", isFullPage ? "px-6 py-2.5" : "px-3 py-1.5")}>
                 <span className={cn("font-black text-gray-600 group-hover:text-gray-900 uppercase tracking-widest", isFullPage ? "text-[11px]" : "text-[8px]")}>Login</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export const MiniFooter = ({ colors, isFullPage }: { colors?: ThemeColors, isFullPage?: boolean }) => (
  <div 
    className={cn("border-t border-white/5 flex flex-col transition-all", isFullPage ? "px-16 py-16 gap-16" : "px-10 py-10 gap-10")}
    style={{ backgroundColor: colors?.footer || "#0a0a0a" }}
  >
    <div className={cn("grid grid-cols-4", isFullPage ? "gap-12" : "gap-6")}>
      {/* Footer Company Info */}
      <div className="space-y-7">
        <div className="flex items-center gap-4">
          <div 
            className={cn(
                "rounded-xl flex items-center justify-center shadow-lg transition-all", 
                isFullPage ? "size-10" : "size-6",
                !colors?.primary && "bg-blue-600"
            )}
            style={{ backgroundColor: colors?.primary || undefined }}
          >
            <Palette size={isFullPage ? 20 : 12} className="text-white" />
          </div>
          <span className={cn("font-black text-white uppercase tracking-tighter", isFullPage ? "text-[20px]" : "text-[12px]")}>Sample Company</span>
        </div>
        <div className="space-y-3">
          <p className={cn("text-gray-400 font-medium leading-relaxed", isFullPage ? "text-[14px] max-w-[350px]" : "text-[9px] max-w-[200px]")}>Creating unforgettable moments with professional event management solutions for every client worldwide.</p>
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-7">
         <span className={cn("font-black text-white uppercase tracking-widest block", isFullPage ? "text-[14px]" : "text-[10px]")}>Social Links</span>
         <div className={cn("flex items-center transition-all", isFullPage ? "gap-4" : "gap-3")}>
           <div className={cn("bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer", isFullPage ? "size-10" : "size-8")}>
             <Facebook size={isFullPage ? 18 : 14} className="text-gray-400" />
           </div>
           <div className={cn("bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer", isFullPage ? "size-10" : "size-8")}>
             <Twitter size={isFullPage ? 18 : 14} className="text-gray-400" />
           </div>
           <div className={cn("bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer", isFullPage ? "size-10" : "size-8")}>
             <Instagram size={isFullPage ? 18 : 14} className="text-gray-400" />
           </div>
           <div className={cn("bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer", isFullPage ? "size-10" : "size-8")}>
             <Linkedin size={isFullPage ? 18 : 14} className="text-gray-400" />
           </div>
         </div>
      </div>

      {/* Contact Info (from Footer page) */}
      <div className="space-y-7">
         <span className={cn("font-black text-white uppercase tracking-widest block", isFullPage ? "text-[14px]" : "text-[10px]")}>Contact Info</span>
         <div className="flex flex-col gap-5">
           <div className="flex items-center gap-3">
              <div 
                className={cn(
                    "flex items-center justify-center rounded-lg bg-white/5 border border-white/10", 
                    isFullPage ? "size-10" : "size-7"
                )}
              >
                <Phone size={isFullPage ? 18 : 12} className="text-gray-400" />
              </div>
              <span className={cn("text-gray-400 font-bold", isFullPage ? "text-[13px]" : "text-[9px]")}>+91 9876543210</span>
           </div>
           <div className="flex items-center gap-3">
              <div 
                className={cn(
                    "flex items-center justify-center rounded-lg bg-white/5 border border-white/10", 
                    isFullPage ? "size-10" : "size-7"
                )}
              >
                <Mail size={isFullPage ? 18 : 12} className="text-gray-400" />
              </div>
              <span className={cn("text-gray-400 font-bold", isFullPage ? "text-[13px]" : "text-[9px]")}>hello@samplecompany.com</span>
           </div>
           <div className="flex items-center gap-3">
              <div 
                className={cn(
                    "flex items-center justify-center rounded-lg bg-white/5 border border-white/10", 
                    isFullPage ? "size-10" : "size-7"
                )}
              >
                <MapPin size={isFullPage ? 18 : 12} className="text-gray-400" />
              </div>
              <span className={cn("text-gray-400 font-bold", isFullPage ? "text-[13px]" : "text-[9px]")}>123 Event St, Gala City</span>
           </div>
         </div>
      </div>

      {/* Newsletter Section */}
      <div className="space-y-7">
         <span className={cn("font-black text-white uppercase tracking-widest block", isFullPage ? "text-[14px]" : "text-[10px]")}>Newsletter</span>
         <div className="flex flex-col gap-4">
           <p className={cn("text-gray-500 font-bold", isFullPage ? "text-[12px]" : "text-[8px]")}>Subscribe for latest updates and event news.</p>
           <div className={cn("bg-white/5 border border-white/10 rounded-lg flex items-center", isFullPage ? "px-4 py-2" : "px-2 py-1")}>
              <span className={cn("text-gray-600 font-bold", isFullPage ? "text-[11px]" : "text-[8px]")}>Email Address</span>
           </div>
           <div 
             className={cn(
                 "rounded-lg flex items-center justify-center font-black text-white uppercase tracking-widest transition-all cursor-pointer shadow-lg",
                 isFullPage ? "w-fit px-5 py-2 text-[10px] self-end" : "w-fit px-3 py-1 text-[7px] self-end",
                 !colors?.primary && "bg-blue-600 shadow-blue-600/20"
             )}
             style={{ 
                 backgroundColor: colors?.primary || undefined,
                 boxShadow: colors?.primary ? `0 10px 15px -3px ${colors.primary}33` : undefined 
             }}
           >
             Subscribe
           </div>
         </div>
      </div>
    </div>

    {/* Footer Bottom (Copyright & Powered By) */}
    <div className={cn("flex justify-between items-center pt-8 border-t border-white/5 font-bold text-gray-500 uppercase tracking-widest", isFullPage ? "text-[11px]" : "text-[8px]")}>
      <span>© 2026 Sample Company. All rights reserved.</span>
      <div className="flex gap-4 items-center">
        <span>Powered By</span>
        <span className="text-white">Sample Tech</span>
      </div>
    </div>
  </div>
);

const Theme1Preview = ({ colors, isFullPage }: { colors?: ThemeColors, isFullPage?: boolean }) => (
  <div className={cn(
    "w-full flex flex-col bg-white transition-all duration-500",
    isFullPage ? "min-h-screen" : "h-full overflow-y-auto custom-scrollbar-hidden select-none pointer-events-none"
  )}>
    <MiniNavbar colors={colors} isFullPage={isFullPage} />
    
    {/* About us Section */}
    <div className={cn("bg-white relative overflow-hidden transition-all", isFullPage ? "p-16 space-y-12" : "p-6 space-y-8")}>
      <div className="absolute top-0 right-0 opacity-[0.03]">
        <Palette className={cn("rotate-12 transition-all", isFullPage ? "size-[600px]" : "size-80")} />
      </div>
      <div className={cn("relative z-10 flex flex-col items-center", isFullPage ? "gap-16" : "gap-8")}>
        <div className="space-y-3 text-center">
          <span 
            className={cn(
                "font-black uppercase transition-all", 
                isFullPage ? "text-[14px] tracking-[0.5em]" : "text-[10px] tracking-[0.3em]",
                !colors?.primary && "text-blue-600"
            )}
            style={{ color: colors?.primary || undefined }}
          >About us</span>
          <h2 className={cn("font-black text-gray-900 leading-[1.1] tracking-tight mx-auto transition-all", isFullPage ? "text-[48px] max-w-[800px]" : "text-[22px] max-w-[400px]")}>
            Crafting Memorable Experiences Since 2010
          </h2>
          <p className={cn("text-gray-500 mx-auto leading-relaxed font-medium transition-all text-center px-4", isFullPage ? "text-[16px] max-w-[600px]" : "text-[11px] max-w-[350px]")}>
            We specialize in premium wedding planning, corporate gala events, and exclusive private celebrations across the globe.
          </p>
        </div>
        
        <div className={cn("flex items-center mx-auto transition-all", isFullPage ? "gap-16 w-full max-w-5xl px-8" : "gap-12 px-6")}>
          <div className="flex-1 space-y-6 text-left">
             <div className="space-y-3">
                <span className={cn("font-black text-gray-900 block tracking-tight transition-all", isFullPage ? "text-[28px]" : "text-[14px]")}>Who We Exactly Are</span>
                <p className={cn("text-gray-500 leading-relaxed font-medium transition-all text-left", isFullPage ? "text-[16px]" : "text-[11px]")}>
                    Our team of dedicated experts works tirelessly to bring your creative vision to life, ensuring every single detail is handled with precision, care, and a touch of magic. We believe that every event should be a unique masterpiece.
                </p>
             </div>
          </div>
          <div className={cn(
            "bg-gray-50 border border-gray-100 shadow-2xl flex items-center justify-center relative overflow-hidden group transition-all shrink-0",
            isFullPage ? "size-[350px] rounded-[4.5rem]" : "size-48 rounded-[2.5rem]"
          )}>
             <img 
               src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" 
               alt="Gala Event"
               className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
             />
             <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
          </div>
        </div>
      </div>
    </div>

    {/* Testimonial Section */}
    <div className={cn("bg-gray-50 flex flex-col items-center border-y border-gray-100 relative overflow-hidden transition-all", isFullPage ? "p-24 gap-12" : "p-10 gap-6")}>
      <div className="flex flex-col items-center text-center space-y-4 mb-4">
         <span 
           className={cn(
               "font-black uppercase transition-all", 
               isFullPage ? "text-[14px] tracking-[0.5em]" : "text-[10px] tracking-[0.3em]",
               !colors?.primary && "text-blue-600"
           )}
           style={{ color: colors?.primary || undefined }}
         >Testimonials</span>
         <div className={cn("w-12 h-1 rounded-full", !colors?.primary && "bg-blue-600")} style={{ backgroundColor: colors?.primary }} />
      </div>

      <div 
        className={cn(
            "rounded-full shadow-xl flex items-center justify-center border border-white transition-all", 
            isFullPage ? "size-24 mb-4" : "size-16 mb-2",
            !colors?.primary && "bg-blue-600 shadow-blue-600/20"
        )}
        style={{ 
            backgroundColor: colors?.primary || undefined,
            boxShadow: colors?.primary ? `0 15px 30px -5px ${colors.primary}4D` : undefined 
        }}
      >
        <Quote size={isFullPage ? 40 : 24} className="text-white" />
      </div>
      <div className="space-y-4 text-center px-10 relative">
        <p className={cn("font-bold text-gray-800 leading-relaxed italic mx-auto transition-all", isFullPage ? "text-[26px] max-w-[900px]" : "text-[18px] max-w-[700px]")}>
            "Sample Company turned our dream wedding into a reality. The team was professional, creative, and handled everything flawlessly. We couldn't be happier with our choice!"
        </p>
      </div>
      <div className={cn("flex flex-col items-center transition-all", isFullPage ? "gap-6 mt-10" : "gap-3 mt-4")}>
        <div className={cn(
            "bg-gray-300 rounded-full border-4 border-white shadow-2xl overflow-hidden transition-all",
            isFullPage ? "size-24" : "size-16"
        )}>
           <img 
             src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" 
             alt="Sarah Johnson"
             className="w-full h-full object-cover"
           />
        </div>
        <div className="text-center">
            <span className={cn("font-black text-gray-900 uppercase block tracking-tighter transition-all", isFullPage ? "text-[18px]" : "text-[12px]")}>Sarah Johnson</span>
            <span className={cn("font-bold text-gray-500 uppercase block transition-all mb-1", isFullPage ? "text-[11px] tracking-widest" : "text-[8px] tracking-wider")}>Royal Wedding Gala</span>
            <span 
                className={cn(
                    "font-black uppercase transition-all", 
                    isFullPage ? "text-[12px] tracking-[0.3em]" : "text-[9px] tracking-[0.2em]",
                    !colors?.primary && "text-blue-600"
                )}
                style={{ color: colors?.primary || undefined }}
            >Happy Bride & Client</span>
        </div>
      </div>
    </div>

    {/* Gallery Section */}
    <div className={cn("bg-white transition-all", isFullPage ? "p-16 space-y-12" : "p-8 space-y-8")}>
      <div className="flex flex-col items-center text-center space-y-3">
         <span className={cn("font-black text-gray-900 block tracking-tight leading-none transition-all", isFullPage ? "text-[42px]" : "text-[24px]")}>Event Gallery</span>
         <p className={cn("text-gray-400 font-bold uppercase tracking-[0.2em] transition-all text-center", isFullPage ? "text-[12px]" : "text-[10px]")}>A visual journey of our most prestigious celebrations.</p>
         <div className={cn("w-16 h-1 rounded-full", !colors?.primary && "bg-blue-600")} style={{ backgroundColor: colors?.primary }} />
      </div>

      <div className={cn("grid transition-all", isFullPage ? "grid-cols-3 gap-6" : "grid-cols-2 gap-4")}>
        {[
          { id: 1, name: "Wedding", city: "Chennai", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" },
          { id: 2, name: "Birthday", city: "Madurai", img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800" },
          { id: 3, name: "Corporate Event", city: "Coimbatore", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800" },
          { id: 4, name: "Concert", city: "Trichy", img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800" },
          { id: 5, name: "Product Launch", city: "Madurai", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" },
          { id: 6, name: "Exhibition", city: "Tirunelveli", img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800" },
        ].map((item) => (
          <div 
            key={item.id} 
            className={cn(
                "relative group overflow-hidden bg-gray-100 transition-all cursor-pointer shadow-lg aspect-[4/3]",
                isFullPage ? "rounded-[1.5rem]" : "rounded-xl"
            )}
          >
            <img 
              src={item.img} 
              alt={item.name} 
              className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-6">
               <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin size={isFullPage ? 12 : 8} className="text-white" style={{ color: colors?.primary }} />
                    <span className={cn("text-white/80 font-black uppercase tracking-[0.2em]", isFullPage ? "text-[9px]" : "text-[7px]")}>{item.city}</span>
                  </div>
                  <h4 className={cn("text-white font-black uppercase tracking-tighter leading-none transition-all", isFullPage ? "text-[18px]" : "text-[12px]")}>{item.name}</h4>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <MiniFooter colors={colors} isFullPage={isFullPage} />
  </div>
);

const Theme2Preview = ({ colors, isFullPage }: { colors?: ThemeColors, isFullPage?: boolean }) => (
  <div className={cn(
    "w-full flex flex-col bg-[#050505] transition-all duration-500",
    isFullPage ? "min-h-screen" : "h-full overflow-y-auto custom-scrollbar-hidden select-none pointer-events-none"
  )}>
    <div className="bg-white"><MiniNavbar colors={colors} isFullPage={isFullPage} /></div>
    
    {/* Advanced Slider */}
    <div 
        className={cn("relative w-full flex items-center justify-center overflow-hidden transition-all", isFullPage ? "h-[85vh] min-h-[750px]" : "h-[400px]")}
    >
      <div 
        className="absolute inset-0 bg-gradient-to-br" 
        style={{ 
            background: colors?.header 
                ? `linear-gradient(to bottom right, ${colors.header}, ${colors.footer}, #000)` 
                : 'linear-gradient(to bottom right, #312e81, #581c87, #000)' 
        }}
      />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:40px_40px]" />
      
      <div className={cn("relative z-10 flex flex-col items-center text-center px-8 transition-all", isFullPage ? "gap-12" : "gap-6")}>
        <div className={cn("transition-all", isFullPage ? "space-y-12" : "space-y-4")}>
          <span className={cn("bg-white/10 border border-white/20 rounded-full font-black text-white uppercase backdrop-blur-3xl shadow-2xl transition-all", isFullPage ? "px-8 py-3 text-[12px] tracking-[0.5em]" : "px-4 py-1.5 text-[8px] tracking-[0.3em]")}>
            Global Premium Management
          </span>
          <h1 className={cn("font-black text-white leading-[1.05] tracking-tighter transition-all", isFullPage ? "text-[72px]" : "text-[32px]")}>
            EXPERIENCE THE<br />
            <span 
                className="text-transparent bg-clip-text bg-gradient-to-r"
                style={{ backgroundImage: colors?.primary ? `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` : 'linear-gradient(to right, #a855f7, #60a5fa)' }}
            >UNEXPECTED MOMENTS</span>
          </h1>
          <p className={cn("text-white/60 mx-auto font-bold leading-relaxed tracking-wide transition-all", isFullPage ? "text-[16px] max-w-[500px]" : "text-[11px] max-w-[350px]")}>
            Bespoke luxury events tailored to your unique style and vision. We redefine the boundaries of high-end event planning.
          </p>
        </div>
        <div className={cn("flex flex-col items-center transition-all", isFullPage ? "gap-12 mt-8" : "gap-6 mt-4")}>
          <div 
            className={cn(
                "bg-white rounded-full shadow-[0_15px_30px_rgba(255,255,255,0.2)] flex items-center justify-center font-black tracking-[0.2em] hover:scale-105 transition-all text-black cursor-pointer",
                isFullPage ? "px-12 py-4.5 text-[13px]" : "px-8 py-3 text-[11px]"
            )}
          >
             BOOK YOUR EVENT
          </div>
        </div>
      </div>
      
      <div className={cn("absolute bottom-10 flex gap-4 px-8 py-4 bg-black/40 backdrop-blur-3xl rounded-full border border-white/10 transition-all", isFullPage ? "scale-110" : "scale-100")}>
        <div className="size-2.5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
        <div className="size-2.5 rounded-full bg-white/20" />
        <div className="size-2.5 rounded-full bg-white/20" />
      </div>
    </div>
    {/* Unified Portfolio Section */}
    <div className={cn("bg-white transition-all", isFullPage ? "p-12 space-y-16" : "p-8 space-y-12")}>
      <div className={cn("space-y-3 text-left transition-all")}>
        <h2 className={cn("font-black text-gray-900 leading-none transition-all", isFullPage ? "text-[56px] tracking-[-0.04em]" : "text-[32px] tracking-tight")}>Portfolio</h2>
        <div className="flex items-center gap-4">
          <div 
            className={cn("w-1.5 transition-all rounded-full", isFullPage ? "h-6" : "h-4", !colors?.primary && "bg-purple-600")}
            style={{ backgroundColor: colors?.primary || undefined }}
          />
          <span 
              className={cn(
                  "font-bold uppercase transition-all opacity-40", 
                  isFullPage ? "text-[14px] tracking-[0.4em]" : "text-[9px] tracking-[0.2em]"
              )}
          >Our Achievements & Partners</span>
        </div>
      </div>

      {[
        { 
          title: "Events", 
          subtitle: "MEMORABLE MOMENTS", 
          header: "Elevating Every Event",
          detail: "Professional event management for conferences, launches, celebrations, and more. We turn your vision into a reality with meticulous planning and flawless execution.",
          stats: [
            { label: "Event Types Managed", value: "20+" },
            { label: "Industry Clients Served", value: "500+" },
            { label: "Total Events Delivered", value: "2,500+" }
          ],
          items: []
        },
        { 
          title: "Clients", 
          subtitle: "TRUSTED PARTNERS", 
          items: [
            {img: "/images/logo.png" },
            {img: "/images/logo.png" },
            {img: "/images/logo.png" },
            {img: "/images/logo.png" }
          ]
        },
        { 
          title: "Sponsors", 
          subtitle: "GLOBAL SUPPORT", 
          items: [
            {img: "/images/logo.png" },
            {img: "/images/logo.png" },
            {img: "/images/logo.png" },
            {img: "/images/logo.png" }
          ]
        }
      ].map((section, idx) => (
        <div key={idx} className={cn("transition-all", isFullPage ? "space-y-10" : "space-y-6")}>
          <div className="flex flex-col gap-6">
            <div className="flex items-end justify-between border-b-2 border-gray-100 pb-6">
              <div className="space-y-2">
                <h2 className={cn("font-black text-gray-900 tracking-tighter uppercase leading-none transition-all", isFullPage ? "text-[48px]" : "text-[22px]")}>{section.title}</h2>
                <span 
                  className={cn(
                      "font-black uppercase transition-all", 
                      isFullPage ? "text-[14px] tracking-[0.5em]" : "text-[9px] tracking-[0.3em]",
                      !colors?.primary && "text-purple-600"
                  )}
                  style={{ color: colors?.primary || undefined }}
                >{section.subtitle}</span>
              </div>
              <div className={cn("rounded-full border-2 border-gray-100 flex items-center justify-center group hover:bg-gray-50 transition-all cursor-pointer", isFullPage ? "size-20" : "size-10")}>
                <div className={cn("border-r-2 border-t-2 border-gray-400 rotate-45 mb-px ml-px group-hover:border-gray-900 transition-all", isFullPage ? "size-4" : "size-2")} />
              </div>
            </div>

            {/* Custom Fields (Header, Detail) */}
            {(section.header || section.detail) && (
              <div className={cn("max-w-4xl mx-auto text-center space-y-6 transition-all")}>
                {section.header && (
                  <h3 className={cn("font-black text-gray-900 uppercase tracking-tighter leading-none transition-all", isFullPage ? "text-[32px]" : "text-[18px]")}>
                    {section.header}
                  </h3>
                )}
                {section.detail && (
                  <p className={cn("text-gray-500 font-medium leading-relaxed transition-all mx-auto", isFullPage ? "text-[16px] max-w-3xl" : "text-[11px]")}>
                    {section.detail}
                  </p>
                )}
              </div>
            )}

            {/* Unified Stats & Cards Container */}
            <div className={cn(
                "transition-all bg-gray-50/50 border border-gray-100/50",
                isFullPage ? "p-12 rounded-[3.5rem] space-y-12 mt-2" : "p-4 rounded-[1.5rem] space-y-6 mt-1"
            )}>
                {section.stats && (
                  <div className={cn("grid grid-cols-3 bg-white shadow-xl shadow-gray-200/50 border border-gray-100 rounded-[3rem] transition-all overflow-hidden divide-x divide-gray-100", isFullPage ? "h-40" : "h-20")}>
                    {section.stats.map((stat, i) => (
                      <div key={i} className="flex flex-col items-center justify-center text-center space-y-2 group hover:bg-gray-50/50 transition-colors">
                        <span 
                          className={cn("font-black tracking-tighter transition-all", isFullPage ? "text-[42px]" : "text-base")}
                          style={{ color: colors?.primary || undefined }}
                        >
                          {stat.value}
                        </span>
                        <span className={cn("font-black text-gray-400 uppercase leading-tight transition-all", isFullPage ? "text-[11px] tracking-widest px-4" : "text-[7px] tracking-wider")}>
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {section.items && section.items.length > 0 && (
                  <div className={cn("grid grid-cols-4", isFullPage ? "gap-8" : "gap-4")}>
                      {section.items.map((item, i) => (
                        (section.title === "Clients" || section.title === "Sponsors") ? (
                          <div key={i} className={cn(
                              "relative group hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center text-center",
                              isFullPage ? "p-8" : "p-4"
                          )}>
                              <div className={cn("flex-1 flex items-center justify-center w-full", isFullPage ? "h-40" : "h-20")}>
                                  <img 
                                  src={item.img} 
                                  alt={section.title}
                                  className="max-w-[80%] max-h-[80%] object-contain group-hover:scale-110 transition-transform duration-500"
                                  />
                              </div>
                          </div>
                        ) : (
                          <div key={i} className={cn(
                              "bg-gray-900 overflow-hidden relative group border-white shadow-2xl hover:-translate-y-4 transition-all duration-700 cursor-pointer",
                              isFullPage ? "aspect-[3/4] rounded-[4rem] border-[12px]" : "aspect-[3/4] rounded-[2.5rem] border-[6px]"
                          )}>
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
                              <img 
                              src={item.img} 
                              alt={section.title}
                              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className={cn("absolute left-10 right-10 z-20 transition-all", isFullPage ? "bottom-12 space-y-6" : "bottom-6 space-y-2")}>
                              <h3 className={cn("font-black text-white uppercase tracking-tight leading-tight transition-all", isFullPage ? "text-[24px]" : "text-[14px]")}>{section.title}</h3>
                              </div>
                          </div>
                        )
                      ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Experience Testimonial */}
    <div 
        className={cn("relative overflow-hidden transition-all", isFullPage ? "px-16 py-24" : "px-8 py-10", !colors?.primary && "bg-purple-600")}
        style={{ backgroundColor: colors?.primary || undefined }}
    >
      <div className="absolute -top-40 -right-40 p-40 opacity-10">
         <Quote size={isFullPage ? 400 : 180} className="text-white" />
      </div>
      <div className={cn("relative z-10 flex flex-col items-center text-center mx-auto transition-all", isFullPage ? "gap-12 max-w-[1000px]" : "gap-8 max-w-[600px]")}>
        <span className={cn("font-black text-white/60 uppercase transition-all", isFullPage ? "text-[14px] tracking-[0.8em]" : "text-[10px] tracking-[0.4em]")}>Testimonials</span>
        
        <div className={cn("flex justify-center transition-all", isFullPage ? "gap-4" : "gap-2")}>
           {[1, 2, 3, 4, 5].map(i => <Star key={i} size={isFullPage ? 32 : 18} fill="white" className="text-white shadow-2xl" />)}
        </div>
        <div className="space-y-4">
           <p className={cn("font-black text-white leading-[1.2] italic tracking-tight transition-all", isFullPage ? "text-[32px]" : "text-[20px]")}>
            "Absolutely phenomenal service! The Nexus tech launch was our most successful event ever. A game-changer in the industry."
           </p>
        </div>
        <div className={cn("flex flex-col items-center transition-all", isFullPage ? "gap-8 mt-10" : "gap-6 mt-4")}>
           <div className={cn(
               "bg-white/20 rounded-full border-4 border-white/40 p-1.5 shadow-2xl backdrop-blur-xl overflow-hidden transition-all",
               isFullPage ? "size-32" : "size-24"
           )}>
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" 
                alt="Michael Ross"
                className="w-full h-full rounded-full object-cover"
              />
           </div>
           <div className="space-y-2">
              <span className={cn("font-black text-white uppercase tracking-tighter block transition-all", isFullPage ? "text-[24px]" : "text-[16px]")}>Michael Ross</span>
              <span className={cn("font-black text-white/90 uppercase tracking-widest block transition-all", isFullPage ? "text-[12px]" : "text-[9px]")}>NEXUS TECH LAUNCH</span>
              <span className={cn("font-black text-white/60 uppercase tracking-[0.4em] transition-all", isFullPage ? "text-[12px]" : "text-[10px]")}>CEO, TechFlow Global Inc.</span>
           </div>
        </div>
      </div>
    </div>

    <MiniFooter colors={colors} isFullPage={isFullPage} />
  </div>
);

export const ThemePreview = ({ themeId, colors, className, isFullPage }: ThemePreviewProps) => {
  const idNum = typeof themeId === 'string' ? parseInt(themeId) : themeId;
  
  return (
    <div className={cn("w-full", isFullPage ? "min-h-screen h-auto" : "h-full", className)}>
      {idNum === 1 
        ? <Theme1Preview colors={colors} isFullPage={isFullPage} /> 
        : <Theme2Preview colors={colors} isFullPage={isFullPage} />
      }
    </div>
  );
};
