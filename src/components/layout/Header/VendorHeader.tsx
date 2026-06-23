"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Mail,
  CheckCheck,
  ChevronDown,
  User,
  Settings,
  MessageSquare,
  LogOut,
  Sparkles,
  Menu,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useVendorMe, useVendorLogout } from "@/hooks/use-vendors";
import { useVendorMailNotifications, useMarkVendorNotificationsRead } from "@/hooks/use-vendor-mail";
import { resolveMediaUrl } from "@/lib/utils";

export default function VendorHeader() {
  const { toggleSidebar } = useSidebar();
  const [mounted, setMounted] = React.useState(false);
  const { data: vendor } = useVendorMe();
  const logout = useVendorLogout();
  const { data: notifData } = useVendorMailNotifications();
  const markRead = useMarkVendorNotificationsRead();
  const unreadCount = notifData?.unread_count ?? 0;
  const notifications = notifData?.notifications ?? [];

  const vendorName =
    [vendor?.name, vendor?.company_name, vendor?.email].find((v) => String(v || "").trim()) || "Vendor";
  const vendorInitial = String(vendorName).trim().charAt(0).toUpperCase();
  const vendorProfileSrc = resolveMediaUrl(vendor?.profile || undefined) || undefined;

  // Company brand shown on the left of the header
  const v = vendor as any;
  const companyName = vendor?.company_name || "Vendor Portal";
  const companyLogoSrc = resolveMediaUrl(vendor?.company_logo || undefined) || undefined;
  const companyInitial = companyName.trim().charAt(0).toUpperCase();
  const city =
    (typeof v?.city === "string" ? v.city : "") ||
    v?.locality?.name ||
    v?.district?.name ||
    (typeof v?.company_address === "string" ? v.company_address.split(",")[0]?.trim() : "") ||
    (typeof v?.address === "string" ? v.address.split(",")[0]?.trim() : "") ||
    "";

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="h-[56px] px-4 flex items-center bg-white border-b border-slate-200 fixed top-0 inset-x-0 z-[1100]">
        <button className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500">
          <Menu className="size-5" />
        </button>
      </header>
    );
  }

  return (
    <header className="h-[56px] pl-3 pr-5 flex items-center justify-between gap-4 bg-white dark:bg-[#09090b] border-b border-slate-200 dark:border-[#27272a] fixed top-0 inset-x-0 z-[1100] min-w-0">
      {/* Left — company brand + toggle + search */}
      <div className="flex flex-1 items-center gap-3 min-w-0">
        {/* Company brand: logo + name + city */}
        <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0 no-underline">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--vendor-primary-btn)] text-[13px] font-extrabold text-white overflow-hidden relative">
            {companyLogoSrc ? (
              <img src={companyLogoSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : companyInitial}
          </span>
          <div className="hidden lg:block leading-tight">
            <p className="text-[14px] font-extrabold text-slate-800 max-w-[160px] truncate">{companyName}</p>
            {city ? <p className="text-[11px] font-medium text-slate-400 truncate max-w-[160px]">{city}</p> : null}
          </div>
        </Link>

        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Menu className="size-5" />
        </button>
        <label className="hidden md:flex items-center gap-2.5 h-10 w-full max-w-[440px] rounded-[var(--vendor-radius-control)] border border-slate-200 bg-slate-50/70 px-3.5 text-slate-400 focus-within:border-[var(--vendor-primary-btn)]/40 focus-within:bg-white transition-colors">
          <Search className="size-4 shrink-0" />
          <input
            type="text"
            placeholder="Search events, clients, guests..."
            className="h-full flex-1 min-w-0 bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400"
          />
          <kbd className="hidden lg:flex items-center gap-0.5 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
            ⌘ K
          </kbd>
        </label>
      </div>

      {/* Right */}
      <div className="flex items-center justify-end gap-2.5 shrink-0">
        {/* Upgrade Plan */}
        <Link
          href="/payment-management"
          className="hidden sm:flex items-center gap-1.5 h-9 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-primary-btn)]/30 bg-white px-3.5 text-[13px] font-semibold text-[var(--vendor-primary-btn)] transition-colors hover:bg-[var(--vendor-primary-btn)]/10"
        >
          <Sparkles className="size-4" /> Upgrade Plan
        </Link>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative w-9 h-9 rounded-[var(--vendor-radius-control)] text-slate-500 hover:bg-slate-100 data-[state=open]:bg-slate-100">
              <Bell className="size-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[15px] h-[15px] px-0.5 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white leading-none">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[320px] p-0 border-slate-200 rounded-[var(--vendor-radius-panel)] shadow-xl mt-2 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-sm text-slate-800">
                Notifications {unreadCount > 0 && <span className="ml-1.5 text-[10px] bg-rose-500 text-white rounded-full px-1.5 py-0.5 font-black">{unreadCount}</span>}
              </h3>
              <Button variant="ghost" size="sm" className="text-xs h-7 text-[var(--vendor-primary-btn)] hover:text-[var(--vendor-primary-btn)] hover:bg-[var(--vendor-primary-btn)]/10 font-bold"
                onClick={() => markRead.mutate()}>
                <CheckCheck className="size-3 mr-1" /> Mark all read
              </Button>
            </div>
            <ScrollArea className="h-[200px]">
              <div className="p-2 space-y-1">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">No notifications</div>
                ) : notifications.map((notif) => (
                  <Link key={notif.id} href="/communication/notification"
                    className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all group">
                    <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]">
                      <Mail className="size-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[12px] font-bold text-slate-800 group-hover:text-[var(--vendor-primary-btn)] transition-colors">New Mail</span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap font-medium">
                          {notif.mail?.sent_at ? new Date(notif.mail.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{notif.mail?.subject || 'No subject'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollArea>
            <div className="p-3 text-center border-t border-slate-100 bg-white">
              <Link href="/communication/notification">
                <Button variant="link" className="text-xs text-[var(--vendor-primary-btn)] font-bold h-auto p-0">View All Notifications</Button>
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile chip */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2.5 cursor-pointer group outline-none rounded-[var(--vendor-radius-control)] pl-1 pr-2 py-1 hover:bg-slate-100 transition-colors">
              <Avatar className="size-9 rounded-full">
                {vendorProfileSrc ? <AvatarImage key={vendorProfileSrc} src={vendorProfileSrc} className="object-cover" /> : null}
                <AvatarFallback className="bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)] font-bold text-xs">{vendorInitial}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-[13px] font-bold text-slate-800 max-w-[140px] truncate">{vendorName}</p>
                <p className="text-[11px] text-slate-400 font-medium">Admin</p>
              </div>
              <ChevronDown className="hidden sm:block size-4 text-slate-400" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[240px] p-0 rounded-[var(--vendor-radius-panel)] shadow-xl mt-2 border-slate-200 overflow-hidden">
            <div className="bg-[var(--vendor-primary-btn)] p-5 text-center">
              <Avatar className="mx-auto mb-3 size-14 border-2 border-white/30 bg-white/10">
                {vendorProfileSrc ? <AvatarImage key={vendorProfileSrc} src={vendorProfileSrc} className="object-cover" /> : null}
                <AvatarFallback className="bg-white/20 text-white font-black">{vendorInitial}</AvatarFallback>
              </Avatar>
              <h6 className="font-bold text-[15px] text-white leading-tight uppercase tracking-wide">{vendorName}</h6>
              <span className="text-[11px] text-white/80 pt-1 block">Premium Member</span>
            </div>
            <div className="p-1.5 bg-white">
              <DropdownMenuItem asChild className="flex items-center h-11 px-4 cursor-pointer text-slate-700 text-[13px] font-medium hover:bg-slate-50 focus:bg-slate-50 outline-none group border-b border-slate-100 rounded-none">
                <Link href="/profile"><User size={16} className="mr-3 text-slate-400 group-hover:text-[var(--vendor-primary-btn)]" /> Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="flex items-center h-11 px-4 cursor-pointer text-slate-700 text-[13px] font-medium hover:bg-slate-50 focus:bg-slate-50 outline-none group border-b border-slate-100 rounded-none">
                <Link href="/profile/edit"><Settings size={16} className="mr-3 text-slate-400 group-hover:text-[var(--vendor-primary-btn)]" /> Edit Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="flex items-center h-11 px-4 cursor-pointer text-slate-700 text-[13px] font-medium hover:bg-slate-50 focus:bg-slate-50 outline-none group border-b border-slate-100 rounded-none">
                <Link href="/communication/chat"><MessageSquare size={16} className="mr-3 text-slate-400 group-hover:text-[var(--vendor-primary-btn)]" /> Chat</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center h-11 px-4 cursor-pointer text-slate-700 text-[13px] font-medium hover:bg-slate-50 focus:bg-slate-50 outline-none group"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
              >
                <LogOut size={16} className="mr-3 text-slate-400 group-hover:text-[var(--vendor-primary-btn)]" />
                {logout.isPending ? "Signing Out..." : "Sign Out"}
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
