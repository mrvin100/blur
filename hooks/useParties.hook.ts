/**
 * Party Hooks
 * Custom hooks for party-related queries and mutations
 * Aligned with backend PartyController endpoints
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { partyService } from '@/services';
import { queryKeys } from '@/lib/query-keys';
import type { Party, PartyMemberInfo, AddPartyMemberDto, UpdatePartyMemberRoleDto, PartyRole } from '@/types/party.types';
import type { PartyActiveStatus } from '@/types/party-active.types';
import type { PartyMember } from '@/types/party-member.types';
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
 * Get party active/actionable status
 */
export const usePartyActiveStatus = (id: number | string) => {
  return useQuery<PartyActiveStatus, Error>({
    queryKey: [...queryKeys.parties.detail(id), 'active-status'],
    queryFn: () => partyService.getActiveStatus(id),
    enabled: !!id,
    staleTime: 30_000,
  });
};

export const usePartyMembers = (id: number | string) => {
  return useQuery<PartyMember[], Error>({
    queryKey: [...queryKeys.parties.detail(id), 'members'],
    queryFn: () => partyService.getMembers(id),
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

// ==================== PARTY MEMBER MANAGEMENT HOOKS ====================

/**
 * Get party members with their roles
 */
export const usePartyMembersWithRoles = (partyId: number | string) => {
  return useQuery<PartyMemberInfo[], Error>({
    queryKey: [...queryKeys.parties.detail(partyId), 'members-roles'],
    queryFn: () => partyService.getMembersWithRoles(partyId),
    enabled: !!partyId,
  });
};

/**
 * Check if current user can manage the party
 */
export const useCanManageParty = (partyId: number | string) => {
  return useQuery<boolean, Error>({
    queryKey: [...queryKeys.parties.detail(partyId), 'can-manage'],
    queryFn: () => partyService.canManage(partyId),
    enabled: !!partyId,
  });
};

/**
 * Get current user's role in the party
 */
export const useMyPartyRole = (partyId: number | string) => {
  return useQuery<PartyRole | 'NOT_MEMBER', Error>({
    queryKey: [...queryKeys.parties.detail(partyId), 'my-role'],
    queryFn: () => partyService.getMyRole(partyId),
    enabled: !!partyId,
  });
};

/**
 * Add member to party mutation
 */
export const useAddPartyMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ partyId, dto }: { partyId: number | string; dto: AddPartyMemberDto }) =>
      partyService.addMember(partyId, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parties.detail(variables.partyId) });
      toast.success('Membre ajouté avec succès');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

/**
 * Update member role mutation
 */
export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ partyId, userId, dto }: { partyId: number | string; userId: number | string; dto: UpdatePartyMemberRoleDto }) =>
      partyService.updateMemberRole(partyId, userId, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parties.detail(variables.partyId) });
      toast.success('Rôle mis à jour avec succès');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

/**
 * Remove member from party mutation
 */
export const useRemovePartyMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ partyId, userId }: { partyId: number | string; userId: number | string }) =>
      partyService.removeMember(partyId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parties.detail(variables.partyId) });
      toast.success('Membre retiré avec succès');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

/**
 * Promote member to co-host mutation
 */
export const usePromoteToCoHost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ partyId, userId }: { partyId: number | string; userId: number | string }) =>
      partyService.promoteToCoHost(partyId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parties.detail(variables.partyId) });
      toast.success('Membre promu co-hôte avec succès');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

/**
 * Demote co-host to participant mutation
 */
export const useDemoteCoHost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ partyId, userId }: { partyId: number | string; userId: number | string }) =>
      partyService.demoteCoHost(partyId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parties.detail(variables.partyId) });
      toast.success('Co-hôte rétrogradé avec succès');
    },
    onError: (error: Error) => handleApiError(error),
  });
};

/**
 * Transfer party ownership mutation
 */
export const useTransferOwnership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ partyId, newHostId }: { partyId: number | string; newHostId: number | string }) =>
      partyService.transferOwnership(partyId, newHostId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parties.detail(variables.partyId) });
      toast.success('Propriété transférée avec succès');
    },
    onError: (error: Error) => handleApiError(error),
  });
};
