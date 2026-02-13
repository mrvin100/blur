/**
 * Party Service
 * Handles all party-related API calls
 * Aligned with backend PartyController endpoints
 */

import apiClient from '@/lib/api-client';
import type { 
  Party, 
  PartyMemberInfo, 
  AddPartyMemberDto, 
  UpdatePartyMemberRoleDto,
  CanManageResponse,
  MyRoleResponse,
  PartyRole
} from '@/types/party.types';
import type { PartyActiveStatus } from '@/types/party-active.types';
import type { PartyMember } from '@/types/party-member.types';
import type { ApiResponse } from '@/types/api.types';

const PARTY_ENDPOINTS = {
  BASE: 'parties',
  TODAY: 'parties/today',
  BY_ID: (id: number | string) => `parties/${id}`,
  BY_DATE: (date: string) => `parties/date/${date}`,
  ACTIVE_STATUS: (id: number | string) => `parties/${id}/active`,
  MEMBERS: (id: number | string) => `parties/${id}/members`,
  MEMBERS_WITH_ROLES: (id: number | string) => `parties/${id}/members/roles`,
  MEMBER_ROLE: (partyId: number | string, userId: number | string) => 
    `parties/${partyId}/members/${userId}/role`,
  REMOVE_MEMBER: (partyId: number | string, userId: number | string) => 
    `parties/${partyId}/members/${userId}`,
  ASSIGN_MANAGER: (partyId: number | string, userId: number | string) => 
    `parties/${partyId}/managers/${userId}`,
  CO_HOSTS: (partyId: number | string, userId: number | string) => 
    `parties/${partyId}/co-hosts/${userId}`,
  TRANSFER_OWNERSHIP: (partyId: number | string, newHostId: number | string) => 
    `parties/${partyId}/transfer-ownership/${newHostId}`,
  CAN_MANAGE: (id: number | string) => `parties/${id}/can-manage`,
  MY_ROLE: (id: number | string) => `parties/${id}/my-role`,
};

