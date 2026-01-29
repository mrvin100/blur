/**
 * Race Hooks
 * Custom hooks for race-related queries and mutations
 * Aligned with backend RaceController endpoints
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { raceService, type CreateRaceParams } from '@/services';
import { queryKeys } from '@/lib/query-keys';
import type { Race } from '@/types/party.types';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api-error-handler';

/**
 * Get total races count
 */
export const useRaceCount = () => {
  return useQuery({
    queryKey: [...queryKeys.races.lists(), 'count'],
    queryFn: raceService.getCount,
    staleTime: 60_000,
  });
};

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
 * Get races by status
 */
export const useRacesByStatus = (status: string) => {
  return useQuery({
    queryKey: [...queryKeys.races.lists(), 'status', status],
    queryFn: () => raceService.getByStatus(status),
    enabled: !!status,
  });
};

/**
 * Create race mutation
 */
export const useCreateRace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateRaceParams) => raceService.create(params),
    onSuccess: (race) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.races.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.races.byParty(race.party?.id || '') });
      // Optional success toast, keep it minimal
      toast.success('Course créée');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

/**
 * Add participant to race mutation
 */
export const useAddParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ raceId, userId }: { raceId: number | string; userId: number | string }) =>
      raceService.addParticipant(raceId, userId),
    onSuccess: (race, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.races.detail(variables.raceId) });
      if (race.party?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.races.byParty(race.party.id) });
      }
      toast.success('Participant ajouté avec succès');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

/**
 * Remove participant from race mutation
 */
export const useRemoveParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ raceId, userId }: { raceId: number | string; userId: number | string }) =>
      raceService.removeParticipant(raceId, userId),
    onSuccess: (race, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.races.detail(variables.raceId) });
      if (race.party?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.races.byParty(race.party.id) });
      }
      toast.success('Participant retiré avec succès');
    },
    onError: (error: Error) => handleApiError(error),
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
        queryClient.invalidateQueries({ queryKey: queryKeys.races.byParty(race.party.id) });
      }
      toast.success('Course démarrée avec succès');
    },
    onError: (error: Error) => handleApiError(error),
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
        queryClient.invalidateQueries({ queryKey: queryKeys.races.byParty(race.party.id) });
      }
      toast.success('Course terminée avec succès');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

/**
 * Cancel race mutation
 */
export const useCancelRace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => raceService.cancel(id),
    onSuccess: (race, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.races.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.races.detail(id) });
      if (race.party?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.races.byParty(race.party.id) });
      }
      toast.success('Course annulée avec succès');
    },
    onError: (error: Error) => handleApiError(error),
  });
};
