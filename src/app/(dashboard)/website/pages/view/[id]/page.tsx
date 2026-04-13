"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useVendorPage } from "@/hooks/use-vendor-pages";

interface ViewPageProps {
  params: Promise<{ id: string }>;
}

export default function ViewWebsitePage({ params }: ViewPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: page, isLoading } = useVendorPage(Number(id));

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-86px)] flex items-center justify-center">
        <p className="text-gray-500 font-bold">Loading...</p>
      </div>
    );
  }

  if (!page) {
    router.push("/website/pages");
    return null;
  }

  const htmlContent = page.content || "<p>No content given.</p>";

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar bg-slate-50/40 dark:bg-transparent">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <Badge className="bg-violet-50 text-violet-600 border-violet-100 hover:bg-violet-50 font-bold">
              Website Page
            </Badge>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
              {page.name}
            </h1>
          </div>
          <Button asChild variant="outline" className="border-gray-200 shadow-sm">
            <Link href="/website/pages" className="gap-2 font-semibold">
              <ArrowLeft size={15} /> Back to Pages
            </Link>
          </Button>
        </div>

        <Card className="border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800">
            <CardTitle className="text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-200">
              Page Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 bg-white dark:bg-[#111827]">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Page Name</p>
                <p className="text-[15px] font-bold text-gray-900 dark:text-gray-100 mt-1">{page.name}</p>
              </div>
              <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 bg-white dark:bg-[#111827]">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Created At</p>
                <p className="text-[14px] font-semibold text-gray-800 dark:text-gray-200 mt-1 flex items-center gap-2">
                  <CalendarDays size={14} className="text-blue-500" />
                  {new Date(page.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-200">
              Description
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-[14px] leading-7 text-gray-600 dark:text-gray-300">{page.description || "No description provided."}</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <FileText size={15} className="text-indigo-500" /> Content Full Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 min-h-[600px] relative bg-white relative">
            <iframe
              title="Isolated HTML Preview"
              srcDoc={htmlContent}
              sandbox="allow-scripts allow-same-origin allow-popups"
              className="absolute inset-0 w-full h-full border-0 bg-white rounded-b-xl"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
