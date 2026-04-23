import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";
import type { ColorSpec } from "@/lib/types";

export function useColorSpecs() {
  return useQuery<ColorSpec[]>({
    queryKey: ["color-specs"],
    queryFn: async () => {
      const specs = await apiClient.getColorSpecs();
      console.log('useColorSpecs: received', specs.length, 'specs');
      console.log('useColorSpecs: sample spec:', specs[0]);
      return specs;
    },
    staleTime: 5 * 60 * 1000,
  });
}
