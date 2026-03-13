import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

const VENDOR_ME_KEY = ['vendor-me'] as const;

export interface Vendor {
  id: number;
  company_name: string;
  reg_no: string | null;
  gst_no: string | null;
  company_address: string | null;
  company_contact: string | null;
  landline: string | null;
  company_email: string | null;
  website: string | null;
  youtube: string | null;
  facebook: string | null;
  instagram: string | null;
  name: string;
  profile: string | null;
  address: string | null;
  contact: string | null;
  email: string;
  membership: 'basic' | 'silver' | 'gold' | 'platinum';
  bank_name: string | null;
  acc_no: string | null;
  ifsc_code: string | null;
  acc_type: 'savings' | 'current' | 'overdraft' | null;
  branch: string | null;
  bank_logo: string | null;
  status: 'active' | 'inactive';
  company_id: number | null;
  created_at: string;
}

// Get current logged-in vendor profile
export const useVendorMe = () => {
  return useQuery({
    queryKey: VENDOR_ME_KEY,
    queryFn: async () => {
      const res = await apiClient.get('/vendors/auth/me');
      return res.data.data as Vendor;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Vendor logout
export const useVendorLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/vendors/auth/logout');
    },
    onSuccess: () => {
      queryClient.clear();
      if (typeof window !== 'undefined') {
        document.cookie = 'vendor_auth_pending=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
      }
      toast.success('Logged out successfully');
      router.push('/login');
    },
    onError: () => {
      queryClient.clear();
      if (typeof window !== 'undefined') {
        document.cookie = 'vendor_auth_pending=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
      }
      router.push('/login');
    },
  });
};

// Update vendor profile
export const useUpdateVendorProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Vendor>) => {
      const res = await apiClient.put('/vendors/auth/profile', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_ME_KEY });
      toast.success('Profile updated successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update profile');
    },
  });
};

// Change vendor password
export const useChangeVendorPassword = () => {
  return useMutation({
    mutationFn: async (data: { current_password: string; new_password: string }) => {
      const res = await apiClient.post('/vendors/auth/change-password', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to change password');
    },
  });
};
