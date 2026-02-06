/**
 * Race Service
 * Handles all race-related API calls
 * Aligned with backend RaceController endpoints
 */

import apiClient from '@/lib/api-client';
import type { Race } from '@/types/party.types';
import type { RaceCount } from '@/types/race-count.types';
import type { ApiResponse } from '@/types/api.types';

const RACE_ENDPOINTS = {
  BASE: 'races',
  COUNT: 'races/count',
  BY_ID: (id: number | string) => `races/${id}`,
  BY_PARTY: (partyId: number | string) => `races/party/${partyId}`,
  BY_STATUS: (status: string) => `races/status/${status}`,
  START: (id: number | string) => `races/${id}/start`,
  COMPLETE: (id: number | string) => `races/${id}/complete`,
  CANCEL: (id: number | string) => `races/${id}/cancel`,
  CHANGE_CARD: (id: number | string) => `races/${id}/change-card`,
  ASSIGN_CARS: (id: number | string) => `races/${id}/assign-cars`,
  ADD_PARTICIPANT: (raceId: number | string, userId: number | string) => 
    `races/${raceId}/participants/${userId}`,
};

export interface CreateRaceParams {
  partyId: number | string;
  attributionType?: 'PER_USER' | 'ALL_USERS';
}

export const raceService = {
  /**
   * Get total races count
   */
  getCount: async (): Promise<RaceCount> => {
    const response = await apiClient.get(RACE_ENDPOINTS.COUNT).json<ApiResponse<RaceCount>>();
    return response.data;
  },

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
   * Get races by status
   */
  getByStatus: async (status: string): Promise<Race[]> => {
    const response = await apiClient
      .get(RACE_ENDPOINTS.BY_STATUS(status))
      .json<ApiResponse<Race[]>>();
    return response.data;
  },

  /**
   * Create new race (backend expects query parameters)
   */
  create: async (params: CreateRaceParams): Promise<Race> => {
    const searchParams = new URLSearchParams();
    searchParams.set('partyId', String(params.partyId));
    if (params.attributionType) {
      searchParams.set('attributionType', params.attributionType);
    }
    
    const response = await apiClient
      .post(`${RACE_ENDPOINTS.BASE}?${searchParams.toString()}`)
      .json<ApiResponse<Race>>();
    return response.data;
  },

  /**
   * Add participant to race
   */
  addParticipant: async (raceId: number | string, userId: number | string): Promise<Race> => {
    const response = await apiClient
      .post(RACE_ENDPOINTS.ADD_PARTICIPANT(raceId, userId))
      .json<ApiResponse<Race>>();
    return response.data;
  },

  /**
   * Remove participant from race
   */
  removeParticipant: async (raceId: number | string, userId: number | string): Promise<Race> => {
    const response = await apiClient
      .delete(RACE_ENDPOINTS.ADD_PARTICIPANT(raceId, userId))
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
   * Cancel a race
   */
  cancel: async (id: number | string): Promise<Race> => {
    const response = await apiClient
      .post(RACE_ENDPOINTS.CANCEL(id))
      .json<ApiResponse<Race>>();
    return response.data;
  },

  /**
   * Change card/map for a race
   */
  changeCard: async (id: number | string): Promise<Race> => {
    const response = await apiClient
      .post(RACE_ENDPOINTS.CHANGE_CARD(id))
      .json<ApiResponse<Race>>();
    return response.data;
  },

  /**
   * Assign cars to participants
   */
  assignCars: async (id: number | string): Promise<Race> => {
    const response = await apiClient
      .post(RACE_ENDPOINTS.ASSIGN_CARS(id))
      .json<ApiResponse<Race>>();
    return response.data;
  },
};

export default raceService;
