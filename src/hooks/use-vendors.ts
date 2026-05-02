import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

const VENDOR_ME_KEY = ['vendor-me'] as const;

export interface Vendor {
  id: number;
  company_name: string;
  company_logo: string | null;
  country_id: number | null;
  state_id: number | null;
  city_id: number | null;
  pincode_id: number | null;
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
  twitter: string | null;
  linkedin: string | null;
  whatsapp: string | null;
  tiktok: string | null;
  telegram: string | null;
  pinterest: string | null;
  name: string;
  profile: string | null;
  address: string | null;
  alt_address: string | null;
  contact: string | null;
  alt_contact: string | null;
  alt_email: string | null;
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
  about_us: string | null;
  short_description: string | null;
  poweredby: string | null;
  copywrite: string | null;
  theme_id: number | null;
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

export interface SocialVisibility {
  website?: boolean;
  youtube?: boolean;
  facebook?: boolean;
  instagram?: boolean;
  twitter?: boolean;
  linkedin?: boolean;
  whatsapp?: boolean;
  tiktok?: boolean;
  telegram?: boolean;
  pinterest?: boolean;
}

export interface FooterLinkColumn {
  heading: string;
  page_ids: number[];
}

export interface NavMenuChild {
  page_id: number;
  label: string;
  order: number;
}

export interface NavMenuItem {
  label: string;
  type?: "home" | "about" | "contact" | "pages"; // fixed nav item types
  page_ids: number[];
  order: number;
  children: NavMenuChild[];
}

export interface VendorAbout extends Vendor {
  district?: { id: number; name: string } | null;
  locality?: { id: number; name: string; pincode: string } | null;
  social_visibility?: SocialVisibility | null;
  footer_links?: FooterLinkColumn[] | null;
  nav_menu?: NavMenuItem[] | null;
  contact_mode?: 'default' | 'alternative' | null;
}

const VENDOR_ABOUT_KEY = ['vendor-about'] as const;

export const useVendorAbout = () => {
  return useQuery({
    queryKey: VENDOR_ABOUT_KEY,
    queryFn: async () => {
      const res = await apiClient.get('/vendors/auth/about');
      return res.data.data as VendorAbout;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateVendorAbout = (successMessage?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<VendorAbout>) => {
      const res = await apiClient.put('/vendors/auth/about', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_ABOUT_KEY });
      toast.success(successMessage ?? 'About company updated successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update');
    },
  });
};

export interface VendorActivityLog {
  id: number;
  action: string;
  module: string;
  description: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface VendorActivityResponse {
  data: VendorActivityLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useVendorActivityLog = (params?: {
  page?: number;
  limit?: number;
  module?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['vendor-activity', params],
    queryFn: async () => {
      const res = await apiClient.get('/vendors/auth/activity', { params });
      return res.data.data as VendorActivityResponse;
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
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
