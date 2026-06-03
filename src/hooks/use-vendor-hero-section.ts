import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface VendorHeroSection {
  id?: number;
  vendor_id?: number;
  company_id?: number | null;
  title?: string | null;
  heading?: string | null;
  description?: string | null;
  button?: string | null;
  button2?: string | null;
  image_url?: string | null;
  bg_image_url?: string | null;
  page_id?: number | null;
  page_id2?: number | null;
  variant?: string | null;
  stat1_val?: string | null;
  stat1_lbl?: string | null;
  stat1_sub?: string | null;
  stat2_val?: string | null;
  stat2_lbl?: string | null;
  stat2_sub?: string | null;
  stat3_val?: string | null;
  stat3_lbl?: string | null;
  stat3_sub?: string | null;
  is_active?: number;
}

export type VendorHeroSectionInput = Omit<VendorHeroSection, 'id' | 'vendor_id' | 'company_id'>;

const HERO_SECTION_KEY = ['vendor-hero-section'] as const;

export const useVendorHeroSection = () =>
  useQuery({
    queryKey: HERO_SECTION_KEY,
    queryFn: async () => {
      const res = await apiClient.get('/vendors/hero-section');
      return (res.data.data || null) as VendorHeroSection | null;
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

export const useSaveVendorHeroSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VendorHeroSectionInput) => {
      const res = await apiClient.put('/vendors/hero-section', data);
      return res.data.data as VendorHeroSection;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HERO_SECTION_KEY });
      queryClient.invalidateQueries({ queryKey: ['vendor-preview-data'] });
      queryClient.invalidateQueries({ queryKey: ['public-vendor'] });
    },
  });
};
