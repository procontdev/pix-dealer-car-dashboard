import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";
import type { VideoJob } from "@/lib/types";

export function useVideoJobs() {
  return useQuery<VideoJob[]>({
    queryKey: ["video-jobs"],
    queryFn: () => apiClient.getVideoJobs(),
    staleTime: 60 * 1000,
  });
}
