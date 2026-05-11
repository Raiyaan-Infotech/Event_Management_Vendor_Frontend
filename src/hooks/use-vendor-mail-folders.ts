import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export interface VendorMailFolder {
  id: number;
  name: string;
  is_active: number;
}

const KEY = ['vendor-mail-folders'] as const;

export const useVendorMailFolders = () =>
  useQuery({
    queryKey: KEY,
    queryFn: async () =>
      (await apiClient.get('/mail/folders')).data.data as VendorMailFolder[],
    staleTime: 60_000,
  });

export const useCreateVendorMailFolder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) =>
      (await apiClient.post('/mail/folders', { name })).data.data as VendorMailFolder,
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('Folder created'); },
    onError: (e: unknown) => {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to create folder');
    },
  });
};

export const useUpdateVendorMailFolder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { name?: string; is_active?: number } }) =>
      (await apiClient.put(`/mail/folders/${id}`, data)).data.data as VendorMailFolder,
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('Folder updated'); },
    onError: () => toast.error('Failed to update folder'),
  });
};

export const useDeleteVendorMailFolder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => apiClient.delete(`/mail/folders/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success('Folder deleted'); },
    onError: () => toast.error('Failed to delete folder'),
  });
};

export const useMoveMailToFolder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ mailId, folderId }: { mailId: number; folderId: number | null }) =>
      apiClient.patch(`/mail/${mailId}/folder`, { folder_id: folderId }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vendor-mails'] }); toast.success('Moved'); },
    onError: () => toast.error('Failed to move mail'),
  });
};
