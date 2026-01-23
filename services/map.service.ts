/**
 * Map/Card Service
 * Handles all map/card-related API calls
 * Aligned with backend CardController endpoints
 */

import apiClient from '@/lib/api-client';
import type { Map } from '@/types/map.types';
import type { ApiResponse } from '@/types/api.types';

const MAP_ENDPOINTS = {
  BASE: 'cards',
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
};

export default mapService;
