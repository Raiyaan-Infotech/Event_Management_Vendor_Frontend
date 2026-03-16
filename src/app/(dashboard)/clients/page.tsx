import Link from "next/link";
import { Plus } from "lucide-react";

export default function ClientsPage() {
  return (
    <div className="bg-background min-h-screen -mt-6 -mx-6 -mb-6 p-6 font-['Roboto',sans-serif]">


      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
          <h1 className="text-foreground text-[24px] font-bold leading-tight uppercase">Clients List</h1>
        </div>
        <div className="flex items-center flex-wrap gap-2 mt-4 md:mt-0">
          <Link href="/clients/add">
            <button className="h-9 px-4 flex items-center gap-2 bg-primary text-white rounded-[5px] shadow-sm hover:brightness-110 text-[13px] font-medium whitespace-nowrap ml-1 transition-all active:scale-95">
              <Plus size={16} /> ADD CLIENT
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-card rounded-[5px] border border-border p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={32} className="text-muted-foreground opacity-20" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">No Clients Found</h2>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Start by adding your first client to manage their events and payments easily.</p>
        <Link href="/clients/add">
            <button className="bg-primary text-white px-6 py-2.5 rounded-[5px] text-[14px] font-bold hover:brightness-110 transition-all">
                Add Your First Client
            </button>
        </Link>
      </div>
    </div>
  );
}
