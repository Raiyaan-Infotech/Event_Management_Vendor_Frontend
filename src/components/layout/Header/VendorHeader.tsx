"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faExpand,
  faCompress,
  faMoon,
  faSun,
  faBell,
  faClock,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useVendorMe, useVendorLogout } from "@/hooks/use-vendors";
import { resolveMediaUrl } from "@/lib/utils";
import { User, Settings, Mail, MessageSquare, Sliders, LogOut } from 'lucide-react';



const ICON_BTN = "w-8 h-8 flex items-center justify-center rounded-full border border-border dark:border-white/10 bg-transparent text-muted-foreground hover:bg-accent dark:hover:bg-card/5 hover:text-primary dark:hover:text-white transition-all duration-200";

export default function VendorHeader() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);
  const { data: vendor } = useVendorMe();
  const logout = useVendorLogout();

  React.useEffect(() => { setMounted(true); }, []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  if (!mounted) {
    return (
      <header className="h-[56px] px-4 flex items-center bg-card border-b border-border sticky top-0 z-40">
        <SidebarTrigger className="w-8 h-8 border border-border bg-transparent" />
      </header>
    );
  }

  return (
    <header className="h-[56px] pl-3 pr-6 flex items-center justify-between bg-card dark:bg-[#09090b] backdrop-blur-md border-b border-border dark:border-[#27272a] sticky top-0 z-50 min-w-0 overflow-hidden text-foreground dark:text-gray-100">
      {/* Left */}
      <div className="flex flex-1 items-center gap-4 min-w-0">
        <SidebarTrigger className="w-8 h-8 flex items-center justify-center rounded-sm border border-border dark:border-[#27272a] bg-transparent text-muted-foreground dark:text-gray-400 hover:bg-accent dark:hover:bg-[#27272a] hover:text-primary dark:hover:text-white hover:border-primary transition-all duration-200" />
      </div>

      {/* Right */}
      <div className="flex items-center justify-end gap-1.5 md:gap-2 shrink-0">

        {/* Search */}
        <Button variant="ghost" size="icon" className={ICON_BTN}>
          <FontAwesomeIcon icon={faSearch} width={16} />
        </Button>

        {/* Language */}
        <Button variant="ghost" size="icon" className={`${ICON_BTN} hidden sm:flex`}>
          <Image src="https://flagcdn.com/us.svg" width={20} height={14} className="w-5 h-3.5 rounded-sm" alt="US" />
        </Button>

        {/* Fullscreen */}
        <Button variant="ghost" size="icon" className={`${ICON_BTN} hidden sm:flex`} onClick={toggleFullscreen}>
          {fullscreen
            ? <FontAwesomeIcon icon={faCompress} width={16} />
            : <FontAwesomeIcon icon={faExpand} width={16} />}
        </Button>

        {/* Clock */}
        <Button variant="ghost" size="icon" className={`${ICON_BTN} hidden md:flex`}>
          <FontAwesomeIcon icon={faClock} width={16} />
        </Button>

        {/* Theme toggle */}
        <Button variant="ghost" size="icon" className={ICON_BTN} onClick={toggleTheme}>
          {theme === "dark"
            ? <FontAwesomeIcon icon={faSun} width={16} />
            : <FontAwesomeIcon icon={faMoon} width={16} />}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className={`${ICON_BTN} p-0 data-[state=open]:bg-accent`}>
              <div className="relative">
                <FontAwesomeIcon icon={faBell} width={16} />
                <span className="absolute -top-0.5 -right-0.5 size-2 bg-rose-500 rounded-full border-2 border-background" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[320px] p-0 border-border rounded-2xl shadow-xl mt-2 overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="font-bold text-sm text-foreground">Notifications</h3>
              <Button variant="ghost" size="sm" className="text-xs h-7 text-primary hover:text-primary hover:bg-primary/5 font-bold">
                <FontAwesomeIcon icon={faCheckDouble} className="!size-3 mr-1" /> Mark all read
              </Button>
            </div>
            <ScrollArea className="h-[200px]">
              <div className="p-4 text-center text-sm text-muted-foreground">No notifications yet</div>
            </ScrollArea>
            <div className="p-3 text-center border-t border-border bg-card">
              <Button variant="link" className="text-xs text-primary font-bold h-auto p-0">View All Notifications</Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer group outline-none ml-1">
              <Avatar className="size-9 border border-border rounded-full group-hover:border-primary/30 transition-colors">
                <AvatarImage src={resolveMediaUrl(vendor?.profile || "")} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {vendor?.name?.charAt(0).toUpperCase() ?? "V"}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[240px] p-0 rounded-lg shadow-xl mt-2 border-border overflow-hidden font-['Roboto',sans-serif]">
            {/* VALEX BLUE HEADER */}
            <div className="bg-primary p-5 text-center">
              <h6 className="font-bold text-[15px] text-white leading-tight uppercase tracking-wide">{vendor?.name || "Petey Cruiser"}</h6>
              <span className="text-[11px] text-white/80 font-normal pt-1 block">Premium Member</span>
            </div>

            <div className="p-1.5 bg-card">
              <DropdownMenuItem asChild className="flex items-center h-11 px-4 cursor-pointer text-foreground text-[13px] font-medium hover:bg-accent focus:bg-accent outline-none group border-b border-border/50 rounded-none first:rounded-t-md">
                <Link href="/profile">
                  <User size={16} className="mr-3 text-muted-foreground group-hover:text-primary" /> Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="flex items-center h-11 px-4 cursor-pointer text-foreground text-[13px] font-medium hover:bg-accent focus:bg-accent outline-none group border-b border-border/50 rounded-none">
                <Link href="/profile/edit">
                  <Settings size={16} className="mr-3 text-muted-foreground group-hover:text-primary" /> Edit Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="flex items-center h-11 px-4 cursor-pointer text-foreground text-[13px] font-medium hover:bg-accent focus:bg-accent outline-none group border-b border-border/50 rounded-none">
                <Link href="/inbox">
                  <Mail size={16} className="mr-3 text-muted-foreground group-hover:text-primary" /> Inbox
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="flex items-center h-11 px-4 cursor-pointer text-foreground text-[13px] font-medium hover:bg-accent focus:bg-accent outline-none group border-b border-border/50 rounded-none">
                <Link href="/messages">
                  <MessageSquare size={16} className="mr-3 text-muted-foreground group-hover:text-primary" /> Messages
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="flex items-center h-11 px-4 cursor-pointer text-foreground text-[13px] font-medium hover:bg-accent focus:bg-accent outline-none group border-b border-border/50 rounded-none">
                <Link href="/settings">
                  <Sliders size={16} className="mr-3 text-muted-foreground group-hover:text-primary" /> Account Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center h-11 px-4 cursor-pointer text-foreground text-[13px] font-medium hover:bg-accent focus:bg-accent outline-none group rounded-b-md"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
              >
                <LogOut size={16} className="mr-3 text-muted-foreground group-hover:text-primary" />
                {logout.isPending ? "Signing Out..." : "Sign Out"}
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
