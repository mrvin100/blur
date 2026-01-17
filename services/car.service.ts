/**
 * Car Service
 * Handles all car-related API calls
 */

import apiClient from '@/lib/api-client';
import { Car, CarAttribution, ApiResponse } from '@/types';

const CAR_ENDPOINTS = {
  BASE: '/api/v1/cars',
  BY_ID: (id: number | string) => `/api/v1/cars/${id}`,
  GLOBAL_ATTRIBUTION: (raceId: number | string) => `/api/v1/cars/global-attribution/${raceId}`,
  INDIVIDUAL_ATTRIBUTION: (raceId: number | string) => `/api/v1/cars/individual-attribution/${raceId}`,
};

export const carService = {
  /**
   * Get all cars
   */
  getAll: async (): Promise<Car[]> => {
    const response = await apiClient.get<ApiResponse<Car[]>>(CAR_ENDPOINTS.BASE);
    return response.data.data;
  },

  /**
   * Get car by ID
   */
  getById: async (id: number | string): Promise<Car> => {
    const response = await apiClient.get<ApiResponse<Car>>(CAR_ENDPOINTS.BY_ID(id));
    return response.data.data;
  },

  /**
   * Get global car attribution for a race
   */
  getGlobalAttribution: async (raceId: number | string): Promise<Car> => {
    const response = await apiClient.get<ApiResponse<Car>>(
      CAR_ENDPOINTS.GLOBAL_ATTRIBUTION(raceId)
    );
    return response.data.data;
  },

  /**
   * Get individual car attributions for a race
   */
  getIndividualAttribution: async (
    raceId: number | string,
    carIds: string[]
  ): Promise<CarAttribution[]> => {
    const response = await apiClient.post<ApiResponse<CarAttribution[]>>(
      CAR_ENDPOINTS.INDIVIDUAL_ATTRIBUTION(raceId),
      carIds
    );
    return response.data.data;
  },
};

export default carService;
