import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";
import type { JobRun } from "@/lib/types";

export function useJobRuns() {
  return useQuery<JobRun[]>({
    queryKey: ["job-runs"],
    queryFn: () => apiClient.getJobRuns(),
    staleTime: 30 * 1000,
  });
}
