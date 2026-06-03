import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { BlockCatalogEntry } from '@/types/home-blocks';

export function useUiBlocks() {
  return useQuery({
    queryKey: ['ui-blocks'],
    queryFn: async (): Promise<BlockCatalogEntry[]> => {
      const { data } = await apiClient.get('/vendors/ui-blocks');
      // Map variants array of strings to objects with id and label
      return data.data.map((block: any) => ({
        ...block,
        variants: Array.isArray(block.variants) 
          ? block.variants.map((variant: string | { key?: string; id?: string; label?: string }, index: number) => ({
              id: typeof variant === 'string' ? `variant_${index + 1}` : variant.key || variant.id || `variant_${index + 1}`,
              label: typeof variant === 'string' ? variant : variant.label || variant.key || `Variant ${index + 1}`,
            }))
          : []
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}
