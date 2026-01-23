/**
 * Map/Card Hooks
 * Custom hooks for map-related queries
 * Aligned with backend CardController endpoints
 */

import { useQuery } from '@tanstack/react-query';
import { mapService } from '@/services';
import { queryKeys } from '@/lib/query-keys';

/**
 * Get all maps
 */
export const useMaps = () => {
  return useQuery({
    queryKey: queryKeys.maps.lists(),
    queryFn: mapService.getAll,
  });
};
