/**
 * API Response Types
 * Standard response structure from backend
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  timestamp?: string;
  path?: string;
}

// API Configuration
export interface AuthEndpoints {
  login: string;
  logout: string;
  session: string;
}

export interface APIEndpoints {
  auth: AuthEndpoints;
}

export interface APIConfig {
  baseURL: string;
  endpoints: APIEndpoints;
} 