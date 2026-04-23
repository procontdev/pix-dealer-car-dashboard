import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";
import type { JobRun, RunLog } from "@/lib/types";

interface MonitoringData {
  runs: JobRun[];
  logs: RunLog[];
}

export function useMonitoring() {
  return useQuery<MonitoringData>({
    queryKey: ["monitoring"],
    queryFn: () => apiClient.getMonitoringData(),
    staleTime: 30 * 1000,
  });
}
