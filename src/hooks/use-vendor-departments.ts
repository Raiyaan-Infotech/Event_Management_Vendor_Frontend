import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export interface VendorDepartment {
  id: number;
  vendor_id: number;
  name: string;
  description: string | null;
  is_active: number;
  created_at: string;
  updated_at?: string;
}

export interface VendorDepartmentsResponse {
  data: VendorDepartment[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const DEPT_KEY = ['vendor-departments'] as const;

export const useVendorDepartments = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: [...DEPT_KEY, params],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/departments', { params });
      return res.data as VendorDepartmentsResponse;
    },
  });
};

export const useVendorDepartment = (id: string | number | undefined) => {
  return useQuery({
    queryKey: [...DEPT_KEY, id],
    queryFn: async () => {
      if (!id) return null;
      const res = await apiClient.get(`/vendors/departments/${id}`);
      return res.data.data.department as VendorDepartment;
    },
    enabled: !!id,
  });
};

export const useCreateVendorDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const res = await apiClient.post('/vendors/departments', data);
      return res.data.data.department as VendorDepartment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPT_KEY });
      toast.success('Department created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create department');
    },
  });
};

export const useUpdateVendorDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number | string; data: Partial<VendorDepartment> }) => {
      const res = await apiClient.put(`/vendors/departments/${id}`, data);
      return res.data.data.department as VendorDepartment;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DEPT_KEY });
      queryClient.invalidateQueries({ queryKey: [...DEPT_KEY, variables.id] });
      toast.success('Department updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update department');
    },
  });
};

export const useDeleteVendorDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number | string) => {
      await apiClient.delete(`/vendors/departments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPT_KEY });
      toast.success('Department deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete department');
    },
  });
};
