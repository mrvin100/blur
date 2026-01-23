/**
 * Car Hooks
 * Custom hooks for car-related queries
 * Aligned with backend CarController endpoints
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
