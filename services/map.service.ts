/**
 * Map/Card Service
 * Handles all map/card-related API calls
 */

import apiClient from '@/lib/api-client';
import type { Map } from '@/types/map.types';
import type { ApiResponse } from '@/types/api.types';

const MAP_ENDPOINTS = {
  BASE: 'cards',
  BY_ID: (id: number | string) => `cards/${id}`,
  RANDOM: (raceId: number | string) => `cards/random/${raceId}`,
};

export const mapService = {
  /**
   * Get all maps/cards
   */
  getAll: async (): Promise<Map[]> => {
    const response = await apiClient
      .get(MAP_ENDPOINTS.BASE)
      .json<ApiResponse<Map[]>>();
    return response.data;
  },

  /**
   * Get map/card by ID
   */
  getById: async (id: number | string): Promise<Map> => {
    const response = await apiClient
      .get(MAP_ENDPOINTS.BY_ID(id))
      .json<ApiResponse<Map>>();
    return response.data;
  },

  /**
   * Get random map for a race
   */
  getRandom: async (raceId: number | string): Promise<Map> => {
    const response = await apiClient
      .get(MAP_ENDPOINTS.RANDOM(raceId))
      .json<ApiResponse<Map>>();
    return response.data;
  },
};

export default mapService;
