import PagesListContent from "./_components/pages-list-content";

export default function WebsitePagesPage() {
  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar">
      <div className="max-w-[1700px] mx-auto space-y-6">
        <div className="animate-in fade-in slide-in-from-bottom duration-1000">
          <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1 font-poppins">Pages Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">View and manage all your website&apos;s static and dynamic pages in one place.</p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
          <PagesListContent />
        </div>
      </div>
    </div>
  );
}
