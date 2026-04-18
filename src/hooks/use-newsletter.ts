import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface NewsletterClient {
  id: number;
  name: string;
  email: string;
  plan: 'silver' | 'gold' | 'platinum' | 'standard' | null;
  client_type: 'subscribed' | 'unsubscribed';
  registration_type: 'guest' | 'client';
  is_active: number;
  [key: string]: unknown;
}

const PLAN_LABEL: Record<string, string> = {
  gold:     'Gold Plan',
  silver:   'Silver Plan',
  platinum: 'Platinum Plan',
  standard: 'Standard Plan',
};

export const getPlanLabel = (plan: string | null, registrationType: string): string => {
  if (registrationType === 'guest') return 'Guest';
  if (!plan) return '—';
  return PLAN_LABEL[plan] ?? plan;
};

export const useBulkUpdateByIds = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ids, client_type }: { ids: number[]; client_type: 'subscribed' | 'unsubscribed' }) => {
      const res = await apiClient.patch('/vendors/newsletter/bulk-ids', { ids, client_type });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-subscribers'] });
      queryClient.invalidateQueries({ queryKey: ['newsletter-unsubscribers'] });
    },
  });
};

export const useToggleClientType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.patch(`/vendors/newsletter/${id}/client-type`);
      return res.data.data as NewsletterClient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-subscribers'] });
      queryClient.invalidateQueries({ queryKey: ['newsletter-unsubscribers'] });
    },
  });
};

export const useBulkUpdateClientType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ from, to }: { from: 'subscribed' | 'unsubscribed'; to: 'subscribed' | 'unsubscribed' }) => {
      const res = await apiClient.patch('/vendors/newsletter/bulk', { from, to });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-subscribers'] });
      queryClient.invalidateQueries({ queryKey: ['newsletter-unsubscribers'] });
    },
  });
};

export const useNewsletterSubscribers = () =>
  useQuery({
    queryKey: ['newsletter-subscribers'],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/newsletter/subscribers');
      return res.data.data as NewsletterClient[];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

export const useNewsletterUnsubscribers = () =>
  useQuery({
    queryKey: ['newsletter-unsubscribers'],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/newsletter/unsubscribers');
      return res.data.data as NewsletterClient[];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

export interface MailStatus {
  id: number;
  name: string;
  email: string;
  membership: string;
  template: string;
  status: 'Success' | 'Failed';
  readStatus: 'Read' | 'Unread';
}

export const useNewsletterSentLogs = () =>
  useQuery({
    queryKey: ['newsletter-sent-logs'],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/newsletter/sent-logs');
      return (res.data.data || []).map((log: any) => ({
        id: log.id,
        name: log.name,
        email: log.email,
        membership: log.membership,
        template: log.template,
        status: log.status === 'sent' ? 'Success' : 'Failed',
        readStatus: log.opened_at ? 'Read' : 'Unread',
      })) as MailStatus[];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

export const useSendNewsletter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { userType: string; plans: string[]; categoryId: number; templateId: number }) => {
      const res = await apiClient.post('/vendors/newsletter/send', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-sent-logs'] });
    },
  });
};
