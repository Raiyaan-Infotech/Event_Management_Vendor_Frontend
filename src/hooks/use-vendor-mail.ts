import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ContactType = 'admin' | 'vendor' | 'client';

export interface MailContact {
  id: number;
  name: string;
  email: string;
  type: ContactType;
}

export interface MailContacts {
  admins: MailContact[];
  vendors: MailContact[];
  clients: MailContact[];
}

export interface MailRecipientRow {
  id: number;
  mail_id: number;
  recipient_type: ContactType;
  recipient_id: number;
  role: 'to' | 'cc' | 'bcc';
  is_read: number;
  is_active: number;
  label: string | null;
  custom_folder_id: number | null;
}

// New API mail shape (from backend)
// Sequelize underscored+timestamps returns createdAt/updatedAt (camelCase)
interface MailApiData {
  id: number;
  sender_type: ContactType;
  sender_id: number;
  subject: string;
  body: string;
  status: 'draft' | 'sent' | 'failed';
  sent_at: string | null;
  error_message: string | null;
  sender_is_active?: number;
  sender_label?: string | null;
  sender_custom_folder_id?: number | null;
  createdAt: string;
  updatedAt: string;
  recipients?: MailRecipientRow[];
}

// Legacy flat shape — keeps existing UI components working unchanged
export interface VendorMail {
  id: number;
  to_email: string;
  subject: string;
  body: string;
  folder: 'sent' | 'drafts' | 'inbox';
  status: 'draft' | 'sent' | 'failed';
  is_read: number;
  is_active: number;
  label: string | null;
  custom_folder_id: number | null;
  error_message: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
  recipients?: MailRecipientRow[];
}

export interface MailPayload {
  subject: string;
  body: string;
  recipients: { id: number; type: ContactType; role: 'to' | 'cc' | 'bcc' }[];
}

export interface MailNotification {
  id: number;
  mail_id: number;
  is_read: number;
  created_at: string;
  mail?: {
    id: number;
    subject: string;
    sender_type: string;
    sender_id: number;
    sent_at: string | null;
  };
}

// ─── Keys ────────────────────────────────────────────────────────────────────

const MAIL_KEY  = ['vendor-mails'] as const;
const NOTIF_KEY = ['vendor-mail-notifications'] as const;

const inv = (qc: ReturnType<typeof useQueryClient>, key: readonly string[] = MAIL_KEY) =>
  qc.invalidateQueries({ queryKey: key });

const invalidateMailViews = (qc: ReturnType<typeof useQueryClient>) => {
  inv(qc);
  qc.invalidateQueries({ queryKey: [...MAIL_KEY, 'sent'] });
  qc.invalidateQueries({ queryKey: [...MAIL_KEY, 'drafts'] });
  qc.invalidateQueries({ queryKey: [...MAIL_KEY, 'trash'] });
  qc.invalidateQueries({ queryKey: [...MAIL_KEY, 'inbox'] });
};

const SENDER_LABEL: Record<string, string> = { admin: 'Admin', vendor: 'Vendor', client: 'Client' };

// ─── Internal raw hooks ───────────────────────────────────────────────────────

const useRawSent = () =>
  useQuery({
    queryKey: [...MAIL_KEY, 'sent'],
    queryFn: async () =>
      (await apiClient.get('/mail/sent')).data.data as { count: number; rows: MailApiData[] },
    staleTime: 30_000,
  });

const useRawDrafts = () =>
  useQuery({
    queryKey: [...MAIL_KEY, 'drafts'],
    queryFn: async () =>
      (await apiClient.get('/mail/drafts')).data.data as { count: number; rows: MailApiData[] },
    staleTime: 30_000,
  });

const useRawInbox = (params?: Record<string, string>) =>
  useQuery({
    queryKey: [...MAIL_KEY, 'inbox', params],
    queryFn: async () =>
      (await apiClient.get('/mail', { params })).data.data as {
        total: number;
        rows: (MailRecipientRow & { mail: MailApiData; recipientRow?: MailRecipientRow })[];
      },
    staleTime: 30_000,
  });

const useRawTrash = () =>
  useQuery({
    queryKey: [...MAIL_KEY, 'trash'],
    queryFn: async () =>
      (await apiClient.get('/mail/trash')).data.data as (MailRecipientRow & { mail?: MailApiData })[],
    staleTime: 30_000,
  });

// ─── Flat helpers ─────────────────────────────────────────────────────────────

