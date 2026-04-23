import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";
import type { BaseAsset } from "@/lib/types";

export function useBaseAssets() {
  return useQuery<BaseAsset[]>({
    queryKey: ["base-assets"],
    queryFn: () => apiClient.getBaseAssets(),
    staleTime: 5 * 60 * 1000,
  });
}
