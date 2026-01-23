/**
 * Car Service
 * Handles all car-related API calls
 */

import apiClient from '@/lib/api-client';
import type { Car, CarAttribution } from '@/types/car.types';
import type { ApiResponse } from '@/types/api.types';

const CAR_ENDPOINTS = {
  BASE: 'cars',
  BY_ID: (id: number | string) => `cars/${id}`,
  GLOBAL_ATTRIBUTION: (raceId: number | string) => `cars/global-attribution/${raceId}`,
  INDIVIDUAL_ATTRIBUTION: (raceId: number | string) => `cars/individual-attribution/${raceId}`,
};

export const carService = {
  /**
   * Get all cars
   */
  getAll: async (): Promise<Car[]> => {
    const response = await apiClient
      .get(CAR_ENDPOINTS.BASE)
      .json<ApiResponse<Car[]>>();
    return response.data;
  },

  /**
   * Get car by ID
   */
  getById: async (id: number | string): Promise<Car> => {
    const response = await apiClient
      .get(CAR_ENDPOINTS.BY_ID(id))
      .json<ApiResponse<Car>>();
    return response.data;
  },

  /**
   * Get global car attribution for a race
   */
  getGlobalAttribution: async (raceId: number | string): Promise<Car> => {
    const response = await apiClient
      .get(CAR_ENDPOINTS.GLOBAL_ATTRIBUTION(raceId))
      .json<ApiResponse<Car>>();
    return response.data;
  },

  /**
   * Get individual car attributions for a race
   */
  getIndividualAttribution: async (
    raceId: number | string,
    carIds: string[]
  ): Promise<CarAttribution[]> => {
    const response = await apiClient
      .post(CAR_ENDPOINTS.INDIVIDUAL_ATTRIBUTION(raceId), {
        json: carIds,
      })
      .json<ApiResponse<CarAttribution[]>>();
    return response.data;
  },
};

export default carService;
