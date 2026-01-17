/**
 * Party Service
 * Handles all party-related API calls
 */

import apiClient from '@/lib/api-client';
import { Party, CreatePartyDto, UpdatePartyDto, ApiResponse } from '@/types';

const PARTY_ENDPOINTS = {
  BASE: '/api/v1/parties',
  BY_ID: (id: number | string) => `/api/v1/parties/${id}`,
  ADD_PARTICIPANTS: (id: number | string) => `/api/v1/parties/${id}/participants`,
  REMOVE_PARTICIPANT: (partyId: number | string, userId: number | string) => 
    `/api/v1/parties/${partyId}/participants/${userId}`,
};

export const partyService = {
  /**
   * Get all parties
   */
  getAll: async (): Promise<Party[]> => {
    const response = await apiClient.get<ApiResponse<Party[]>>(PARTY_ENDPOINTS.BASE);
    return response.data.data;
  },

  /**
   * Get party by ID
   */
  getById: async (id: number | string): Promise<Party> => {
    const response = await apiClient.get<ApiResponse<Party>>(PARTY_ENDPOINTS.BY_ID(id));
    return response.data.data;
  },

  /**
   * Create new party
   */
  create: async (data: CreatePartyDto): Promise<Party> => {
    const response = await apiClient.post<ApiResponse<Party>>(PARTY_ENDPOINTS.BASE, data);
    return response.data.data;
  },

  /**
   * Update party
   */
  update: async (id: number | string, data: UpdatePartyDto): Promise<Party> => {
    const response = await apiClient.put<ApiResponse<Party>>(PARTY_ENDPOINTS.BY_ID(id), data);
    return response.data.data;
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
    const response = await apiClient.post<ApiResponse<Party>>(
      PARTY_ENDPOINTS.ADD_PARTICIPANTS(partyId),
      { userIds }
    );
    return response.data.data;
  },

  /**
   * Remove participant from party
   */
  removeParticipant: async (partyId: number | string, userId: number | string): Promise<void> => {
    await apiClient.delete(PARTY_ENDPOINTS.REMOVE_PARTICIPANT(partyId, userId));
  },
};

export default partyService;
