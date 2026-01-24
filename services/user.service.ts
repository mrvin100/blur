/**
 * User Service
 * Handles all user-related API calls
 */

import { apiClient } from '@/lib/api-client';
import type { User, CreateUserDto, UpdateUserDto } from '@/types/user.types';
import type { ApiResponse } from '@/types/api.types';

const USER_ENDPOINTS = {
  BASE: 'users',
  BY_ID: (id: number | string) => `users/${id}`,
  ME: 'users/me',
  PROFILE: (id: number | string) => `users/${id}/profile`,
  ROLE: (id: number | string) => `users/${id}/role`,
  ROLES: (id: number | string) => `users/${id}/roles`,
  ALL_ROLES: 'users/roles',
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

  /**
   * Get current authenticated user
   * Backend: GET /users/me
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get(USER_ENDPOINTS.ME).json<ApiResponse<User>>();
    return response.data;
  },

  /**
   * Update user's own profile
   * Backend: PUT /users/{id}/profile
   */
  updateProfile: async (id: number | string, data: UpdateUserDto): Promise<User> => {
    const response = await apiClient.put(USER_ENDPOINTS.PROFILE(id), { json: data }).json<ApiResponse<User>>();
    return response.data;
  },

  /**
   * Assign single role to a user (legacy)
   * Backend: PUT /users/{id}/role?role={role}
   */
  assignRole: async (id: number | string, role: string): Promise<User> => {
    const response = await apiClient
      .put(`${USER_ENDPOINTS.ROLE(id)}?role=${role}`)
      .json<ApiResponse<User>>();
    return response.data;
  },

  /**
   * Assign multiple roles to a user
   * Backend: PUT /users/{id}/roles
   */
  assignRoles: async (id: number | string, roles: string[]): Promise<User> => {
    const response = await apiClient
      .put(USER_ENDPOINTS.ROLES(id), { json: roles })
      .json<ApiResponse<User>>();
    return response.data;
  },

  /**
   * Remove a role from a user
   * Backend: DELETE /users/{id}/roles/{role}
   */
  removeRole: async (id: number | string, role: string): Promise<User> => {
    const response = await apiClient
      .delete(`${USER_ENDPOINTS.ROLES(id)}/${role}`)
      .json<ApiResponse<User>>();
    return response.data;
  },

  /**
   * Get all available roles
   * Backend: GET /users/roles
   */
  getAllRoles: async (): Promise<string[]> => {
    const response = await apiClient.get(USER_ENDPOINTS.ALL_ROLES).json<ApiResponse<string[]>>();
    return response.data;
  },
};

export default userService;
