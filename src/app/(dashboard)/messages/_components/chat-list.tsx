import { Avatar, AvatarImage } from '@/components/ui/avatar';

const cardClass = 'bg-card rounded-[5px] border border-border shadow-sm dark:shadow-none font-["Roboto",sans-serif]';

export function ChatList() {
  return (
    <div className={`w-full lg:w-[300px] xl:w-[320px] shrink-0 flex flex-col ${cardClass} overflow-hidden min-h-0`}>
      {/* Tabs */}
      <div className="flex px-4 pt-2 border-b border-border shrink-0">
        <button className="px-5 py-3 text-[14px] font-bold text-primary border-b-2 border-primary">
          Recent Chat
        </button>
        <button className="px-5 py-3 text-[14px] font-medium text-muted-foreground hover:text-foreground transition-colors">
          Groups
        </button>
      </div>
      <div className="px-6 py-3 border-b border-border shrink-0">
         <span className="text-foreground font-medium text-[14px]">Calls</span>
      </div>

      {/* Chat List Items */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Item 1 */}
        <div className="flex gap-3 p-[18px] border-b border-border hover:bg-muted cursor-pointer transition-colors relative">
          <div className="relative shrink-0">
            <Avatar className="w-[40px] h-[40px]">
              <AvatarImage src="https://i.pravatar.cc/150?u=12" className="object-cover" />
            </Avatar>
            <div className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              2
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <h6 className="text-foreground text-[14px] font-bold truncate">Socrates Itumay</h6>
              <span className="text-[12px] text-muted-foreground shrink-0 ml-2">2 hours</span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-tight line-clamp-2">
              Nam quam nunc, blandit vel aecenas et ante tincid
            </p>
          </div>
        </div>

        {/* Item 2 */}
        <div className="flex gap-3 p-[18px] border-b border-border hover:bg-muted cursor-pointer transition-colors relative">
          <div className="relative shrink-0">
            <Avatar className="w-[40px] h-[40px]">
              <AvatarImage src="https://i.pravatar.cc/150?u=33" className="object-cover" />
            </Avatar>
            <div className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              1
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <h6 className="text-foreground text-[14px] font-bold truncate">Dexter dela Cruz</h6>
              <span className="text-[12px] text-muted-foreground shrink-0 ml-2">3 hours</span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-tight line-clamp-2">
              Maec enas tempus, tellus eget con dime ntum rhoncus, sem quam
            </p>
          </div>
        </div>

        {/* Item 3 (Selected) */}
        <div className="flex gap-3 p-[18px] border-b border-border bg-primary/10 cursor-pointer relative">
          {/* Active left border indicator (based on valex style usually blue) */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary"></div>
          
          <div className="relative shrink-0 pl-1">
            <Avatar className="w-[40px] h-[40px]">
              <AvatarImage src="https://i.pravatar.cc/150?u=44" className="object-cover" />
            </Avatar>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <h6 className="text-foreground text-[14px] font-bold truncate">Reynante Labares</h6>
              <span className="text-[12px] text-muted-foreground shrink-0 ml-2">10 hours</span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-tight line-clamp-2">
              Nam quam nunc, bl ndit vel aecenas et ante tincid
            </p>
          </div>
        </div>

        {/* Item 4 */}
        <div className="flex gap-3 p-[18px] border-b border-border hover:bg-muted cursor-pointer transition-colors relative">
          <div className="relative shrink-0 flex items-center">
            <Avatar className="w-[40px] h-[40px]">
              <AvatarImage src="https://i.pravatar.cc/150?u=52" className="object-cover" />
            </Avatar>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <h6 className="text-foreground text-[14px] font-bold truncate">Joyce Chua</h6>
              <span className="text-[12px] text-muted-foreground shrink-0 ml-2">2 days</span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-tight line-clamp-2">
              Ma ecenas tempus, tellus eget con dimen tum rhoncus, sem quam
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
