/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import apiClient from '@/lib/api-client';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth.types';

const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
};

export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, {
      userName: credentials.username,
      password: credentials.password,
    });
    return response.data;
  },

  /**
   * Register new user
   */
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, credentials);
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.REFRESH, { refreshToken });
    return response.data;
  },
};

export default authService;
