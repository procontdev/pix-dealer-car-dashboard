import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";
import type { CompositionAsset } from "@/lib/types";

export function useCompositions() {
  return useQuery<CompositionAsset[]>({
    queryKey: ["compositions"],
    queryFn: () => apiClient.getCompositions(),
    staleTime: 60 * 1000,
  });
}
