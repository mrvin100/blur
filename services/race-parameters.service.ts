/**
 * Race Parameters Service
 * Handles all race parameters-related API calls
 */

import apiClient from '@/lib/api-client';
import { RaceParameter, CreateRaceParameterDto, UpdateRaceParameterDto, ApiResponse } from '@/types';

const RACE_PARAMS_ENDPOINTS = {
  BASE: '/api/v1/raceParameters',
  BY_ID: (id: number | string) => `/api/v1/raceParameters/${id}`,
  ACTIVE: '/api/v1/raceParameters/active',
};

export const raceParametersService = {
  /**
   * Get all race parameters
   */
  getAll: async (): Promise<RaceParameter[]> => {
    const response = await apiClient.get<ApiResponse<RaceParameter[]>>(RACE_PARAMS_ENDPOINTS.BASE);
    return response.data.data;
  },

  /**
   * Get race parameter by ID
   */
  getById: async (id: number | string): Promise<RaceParameter> => {
    const response = await apiClient.get<ApiResponse<RaceParameter>>(
      RACE_PARAMS_ENDPOINTS.BY_ID(id)
    );
    return response.data.data;
  },

  /**
   * Get active race parameters
   */
  getActive: async (): Promise<RaceParameter[]> => {
    const response = await apiClient.get<ApiResponse<RaceParameter[]>>(
      RACE_PARAMS_ENDPOINTS.ACTIVE
    );
    return response.data.data;
  },

  /**
   * Create new race parameter
   */
  create: async (data: CreateRaceParameterDto): Promise<RaceParameter> => {
    const response = await apiClient.post<ApiResponse<RaceParameter>>(
      RACE_PARAMS_ENDPOINTS.BASE,
      data
    );
    return response.data.data;
  },

  /**
   * Update race parameter
   */
  update: async (id: number | string, data: UpdateRaceParameterDto): Promise<RaceParameter> => {
    const response = await apiClient.put<ApiResponse<RaceParameter>>(
      RACE_PARAMS_ENDPOINTS.BY_ID(id),
      data
    );
    return response.data.data;
  },

  /**
   * Delete race parameter
   */
  delete: async (id: number | string): Promise<void> => {
    await apiClient.delete(RACE_PARAMS_ENDPOINTS.BY_ID(id));
  },
};

export default raceParametersService;
