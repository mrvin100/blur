/**
 * Party Service
 * Handles all party-related API calls
 */

import apiClient from '@/lib/api-client';
import type { Party, CreatePartyDto, UpdatePartyDto } from '@/types/party.types';
import type { ApiResponse } from '@/types/api.types';

const PARTY_ENDPOINTS = {
  BASE: 'parties',
  BY_ID: (id: number | string) => `parties/${id}`,
  ADD_PARTICIPANTS: (id: number | string) => `parties/${id}/participants`,
  REMOVE_PARTICIPANT: (partyId: number | string, userId: number | string) => 
    `parties/${partyId}/participants/${userId}`,
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
   * Create new party
   */
  create: async (data: CreatePartyDto): Promise<Party> => {
    const response = await apiClient
      .post(PARTY_ENDPOINTS.BASE, { json: data })
      .json<ApiResponse<Party>>();
    return response.data;
  },

  /**
   * Update party
   */
  update: async (id: number | string, data: UpdatePartyDto): Promise<Party> => {
    const response = await apiClient
      .put(PARTY_ENDPOINTS.BY_ID(id), { json: data })
      .json<ApiResponse<Party>>();
    return response.data;
  },

  /**
   * Delete party
   */
  delete: async (id: number | string): Promise<void> => {
    await apiClient.delete(PARTY_ENDPOINTS.BY_ID(id));
  },

  /**
   * Add participants to party
   */
  addParticipants: async (partyId: number | string, userIds: number[]): Promise<Party> => {
    const response = await apiClient
      .post(PARTY_ENDPOINTS.ADD_PARTICIPANTS(partyId), {
        json: { userIds },
      })
      .json<ApiResponse<Party>>();
    return response.data;
  },

  /**
   * Remove participant from party
   */
  removeParticipant: async (partyId: number | string, userId: number | string): Promise<void> => {
    await apiClient.delete(PARTY_ENDPOINTS.REMOVE_PARTICIPANT(partyId, userId));
  },
};

export default partyService;
