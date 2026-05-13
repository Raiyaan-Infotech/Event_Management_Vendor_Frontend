"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Star, Trash2, CheckSquare, RotateCw, MailOpen, Folder, ChevronDown, X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MailSidebar } from "./mail-sidebar";
import { PageHeader } from "@/components/common/PageHeader";
import {
  useVendorMails,
  useVendorInbox,
  useVendorMailTrash,
  useVendorMail,
  useToggleMailRead,
  useRestoreFromTrash,
  usePermanentDeleteMail,
  useBulkDeleteVendorMail,
  useBulkMarkRead,
  useBulkAssignLabel,
  useBulkMoveFolder,
} from "@/hooks/use-vendor-mail";
import { useVendorMailFolders } from "@/hooks/use-vendor-mail-folders";
import type { VendorMail } from "@/hooks/use-vendor-mail";

const cardClass = "bg-card rounded-[5px] border border-border overflow-hidden shadow-sm dark:shadow-none";

const stripHtml = (html: string): string => {
  if (typeof window === "undefined") return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
};

const LABELS = [
  { key: "social",     label: "Social",     color: "text-primary" },
  { key: "promotions", label: "Promotions", color: "text-green-500" },
  { key: "updates",    label: "Updates",    color: "text-sky-500" },
] as const;

type VendorMailContentProps = {
  title?: string;
  subtitle?: string;
};

