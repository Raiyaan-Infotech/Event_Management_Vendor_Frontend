'use client';

import { MoreHorizontal, Facebook, X, Linkedin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function ClientsTab() {
  return (
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
        <div key={i} className="bg-card rounded-[5px] border border-border p-8 text-center relative group hover:shadow-md transition-all">
          <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
            <MoreHorizontal size={18} />
          </button>
          <div className="mb-4 flex justify-center">
            <Avatar className="w-[100px] h-[100px] border border-border p-[2px] bg-card">
              <AvatarImage src={friend.img} className="rounded-full" />
              <AvatarFallback className="bg-muted text-primary font-bold">FR</AvatarFallback>
            </Avatar>
          </div>
          <h5 className="text-foreground text-[16px] font-bold mb-1">{friend.name}</h5>
          <p className="text-muted-foreground text-[13px] mb-6">{friend.role}</p>
          <div className="flex items-center justify-center gap-2">
            <button className="w-9 h-9 border border-border rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"><Facebook size={16} /></button>
            <button className="w-9 h-9 border border-border rounded-full flex items-center justify-center text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-all"><X size={14} /></button>
            <button className="w-9 h-9 border border-border rounded-full flex items-center justify-center text-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-all"><Linkedin size={16} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
