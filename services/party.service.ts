/**
 * Party Service
 * Handles all party-related API calls
 * Aligned with backend PartyController endpoints
 */

import apiClient from '@/lib/api-client';
import type { Party } from '@/types/party.types';
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
  JOIN: (partyId: number | string) => `parties/${partyId}/join`,
  LEAVE: (partyId: number | string) => `parties/${partyId}/leave`,
  ASSIGN_MANAGER: (partyId: number | string, userId: number | string) => 
    `parties/${partyId}/managers/${userId}`,
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
   * Join a party (current user joins)
   */
  join: async (partyId: number | string): Promise<Party> => {
    const response = await apiClient
      .post(PARTY_ENDPOINTS.JOIN(partyId))
      .json<ApiResponse<Party>>();
    return response.data;
  },

  /**
   * Leave a party (current user leaves)
   */
  leave: async (partyId: number | string): Promise<Party> => {
    const response = await apiClient
      .post(PARTY_ENDPOINTS.LEAVE(partyId))
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
};

export default partyService;
