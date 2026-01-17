/**
 * Race Service
 * Handles all race-related API calls
 */

import apiClient from '@/lib/api-client';
import { Race, CreateRaceDto, UpdateRaceDto, ApiResponse } from '@/types';

const RACE_ENDPOINTS = {
  BASE: '/api/v1/races',
  BY_ID: (id: number | string) => `/api/v1/races/${id}`,
  BY_PARTY: (partyId: number | string) => `/api/v1/races/party/${partyId}`,
  START: (id: number | string) => `/api/v1/races/${id}/start`,
  COMPLETE: (id: number | string) => `/api/v1/races/${id}/complete`,
  CURRENT: (partyId: number | string) => `/api/v1/races/party/${partyId}/current`,
};

export const raceService = {
  /**
   * Get all races
   */
  getAll: async (): Promise<Race[]> => {
    const response = await apiClient.get<ApiResponse<Race[]>>(RACE_ENDPOINTS.BASE);
    return response.data.data;
  },

  /**
   * Get race by ID
   */
  getById: async (id: number | string): Promise<Race> => {
    const response = await apiClient.get<ApiResponse<Race>>(RACE_ENDPOINTS.BY_ID(id));
    return response.data.data;
  },

  /**
   * Get races by party ID
   */
  getByPartyId: async (partyId: number | string): Promise<Race[]> => {
    const response = await apiClient.get<ApiResponse<Race[]>>(RACE_ENDPOINTS.BY_PARTY(partyId));
    return response.data.data;
  },

  /**
   * Get current race for a party
   */
  getCurrentRace: async (partyId: number | string): Promise<Race | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Race>>(RACE_ENDPOINTS.CURRENT(partyId));
      return response.data.data;
    } catch (error: any) {
      // Return null if no current race exists (404)
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Create new race
   */
  create: async (data: CreateRaceDto): Promise<Race> => {
    const response = await apiClient.post<ApiResponse<Race>>(RACE_ENDPOINTS.BASE, data);
    return response.data.data;
  },

  /**
   * Update race
   */
  update: async (id: number | string, data: UpdateRaceDto): Promise<Race> => {
    const response = await apiClient.put<ApiResponse<Race>>(RACE_ENDPOINTS.BY_ID(id), data);
    return response.data.data;
  },

  /**
   * Start a race
   */
  start: async (id: number | string): Promise<Race> => {
    const response = await apiClient.post<ApiResponse<Race>>(RACE_ENDPOINTS.START(id));
    return response.data.data;
  },

  /**
   * Complete a race
   */
  complete: async (id: number | string): Promise<Race> => {
    const response = await apiClient.post<ApiResponse<Race>>(RACE_ENDPOINTS.COMPLETE(id));
    return response.data.data;
  },

  /**
   * Delete race
   */
  delete: async (id: number | string): Promise<void> => {
    await apiClient.delete(RACE_ENDPOINTS.BY_ID(id));
  },
};

export default raceService;