const flattenSent = (m: MailApiData): VendorMail => ({
  id: m.id,
  to_email: m.recipients?.filter(r => r.role === 'to').length
    ? `${m.recipients!.filter(r => r.role === 'to').length} recipient(s)`
    : 'Sent',
  subject: m.subject,
  body: m.body,
  folder: 'sent',
  status: m.status,
  is_read: 1,
  is_active: m.sender_is_active ?? 1,
  label: m.sender_label ?? null,
  custom_folder_id: m.sender_custom_folder_id ?? null,
  error_message: m.error_message ?? null,
  sent_at: m.sent_at,
  created_at: m.createdAt,
  updated_at: m.updatedAt,
  recipients: m.recipients ?? [],
});

const flattenDraft = (m: MailApiData): VendorMail => ({
  id: m.id,
  to_email: 'Draft',
  subject: m.subject,
  body: m.body,
  folder: 'drafts',
  status: m.status,
  is_read: 1,
  is_active: m.sender_is_active ?? 1,
  label: m.sender_label ?? null,
  custom_folder_id: m.sender_custom_folder_id ?? null,
  error_message: null,
  sent_at: m.sent_at,
  created_at: m.createdAt,
  updated_at: m.updatedAt,
});

const flattenInboxRow = (row: MailRecipientRow & { mail: MailApiData; recipientRow?: MailRecipientRow }): VendorMail => {
  const recipient = row.recipientRow ?? row;
  return {
    id: row.mail.id,
    to_email: `From: ${SENDER_LABEL[row.mail.sender_type] ?? row.mail.sender_type}`,
    subject: row.mail.subject,
    body: row.mail.body,
    folder: 'inbox',
    status: row.mail.status,
    is_read: recipient.is_read,
    is_active: recipient.is_active,
    label: recipient.label,
    custom_folder_id: recipient.custom_folder_id,
    error_message: row.mail.error_message ?? null,
    sent_at: row.mail.sent_at,
    created_at: row.mail.createdAt,
    updated_at: row.mail.updatedAt,
  };
};

const flattenTrashRow = (row: MailRecipientRow & { mail?: MailApiData; owner?: string }): VendorMail => {
  const status = row.mail?.status ?? 'sent';
  const isOwnDraft = row.owner === 'sender' && status === 'draft';
  return {
    id: row.mail?.id ?? row.mail_id,
    to_email: isOwnDraft
      ? 'Draft'
      : row.mail
        ? `From: ${SENDER_LABEL[row.mail.sender_type] ?? row.mail.sender_type}`
        : '',
    subject: row.mail?.subject ?? '',
    body: row.mail?.body ?? '',
    folder: status === 'draft' ? 'drafts' : 'sent',
    status,
    is_read: row.is_read,
    is_active: row.is_active,
    label: row.label,
    custom_folder_id: row.custom_folder_id,
    error_message: null,
    sent_at: row.mail?.sent_at ?? null,
    created_at: row.mail?.createdAt ?? '',
    updated_at: row.mail?.updatedAt ?? '',
  };
};

// ─── Legacy compatibility hooks (used by vendor-mail-content.tsx) ─────────────

/** All sent + draft mails combined in legacy flat format */
export const useVendorMails = () => {
  const sent   = useRawSent();
  const drafts = useRawDrafts();

  const data = useMemo<VendorMail[]>(() => [
    ...(sent.data?.rows ?? []).map(flattenSent),
    ...(drafts.data?.rows ?? []).map(flattenDraft),
  ], [sent.data, drafts.data]);

  return {
    data,
    isLoading: sent.isLoading || drafts.isLoading,
    refetch: () => { sent.refetch(); drafts.refetch(); },
  };
};

/** Inbox mails (sent to this user) in legacy flat format */
export const useVendorInbox = (params?: Record<string, string>) => {
  const inbox = useRawInbox(params);

  const data = useMemo<VendorMail[]>(() =>
    (inbox.data?.rows ?? []).map(flattenInboxRow),
    [inbox.data],
  );

  return { data, isLoading: inbox.isLoading, refetch: inbox.refetch };
};

/** Trash mails in legacy flat format */
export const useVendorMailTrash = () => {
  const trash = useRawTrash();

  const data = useMemo<VendorMail[]>(() =>
    (trash.data ?? []).map(flattenTrashRow),
    [trash.data],
  );

  return { data, isLoading: trash.isLoading, refetch: trash.refetch };
};

// ─── Compose hooks ────────────────────────────────────────────────────────────

export const useMailContacts = () =>
  useQuery({
    queryKey: ['vendor-mail-contacts'],
    queryFn: async () => (await apiClient.get('/mail/contacts')).data.data as MailContacts,
    staleTime: 60_000,
  });

