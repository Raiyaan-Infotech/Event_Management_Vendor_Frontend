'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Paperclip, Link, Image as ImageIcon, Trash2, Search, X, ChevronDown } from 'lucide-react';
import { MailSidebar } from '../../_components/mail-sidebar';
import { PageHeader } from '@/components/common/PageHeader';
import {
  useSaveVendorMailDraft,
  useUpdateVendorMailDraft,
  useSendVendorMailDraft,
  useSendVendorMail,
  useMailContacts,
  type MailContact,
  type ContactType,
} from '@/hooks/use-vendor-mail';

const QuillEditor = dynamic(() => import('@/components/ui/quill-editor'), { ssr: false });

const cardClass = 'bg-card rounded-[5px] border border-border overflow-hidden shadow-sm dark:shadow-none';

const LIMITS: Record<'to' | 'cc' | 'bcc', number> = { to: 25, cc: 5, bcc: 3 };

type Role = 'to' | 'cc' | 'bcc';

interface SelectedContact extends MailContact {
  role: Role;
}

// ─── Contact chip ─────────────────────────────────────────────────────────────

function ContactChip({ contact, onRemove }: { contact: SelectedContact; onRemove: () => void }) {
  const bg: Record<ContactType, string> = {
    admin:  'bg-primary/10 text-primary',
    vendor: 'bg-amber-500/10 text-amber-600',
    client: 'bg-green-500/10 text-green-600',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[12px] font-medium ${bg[contact.type]}`}>
      {contact.name}
      <button onClick={onRemove} className="hover:opacity-70">
        <X size={11} />
      </button>
    </span>
  );
}

// ─── Contact picker panel ─────────────────────────────────────────────────────

function ContactPickerPanel({
  selected,
  onAdd,
  onRemove,
}: {
  selected: SelectedContact[];
  onAdd: (c: MailContact, role: Role) => void;
  onRemove: (c: SelectedContact) => void;
}) {
  const { data: contacts } = useMailContacts();
  const [search, setSearch] = useState('');
  const [popover, setPopover] = useState<MailContact | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setPopover(null);
        setShowPanel(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const all: MailContact[] = [
    ...(contacts?.admins  ?? []),
    ...(contacts?.clients ?? []),
  ];
  const filtered = all.filter(
    (c) =>
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
       c.email.toLowerCase().includes(search.toLowerCase())) &&
      !selected.some((s) => s.id === c.id && s.type === c.type)
  );

  const handleAdd = (c: MailContact, role: Role) => {
    const count = selected.filter(s => s.role === role).length;
    if (count >= LIMITS[role]) return;
    onAdd(c, role);
    setPopover(null);
    setSearch('');
  };

  const ROLE_LABELS: { role: Role; label: string; cls: string }[] = [
    { role: 'to',  label: 'To',  cls: 'bg-primary text-white' },
    { role: 'cc',  label: 'CC',  cls: 'bg-muted text-foreground border border-border' },
    { role: 'bcc', label: 'BCC', cls: 'bg-muted text-foreground border border-border' },
  ];

  const byRole = (role: Role) => selected.filter((s) => s.role === role);

  return (
    <div ref={ref} className="space-y-0">
      {/* Chips per role */}
      {(['to', 'cc', 'bcc'] as Role[]).map((role) => {
        const chips = byRole(role);
        if (role !== 'to' && chips.length === 0) return null;
        return (
          <div key={role} className="flex items-start gap-4 border-b border-border py-2.5">
            <label className="w-14 text-[12px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 pt-1">
              {role.toUpperCase()}
            </label>
            <div className="flex-1 flex flex-wrap gap-1.5 items-center min-h-[26px]">
              {chips.map((c) => (
                <ContactChip
                  key={`${c.type}-${c.id}`}
                  contact={c}
                  onRemove={() => onRemove(c)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Search trigger */}
      <div className="flex items-center gap-4 border-b border-border py-2.5">
        <label className="w-14 text-[12px] font-bold text-muted-foreground uppercase tracking-wider shrink-0">
          Add
        </label>
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => setShowPanel((v) => !v)}
            className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search size={14} /> Search contacts…
            <ChevronDown size={12} className={`transition-transform ${showPanel ? 'rotate-180' : ''}`} />
          </button>

          {showPanel && (
            <div className="absolute top-full left-0 z-50 mt-1 w-[320px] bg-popover border border-border rounded-[5px] shadow-lg">
              <div className="p-2 border-b border-border">
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email…"
                  className="w-full text-[13px] bg-transparent outline-none text-foreground placeholder:text-muted-foreground/60"
                />
              </div>
              <ul className="max-h-[220px] overflow-y-auto py-1 chat-scrollbar">
                {filtered.length === 0 && (
                  <li className="px-3 py-2 text-[12px] text-muted-foreground">No contacts found</li>
                )}
                {filtered.map((c) => (
                  <li key={`${c.type}-${c.id}`} className="relative group">
                    {popover?.id === c.id && popover?.type === c.type ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted">
                        <span className="flex-1 text-[13px] font-medium text-foreground truncate">{c.name}</span>
                        {ROLE_LABELS.map(({ role, label, cls }) => {
                          const atLimit = selected.filter(s => s.role === role).length >= LIMITS[role];
                          return (
                          <button
                            key={role}
                            onClick={() => handleAdd(c, role)}
                            disabled={atLimit}
                            title={atLimit ? `Max ${LIMITS[role]} ${label} recipients` : undefined}
                            className={`px-2 py-0.5 rounded text-[11px] font-bold transition-opacity ${atLimit ? 'opacity-30 cursor-not-allowed bg-muted text-muted-foreground' : cls}`}
                          >
                            {label}
                          </button>
                          );
                        })}
                      </div>
                    ) : (
                      <button
                        onClick={() => setPopover(c)}
                        className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[13px] font-medium text-foreground">{c.name}</p>
                            <p className="text-[11px] text-muted-foreground">{c.email}</p>
                          </div>
                          <span className="text-[10px] font-bold uppercase text-muted-foreground/60 capitalize">
                            {c.type}
                          </span>
                        </div>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Compose page ─────────────────────────────────────────────────────────────

interface ComposeContentProps {
  initialRecipients?: { id: number; type: ContactType; name: string; email: string; role?: Role }[];
  draftId?: number;
  initialSubject?: string;
  initialBody?: string;
}

export function ComposeContent({ initialRecipients, draftId, initialSubject = '', initialBody = '' }: ComposeContentProps) {
  const router = useRouter();
  const saveDraft = useSaveVendorMailDraft();
  const updateDraft = useUpdateVendorMailDraft();
  const sendDraft = useSendVendorMailDraft();
  const sendMail  = useSendVendorMail();

  const [selected, setSelected] = useState<SelectedContact[]>(
    (initialRecipients ?? []).map((r) => ({ ...r, role: r.role ?? ('to' as const) }))
  );
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!draftId) return;
    setSelected((initialRecipients ?? []).map((r) => ({ ...r, role: r.role ?? ('to' as const) })));
    setSubject(initialSubject);
    setBody(initialBody);
  }, [draftId, initialSubject, initialBody, initialRecipients]);
  const isPending = saveDraft.isPending || updateDraft.isPending || sendDraft.isPending || sendMail.isPending;

  const handleBodyChange = useCallback(({ html }: { html: string; delta: unknown }) => {
    setBody(html);
  }, []);

  const addContact = (c: MailContact, role: Role) => {
    setSelected((prev) => {
      if (prev.some((s) => s.id === c.id && s.type === c.type)) return prev;
      return [...prev, { ...c, role }];
    });
  };

  const removeContact = (c: SelectedContact) => {
    setSelected((prev) => prev.filter((s) => !(s.id === c.id && s.type === c.type)));
  };

  const buildPayload = () => ({
    subject,
    body,
    recipients: selected.map((s) => ({ id: s.id, type: s.type as ContactType, role: s.role })),
  });

  const validate = () => {
    if (!selected.some((s) => s.role === 'to')) { setError('At least one "To" recipient is required'); return false; }
    if (!subject.trim()) { setError('Subject is required'); return false; }
    if (!body.trim() || body === '<p><br></p>') { setError('Message body is required'); return false; }
    setError('');
    return true;
  };

  const handleSave = async () => {
    if (!subject.trim()) { setError('Subject is required to save draft'); return; }
    setError('');
    if (draftId) await updateDraft.mutateAsync({ id: draftId, payload: buildPayload() });
    else await saveDraft.mutateAsync(buildPayload());
    router.push('/mail');
  };

  const handleSend = async () => {
    if (!validate()) return;
    if (draftId) await sendDraft.mutateAsync({ id: draftId, payload: buildPayload() });
    else await sendMail.mutateAsync(buildPayload());
    router.push('/mail');
  };

  const handleDiscard = () => {
    setSelected([]);
    setSubject('');
    setBody('');
    setError('');
  };

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 pt-4 pb-10 custom-scrollbar">
      <div className="space-y-6 max-w-[1700px] mx-auto">
        <PageHeader title="Compose" subtitle="Draft and send a new message." />

        <div className="flex flex-col lg:flex-row gap-[30px] mb-6 lg:h-[800px] items-stretch">
          <MailSidebar />

          <div className="flex-1 min-w-0 flex flex-col h-full">
          <div className={`${cardClass} bg-card flex-1 flex flex-col mb-0 overflow-hidden`}>

            {/* Header */}
            <div className="p-6 border-b border-border">
              <h2 className="text-foreground text-[14px] font-bold uppercase tracking-wider">{draftId ? 'Edit Draft' : 'Compose New Message'}</h2>
            </div>

            {/* Form */}
            <div className="flex-1 p-6 overflow-y-auto chat-scrollbar">
              <div className="space-y-0">

                {/* Contact Picker (To / CC / BCC) */}
                <ContactPickerPanel
                  selected={selected}
                  onAdd={addContact}
                  onRemove={removeContact}
                />

                {/* SUBJECT */}
                <div className="flex items-center gap-4 border-b border-border py-3">
                  <label className="w-14 text-[12px] font-bold text-muted-foreground uppercase tracking-wider shrink-0">
                    Subject
                  </label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject"
                    className="flex-1 bg-transparent text-[14px] focus:outline-none text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>

                {/* BODY */}
                <div className="pt-4">
                  <QuillEditor
                    value={body}
                    onChange={handleBodyChange}
                    placeholder="Write your message..."
                    height="300px"
                  />
                </div>

                {error && (
                  <p className="text-destructive text-[13px] font-bold pt-3">{error}</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <button className="w-9 h-9 flex items-center justify-center hover:bg-muted rounded-[3px] transition-colors" title="Attach Files">
                  <Paperclip size={18} />
                </button>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-muted rounded-[3px] transition-colors" title="Add Link">
                  <Link size={18} />
                </button>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-muted rounded-[3px] transition-colors" title="Add Image">
                  <ImageIcon size={18} />
                </button>
                <button onClick={handleDiscard} className="w-9 h-9 flex items-center justify-center hover:bg-muted rounded-[3px] transition-colors" title="Discard">
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleDiscard} disabled={isPending} className="px-6 py-2 bg-[#f8f9fa] border border-border text-foreground rounded-[5px] text-[13px] font-bold hover:bg-gray-100 dark:hover:bg-muted transition-colors disabled:opacity-50">
                  Discard
                </button>
                <button onClick={handleSave} disabled={isPending} className="px-6 py-2 bg-primary text-white rounded-[5px] text-[13px] font-bold hover:brightness-110 transition-colors disabled:opacity-50">
                  {saveDraft.isPending ? 'Saving…' : 'Save Draft'}
                </button>
                <button onClick={handleSend} disabled={isPending} className="px-6 py-2 bg-destructive text-white rounded-[5px] text-[13px] font-bold hover:brightness-110 transition-colors disabled:opacity-50">
                  {sendMail.isPending ? 'Sending…' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
