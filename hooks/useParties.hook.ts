/**
 * Party Hooks
 * Custom hooks for party-related queries and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { partyService } from '@/services';
import { queryKeys } from '@/lib/query-keys';
import type { Party, CreatePartyDto, UpdatePartyDto } from '@/types/party.types';
import { toast } from 'sonner';

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
 * Create party mutation
 */
export const useCreateParty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePartyDto) => partyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parties.lists() });
      toast.success('Party created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create party');
    },
  });
};

/**
 * Update party mutation
 */
export const useUpdateParty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdatePartyDto }) =>
      partyService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parties.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.parties.detail(variables.id) });
      toast.success('Party updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update party');
    },
  });
};

/**
 * Delete party mutation
 */
export const useDeleteParty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => partyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parties.lists() });
      toast.success('Party deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete party');
    },
  });
};

/**
 * Add participants to party mutation
 */
export const useAddParticipants = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ partyId, userIds }: { partyId: number | string; userIds: number[] }) =>
      partyService.addParticipants(partyId, userIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parties.detail(variables.partyId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.parties.participants(variables.partyId) });
      toast.success('Participants added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add participants');
    },
  });
};

/**
 * Remove participant from party mutation
 */
export const useRemoveParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ partyId, userId }: { partyId: number | string; userId: number | string }) =>
      partyService.removeParticipant(partyId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parties.detail(variables.partyId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.parties.participants(variables.partyId) });
      toast.success('Participant removed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove participant');
    },
  });
};
