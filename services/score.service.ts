/**
 * Score Service
 * Handles all score-related API calls
 */

import apiClient from '@/lib/api-client';
import { Score, CreateScoreDto, UpdateScoreDto, ApiResponse } from '@/types';

const SCORE_ENDPOINTS = {
  BASE: '/api/v1/scores',
  BY_ID: (id: number | string) => `/api/v1/scores/${id}`,
  BY_RACE: (raceId: number | string) => `/api/v1/scores/race/${raceId}`,
  BY_USER: (userId: number | string) => `/api/v1/scores/user/${userId}`,
};

export const scoreService = {
  /**
   * Get all scores
   */
  getAll: async (): Promise<Score[]> => {
    const response = await apiClient.get<ApiResponse<Score[]>>(SCORE_ENDPOINTS.BASE);
    return response.data.data;
  },

  /**
   * Get score by ID
   */
  getById: async (id: number | string): Promise<Score> => {
    const response = await apiClient.get<ApiResponse<Score>>(SCORE_ENDPOINTS.BY_ID(id));
    return response.data.data;
  },

  /**
   * Get scores by race ID
   */
  getByRaceId: async (raceId: number | string): Promise<Score[]> => {
    const response = await apiClient.get<ApiResponse<Score[]>>(SCORE_ENDPOINTS.BY_RACE(raceId));
    return response.data.data;
  },

  /**
   * Get scores by user ID
   */
  getByUserId: async (userId: number | string): Promise<Score[]> => {
    const response = await apiClient.get<ApiResponse<Score[]>>(SCORE_ENDPOINTS.BY_USER(userId));
    return response.data.data;
  },

  /**
   * Create new score
   */
  create: async (data: CreateScoreDto): Promise<Score> => {
    const response = await apiClient.post<ApiResponse<Score>>(SCORE_ENDPOINTS.BASE, data);
    return response.data.data;
  },

  /**
   * Update score
   */
  update: async (id: number | string, data: UpdateScoreDto): Promise<Score> => {
    const response = await apiClient.put<ApiResponse<Score>>(SCORE_ENDPOINTS.BY_ID(id), data);
    return response.data.data;
  },

  /**
   * Delete score
   */
  delete: async (id: number | string): Promise<void> => {
    await apiClient.delete(SCORE_ENDPOINTS.BY_ID(id));
  },
};

export default scoreService;
