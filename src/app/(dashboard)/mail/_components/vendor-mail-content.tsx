"use client";

import { useState } from "react";

import {
  Star,
  Trash2,
  Folder,
  CheckSquare,
  RotateCw,
  MailOpen,
  AlertOctagon,
  Tag,
  Paperclip,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MailSidebar } from "./mail-sidebar";
import { PageHeader } from "@/components/common/PageHeader";

const cardClass =
  "bg-card rounded-[5px] border border-border overflow-hidden shadow-sm dark:shadow-none mb-6 ";

interface Email {
  id: number;
  sender: string;
  avatar: string;
  subject: string;
  snippet: string;
  time: string;
  isUnread: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
  selected: boolean;
  initials: string;
}

const initialEmails: Email[] = [
  {
    id: 1,
    sender: "Adrian Monino",
    avatar: "/images/user-avatar-1.jpg",
    subject: "Someone who believes in you",
    snippet:
      "enean commodo li gula eget dolor cum socia eget dolor enean commod...",
    time: "11:30am",
    isUnread: true,
    isStarred: false,
    hasAttachment: true,
    selected: false,
    initials: "AM",
  },
  {
    id: 2,
    sender: "Albert Ansing",
    avatar: "/images/user-avatar-2.jpg",
    subject: "Here's What You Missed This Week",
    snippet:
      "enean commodo li gula eget dolor cum socia eget dolor enean commod...",
    time: "06:50am",
    isUnread: true,
    isStarred: true,
    hasAttachment: false,
    selected: false,
    initials: "AA",
  },
  {
    id: 3,
    sender: "Carla Guden",
    avatar: "/images/user-avatar-3.jpg",
    subject: "4 Ways to Optimize Your Search",
    snippet:
      "viva mus elemen tum semper nisi enean vulputat enean commodo li gul...",
    time: "Yesterday",
    isUnread: false,
    isStarred: false,
    hasAttachment: true,
    selected: false,
    initials: "CG",
  },
  {
    id: 4,
    sender: "Reven Galeon",
    avatar: "/images/user-avatar-4.jpg",
    subject: "We're Giving a Macbook for Free",
    snippet:
      "viva mus elemen tum semper nisi enean vulputat enean commodo li gul...",
    time: "Yesterday",
    isUnread: false,
    isStarred: false,
    hasAttachment: false,
    selected: false,
    initials: "RG",
  },
  {
    id: 5,
    sender: "Elisse Tan",
    avatar: "/images/user-avatar-5.jpg",
    subject: "Keep Your Personal Data Safe",
    snippet:
      "viva mus elemen tum semper nisi enean vulputat enean commodo li gul...",
    time: "Oct 13",
    isUnread: false,
    isStarred: false,
    hasAttachment: false,
    selected: false,
    initials: "ET",
  },
  {
    id: 6,
    sender: "Marianne Audrey",
    avatar: "/images/user-avatar-6.jpg",
    subject: "We've Made Some Changes",
    snippet:
      "viva mus elemen tum semper nisi enean vulputat enean commodo li gul...",
    time: "Oct 13",
    isUnread: false,
    isStarred: false,
    hasAttachment: false,
    selected: false,
    initials: "MA",
  },
  {
    id: 7,
    sender: "Jane Phoebe",
    avatar: "/images/user-avatar-7.jpg",
    subject: "Grab Our Holiday Deals",
    snippet:
      "viva mus elemen tum semper nisi enean vulputat enean commodo li gul...",
    time: "Oct 12",
    isUnread: false,
    isStarred: false,
    hasAttachment: false,
    selected: false,
    initials: "J",
  },
  {
    id: 8,
    sender: "Raffy Godinez",
    avatar: "/images/user-avatar-8.jpg",
    subject: "Just a Few Steps Away",
    snippet:
      "viva mus elemen tum semper nisi enean vulputat enean commodo li gul...",
    time: "Oct 05",
    isUnread: false,
    isStarred: false,
    hasAttachment: false,
    selected: false,
    initials: "RG",
  },
  {
    id: 9,
    sender: "Allan Cadungog",
    avatar: "/images/user-avatar-60.jpg",
    subject: "Credit Card Promos",
    snippet:
      "viva mus elemen tum semper nisi enean vulputat enean commodo li gul...",
    time: "Oct 04",
    isUnread: false,
    isStarred: true,
    hasAttachment: false,
    selected: false,
    initials: "AC",
  },
  {
    id: 10,
    sender: "Alfie Salinas",
    avatar: "/images/user-avatar-66.jpg",
    subject: "4 Ways to Optimize Your Search",
    snippet:
      "viva mus elemen tum semper nisi enean vulputat enean commodo li gul...",
    time: "Oct 02",
    isUnread: false,
    isStarred: false,
    hasAttachment: false,
    selected: false,
    initials: "AS",
  },
  {
    id: 11,
    sender: "Jove Guden",
    avatar: "/images/user-avatar-12.jpg",
    subject: "Keep Your Personal Data Safe",
    snippet:
      "viva mus elemen tum semper nisi enean vulputat enean commodo li gul...",
    time: "Oct 02",
    isUnread: false,
    isStarred: false,
    hasAttachment: false,
    selected: false,
    initials: "JG",
  },
];

interface VendorMailContentProps {
  title?: string;
  subtitle?: string;
}

