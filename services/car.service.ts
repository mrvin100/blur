/**
 * Car Service
 * Handles all car-related API calls
 * Aligned with backend CarController endpoints
 */

import apiClient from '@/lib/api-client';
import type { Car } from '@/types/car.types';
import type { ApiResponse } from '@/types/api.types';

const CAR_ENDPOINTS = {
  BASE: 'cars',
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
};

export default carService;
