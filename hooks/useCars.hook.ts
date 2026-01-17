/**
 * Car Hooks
 * Custom hooks for car-related queries
 */

import { useQuery } from '@tanstack/react-query';
import { carService } from '@/services';
import { queryKeys } from '@/lib/query-keys';

/**
 * Get all cars
 */
export const useCars = () => {
  return useQuery({
    queryKey: queryKeys.cars.lists(),
    queryFn: carService.getAll,
  });
};

/**
 * Get car by ID
 */
export const useCar = (id: number | string) => {
  return useQuery({
    queryKey: queryKeys.cars.detail(id),
    queryFn: () => carService.getById(id),
    enabled: !!id,
  });
};

/**
 * Get global car attribution for a race
 */
export const useGlobalCarAttribution = (raceId: number | string) => {
  return useQuery({
    queryKey: queryKeys.cars.attribution.global(raceId),
    queryFn: () => carService.getGlobalAttribution(raceId),
    enabled: !!raceId,
  });
};

/**
 * Get individual car attributions for a race
 */
export const useIndividualCarAttribution = (raceId: number | string, carIds?: string[]) => {
  return useQuery({
    queryKey: queryKeys.cars.attribution.individual(raceId, carIds),
    queryFn: () => carService.getIndividualAttribution(raceId, carIds || []),
    enabled: !!raceId && !!carIds && carIds.length > 0,
  });
};
