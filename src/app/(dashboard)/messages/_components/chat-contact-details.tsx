import { Phone, Mail, MapPin, MoreVertical } from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

const cardClass = 'bg-card rounded-[5px] border border-border shadow-sm dark:shadow-none font-["Roboto",sans-serif]';

export function ChatContactDetails() {
  return (
    <div className={`w-[260px] xl:w-[280px] shrink-0 hidden lg:flex flex-col ${cardClass} p-6`}>
      <div className="flex justify-end mb-2">
         <button className="text-muted-foreground hover:text-foreground"><MoreVertical size={20} /></button>
      </div>
      <div className="flex flex-col items-center mb-8 border-b border-border pb-8">
         <Avatar className="w-[80px] h-[80px] mb-4">
           <AvatarImage src="https://i.pravatar.cc/150?u=60" className="object-cover" />
         </Avatar>
         <h4 className="text-foreground text-[18px] font-bold">Ryan Gracie</h4>
         <p className="text-muted-foreground text-[13px]">Web Designer</p>
      </div>

      <div>
         <h6 className="text-foreground text-[15px] font-bold mb-6">Contact Details</h6>
         
         <div className="flex gap-4 mb-5">
           <div className="w-[36px] h-[36px] rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
             <Phone size={16} />
           </div>
           <div>
             <p className="text-foreground text-[14px] font-medium leading-none mb-1">Phone</p>
             <p className="text-muted-foreground text-[13px]">+1 135792468</p>
           </div>
         </div>

         <div className="flex gap-4 mb-5">
           <div className="w-[36px] h-[36px] rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
             <Mail size={16} />
           </div>
           <div>
             <p className="text-foreground text-[14px] font-medium leading-none mb-1">Email</p>
             <p className="text-muted-foreground text-[13px]">harvey@gmail.com.</p>
           </div>
         </div>

         <div className="flex gap-4">
           <div className="w-[36px] h-[36px] rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
             <MapPin size={16} />
           </div>
           <div>
             <p className="text-foreground text-[14px] font-medium leading-none mb-1">Address</p>
             <p className="text-muted-foreground text-[13px]">California.</p>
           </div>
         </div>
      </div>
    </div>
  );
}
