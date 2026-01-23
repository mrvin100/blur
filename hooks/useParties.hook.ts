/**
 * Party Hooks
 * Custom hooks for party-related queries and mutations
 * Aligned with backend PartyController endpoints
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { partyService } from '@/services';
import { queryKeys } from '@/lib/query-keys';
import type { Party } from '@/types/party.types';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api-error-handler';

/**
 * Get all parties
 */
export const useParties = () => {
  return useQuery<Party[], Error>({
    queryKey: queryKeys.parties.lists(),
    queryFn: partyService.getAll,
  });
};

/**
 * Get party by ID
 */
export const useParty = (id: number | string) => {
  return useQuery<Party, Error>({
    queryKey: queryKeys.parties.detail(id),
    queryFn: () => partyService.getById(id),
    enabled: !!id,
  });
};

/**
 * Get today's party (creates one if it doesn't exist)
 */
export const useTodayParty = () => {
  return useQuery<Party, Error>({
    queryKey: [...queryKeys.parties.lists(), 'today'],
    queryFn: partyService.getTodayParty,
  });
};

/**
 * Get party by date
 */
export const usePartyByDate = (date: string) => {
  return useQuery<Party, Error>({
    queryKey: [...queryKeys.parties.lists(), 'date', date],
    queryFn: () => partyService.getByDate(date),
    enabled: !!date,
  });
};

/**
 * Join party mutation
 */
export const useJoinParty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (partyId: number | string) => partyService.join(partyId),
    onSuccess: (_, partyId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parties.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.parties.detail(partyId) });
      toast.success('Vous avez rejoint la partie');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

/**
 * Leave party mutation
 */
export const useLeaveParty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (partyId: number | string) => partyService.leave(partyId),
    onSuccess: (_, partyId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parties.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.parties.detail(partyId) });
      toast.success('Vous avez quitté la partie');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

/**
 * Assign manager to party mutation
 */
export const useAssignManager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ partyId, userId }: { partyId: number | string; userId: number | string }) =>
      partyService.assignManager(partyId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parties.detail(variables.partyId) });
      toast.success('Manager assigné avec succès');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

/**
 * Remove manager from party mutation
 */
export const useRemoveManager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ partyId, userId }: { partyId: number | string; userId: number | string }) =>
      partyService.removeManager(partyId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parties.detail(variables.partyId) });
      toast.success('Manager retiré avec succès');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

/**
 * Deactivate party mutation
 */
export const useDeactivateParty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => partyService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parties.lists() });
      toast.success('Partie désactivée avec succès');
    },
    onError: (error: Error) => handleApiError(error),
  });
};
