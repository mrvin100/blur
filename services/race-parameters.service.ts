/**
 * Race Parameters Service
 * Handles all race parameters-related API calls
 * Aligned with backend RaceParametersController endpoints
 */

import apiClient from '@/lib/api-client';
import type { RaceParameter } from '@/types/raceParameters.types';
import type { ApiResponse } from '@/types/api.types';

const RACE_PARAMS_ENDPOINTS = {
  BASE: 'raceParameters',
  BY_ID: (id: number | string) => `raceParameters/${id}`,
};

export const raceParametersService = {
  /**
   * Get all race parameters
   */
  getAll: async (): Promise<RaceParameter[]> => {
    const response = await apiClient
      .get(RACE_PARAMS_ENDPOINTS.BASE)
      .json<ApiResponse<RaceParameter[]>>();
    return response.data;
  },

  /**
   * Get race parameter by ID
   */
  getById: async (id: number | string): Promise<RaceParameter> => {
    const response = await apiClient
      .get(RACE_PARAMS_ENDPOINTS.BY_ID(id))
      .json<ApiResponse<RaceParameter>>();
    return response.data;
  },
};

export default raceParametersService;
