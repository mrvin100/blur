/**
 * User Types
 */

export interface User {
  id: number;
  userName: string;
  email?: string;
  roles?: string[]; // Multiple roles support
  role?: string; // Legacy single role for backward compatibility
  permissions?: string[];
  enabled?: boolean;
  accountNonLocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// DTOs
export interface CreateUserDto {
  userName: string;
  email?: string;
  password: string;
  roles: string[]; // Multiple roles support
  role?: string; // Legacy fallback
}

export interface UpdateUserDto {
  userName?: string;
  email?: string;
  password?: string;
  roles?: string[];
  enabled?: boolean;
  accountNonLocked?: boolean;
}

// Available role types
export type RoleType = 'GREAT_ADMIN' | 'PARTY_MANAGER' | 'RACER';

export const AVAILABLE_ROLES: RoleType[] = ['GREAT_ADMIN', 'PARTY_MANAGER', 'RACER'];

// Legacy alias for backward compatibility
export type Users = User;
