import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";
import type { NormalizedBaseAsset } from "@/lib/types";

export function useNormalizedBaseAssets() {
  return useQuery<NormalizedBaseAsset[]>({
    queryKey: ["normalized-base-assets"],
    queryFn: () => apiClient.getNormalizedBaseAssets(),
    staleTime: 60 * 1000,
  });
}