export const partyService = {
  /**
   * Get all parties
   */
  getAll: async (): Promise<Party[]> => {
    const response = await apiClient
      .get(PARTY_ENDPOINTS.BASE)
      .json<ApiResponse<Party[]>>();
    return response.data;
  },

  /**
   * Get party by ID
   */
  getById: async (id: number | string): Promise<Party> => {
    const response = await apiClient
      .get(PARTY_ENDPOINTS.BY_ID(id))
      .json<ApiResponse<Party>>();
    return response.data;
  },

  /**
   * Get party active/actionable status
   * Backend: GET /parties/{id}/active
   */
  getActiveStatus: async (id: number | string): Promise<PartyActiveStatus> => {
    const response = await apiClient
      .get(PARTY_ENDPOINTS.ACTIVE_STATUS(id))
      .json<ApiResponse<PartyActiveStatus>>();
    return response.data;
  },

  /**
   * Get party members
   * Backend: GET /parties/{id}/members
   */
  getMembers: async (id: number | string): Promise<PartyMember[]> => {
    const response = await apiClient
      .get(PARTY_ENDPOINTS.MEMBERS(id))
      .json<ApiResponse<PartyMember[]>>();
    return response.data;
  },

  /**
   * Get today's party or create one if it doesn't exist
   */
  getTodayParty: async (): Promise<Party> => {
    const response = await apiClient
      .get(PARTY_ENDPOINTS.TODAY)
      .json<ApiResponse<Party>>();
    return response.data;
  },

  /**
   * Get party by date (format: YYYY-MM-DD)
   */
  getByDate: async (date: string): Promise<Party> => {
    const response = await apiClient
      .get(PARTY_ENDPOINTS.BY_DATE(date))
      .json<ApiResponse<Party>>();
    return response.data;
  },

  /**
   * Assign a manager to a party
   */
  assignManager: async (partyId: number | string, userId: number | string): Promise<Party> => {
    const response = await apiClient
      .post(PARTY_ENDPOINTS.ASSIGN_MANAGER(partyId, userId))
      .json<ApiResponse<Party>>();
    return response.data;
  },

  /**
   * Remove a manager from a party
   */
  removeManager: async (partyId: number | string, userId: number | string): Promise<Party> => {
    const response = await apiClient
      .delete(PARTY_ENDPOINTS.ASSIGN_MANAGER(partyId, userId))
      .json<ApiResponse<Party>>();
    return response.data;
  },

  /**
   * Deactivate a party (soft delete)
   */
  deactivate: async (id: number | string): Promise<void> => {
    await apiClient.delete(PARTY_ENDPOINTS.BY_ID(id));
  },

  // ==================== PARTY MEMBER MANAGEMENT ====================

  /**
   * Get all party members with their roles
   */
  getMembersWithRoles: async (partyId: number | string): Promise<PartyMemberInfo[]> => {
    const response = await apiClient
      .get(PARTY_ENDPOINTS.MEMBERS_WITH_ROLES(partyId))
      .json<ApiResponse<PartyMemberInfo[]>>();
    return response.data;
  },

  /**
   * Add a new member to the party
   */
  addMember: async (partyId: number | string, dto: AddPartyMemberDto): Promise<PartyMemberInfo> => {
    const response = await apiClient
      .post(PARTY_ENDPOINTS.MEMBERS(partyId), { json: dto })
      .json<ApiResponse<PartyMemberInfo>>();
    return response.data;
  },

  /**
   * Update a member's role
   */
  updateMemberRole: async (
    partyId: number | string, 
    userId: number | string, 
    dto: UpdatePartyMemberRoleDto
  ): Promise<PartyMemberInfo> => {
    const response = await apiClient
      .patch(PARTY_ENDPOINTS.MEMBER_ROLE(partyId, userId), { json: dto })
      .json<ApiResponse<PartyMemberInfo>>();
    return response.data;
  },

  /**
   * Remove a member from the party
   */
  removeMember: async (partyId: number | string, userId: number | string): Promise<void> => {
    await apiClient.delete(PARTY_ENDPOINTS.REMOVE_MEMBER(partyId, userId));
  },

  /**
   * Promote a member to co-host
   */
  promoteToCoHost: async (partyId: number | string, userId: number | string): Promise<Party> => {
    const response = await apiClient
      .post(PARTY_ENDPOINTS.CO_HOSTS(partyId, userId))
      .json<ApiResponse<Party>>();
    return response.data;
  },

  /**
   * Demote a co-host to participant
   */
  demoteCoHost: async (partyId: number | string, userId: number | string): Promise<Party> => {
    const response = await apiClient
      .delete(PARTY_ENDPOINTS.CO_HOSTS(partyId, userId))
      .json<ApiResponse<Party>>();
    return response.data;
  },

  /**
   * Transfer party ownership to another member
   */
  transferOwnership: async (partyId: number | string, newHostId: number | string): Promise<PartyMemberInfo> => {
    const response = await apiClient
      .post(PARTY_ENDPOINTS.TRANSFER_OWNERSHIP(partyId, newHostId))
      .json<ApiResponse<PartyMemberInfo>>();
    return response.data;
  },

  /**
   * Check if current user can manage the party
   */
  canManage: async (partyId: number | string): Promise<boolean> => {
    const response = await apiClient
      .get(PARTY_ENDPOINTS.CAN_MANAGE(partyId))
      .json<ApiResponse<CanManageResponse>>();
    return response.data.canManage;
  },

  /**
   * Get current user's role in the party
   */
  getMyRole: async (partyId: number | string): Promise<PartyRole | 'NOT_MEMBER'> => {
    const response = await apiClient
      .get(PARTY_ENDPOINTS.MY_ROLE(partyId))
      .json<ApiResponse<MyRoleResponse>>();
    return response.data.role;
  },
};

export default partyService;
