// hooks/use-locations.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export function useLocations() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: () => apiClient.getLocations(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}