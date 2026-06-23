import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface VendorSubscriber {
  id: number;
  vendor_id: number;
  company_id: number | null;
  email: string;
  is_active: 0 | 1;
  created_at: string;
  updated_at?: string;
}

export interface VendorSubscriberResponse {
  data: VendorSubscriber[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const SUBSCRIBERS_KEY = ['vendor-subscribers'] as const;

export const useVendorSubscribers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: number | string;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}) => {
  return useQuery({
    queryKey: [...SUBSCRIBERS_KEY, params],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/subscribers', { params });
      return res.data.data as VendorSubscriberResponse;
    },
  });
};

export const useCreateVendorSubscriber = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { email: string; is_active?: number }) => {
      const res = await apiClient.post('/vendors/subscribers', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIBERS_KEY });
      toast.success('Subscriber added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add subscriber');
    },
  });
};

export const useUpdateVendorSubscriber = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { email?: string; is_active?: number } }) => {
      const res = await apiClient.put(`/vendors/subscribers/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIBERS_KEY });
      toast.success('Subscriber updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update subscriber');
    },
  });
};

export const useDeleteVendorSubscriber = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/vendors/subscribers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIBERS_KEY });
      toast.success('Subscriber deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete subscriber');
    },
  });
};
