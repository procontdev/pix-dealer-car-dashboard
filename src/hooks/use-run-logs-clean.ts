// hooks/use-run-logs.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export function useRunLogs() {
  return useQuery({
    queryKey: ['run-logs'],
    queryFn: () => apiClient.getRunLogs(),
    staleTime: 30 * 1000, // 30 seconds - more frequent for monitoring
  });
}