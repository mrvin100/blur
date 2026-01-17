/**
 * Race Hooks
 * Custom hooks for race-related queries and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { raceService } from '@/services';
import { queryKeys } from '@/lib/query-keys';
import { Race, CreateRaceDto, UpdateRaceDto } from '@/types';
import { toast } from 'sonner';

/**
 * Get all races
 */
export const useRaces = () => {
  return useQuery({
    queryKey: queryKeys.races.lists(),
    queryFn: raceService.getAll,
  });
};

/**
 * Get race by ID
 */
export const useRace = (id: number | string) => {
  return useQuery({
    queryKey: queryKeys.races.detail(id),
    queryFn: () => raceService.getById(id),
    enabled: !!id,
  });
};

/**
 * Get races by party ID
 */
export const useRacesByParty = (partyId: number | string) => {
  return useQuery({
    queryKey: queryKeys.races.byParty(partyId),
    queryFn: () => raceService.getByPartyId(partyId),
    enabled: !!partyId,
  });
};

/**
 * Get current race for a party
 */
export const useCurrentRace = (partyId: number | string) => {
  return useQuery({
    queryKey: queryKeys.races.current(partyId),
    queryFn: () => raceService.getCurrentRace(partyId),
    enabled: !!partyId,
  });
};

/**
 * Create race mutation
 */
export const useCreateRace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRaceDto) => raceService.create(data),
    onSuccess: (race) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.races.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.races.byParty(race.party?.id || '') });
      toast.success('Race created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create race');
    },
  });
};

/**
 * Update race mutation
 */
export const useUpdateRace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateRaceDto }) =>
      raceService.update(id, data),
    onSuccess: (race, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.races.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.races.detail(variables.id) });
      if (race.party?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.races.byParty(race.party.id) });
      }
      toast.success('Race updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update race');
    },
  });
};

/**
 * Start race mutation
 */
export const useStartRace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => raceService.start(id),
    onSuccess: (race, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.races.detail(id) });
      if (race.party?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.races.current(race.party.id) });
      }
      toast.success('Race started successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to start race');
    },
  });
};

/**
 * Complete race mutation
 */
export const useCompleteRace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => raceService.complete(id),
    onSuccess: (race, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.races.detail(id) });
      if (race.party?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.races.current(race.party.id) });
        queryClient.invalidateQueries({ queryKey: queryKeys.races.byParty(race.party.id) });
      }
      toast.success('Race completed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to complete race');
    },
  });
};

/**
 * Delete race mutation
 */
export const useDeleteRace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => raceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.races.lists() });
      toast.success('Race deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete race');
    },
  });
};