export function VendorMailContent({
  title = "Mail",
  subtitle = "Inbox",
}: VendorMailContentProps) {
  const [emails, setEmails] = useState<Email[]>(initialEmails);
  const [selectAll, setSelectAll] = useState(false);

  const toggleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    setEmails(emails.map((email) => ({ ...email, selected: newValue })));
  };

  const toggleSelect = (id: number) => {
    setEmails(
      emails.map((email) =>
        email.id === id ? { ...email, selected: !email.selected } : email,
      ),
    );
  };

  const toggleStar = (id: number) => {
    setEmails(
      emails.map((email) =>
        email.id === id ? { ...email, isStarred: !email.isStarred } : email,
      ),
    );
  };

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 pt-4 pb-10 custom-scrollbar ">
      <div className="space-y-6 max-w-[1700px] mx-auto">
        <PageHeader
          title={title}
          subtitle="Manage Your Emails and Communications"
          total={emails.length}
        />

        <div className="flex flex-col lg:flex-row gap-[30px] mb-6 lg:h-[800px] items-stretch">
          {/* --- LEFT NAVIGATION --- */}
          <MailSidebar />

          {/* --- RIGHT CONTENT --- */}
          <div className="flex-1 min-w-0 flex flex-col h-full">
            <div
              className={`${cardClass} bg-card flex-1 flex flex-col mb-0 overflow-hidden`}
            >
              {/* Header Area */}
              <div className="p-6 pb-4">
                <div className="flex items-baseline justify-between mb-1">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 uppercase tracking-tight">
                    {subtitle}
                  </h2>
                </div>
                <div className="flex items-center justify-between border-b pb-1 border-transparent"></div>
              </div>

              {/* Toolbar Area */}
              <div className="px-6 py-3 border-y border-border bg-muted/50 flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    className={`flex items-center justify-center w-[16px] h-[16px] rounded-[3px] border ${selectAll ? "bg-primary border-primary" : "bg-transparent border-[#c4c9d7] group-hover:border-primary"} transition-all`}
                  >
                    {selectAll && (
                      <CheckSquare
                        size={12}
                        className="text-white opacity-100"
                      />
                    )}
                  </div>
                  <span className="text-[14px] text-muted-foreground">
                    Select All
                  </span>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                </label>

                <div className="flex items-center gap-2">
                  <button
                    title="Refresh"
                    className="w-[36px] h-[36px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all"
                  >
                    <RotateCw size={16} />
                  </button>
                  <button
                    title="Mark as Read"
                    className="w-[36px] h-[36px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all"
                  >
                    <MailOpen size={16} />
                  </button>
                  <button
                    title="Report Spam"
                    className="w-[36px] h-[36px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all"
                  >
                    <AlertOctagon size={16} />
                  </button>
                  <button
                    title="Delete"
                    className="w-[36px] h-[36px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    title="Move to Folder"
                    className="w-[36px] h-[36px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all"
                  >
                    <Folder size={16} />
                  </button>
                  <button
                    title="Tag"
                    className="w-[36px] h-[36px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all"
                  >
                    <Tag size={16} />
                  </button>
                </div>
              </div>

              {/* Email List Area */}
              <div className="flex-1 overflow-y-auto chat-scrollbar pb-6">
                {emails.map((email) => (
                  <div
                    key={email.id}
                    className={`group flex items-start gap-4 pt-[22px] pb-[20px] pl-[30px] pr-6 border-b border-border transition-all cursor-pointer ${
                      email.selected
                        ? "bg-primary/5"
                        : "bg-card hover:bg-muted/30"
                    }`}
                  >
                    {/* Actions */}
                    <div className="flex items-center gap-[18px] shrink-0 mt-[1px]">
                      <label
                        className="cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className={`flex items-center justify-center w-[16px] h-[16px] rounded-[3px] border ${email.selected ? "bg-primary border-primary" : "bg-transparent border-[#c4c9d7] hover:border-primary"} transition-all`}
                        >
                          {email.selected && (
                            <CheckSquare
                              size={12}
                              className="text-white opacity-100"
                            />
                          )}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={email.selected}
                          onChange={() => toggleSelect(email.id)}
                        />
                      </label>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(email.id);
                        }}
                        className={`hover:scale-110 transition-transform ${email.isStarred ? "text-yellow-500" : "text-muted-foreground"}`}
                      >
                        <Star
                          size={16}
                          className={email.isStarred ? "fill-current" : ""}
                        />
                      </button>
                    </div>

                    {/* Avatar & Content Wrapper */}
                    <div className="flex flex-1 min-w-0 items-start gap-4 ml-2">
                      <Avatar className="w-[32px] h-[32px] border border-transparent bg-transparent shrink-0 mt-0">
                        {email.avatar ? (
                          <AvatarImage
                            src={email.avatar}
                            className="object-cover rounded-full"
                          />
                        ) : (
                          <AvatarFallback className="bg-primary text-white font-bold text-[12px] rounded-full">
                            {email.initials}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1.5">
                          <p
                            className={`text-[13px] leading-[13px] font-bold transition-colors truncate ${email.isUnread ? "text-foreground" : "text-muted-foreground group-hover:text-primary"}`}
                          >
                            {email.sender}
                          </p>
                          <div className="flex items-center gap-3 shrink-0 ml-4 -mt-0.5">
                            {email.hasAttachment && (
                              <Paperclip
                                size={14}
                                className="text-foreground"
                              />
                            )}
                            <span className="text-[12px] text-muted-foreground whitespace-nowrap">
                              {email.time}
                            </span>
                          </div>
                        </div>
                        <p
                          className={`text-[14px] leading-[14px] mb-[7px] truncate ${email.isUnread ? "text-foreground font-bold" : "text-foreground font-bold"}`}
                        >
                          {email.subject}
                        </p>
                        <p className="text-[13px] leading-[13px] text-muted-foreground truncate">
                          {email.snippet}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
