import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";
import type { InventoryItem } from "@/lib/types";

export function useInventory() {
  return useQuery<InventoryItem[]>({
    queryKey: ["inventory"],
    queryFn: () => apiClient.getInventory(),
    staleTime: 60 * 1000,
  });
}
