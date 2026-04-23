import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";
import type { RunLog } from "@/lib/types";

export function useRunLogs() {
  return useQuery<RunLog[]>({
    queryKey: ["run-logs"],
    queryFn: () => apiClient.getRunLogs(),
    staleTime: 30 * 1000,
  });
}
