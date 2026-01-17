/**
 * User Service
 * Handles all user-related API calls
 */

import apiClient from '@/lib/api-client';
import { User, CreateUserDto, UpdateUserDto, ApiResponse } from '@/types';

const USER_ENDPOINTS = {
  BASE: '/api/v1/users',
  BY_ID: (id: number | string) => `/api/v1/users/${id}`,
};

export const userService = {
  /**
   * Get all users
   */
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<ApiResponse<User[]>>(USER_ENDPOINTS.BASE);
    return response.data.data;
  },

  /**
   * Get user by ID
   */
  getById: async (id: number | string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(USER_ENDPOINTS.BY_ID(id));
    return response.data.data;
  },

  /**
   * Create new user
   */
  create: async (data: CreateUserDto): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>(USER_ENDPOINTS.BASE, data);
    return response.data.data;
  },

  /**
   * Update user
   */
  update: async (id: number | string, data: UpdateUserDto): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(USER_ENDPOINTS.BY_ID(id), data);
    return response.data.data;
  },

  /**
   * Delete user
   */
  delete: async (id: number | string): Promise<void> => {
    await apiClient.delete(USER_ENDPOINTS.BY_ID(id));
  },
};

export default userService;
