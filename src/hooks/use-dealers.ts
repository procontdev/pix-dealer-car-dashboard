import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";
import type { Dealer } from "@/lib/types";

export function useDealers() {
  return useQuery<Dealer[]>({
    queryKey: ["dealers"],
    queryFn: () => apiClient.getDealers(),
    staleTime: 5 * 60 * 1000,
  });
}
