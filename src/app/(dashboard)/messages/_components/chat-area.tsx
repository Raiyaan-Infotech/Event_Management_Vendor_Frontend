import { Phone, Video, UserPlus, Trash2, Paperclip, Send } from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

const cardClass = 'bg-card rounded-[5px] border border-border shadow-sm dark:shadow-none font-["Roboto",sans-serif]';

export function ChatArea() {
  return (
    <div className={`flex-1 flex flex-col ${cardClass} overflow-hidden min-w-0 min-h-0`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="w-[40px] h-[40px]">
            <AvatarImage src="https://i.pravatar.cc/150?u=44" className="object-cover" />
          </Avatar>
          <div>
            <h5 className="text-foreground text-[15px] font-bold leading-tight">Reynante Labares</h5>
            <span className="text-muted-foreground text-[12px]">Last seen: 2 minutes ago</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <button className="hover:text-primary transition-colors"><Phone size={18} /></button>
          <button className="hover:text-primary transition-colors"><Video size={20} /></button>
          <button className="hover:text-primary transition-colors"><UserPlus size={20} /></button>
          <button className="hover:text-destructive transition-colors"><Trash2 size={18} /></button>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 bg-card p-6 overflow-y-auto space-y-4 flex flex-col min-h-0">
        
        {/* Timestamp */}
        <div className="text-center font-bold text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
          3 DAYS AGO
        </div>

        {/* Message Right (Sent) */}
        <div className="flex flex-col items-end gap-1 max-w-full">
           <div className="flex justify-end gap-3 w-full">
             <div className="bg-primary text-white p-[14px_18px] rounded-[5px] rounded-tr-none text-[13.5px] leading-relaxed max-w-[70%]">
               Nulla consequat massa quis enim. Donec pede justo, fringilla vel...
             </div>
             <Avatar className="w-[36px] h-[36px] shrink-0 mt-0.5">
               <AvatarImage src="https://i.pravatar.cc/150?u=49" className="object-cover" />
             </Avatar>
           </div>
           <div className="flex justify-end gap-3 w-full">
             <div className="bg-primary text-white p-[14px_18px] rounded-[5px] rounded-tr-none text-[13.5px] leading-relaxed max-w-[70%]">
               rhoncus ut, imperdiet a, venenatis vitae, justo...
             </div>
             <div className="w-[36px] shrink-0"></div>
           </div>
           <span className="text-muted-foreground text-[11px] pr-[48px] pt-1 font-medium text-right w-full tracking-wide">9:48 am</span>
        </div>

        {/* Message Left (Received) */}
        <div className="flex flex-col items-start gap-1 max-w-full">
           <div className="flex justify-start gap-3 w-full">
             <Avatar className="w-[36px] h-[36px] shrink-0 mt-0.5">
               <AvatarImage src="https://i.pravatar.cc/150?u=44" className="object-cover" />
             </Avatar>
             <div className="bg-muted text-foreground p-[14px_18px] rounded-[5px] rounded-tl-none text-[13.5px] leading-relaxed max-w-[70%] font-medium">
               Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
             </div>
           </div>
           <span className="text-muted-foreground text-[11px] pl-[48px] pt-1 font-medium text-left w-full tracking-wide">9:32 am</span>
        </div>

        {/* Message Right (Sent) */}
        <div className="flex flex-col items-end gap-1 max-w-full mt-2">
           <div className="flex justify-end gap-3 w-full">
             <div className="bg-primary text-white p-[14px_18px] rounded-[5px] rounded-tr-none text-[13.5px] leading-relaxed max-w-[70%]">
               Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
             </div>
             <Avatar className="w-[36px] h-[36px] shrink-0 mt-0.5">
               <AvatarImage src="https://i.pravatar.cc/150?u=49" className="object-cover" />
             </Avatar>
           </div>
           <div className="flex justify-end gap-3 w-full">
             <div className="bg-primary text-white p-[14px_18px] rounded-[5px] rounded-tr-none text-[13.5px] leading-relaxed max-w-[70%]">
               Nullam dictum felis eu pede mollis pretium
             </div>
             <div className="w-[36px] shrink-0"></div>
           </div>
           <span className="text-muted-foreground text-[11px] pr-[48px] pt-1 font-medium text-right w-full tracking-wide">9:48 am</span>
        </div>

        {/* Timestamp TODAY */}
        <div className="text-center font-bold text-[10px] text-foreground uppercase tracking-wider my-3 mt-4">
          TODAY
        </div>

        {/* Message Left (Received) - Images */}
        <div className="flex flex-col items-start gap-1 max-w-full">
           <div className="flex justify-start gap-3 w-full">
             <Avatar className="w-[36px] h-[36px] shrink-0 mt-0.5">
               <AvatarImage src="https://i.pravatar.cc/150?u=44" className="object-cover" />
             </Avatar>
             <div className="flex flex-col gap-2 max-w-[70%]">
               <div className="bg-muted text-foreground p-[14px_18px] rounded-[5px] rounded-tl-none text-[13.5px] leading-relaxed font-medium">
                 Maecenas tempus, tellus eget condimentum rhoncus
               </div>
               <div className="flex gap-2 flex-wrap">
                 <div className="w-[90px] h-[65px] rounded-[5px] overflow-hidden">
                   <Image src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80" width={90} height={65} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer" alt="sunset" />
                 </div>
                 <div className="w-[90px] h-[65px] rounded-[5px] overflow-hidden">
                   <Image src="https://images.unsplash.com/photo-1471922694854-ff1b63b20054?auto=format&fit=crop&w=300&q=80" width={90} height={65} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer" alt="ocean" />
                 </div>
                 <div className="w-[90px] h-[65px] rounded-[5px] overflow-hidden">
                   <Image src="https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=300&q=80" width={90} height={65} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer" alt="city" />
                 </div>
               </div>
             </div>
           </div>
           <span className="text-muted-foreground text-[11px] pl-[48px] pt-1 font-medium w-full text-left tracking-wide">10:12 am</span>
        </div>

        {/* Message Right (Sent) */}
        <div className="flex flex-col items-end gap-1 max-w-full mb-2 mt-2">
           <div className="flex justify-end gap-3 w-full">
             <div className="bg-primary text-white p-[14px_18px] rounded-[5px] rounded-tr-none text-[13.5px] leading-relaxed max-w-[70%]">
               Maecenas tempus, tellus eget condimentum rhoncus
             </div>
             <Avatar className="w-[36px] h-[36px] shrink-0 mt-0.5">
               <AvatarImage src="https://i.pravatar.cc/150?u=49" className="object-cover" />
             </Avatar>
           </div>
           <div className="flex justify-end gap-3 w-full">
             <div className="bg-primary text-white p-[14px_18px] rounded-[5px] rounded-tr-none text-[13.5px] leading-relaxed max-w-[70%]">
               Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus.
             </div>
             <div className="w-[36px] shrink-0"></div>
           </div>
           <span className="text-muted-foreground text-[11px] pr-[48px] pt-1 font-medium text-right w-full tracking-wide">09:40 am</span>
        </div>
      </div>

      {/* Footer (Input) */}
      <div className="p-4 border-t border-border bg-card shrink-0 flex items-center gap-3">
         <input 
           type="text" 
           placeholder="Type your message here..."
           className="flex-1 bg-transparent text-[14px] text-foreground placeholder-[#a8b1c7] focus:outline-none"
         />
         <button className="text-muted-foreground hover:text-primary transition-colors p-2">
           <Paperclip size={18} />
         </button>
         <button className="text-primary hover:brightness-110 transition-colors p-2">
           <Send size={20} className="fill-current -rotate-45 -mt-1 ml-1" />
         </button>
      </div>
    </div>
  );
}
