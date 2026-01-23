/**
 * User Service
 * Handles all user-related API calls
 */

import { apiClient } from '@/lib/api-client';
import type { User, CreateUserDto, UpdateUserDto } from '@/types/user.types';
import type { ApiResponse } from '@/types/api.types';

const USER_ENDPOINTS = {
  BASE: 'api/v1/users',
  BY_ID: (id: number | string) => `api/v1/users/${id}`,
};

export const userService = {
  /**
   * Get all users
   */
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get(USER_ENDPOINTS.BASE).json<ApiResponse<User[]>>();
    return response.data;
  },

  /**
   * Get user by ID
   */
  getById: async (id: number | string): Promise<User> => {
    const response = await apiClient.get(USER_ENDPOINTS.BY_ID(id)).json<ApiResponse<User>>();
    return response.data;
  },

  /**
   * Create new user
   */
  create: async (data: CreateUserDto): Promise<User> => {
    const response = await apiClient.post(USER_ENDPOINTS.BASE, { json: data }).json<ApiResponse<User>>();
    return response.data;
  },

  /**
   * Update user
   */
  update: async (id: number | string, data: UpdateUserDto): Promise<User> => {
    const response = await apiClient.put(USER_ENDPOINTS.BY_ID(id), { json: data }).json<ApiResponse<User>>();
    return response.data;
  },

  /**
   * Delete user
   */
  delete: async (id: number | string): Promise<void> => {
    await apiClient.delete(USER_ENDPOINTS.BY_ID(id));
  },
};

export default userService;
