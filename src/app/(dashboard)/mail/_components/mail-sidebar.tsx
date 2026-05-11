'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Inbox, Bookmark, Send, Edit, Mail, Users, Trash2, Folder, Plus, X, Pencil,
} from 'lucide-react';
import {
  useVendorMails,
  useVendorInbox,
  useVendorMailTrash,
  useMailContacts,
} from '@/hooks/use-vendor-mail';
import {
  useVendorMailFolders,
  useCreateVendorMailFolder,
  useUpdateVendorMailFolder,
  useDeleteVendorMailFolder,
} from '@/hooks/use-vendor-mail-folders';

export interface MailSidebarProps {
  activeFolder?: string;
  onFolderChange?: (folder: string) => void;
}

export function MailSidebar({ activeFolder = 'inbox', onFolderChange }: MailSidebarProps) {
  const router = useRouter();
  const { data: mails = [] }   = useVendorMails();
  const { data: inboxMails = [] } = useVendorInbox();
  const { data: trashData = [] }  = useVendorMailTrash();
  const { data: contactsData }    = useMailContacts();
  const { data: folders = [] }    = useVendorMailFolders();

  const createFolder = useCreateVendorMailFolder();
  const updateFolder = useUpdateVendorMailFolder();
  const deleteFolder = useDeleteVendorMailFolder();

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const contactCount =
    (contactsData?.admins.length ?? 0) +
    (contactsData?.vendors.length ?? 0) +
    (contactsData?.clients.length ?? 0);

  const counts = {
    inbox:    inboxMails.length,
    sent:     mails.filter((m) => m.folder === 'sent').length,
    drafts:   mails.filter((m) => m.folder === 'drafts').length,
    all:      inboxMails.length + mails.length,
    contacts: contactCount,
    trash:    trashData.length,
  };

  const setFolder = (key: string) => {
    if (onFolderChange) {
      onFolderChange(key);
    } else {
      router.push('/mail');
    }
  };

  const itemCls = (key: string) =>
    `w-full flex items-center justify-between px-3 py-[7px] rounded-[3px] transition-all text-[13px] font-medium ${
      activeFolder === key
        ? 'text-primary bg-muted font-bold'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`;

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await createFolder.mutateAsync(newName.trim());
    setNewName('');
    setShowCreate(false);
  };

  const handleEditSave = async (id: number) => {
    if (!editName.trim()) return;
    await updateFolder.mutateAsync({ id, data: { name: editName.trim() } });
    setEditingId(null);
    setEditName('');
  };

  const handleDelete = async (id: number) => {
    await deleteFolder.mutateAsync(id);
    if (activeFolder === `folder-${id}`) setFolder('inbox');
  };

  const activeFolders = folders.filter((f) => f.is_active === 1);
  const canCreate = activeFolders.length < 10;

  return (
    <div className="w-full lg:w-[260px] xl:w-[280px] shrink-0 flex flex-col">
      <div className="bg-card rounded-[5px] border border-border shadow-sm dark:shadow-none p-6 h-full overflow-y-auto custom-scrollbar">

        <Link href="/mail/compose">
          <button className="w-full bg-primary text-white py-2.5 rounded-[5px] text-[13px] font-bold tracking-wider hover:bg-primary/90 transition-all mb-6 shadow-sm">
            COMPOSE
          </button>
        </Link>

        {/* Main nav */}
        <ul className="space-y-0.5 mb-6">
          {([
            { key: 'inbox',     icon: Inbox,    label: 'Inbox',     count: counts.inbox },
            { key: 'important', icon: Bookmark,  label: 'Important', count: null },
            { key: 'sent',      icon: Send,      label: 'Send Mail', count: counts.sent },
            { key: 'drafts',    icon: Edit,      label: 'Draft',     count: counts.drafts },
            { key: 'all',       icon: Mail,      label: 'All Mails', count: counts.all },
            { key: 'contacts',  icon: Users,     label: 'Contacts',  count: counts.contacts },
            { key: 'trash',     icon: Trash2,    label: 'Trash',     count: counts.trash },
          ] as const).map(({ key, icon: Icon, label, count }) => (
            <li key={key}>
              <button
                className={itemCls(key)}
                onClick={() => key === 'contacts' ? router.push('/mail/contacts') : setFolder(key)}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} /> {label}
                </div>
                {count != null && count > 0 && <span className="text-[12px]">{count}</span>}
              </button>
            </li>
          ))}
        </ul>

        {/* LABEL */}
        <div className="mb-6">
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-2 px-3">LABEL</p>
          <ul className="space-y-0.5">
            {([
              { key: 'label-social',     label: 'Social',     color: 'text-primary' },
              { key: 'label-promotions', label: 'Promotions', color: 'text-green-500' },
              { key: 'label-updates',    label: 'Updates',    color: 'text-sky-500' },
            ] as const).map(({ key, label, color }) => (
              <li key={key}>
                <button className={itemCls(key)} onClick={() => setFolder(key)}>
                  <div className="flex items-center gap-3">
                    <Folder size={16} className={color} /> {label}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* MY FOLDER */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">MY FOLDER</p>
            {canCreate && (
              <button
                onClick={() => setShowCreate(true)}
                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                title="Create folder"
              >
                <Plus size={13} />
              </button>
            )}
          </div>

          {showCreate && (
            <div className="mb-2 px-1">
              <div className="flex items-center gap-1.5 bg-muted rounded-[4px] px-2 py-1.5">
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreate();
                    if (e.key === 'Escape') { setShowCreate(false); setNewName(''); }
                  }}
                  placeholder="Folder name..."
                  maxLength={30}
                  className="flex-1 bg-transparent text-[13px] outline-none text-foreground placeholder:text-muted-foreground/60"
                />
                <button
                  onClick={handleCreate}
                  disabled={createFolder.isPending}
                  className="text-primary text-[12px] font-bold hover:opacity-80 disabled:opacity-50"
                >
                  Add
                </button>
                <button onClick={() => { setShowCreate(false); setNewName(''); }}>
                  <X size={13} className="text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            </div>
          )}

          <ul className="space-y-0.5">
            {activeFolders.map((folder) => (
              <li key={folder.id} className="group">
                {editingId === folder.id ? (
                  <div className="flex items-center gap-1.5 bg-muted rounded-[4px] px-2 py-1.5 mx-1">
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave(folder.id);
                        if (e.key === 'Escape') { setEditingId(null); setEditName(''); }
                      }}
                      maxLength={30}
                      className="flex-1 bg-transparent text-[13px] outline-none text-foreground"
                    />
                    <button
                      onClick={() => handleEditSave(folder.id)}
                      disabled={updateFolder.isPending}
                      className="text-primary text-[12px] font-bold hover:opacity-80 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button onClick={() => { setEditingId(null); setEditName(''); }}>
                      <X size={13} className="text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                ) : (
                  <div className={`flex items-center justify-between rounded-[3px] transition-all ${activeFolder === `folder-${folder.id}` ? 'bg-muted' : 'hover:bg-muted'}`}>
                    <button
                      className={`flex-1 flex items-center gap-3 px-3 py-[7px] text-[13px] font-medium text-left ${activeFolder === `folder-${folder.id}` ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                      onClick={() => setFolder(`folder-${folder.id}`)}
                    >
                      <Folder size={16} className="text-amber-500 shrink-0" />
                      <span className="truncate flex-1">{folder.name}</span>
                    </button>
                    <div className="flex items-center gap-0.5 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingId(folder.id); setEditName(folder.name); }}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-border text-muted-foreground hover:text-foreground"
                        title="Rename"
                      >
                        <Pencil size={11} />
                      </button>
                      <button
                        onClick={() => handleDelete(folder.id)}
                        disabled={deleteFolder.isPending}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        title="Delete folder"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
