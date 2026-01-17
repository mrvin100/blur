/**
 * User Types
 */

export interface User {
  id: number;
  userName: string;
  email?: string;
  role?: string;
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// DTOs
export interface CreateUserDto {
  userName: string;
  email?: string;
  password: string;
  role?: string;
}

export interface UpdateUserDto {
  userName?: string;
  email?: string;
  password?: string;
  role?: string;
}

// Legacy alias for backward compatibility
export type Users = User;
