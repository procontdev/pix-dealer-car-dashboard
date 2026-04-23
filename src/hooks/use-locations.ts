import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";
import type { Location } from "@/lib/types";

export function useLocations() {
  return useQuery<Location[]>({
    queryKey: ["locations"],
    queryFn: () => apiClient.getLocations(),
    staleTime: 5 * 60 * 1000,
  });
}
