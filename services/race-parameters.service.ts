/**
 * Race Parameters Service
 * Handles all race parameters-related API calls
 */

import apiClient from '@/lib/api-client';
import type {
  RaceParameter,
  CreateRaceParameterDto,
  UpdateRaceParameterDto,
} from '@/types/raceParameters.types';
import type { ApiResponse } from '@/types/api.types';

const RACE_PARAMS_ENDPOINTS = {
  BASE: 'api/v1/raceParameters',
  BY_ID: (id: number | string) => `api/v1/raceParameters/${id}`,
  ACTIVE: 'api/v1/raceParameters/active',
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

  /**
   * Get active race parameters
   */
  getActive: async (): Promise<RaceParameter[]> => {
    const response = await apiClient
      .get(RACE_PARAMS_ENDPOINTS.ACTIVE)
      .json<ApiResponse<RaceParameter[]>>();
    return response.data;
  },

  /**
   * Create new race parameter
   */
  create: async (data: CreateRaceParameterDto): Promise<RaceParameter> => {
    const response = await apiClient
      .post(RACE_PARAMS_ENDPOINTS.BASE, { json: data })
      .json<ApiResponse<RaceParameter>>();
    return response.data;
  },

  /**
   * Update race parameter
   */
  update: async (id: number | string, data: UpdateRaceParameterDto): Promise<RaceParameter> => {
    const response = await apiClient
      .put(RACE_PARAMS_ENDPOINTS.BY_ID(id), { json: data })
      .json<ApiResponse<RaceParameter>>();
    return response.data;
  },

  /**
   * Delete race parameter
   */
  delete: async (id: number | string): Promise<void> => {
    await apiClient.delete(RACE_PARAMS_ENDPOINTS.BY_ID(id));
  },
};

export default raceParametersService;
