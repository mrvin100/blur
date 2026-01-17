/**
 * Map/Card Hooks
 * Custom hooks for map-related queries
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

/**
 * Get map by ID
 */
export const useMap = (id: number | string) => {
  return useQuery({
    queryKey: queryKeys.maps.detail(id),
    queryFn: () => mapService.getById(id),
    enabled: !!id,
  });
};

/**
 * Get random map for a race
 */
export const useRandomMap = (raceId: number | string) => {
  return useQuery({
    queryKey: queryKeys.maps.random(raceId),
    queryFn: () => mapService.getRandom(raceId),
    enabled: !!raceId,
  });
};
