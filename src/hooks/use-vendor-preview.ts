import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { VendorHeroSection } from '@/hooks/use-vendor-hero-section';

export interface PortfolioItem {
  id: number;
  image_path: string | null;
  label: string | null;
  value: string | null;
  sort_order: number;
  is_active: 1 | 0;
}

export interface SocialLink {
  id: number;
  vendor_id: number;
  icon: string;
  icon_color: string;
  label: string;
  url: string;
  is_active: 1 | 0;
  sort_order: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface VendorPreviewData {
  vendor: {
    id: number;
    company_name: string;
    company_logo: string | null;
    short_description: string | null;
    about_us: string | null;
    company_information: string | null;
    company_contact: string | null;
    company_email: string | null;
    company_address: string | null;
    contact_mode?: 'default' | 'alternative' | null;
    contact?: string | null;
    alt_contact?: string | null;
    alt_email?: string | null;
    address?: string | null;
    alt_address?: string | null;
    copywrite: string | null;
    poweredby: string | null;
    locality: { id: number; name: string } | null;
    district: { id: number; name: string } | null;
    city?: string | { id: number; name: string } | null;
    city_id?: number | null;
    pincode_id?: number | null;
  };
  theme_id: number | null;
  home_blocks: { block_type: string; is_visible: boolean }[];
  heroSection?: VendorHeroSection | null;
  colors: {
    primary_color: string | null;
    secondary_color: string | null;
    header_color: string | null;
    footer_color: string | null;
    text_color: string | null;
    hover_color: string | null;
  } | null;
  gallery: {
    id: number;
    images: string[];
    event_name?: string;
    city?: string;
    is_active: 1 | 0;
  }[];
  testimonials: {
    id: number;
    customer_name: string;
    customer_portrait: string | null;
    client_feedback: string;
    event_name?: string;
    is_active: 1 | 0;
  }[];
  socialLinks: SocialLink[];
  pages: Array<{ id: number; name: string; description?: string | null; content?: string | null; is_active?: number }>;
  terms_content?: string | null;
  privacy_content?: string | null;
  portfolio: {
    clients: PortfolioItem[];
    sponsors: PortfolioItem[];
    events: PortfolioItem[];
  };
}

export const useVendorPreviewData = (vendorId?: number | null, themeId?: number | null) =>
  useQuery({
    queryKey: ['vendor-preview-data', vendorId ?? 'me', themeId ?? 'active'],
    queryFn: async () => {
      const url = vendorId
        ? `/vendors/${vendorId}/preview-data`
        : '/vendors/auth/preview-data';
      const params: Record<string, string | number> = { _t: Date.now() };
      if (themeId) params.theme_id = themeId;
      const res = await apiClient.get(url, {
        params,
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
      return res.data.data as VendorPreviewData;
    },
    staleTime: 0,
    refetchOnMount: 'always',
  });
