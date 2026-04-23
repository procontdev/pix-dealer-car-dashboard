// hooks/use-base-assets.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export function useBaseAssets() {
  return useQuery({
    queryKey: ['base-assets'],
    queryFn: () => apiClient.getBaseAssets(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}