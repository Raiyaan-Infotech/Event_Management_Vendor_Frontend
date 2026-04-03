'use client';

export function SettingsTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-4 max-w-5xl">
        <div className="space-y-2">
          <label className="block text-foreground text-[14px] font-bold">Full Name</label>
          <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-[5px] text-[14px] text-muted-foreground focus:outline-none focus:border-primary transition-all" defaultValue="John Doe" />
        </div>
           <div className="space-y-2">
          <label className="block text-foreground text-[14px] font-bold">Username</label>
          <input type="text" className="w-full px-4 py-2 bg-background border border-border rounded-[5px] text-[14px] text-muted-foreground focus:outline-none focus:border-primary transition-all" defaultValue="john" />
        </div>
         <div className="space-y-2">
          <label className="block text-foreground text-[14px] font-bold">Mobile Number</label>
          <input type="tel" className="w-full px-4 py-2 bg-background border border-border rounded-[5px] text-[14px] text-muted-foreground focus:outline-none focus:border-primary transition-all" defaultValue="+123 456 7890" />
        </div>
        <div className="space-y-2">
          <label className="block text-foreground text-[14px] font-bold">Email</label>
          <input type="email" className="w-full px-4 py-2 bg-background border border-border rounded-[5px] text-[14px] text-muted-foreground focus:outline-none focus:border-primary transition-all" defaultValue="first.last@example.com" />
        </div>
        <div className="space-y-2">
          <label className="block text-foreground text-[14px] font-bold">Password</label>
          <input type="password" placeholder="6 - 15 Characters" className="w-full px-4 py-2 bg-background border border-border rounded-[5px] text-[14px] text-muted-foreground focus:outline-none focus:border-primary transition-all" />
        </div>
        <div className="space-y-2">
          <label className="block text-foreground text-[14px] font-bold">Re-Password</label>
          <input type="password" placeholder="6 - 15 Characters" className="w-full px-4 py-2 bg-background border border-border rounded-[5px] text-[14px] text-muted-foreground focus:outline-none focus:border-primary transition-all" />
        </div>
        <div className="space-y-2">
          <label className="block text-foreground text-[14px] font-bold">About Me</label>
          <textarea
            className="w-full px-4 py-2 bg-background border border-border rounded-[5px] text-[14px] text-muted-foreground focus:outline-none focus:border-primary transition-all min-h-[140px] resize-none"
            defaultValue="Loren gypsum dolor sit mate, consecrate disciplining lit, tied diam nonunion nib modernism tincidunt it Loretta dolor manga Amalie erst solute. Ur wise denim ad minim venial, quid"
          ></textarea>
        </div>
        <button className="bg-primary text-white px-5 py-2.5 rounded-[5px] text-[13px] font-bold hover:bg-primary/90 transition-all shadow-sm uppercase">Save</button>
      </div>
    </div>
  );
}