export function VendorMailContent({
  title = "Mail",
  subtitle = "Manage Your Emails and Communications",
}: VendorMailContentProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [starredIds, setStarredIds] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedMailId, setSelectedMailId] = useState<number | null>(null);

  // Auto-open mail from ?mailId= param (e.g. when navigating from notification page)
  useEffect(() => {
    const id = searchParams.get("mailId");
    if (id) {
      setActiveFolder("inbox");
      setSelectedMailId(Number(id));
    }
  }, [searchParams]);

  const { data: mails = [], isLoading, refetch } = useVendorMails();
  const { data: inboxMails = [], isLoading: inboxLoading, refetch: refetchInbox } = useVendorInbox();
  const { data: trashMails = [], isLoading: trashLoading, refetch: refetchTrash } = useVendorMailTrash();
  const { data: mailDetail, isLoading: detailLoading } = useVendorMail(selectedMailId ?? undefined);
  const toggleRead        = useToggleMailRead();

  // Auto-mark as read when a mail is opened (inbox only — sent/drafts are always read)
  // useRef prevents duplicate calls when inboxMails refetches after invalidation
  const autoReadRef = useRef<Set<number>>(new Set());
  useEffect(() => {
    if (!selectedMailId) return;
    if (autoReadRef.current.has(selectedMailId)) return;
    const mail = inboxMails.find((m) => m.id === selectedMailId);
    if (mail && mail.is_read === 0) {
      autoReadRef.current.add(selectedMailId);
      toggleRead.mutate(selectedMailId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMailId, inboxMails]);
  const restoreMutation   = useRestoreFromTrash();
  const permDeleteMutation = usePermanentDeleteMail();
  const { data: folders = [] } = useVendorMailFolders();
  const bulkDelete    = useBulkDeleteVendorMail();
  const bulkRead      = useBulkMarkRead();
  const bulkLabel     = useBulkAssignLabel();
  const bulkFolder    = useBulkMoveFolder();

  const customFolders = folders.filter((f) => f.is_active === 1);
  const selectedArr   = Array.from(selectedIds);
  const hasSelection  = selectedArr.length > 0;

  const filteredMails = useMemo<VendorMail[]>(() => {
    if (activeFolder === "inbox")            return inboxMails;
    if (activeFolder === "sent")             return mails.filter((m) => m.folder === "sent" && !m.custom_folder_id && !m.label);
    if (activeFolder === "drafts")           return mails.filter((m) => m.folder === "drafts" && !m.custom_folder_id && !m.label);
    if (activeFolder === "all")              return mails;
    if (activeFolder === "important")        return mails.filter((m) => starredIds.has(m.id));
    if (activeFolder === "trash")            return [];
    if (activeFolder === "contacts")         return [];
    if (activeFolder === "label-social")     return mails.filter((m) => m.label === "social");
    if (activeFolder === "label-promotions") return mails.filter((m) => m.label === "promotions");
    if (activeFolder === "label-updates")    return mails.filter((m) => m.label === "updates");
    if (activeFolder.startsWith("folder-")) {
      const folderId = Number(activeFolder.replace("folder-", ""));
      return mails.filter((m) => m.custom_folder_id === folderId);
    }
    return mails;
  }, [mails, inboxMails, activeFolder, starredIds]);

  const folderLabel: Record<string, string> = {
    inbox: "Inbox", important: "Important", sent: "Sent Mail",
    drafts: "Draft", all: "All Mails", contacts: "Contacts", trash: "Trash",
    "label-social": "Social", "label-promotions": "Promotions", "label-updates": "Updates",
  };
  const currentLabel = activeFolder.startsWith("folder-")
    ? (customFolders.find((f) => `folder-${f.id}` === activeFolder)?.name ?? "Folder")
    : (folderLabel[activeFolder] ?? activeFolder);

  const handleFolderChange = (folder: string) => {
    setActiveFolder(folder);
    setSelectedIds(new Set());
    setSelectAll(false);
    setMoveOpen(false);
  };

  const toggleSelectAll = () => {
    const next = !selectAll;
    setSelectAll(next);
    setSelectedIds(next ? new Set(filteredMails.map((m) => m.id)) : new Set());
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      setSelectAll(next.size > 0 && next.size === filteredMails.length);
      return next;
    });
  };

  const toggleStar = (id: number) =>
    setStarredIds((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });

  const clearSelection = () => { setSelectedIds(new Set()); setSelectAll(false); };
  const handleRestoreOne = async (id: number) => {
    clearSelection();
    await restoreMutation.mutateAsync(id);
  };
  const handlePermanentDeleteOne = async (id: number) => {
    clearSelection();
    await permDeleteMutation.mutateAsync(id);
  };

  const handleBulkDelete = async () => {
    if (!hasSelection) return;
    await bulkDelete.mutateAsync(selectedArr);
    clearSelection();
    setConfirmDelete(false);
  };

  const handleBulkRead = async (isRead: boolean) => {
    if (!hasSelection) return;
    await bulkRead.mutateAsync({ ids: selectedArr, is_read: isRead });
    clearSelection();
  };

  const handleMoveToLabel = async (label: string | null) => {
    if (!hasSelection) return;
    setMoveOpen(false);
    await bulkLabel.mutateAsync({ ids: selectedArr, label });
    clearSelection();
  };

  const handleMoveToFolder = async (folderId: number | null) => {
    if (!hasSelection) return;
    setMoveOpen(false);
    await bulkFolder.mutateAsync({ ids: selectedArr, folder_id: folderId });
    clearSelection();
  };

  const isWorking = bulkDelete.isPending || bulkRead.isPending || bulkLabel.isPending || bulkFolder.isPending;

  /* ── Trash view ────────────────────────────────────────────────────────────── */
  if (activeFolder === "trash") {
    return (
      <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 pt-4 pb-10 custom-scrollbar">
        <div className="space-y-6 max-w-[1700px] mx-auto">
          <PageHeader title={title} subtitle={subtitle} total={trashMails.length} />
          <div className="flex flex-col lg:flex-row gap-[30px] lg:h-[800px] items-stretch">
            <MailSidebar activeFolder={activeFolder} onFolderChange={handleFolderChange} />
            <div className="flex-1 min-w-0 flex flex-col h-full">
              <div className={`${cardClass} flex-1 flex flex-col overflow-hidden`}>
                <div className="p-6 pb-4 flex items-center justify-between border-b border-border">
                  <h2 className="text-2xl font-bold text-foreground uppercase tracking-tight">Trash</h2>
                  <button onClick={() => refetchTrash()} className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all">
                    <RotateCw size={15} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto chat-scrollbar pb-6">
                  {trashLoading && <div className="p-10 text-center text-sm font-bold text-muted-foreground">Loading...</div>}
                  {!trashLoading && trashMails.length === 0 && (
                    <div className="p-10 text-center text-sm font-bold text-muted-foreground">Trash is empty.</div>
                  )}
                  {trashMails.map((mail) => (
                    <div key={mail.id} className="flex items-start gap-4 pt-5 pb-4 pl-6 pr-6 border-b border-border hover:bg-muted/20 transition-all">
                      <Avatar className="w-[32px] h-[32px] shrink-0">
                        <AvatarFallback className="bg-muted text-muted-foreground font-bold text-[12px] rounded-full">
                          {mail.folder === "drafts" ? "D" : "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-muted-foreground truncate">{mail.to_email}</p>
                        <p className="text-[14px] font-bold text-foreground truncate">{mail.subject}</p>
                        <p className="text-[12px] text-muted-foreground truncate">{stripHtml(mail.body).slice(0, 100)}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRestoreOne(mail.id); }}
                          disabled={restoreMutation.isPending}
                          className="px-3 h-8 text-[12px] font-bold border border-border rounded-[4px] text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                        >
                          Restore
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handlePermanentDeleteOne(mail.id); }}
                          disabled={permDeleteMutation.isPending}
                          className="px-3 h-8 text-[12px] font-bold border border-destructive/30 rounded-[4px] text-destructive hover:bg-destructive/5 transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
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

  /* ── Contacts view ─────────────────────────────────────────────────────────── */
  if (activeFolder === "contacts") {
    const uniqueEmails = Array.from(
      new Set(mails.flatMap((m) => m.to_email.split(",").map((e) => e.trim().toLowerCase())).filter(Boolean))
    );
    return (
      <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 pt-4 pb-10 custom-scrollbar">
        <div className="space-y-6 max-w-[1700px] mx-auto">
          <PageHeader title={title} subtitle={subtitle} total={uniqueEmails.length} />
          <div className="flex flex-col lg:flex-row gap-[30px]">
            <MailSidebar activeFolder={activeFolder} onFolderChange={handleFolderChange} />
            <div className="flex-1 min-w-0">
              <div className={`${cardClass} p-6`}>
                <h2 className="text-[14px] font-bold uppercase tracking-wider mb-4 text-foreground">Contacts</h2>
                {uniqueEmails.length === 0
                  ? <p className="text-sm text-muted-foreground">No contacts yet.</p>
                  : <ul className="divide-y divide-border">{uniqueEmails.map((e) => <li key={e} className="py-3 text-[14px] text-foreground font-medium">{e}</li>)}</ul>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 pt-4 pb-10 custom-scrollbar">
      <div className="space-y-6 max-w-[1700px] mx-auto">
        <PageHeader title={title} subtitle={subtitle} total={filteredMails.length} />

        <div className="flex flex-col lg:flex-row gap-[30px] mb-6 lg:h-[800px] items-stretch">
          <MailSidebar activeFolder={activeFolder} onFolderChange={handleFolderChange} />

          <div className="flex-1 min-w-0 flex gap-[20px] h-full overflow-hidden">
            {/* Mail list panel */}
            <div className={`${cardClass} bg-card flex flex-col mb-0 overflow-hidden transition-all duration-300 ${selectedMailId ? "w-[42%] shrink-0" : "flex-1"}`}>

              {/* Header */}
              <div className="p-6 pb-4">
                <h2 className="text-2xl font-bold text-foreground uppercase tracking-tight">{currentLabel}</h2>
              </div>

              {/* Toolbar */}
              <div className="px-6 py-3 border-y border-border bg-muted/50 flex items-center justify-between">
                {/* Select all */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`flex items-center justify-center w-[16px] h-[16px] rounded-[3px] border ${selectAll ? "bg-primary border-primary" : "bg-transparent border-[#c4c9d7] group-hover:border-primary"} transition-all`}>
                    {selectAll && <CheckSquare size={12} className="text-white" />}
                  </div>
                  <span className="text-[14px] text-muted-foreground">Select All</span>
                  <input type="checkbox" className="hidden" checked={selectAll} onChange={toggleSelectAll} />
                </label>

                <div className="flex items-center gap-2">
                  {/* Refresh */}
                  <button title="Refresh" onClick={() => { refetch(); refetchInbox(); }}
                    className="w-[36px] h-[36px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all">
                    <RotateCw size={16} />
                  </button>

                  {/* Mark as read */}
                  <button title="Mark as Read" disabled={!hasSelection || isWorking}
                    onClick={() => handleBulkRead(true)}
                    className="w-[36px] h-[36px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all disabled:opacity-40">
                    <MailOpen size={16} />
                  </button>

                  {/* Delete */}
                  <button title="Delete selected" disabled={!hasSelection || isWorking}
                    onClick={() => hasSelection && setConfirmDelete(true)}
                    className="w-[36px] h-[36px] flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-muted rounded-full transition-all disabled:opacity-40">
                    <Trash2 size={16} />
                  </button>

                  {/* Move to (label + custom folder) */}
                  {hasSelection && (
                    <div className="relative">
                      <button
                        onClick={() => setMoveOpen((o) => !o)}
                        disabled={isWorking}
                        className="flex items-center gap-1.5 px-3 h-[36px] text-[12px] font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-[3px] transition-all border border-border disabled:opacity-40"
                      >
                        <Folder size={14} /> Move to <ChevronDown size={12} className={`transition-transform ${moveOpen ? "rotate-180" : ""}`} />
                      </button>

                      {moveOpen && (
                        <div className="absolute right-0 top-[40px] z-50 bg-card border border-border rounded-[5px] shadow-xl min-w-[180px] py-1">
                          {/* Labels section */}
                          <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Label</p>
                          {LABELS.map(({ key, label }) => (
                            <button key={key} onClick={() => handleMoveToLabel(key)}
                              className="w-full text-left px-4 py-2 text-[13px] hover:bg-muted text-foreground transition-colors">
                              {label}
                            </button>
                          ))}
                          <button onClick={() => handleMoveToLabel(null)}
                            className="w-full text-left px-4 py-2 text-[13px] hover:bg-muted text-muted-foreground transition-colors">
                            Remove label
                          </button>

                          {/* Custom folders section */}
                          {customFolders.length > 0 && (
                            <>
                              <div className="border-t border-border my-1" />
                              <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">My Folder</p>
                              {customFolders.map((f) => (
                                <button key={f.id} onClick={() => handleMoveToFolder(f.id)}
                                  className="w-full text-left px-4 py-2 text-[13px] hover:bg-muted text-foreground transition-colors">
                                  {f.name}
                                </button>
                              ))}
                              <button onClick={() => handleMoveToFolder(null)}
                                className="w-full text-left px-4 py-2 text-[13px] hover:bg-muted text-muted-foreground transition-colors">
                                Remove from folder
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Mail list */}
              <div className="flex-1 overflow-y-auto chat-scrollbar pb-6" onClick={() => setMoveOpen(false)}>
                {(activeFolder === "inbox" ? inboxLoading : isLoading) && (
                  <div className="p-10 text-center text-sm font-bold text-muted-foreground">Loading mails...</div>
                )}
                {!(activeFolder === "inbox" ? inboxLoading : isLoading) && filteredMails.length === 0 && (
                  <div className="p-10 text-center text-sm font-bold text-muted-foreground">
                    {activeFolder === "inbox" ? "Your inbox is empty." : "No mails found."}
                  </div>
                )}

                {filteredMails.map((mail) => {
                  const isSelected = selectedIds.has(mail.id);
                  const isStarred  = starredIds.has(mail.id);
                  const isRead     = mail.is_read === 1;
                  const initials   = mail.folder === "drafts" ? "D" : mail.status === "failed" ? "F" : "S";
                  const snippet    = mail.error_message
                    ? `Failed: ${mail.error_message}`
                    : stripHtml(mail.body).slice(0, 140);
                  const time = mail.sent_at
                    ? new Date(mail.sent_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
                    : new Date(mail.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

                  return (
                    <div key={mail.id}
                      onClick={() => {
                        if (mail.folder === "drafts") { router.push(`/mail/compose?draftId=${mail.id}`); return; }
                        setSelectedMailId(mail.id === selectedMailId ? null : mail.id);
                      }}
                      className={`group relative flex items-start gap-4 pt-[22px] pb-[20px] pr-6 border-b border-border transition-all cursor-pointer
                        ${mail.id === selectedMailId
                          ? "bg-primary/10 border-l-[3px] border-l-primary pl-[27px]"
                          : isSelected
                            ? "bg-primary/5 border-l-[3px] border-l-primary/40 pl-[27px]"
                            : isRead
                              ? "bg-card hover:bg-muted/20 border-l-[3px] border-l-transparent pl-[27px]"
                              : "bg-muted/10 hover:bg-muted/30 border-l-[3px] border-l-indigo-500 pl-[27px]"
                        }`}
                    >
                      {/* Checkbox + star */}
                      <div className="flex items-center gap-[18px] shrink-0 mt-[1px]">
                        <label className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
                          <div className={`flex items-center justify-center w-[16px] h-[16px] rounded-[3px] border ${isSelected ? "bg-primary border-primary" : "bg-transparent border-[#c4c9d7] hover:border-primary"} transition-all`}>
                            {isSelected && <CheckSquare size={12} className="text-white" />}
                          </div>
                          <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleSelect(mail.id)} />
                        </label>
                        <button onClick={(e) => { e.stopPropagation(); toggleStar(mail.id); }}
                          className={`hover:scale-110 transition-transform ${isStarred ? "text-yellow-500" : "text-muted-foreground"}`}>
                          <Star size={16} className={isStarred ? "fill-current" : ""} />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 min-w-0 items-start gap-4 ml-2">
                        <div className="relative shrink-0 mt-0">
                          <Avatar className="w-[32px] h-[32px]">
                            <AvatarFallback className="bg-primary text-white font-bold text-[12px] rounded-full">{initials}</AvatarFallback>
                          </Avatar>
                          {!isRead && (
                            <span className="absolute -top-0.5 -right-0.5 w-[9px] h-[9px] bg-indigo-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1.5">
                            <p className={`text-[13px] truncate group-hover:text-primary transition-colors ${isRead ? "font-semibold text-muted-foreground" : "font-black text-foreground"}`}>
                              {mail.to_email}
                            </p>
                            <div className="flex items-center gap-2 shrink-0 ml-4 -mt-0.5">
                              {mail.label && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] bg-muted capitalize ${LABELS.find(l => l.key === mail.label)?.color || "text-muted-foreground"}`}>
                                  {mail.label}
                                </span>
                              )}
                              <span className={`text-[12px] whitespace-nowrap ${isRead ? "text-muted-foreground" : "text-foreground font-semibold"}`}>{time}</span>
                            </div>
                          </div>
                          <p className={`text-[14px] mb-[7px] truncate ${isRead ? "font-medium text-foreground/70" : "font-bold text-foreground"}`}>{mail.subject}</p>
                          <p className="text-[13px] text-muted-foreground truncate">{snippet}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mail detail panel */}
            {selectedMailId && (
              <div className={`${cardClass} flex-1 flex flex-col overflow-hidden`}>
                {detailLoading ? (
                  <div className="flex-1 flex items-center justify-center text-sm font-bold text-muted-foreground">Loading...</div>
                ) : mailDetail ? (
                  <>
                    {/* Detail header */}
                    <div className="p-5 border-b border-border flex items-start justify-between gap-4 shrink-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                          {mailDetail.recipientRow
                            ? `From: ${mailDetail.mail.sender_type.charAt(0).toUpperCase() + mailDetail.mail.sender_type.slice(1)}`
                            : `To: ${(mailDetail.mail.recipients ?? []).filter(r => r.role === "to").length} recipient(s)`}
                        </p>
                        <h3 className="text-[16px] font-black text-foreground leading-snug break-words">{mailDetail.mail.subject}</h3>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {mailDetail.mail.sent_at
                            ? new Date(mailDetail.mail.sent_at).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
                            : new Date(mailDetail.mail.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedMailId(null)}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all shrink-0"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Recipients row (if sender view) */}
                    {!mailDetail.recipientRow && (mailDetail.mail.recipients ?? []).length > 0 && (
                      <div className="px-5 py-2.5 border-b border-border bg-muted/30 shrink-0 flex flex-wrap gap-1.5">
                        {(mailDetail.mail.recipients ?? []).map((r) => (
                          <span key={r.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-muted text-[11px] font-bold text-foreground capitalize">
                            <span className="text-muted-foreground">{r.role.toUpperCase()}:</span> {r.recipient_type}#{r.recipient_id}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto chat-scrollbar p-5">
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none text-[14px] text-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: mailDetail.mail.body }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-sm font-bold text-muted-foreground">Mail not found.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-[8px] shadow-2xl p-8 w-full max-w-sm mx-4 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <Trash2 size={24} className="text-destructive" />
            </div>
            <div>
              <h3 className="text-[16px] font-black uppercase tracking-tight text-foreground">Delete {selectedArr.length} Mail{selectedArr.length > 1 ? "s" : ""}?</h3>
              <p className="text-[13px] text-muted-foreground mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={bulkDelete.isPending}
                className="flex-1 h-10 border border-border rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={bulkDelete.isPending}
                className="flex-1 h-10 bg-destructive text-white rounded-[5px] text-[13px] font-bold hover:brightness-110 transition-colors disabled:opacity-50"
              >
                {bulkDelete.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
