import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";
import type { VehicleColorAsset } from "@/lib/types";

export function useVehicleColorAssets() {
  return useQuery<VehicleColorAsset[]>({
    queryKey: ["vehicle-color-assets"],
    queryFn: () => apiClient.getVehicleColorAssets(),
    staleTime: 5 * 60 * 1000,
  });
}
