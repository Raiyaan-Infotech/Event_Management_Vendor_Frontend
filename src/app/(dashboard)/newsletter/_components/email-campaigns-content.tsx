"use client";

import React, { useState, useMemo } from "react";
import { Send, History, Mail, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTableSearch } from "@/components/common/DataTableSearch";
import { DataTable, Column } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/PaginationControls";
import { Button } from "@/components/ui/button";
import { useNewsletterSends, NewsletterSend } from "@/hooks/use-newsletter";
import { format } from "date-fns";

export default function EmailCampaignsContent() {
  const { data: sends = [], isLoading } = useNewsletterSends();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = useMemo(() =>
    sends.filter(s => s.template_name.toLowerCase().includes(searchQuery.toLowerCase())),
    [sends, searchQuery]
  );

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const columns: Column<NewsletterSend>[] = [
    {
      key: "s_no",
      label: "S.No",
      render: (_, idx) => (
        <span className="text-[12px] font-bold text-gray-500">
          {(currentPage - 1) * itemsPerPage + idx + 1}
        </span>
      ),
    },
    {
      key: "template_name",
      label: "Template",
      render: (item) => (
        <span className="text-[13px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
          {item.template_name}
        </span>
      ),
    },
    {
      key: "user_type",
      label: "User Type",
      render: (item) => (
        <span className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-lg tracking-widest border ${
          item.user_type === 'Guest'
            ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20'
            : 'bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-500/10 dark:border-violet-500/20'
        }`}>
          {item.user_type}
        </span>
      ),
    },
    {
      key: "total_sent",
      label: "Total",
      render: (item) => (
        <span className="text-[13px] font-black text-gray-700 dark:text-gray-300">{item.total_sent}</span>
      ),
    },
    {
      key: "success_count",
      label: "Success",
      render: (item) => (
        item.success_count > 0 ? (
          <Link
            href={`/newsletter/mail-status?newsletter_id=${item.id}&status=Success`}
            className="inline-flex items-center gap-1.5 text-[12px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg transition-all border border-emerald-100 dark:border-emerald-500/20"
          >
            <CheckCircle2 size={12} /> {item.success_count}
          </Link>
        ) : (
          <span className="text-[12px] font-bold text-gray-400 px-2.5 py-1">0</span>
        )
      ),
    },
    {
      key: "failed_count",
      label: "Failed",
      render: (item) => (
        item.failed_count > 0 ? (
          <Link
            href={`/newsletter/mail-status?newsletter_id=${item.id}&status=Failed`}
            className="inline-flex items-center gap-1.5 text-[12px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 px-2.5 py-1 rounded-lg transition-all border border-rose-100 dark:border-rose-500/20"
          >
            <XCircle size={12} /> {item.failed_count}
          </Link>
        ) : (
          <span className="text-[12px] font-bold text-gray-400 px-2.5 py-1">0</span>
        )
      ),
    },
    {
      key: "read_count",
      label: "Read",
      render: (item) => (
        item.read_count > 0 ? (
          <Link
            href={`/newsletter/mail-status?newsletter_id=${item.id}&read=Read`}
            className="inline-flex items-center gap-1.5 text-[12px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 px-2.5 py-1 rounded-lg transition-all border border-blue-100 dark:border-blue-500/20"
          >
            <Eye size={12} /> {item.read_count}
          </Link>
        ) : (
          <span className="text-[12px] font-bold text-gray-400 px-2.5 py-1">0</span>
        )
      ),
    },
    {
      key: "unread_count",
      label: "Unread",
      render: (item) => (
        item.unread_count > 0 ? (
          <Link
            href={`/newsletter/mail-status?newsletter_id=${item.id}&read=Unread`}
            className="inline-flex items-center gap-1.5 text-[12px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-500/10 dark:hover:bg-gray-500/20 px-2.5 py-1 rounded-lg transition-all border border-gray-200 dark:border-gray-500/20"
          >
            <EyeOff size={12} /> {item.unread_count}
          </Link>
        ) : (
          <span className="text-[12px] font-bold text-gray-400 px-2.5 py-1">0</span>
        )
      ),
    },
    {
      key: "createdAt",
      label: "Sent At",
      render: (item) => (
        <span className="text-[12px] font-medium text-gray-500 dark:text-gray-400">
          {format(new Date(item.createdAt), "dd MMM yyyy, HH:mm")}
        </span>
      ),
    },
  ];

  return (
    <div className="h-[calc(100vh-86px)] flex flex-col space-y-4 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden pt-8 pb-3 bg-[#F8FAFC] dark:bg-black/40">
      <PageHeader
        title="EMAIL"
        subtitle="Overview of all sent newsletters."
        total={filtered.length}
        rightContent={
          <div className="flex items-center gap-2">
            <Link href="/newsletter/send">
              <Button variant="outline" className="h-10 text-[11px] font-black gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-widest bg-white">
                <Send size={15} strokeWidth={2.5} className="text-emerald-500" /> Send Mail
              </Button>
            </Link>
            <Link href="/newsletter/mail-status">
              <Button variant="outline" className="h-10 text-[11px] font-black gap-2 border-slate-200 dark:border-gray-800 text-slate-600 hover:bg-slate-50 transition-all rounded-xl shadow-sm uppercase tracking-widest bg-white">
                <History size={15} strokeWidth={2.5} className="text-blue-500" /> Mail Status
              </Button>
            </Link>
          </div>
        }
      />

      <DataTableSearch
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
        placeholder="Search templates..."
      />

      <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-[#1f2937] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <DataTable
          data={paginated}
          columns={columns}
          visibleColumns={columns.map(c => c.key as string)}
          rowIdKey="id"
          loading={isLoading}
          noCard={true}
          emptyContent={
            <div className="flex flex-col items-center justify-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-300">
                <Mail size={32} />
              </div>
              <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-200">No newsletters sent yet</h4>
            </div>
          }
        />
        <PaginationControls
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalResults={filtered.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={() => {}}
        />
      </div>
    </div>
  );
}
