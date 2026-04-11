'use client';

import { Package, Briefcase, Rocket, ChevronRight } from 'lucide-react';

const cardClass = 'bg-card rounded-[5px] border border-border overflow-hidden shadow-sm dark:shadow-none mb-6 ';

export function ProfileStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { label: 'Orders', value: '1,587', icon: <Package size={24} />, iconBg: 'bg-primary/10', iconColor: 'text-primary' },
        { label: 'Revenue', value: '46,782', icon: <Briefcase size={24} />, iconBg: 'bg-destructive/10', iconColor: 'text-destructive' },
        { label: 'Product sold', value: '1,890', icon: <Rocket size={24} />, iconBg: 'bg-green-500/10', iconColor: 'text-green-500' },
      ].map((card, i) => (
        <div key={i} className={`${cardClass} p-8 flex items-center justify-between`}>
          <div className={`w-[60px] h-[60px] rounded-full ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0 shadow-inner`}>
            {card.icon}
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-[13px] font-bold uppercase mb-1 tracking-tight">{card.label}</p>
            <h3 className="text-foreground text-[28px] font-bold leading-tight mb-1">{card.value}</h3>
            <p className="text-green-500 text-[11px] font-medium flex items-center justify-end gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500/10 flex items-center justify-center"><ChevronRight size={10} className="rotate-[-45deg] translate-y-[-0.5px] translate-x-[0.5px]" /></span>
              increase
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
