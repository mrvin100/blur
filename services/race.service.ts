/**
 * Race Service
 * Handles all race-related API calls
 */

import apiClient from '@/lib/api-client';
import type { Race, CreateRaceDto, UpdateRaceDto } from '@/types/party.types';
import type { ApiResponse } from '@/types/api.types';

const RACE_ENDPOINTS = {
  BASE: 'races',
  BY_ID: (id: number | string) => `races/${id}`,
  BY_PARTY: (partyId: number | string) => `races/party/${partyId}`,
  START: (id: number | string) => `races/${id}/start`,
  COMPLETE: (id: number | string) => `races/${id}/complete`,
  CURRENT: (partyId: number | string) => `races/party/${partyId}/current`,
};

export const raceService = {
  /**
   * Get all races
   */
  getAll: async (): Promise<Race[]> => {
    const response = await apiClient
      .get(RACE_ENDPOINTS.BASE)
      .json<ApiResponse<Race[]>>();
    return response.data;
  },

  /**
   * Get race by ID
   */
  getById: async (id: number | string): Promise<Race> => {
    const response = await apiClient
      .get(RACE_ENDPOINTS.BY_ID(id))
      .json<ApiResponse<Race>>();
    return response.data;
  },

  /**
   * Get races by party ID
   */
  getByPartyId: async (partyId: number | string): Promise<Race[]> => {
    const response = await apiClient
      .get(RACE_ENDPOINTS.BY_PARTY(partyId))
      .json<ApiResponse<Race[]>>();
    return response.data;
  },

  /**
   * Get current race for a party
   */
  getCurrentRace: async (partyId: number | string): Promise<Race | null> => {
    try {
      const response = await apiClient
        .get(RACE_ENDPOINTS.CURRENT(partyId))
        .json<ApiResponse<Race>>();
      return response.data;
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
    const response = await apiClient
      .post(RACE_ENDPOINTS.BASE, { json: data })
      .json<ApiResponse<Race>>();
    return response.data;
  },

  /**
   * Update race
   */
  update: async (id: number | string, data: UpdateRaceDto): Promise<Race> => {
    const response = await apiClient
      .put(RACE_ENDPOINTS.BY_ID(id), { json: data })
      .json<ApiResponse<Race>>();
    return response.data;
  },

  /**
   * Start a race
   */
  start: async (id: number | string): Promise<Race> => {
    const response = await apiClient
      .post(RACE_ENDPOINTS.START(id))
      .json<ApiResponse<Race>>();
    return response.data;
  },

  /**
   * Complete a race
   */
  complete: async (id: number | string): Promise<Race> => {
    const response = await apiClient
      .post(RACE_ENDPOINTS.COMPLETE(id))
      .json<ApiResponse<Race>>();
    return response.data;
  },

  /**
   * Delete race
   */
  delete: async (id: number | string): Promise<void> => {
    await apiClient.delete(RACE_ENDPOINTS.BY_ID(id));
  },
};

export default raceService;
