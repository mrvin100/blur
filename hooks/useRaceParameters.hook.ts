/**
 * Race Parameters Hooks
 * Custom hooks for race parameters queries
 * Aligned with backend RaceParametersController endpoints
 */

import { useQuery } from '@tanstack/react-query';
import { raceParametersService } from '@/services';
import { queryKeys } from '@/lib/query-keys';

/**
 * Get all race parameters
 */
export const useRaceParameters = () => {
  return useQuery({
    queryKey: queryKeys.raceParameters.lists(),
    queryFn: raceParametersService.getAll,
  });
};

/**
 * Get race parameter by ID
 */
export const useRaceParameter = (id: number | string) => {
  return useQuery({
    queryKey: queryKeys.raceParameters.list({ id }),
    queryFn: () => raceParametersService.getById(id),
    enabled: !!id,
  });
};
