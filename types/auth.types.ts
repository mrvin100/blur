/**
 * Authentication Types
 */

export interface AuthUser {
  id: number;
  username: string;
  email?: string;
  role: string;
  permissions?: string[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  userName: string;
  email?: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  user: AuthUser;
  timestamp?: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isAuthenticated: boolean;
}
