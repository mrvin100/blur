/**
 * Race Parameters Hooks
 * Custom hooks for race parameters queries and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { raceParametersService } from '@/services';
import { queryKeys } from '@/lib/query-keys';
import type {
  RaceParameter,
  CreateRaceParameterDto,
  UpdateRaceParameterDto,
} from '@/types/raceParameters.types';
import { toast } from 'sonner';

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

/**
 * Get active race parameters
 */
export const useActiveRaceParameters = () => {
  return useQuery({
    queryKey: queryKeys.raceParameters.active(),
    queryFn: raceParametersService.getActive,
  });
};

/**
 * Create race parameter mutation
 */
export const useCreateRaceParameter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRaceParameterDto) => raceParametersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.raceParameters.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.raceParameters.active() });
      toast.success('Race parameter created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create race parameter');
    },
  });
};

/**
 * Update race parameter mutation
 */
export const useUpdateRaceParameter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateRaceParameterDto }) =>
      raceParametersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.raceParameters.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.raceParameters.active() });
      toast.success('Race parameter updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update race parameter');
    },
  });
};

/**
 * Delete race parameter mutation
 */
export const useDeleteRaceParameter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => raceParametersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.raceParameters.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.raceParameters.active() });
      toast.success('Race parameter deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete race parameter');
    },
  });
};