export const useSaveVendorMailDraft = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: MailPayload) =>
      (await apiClient.post('/mail/drafts', p)).data.data as MailApiData,
    onSuccess: () => { inv(qc); toast.success('Draft saved'); },
    onError:   () => toast.error('Failed to save draft'),
  });
};

export const useUpdateVendorMailDraft = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: MailPayload }) =>
      (await apiClient.put(`/mail/drafts/${id}`, payload)).data.data as MailApiData,
    onSuccess: () => { inv(qc); toast.success('Draft updated'); },
    onError:   () => toast.error('Failed to update draft'),
  });
};

export const useSendVendorMailDraft = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: MailPayload }) =>
      (await apiClient.post(`/mail/drafts/${id}/send`, payload)).data.data as MailApiData,
    onSuccess: () => { inv(qc); inv(qc, NOTIF_KEY); toast.success('Draft sent'); },
    onError: (e: unknown) => {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to send draft');
    },
  });
};

export const useVendorMail = (id?: number) =>
  useQuery({
    queryKey: [...MAIL_KEY, 'single', id],
    queryFn: async () => (await apiClient.get(`/mail/${id}`)).data.data as { mail: MailApiData; recipientRow: MailRecipientRow | null },
    enabled: !!id,
  });

export const useSendVendorMail = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: MailPayload) =>
      (await apiClient.post('/mail/send', p)).data.data as MailApiData,
    onSuccess: async () => { await inv(qc); await inv(qc, NOTIF_KEY); toast.success('Mail sent'); },
    onError: (e: unknown) => {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to send mail');
    },
  });
};

// ─── Single ops ───────────────────────────────────────────────────────────────

export const useDeleteVendorMail = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => apiClient.delete(`/mail/${id}`),
    onSuccess: () => { invalidateMailViews(qc); toast.success('Moved to trash'); },
    onError:   () => toast.error('Failed to delete'),
  });
};

export const useToggleMailRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => apiClient.patch(`/mail/${id}/read`),
    onSuccess: () => { inv(qc); qc.invalidateQueries({ queryKey: NOTIF_KEY }); },
  });
};

export const useAssignMailLabel = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, label }: { id: number; label: string | null }) =>
      apiClient.patch(`/mail/${id}/label`, { label }),
    onSuccess: () => inv(qc),
    onError: () => toast.error('Failed to assign label'),
  });
};

// ─── Bulk ops ─────────────────────────────────────────────────────────────────

export const useBulkDeleteVendorMail = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => apiClient.post('/mail/bulk-delete', { ids }),
    onSuccess: () => { invalidateMailViews(qc); toast.success('Moved to trash'); },
    onError:   () => toast.error('Failed to delete'),
  });
};

export const useBulkMarkRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ ids, is_read }: { ids: number[]; is_read: boolean }) =>
      apiClient.post('/mail/bulk-read', { ids, is_read }),
    onSuccess: () => inv(qc),
  });
};

export const useBulkAssignLabel = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ ids, label }: { ids: number[]; label: string | null }) =>
      apiClient.post('/mail/bulk-label', { ids, label }),
    onSuccess: () => inv(qc),
    onError: () => toast.error('Failed to assign labels'),
  });
};

export const useBulkMoveFolder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ ids, folder_id }: { ids: number[]; folder_id: number | null }) =>
      apiClient.post('/mail/bulk-folder', { ids, folder_id }),
    onSuccess: () => { inv(qc); toast.success('Mails moved'); },
    onError: () => toast.error('Failed to move mails'),
  });
};

// ─── Trash actions ────────────────────────────────────────────────────────────

export const useRestoreFromTrash = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => apiClient.patch(`/mail/trash/${id}/restore`),
    onSuccess: () => { invalidateMailViews(qc); toast.success('Restored'); },
    onError:   () => toast.error('Failed to restore'),
  });
};

export const usePermanentDeleteMail = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => apiClient.delete(`/mail/trash/${id}`),
    onSuccess: () => { invalidateMailViews(qc); toast.success('Permanently deleted'); },
    onError:   () => toast.error('Failed to delete'),
  });
};

// ─── Notifications ────────────────────────────────────────────────────────────

export const useVendorMailNotifications = () =>
  useQuery({
    queryKey: NOTIF_KEY,
    queryFn: async () =>
      (await apiClient.get('/mail/notifications')).data.data as {
        unread_count: number;
        notifications: MailNotification[];
      },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

export const useMarkVendorNotificationsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => apiClient.patch('/mail/notifications/read'),
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTIF_KEY }),
  });
};
