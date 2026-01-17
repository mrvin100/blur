/**
 * Map/Card Service
 * Handles all map/card-related API calls
 */

import apiClient from '@/lib/api-client';
import { Map, ApiResponse } from '@/types';

const MAP_ENDPOINTS = {
  BASE: '/api/v1/cards',
  BY_ID: (id: number | string) => `/api/v1/cards/${id}`,
  RANDOM: (raceId: number | string) => `/api/v1/cards/random/${raceId}`,
};

export const mapService = {
  /**
   * Get all maps/cards
   */
  getAll: async (): Promise<Map[]> => {
    const response = await apiClient.get<ApiResponse<Map[]>>(MAP_ENDPOINTS.BASE);
    return response.data.data;
  },

  /**
   * Get map/card by ID
   */
  getById: async (id: number | string): Promise<Map> => {
    const response = await apiClient.get<ApiResponse<Map>>(MAP_ENDPOINTS.BY_ID(id));
    return response.data.data;
  },

  /**
   * Get random map for a race
   */
  getRandom: async (raceId: number | string): Promise<Map> => {
    const response = await apiClient.get<ApiResponse<Map>>(MAP_ENDPOINTS.RANDOM(raceId));
    return response.data.data;
  },
};

export default mapService;
