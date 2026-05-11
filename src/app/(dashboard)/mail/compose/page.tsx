'use client';

import { useSearchParams } from 'next/navigation';
import { ComposeContent } from './_components/compose-content';
import { useMailContacts, useVendorMail } from '@/hooks/use-vendor-mail';
import type { ContactType } from '@/hooks/use-vendor-mail';

export default function ComposePage() {
  const params = useSearchParams();
  const count  = Number(params.get('count') ?? 0);
  const draftId = params.get('draftId') ? Number(params.get('draftId')) : undefined;
  const { data: draftData } = useVendorMail(draftId);
  const { data: contacts } = useMailContacts();

  const initialRecipients = count > 0
    ? Array.from({ length: count }, (_, i) => {
        const id   = params.get(`r${i}_id`);
        const type = params.get(`r${i}_type`) as ContactType | null;
        const name = params.get(`r${i}_name`) ?? '';
        if (!id || !type) return null;
        return { id: Number(id), type, name, email: '' };
      }).filter(Boolean) as { id: number; type: ContactType; name: string; email: string }[]
    : [];

  const contactList = [
    ...(contacts?.admins ?? []),
    ...(contacts?.vendors ?? []),
    ...(contacts?.clients ?? []),
  ];
  const draftRecipients = draftData?.mail.recipients
    ?.map((r) => {
      const contact = contactList.find((c) => c.id === r.recipient_id && c.type === r.recipient_type);
      return contact ? { ...contact, role: r.role } : null;
    })
    .filter(Boolean) as { id: number; type: ContactType; name: string; email: string; role: 'to' | 'cc' | 'bcc' }[] | undefined;

  return (
    <ComposeContent
      draftId={draftId}
      initialRecipients={draftRecipients ?? initialRecipients}
      initialSubject={draftData?.mail.subject ?? ''}
      initialBody={draftData?.mail.body ?? ''}
    />
  );
}
