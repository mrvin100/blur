/**
 * Score Service
 * Handles all score-related API calls
 * Aligned with backend ScoreController endpoints
 */

import apiClient from '@/lib/api-client';
import type { Score, CreateScoreDto } from '@/types/score.types';
import type { ApiResponse } from '@/types/api.types';

const SCORE_ENDPOINTS = {
  BASE: 'scores',
  BY_ID: (id: number | string) => `scores/${id}`,
  BY_RACE: (raceId: number | string) => `scores/race/${raceId}`,
  BY_USER: (userId: number | string) => `scores/user/${userId}`,
  BY_RACE_AND_USER: (raceId: number | string, userId: number | string) => 
    `scores/race/${raceId}/user/${userId}`,
};

export const scoreService = {
  /**
   * Get score by ID
   */
  getById: async (id: number | string): Promise<Score> => {
    const response = await apiClient
      .get(SCORE_ENDPOINTS.BY_ID(id))
      .json<ApiResponse<Score>>();
    return response.data;
  },

  /**
   * Get scores by race ID
   */
  getByRaceId: async (raceId: number | string): Promise<Score[]> => {
    const response = await apiClient
      .get(SCORE_ENDPOINTS.BY_RACE(raceId))
      .json<ApiResponse<Score[]>>();
    return response.data;
  },

  /**
   * Get scores by user ID
   */
  getByUserId: async (userId: number | string): Promise<Score[]> => {
    const response = await apiClient
      .get(SCORE_ENDPOINTS.BY_USER(userId))
      .json<ApiResponse<Score[]>>();
    return response.data;
  },

  /**
   * Get score by race ID and user ID
   */
  getByRaceAndUser: async (raceId: number | string, userId: number | string): Promise<Score> => {
    const response = await apiClient
      .get(SCORE_ENDPOINTS.BY_RACE_AND_USER(raceId, userId))
      .json<ApiResponse<Score>>();
    return response.data;
  },

  /**
   * Submit a new score
   */
  submit: async (data: CreateScoreDto): Promise<Score> => {
    const response = await apiClient
      .post(SCORE_ENDPOINTS.BASE, { json: data })
      .json<ApiResponse<Score>>();
    return response.data;
  },

  /**
   * Update score (uses same DTO as create)
   */
  update: async (id: number | string, data: CreateScoreDto): Promise<Score> => {
    const response = await apiClient
      .put(SCORE_ENDPOINTS.BY_ID(id), { json: data })
      .json<ApiResponse<Score>>();
    return response.data;
  },

  /**
   * Delete score
   */
  delete: async (id: number | string): Promise<void> => {
    await apiClient.delete(SCORE_ENDPOINTS.BY_ID(id));
  },
};

export default scoreService;
