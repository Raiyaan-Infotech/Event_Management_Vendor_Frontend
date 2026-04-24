 import MenuManagementContent from "./_components/menu-management-content";

export default function MenuManagementPage() {
  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 custom-scrollbar bg-[#f8fafc] dark:bg-slate-950">
      <div className="max-w-[1700px] mx-auto space-y-6">
        <div className="animate-in fade-in slide-in-from-bottom duration-1000">
          <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1 font-poppins">Menu</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Configure your website navigation structure, parent menus, and page hierarchy.</p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
          <MenuManagementContent />
        </div>
      </div>
    </div>
  );
}
