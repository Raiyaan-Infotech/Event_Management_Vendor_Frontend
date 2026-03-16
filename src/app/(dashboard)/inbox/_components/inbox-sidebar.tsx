import { Inbox, Star, Bookmark, Send, Edit, AlertCircle, Trash2, Folder, X, Github } from 'lucide-react';

const cardClass = 'bg-card rounded-[5px] border border-border overflow-hidden shadow-sm dark:shadow-none mb-6 font-["Roboto",sans-serif]';

export function InboxSidebar() {
  return (
    <div className="w-full lg:w-[260px] xl:w-[280px] shrink-0 flex flex-col">
      <div className={`${cardClass} p-6 h-full mb-0`}>
        <button className="w-full bg-primary text-white py-2.5 rounded-[5px] text-[13px] font-bold tracking-wider hover:bg-primary/90 transition-all mb-6 shadow-sm">
          COMPOSE
        </button>

        <ul className="space-y-1 mb-8">
          <li>
            <button className="w-full flex items-center justify-between px-3 py-2 text-primary bg-muted rounded-[3px] transition-all font-bold">
              <div className="flex items-center gap-3 text-[14px]">
                <Inbox size={18} /> Inbox
              </div>
              <span className="text-[13px]">20</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center justify-between px-3 py-2 text-muted-foreground hover:bg-muted rounded-[3px] transition-all font-medium group">
              <div className="flex items-center gap-3 text-[14px] group-hover:text-foreground">
                <Star size={18} /> Starred
              </div>
              <span className="text-[13px]">3</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center justify-between px-3 py-2 text-muted-foreground hover:bg-muted rounded-[3px] transition-all font-medium group">
              <div className="flex items-center gap-3 text-[14px] group-hover:text-foreground">
                <Bookmark size={18} /> Important
              </div>
              <span className="text-[13px]">10</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center justify-between px-3 py-2 text-muted-foreground hover:bg-muted rounded-[3px] transition-all font-medium group">
              <div className="flex items-center gap-3 text-[14px] group-hover:text-foreground">
                <Send size={18} /> Sent Mail
              </div>
              <span className="text-[13px]">8</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center justify-between px-3 py-2 text-muted-foreground hover:bg-muted rounded-[3px] transition-all font-medium group">
              <div className="flex items-center gap-3 text-[14px] group-hover:text-foreground">
                <Edit size={18} /> Drafts
              </div>
              <span className="text-[13px]">15</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center justify-between px-3 py-2 text-muted-foreground hover:bg-muted rounded-[3px] transition-all font-medium group">
              <div className="flex items-center gap-3 text-[14px] group-hover:text-foreground">
                <AlertCircle size={18} /> Spam
              </div>
              <span className="text-[13px]">128</span>
            </button>
          </li>
          <li>
            <button className="w-full flex items-center justify-between px-3 py-2 text-muted-foreground hover:bg-muted rounded-[3px] transition-all font-medium group">
              <div className="flex items-center gap-3 text-[14px] group-hover:text-foreground">
                <Trash2 size={18} /> Trash
              </div>
              <span className="text-[13px]">6</span>
            </button>
          </li>
        </ul>

        <div className="mb-8">
          <h6 className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider mb-4 px-3">LABEL</h6>
          <ul className="space-y-1">
            <li>
              <button className="w-full flex items-center justify-between px-3 py-2 text-muted-foreground hover:bg-muted rounded-[3px] transition-all font-medium group">
                <div className="flex items-center gap-3 text-[14px] group-hover:text-foreground">
                  <Folder size={18} className="text-primary" /> Social
                </div>
                <span className="text-[13px]">10</span>
              </button>
            </li>
            <li>
              <button className="w-full flex items-center justify-between px-3 py-2 text-muted-foreground hover:bg-muted rounded-[3px] transition-all font-medium group">
                <div className="flex items-center gap-3 text-[14px] group-hover:text-foreground">
                  <Folder size={18} className="text-green-500" /> Promotions
                </div>
                <span className="text-[13px]">22</span>
              </button>
            </li>
            <li>
              <button className="w-full flex items-center justify-between px-3 py-2 text-muted-foreground hover:bg-muted rounded-[3px] transition-all font-medium group">
                <div className="flex items-center gap-3 text-[14px] group-hover:text-foreground">
                  <Folder size={18} className="text-sky-500" /> Updates
                </div>
                <span className="text-[13px]">17</span>
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h6 className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider mb-4 px-3">TAGS</h6>
          <ul className="space-y-1">
            <li>
              <button className="w-full flex items-center justify-between px-3 py-2 text-muted-foreground hover:bg-muted rounded-[3px] transition-all font-medium group">
                <div className="flex items-center gap-3 text-[14px] group-hover:text-foreground">
                  <X size={16} /> Twitter  {/* Approximation of the brand icon seen in Valex */}
                </div>
                <span className="text-[13px]">2</span>
              </button>
            </li>
            <li>
              <button className="w-full flex items-center justify-between px-3 py-2 text-muted-foreground hover:bg-muted rounded-[3px] transition-all font-medium group">
                <div className="flex items-center gap-3 text-[14px] group-hover:text-foreground">
                  <Github size={16} /> Github
                </div>
                <span className="text-[13px]">32</span>
              </button>
            </li>
            <li>
              <button className="w-full flex items-center justify-between px-3 py-2 text-muted-foreground hover:bg-muted rounded-[3px] transition-all font-medium group">
                <div className="flex items-center gap-3 text-[14px] group-hover:text-foreground">
                  <span className="font-bold text-[16px] leading-[16px]">G+</span> Google
                </div>
                <span className="text-[13px]">7</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
