export interface Permission {
  id: number;
  name: string;
}

export interface Score {
  id: number;
  value: number;
  race?: any; // This is recursive, so we'll use any for now
}

export interface Race {
  id: number;
  scores: Score[];
}

export interface User {
  id: number;
  userName: string;
  password: string;
  permissions: Permission[];
  races: Race[];
}

export interface UserResponse {
  message: string;
  data: {
    id: number;
    userName: string;
    permissions: Permission[];
  };
}

export interface PermissionsResponse {
  message: string;
  data: Permission[];
}

export interface CreateUserDto {
  userName: string;
  password: string;
  permissionsIds: number[];
}

export interface CreatePermissionDto {
  name: string;
}

export type UserRole = 'admin' | 'user';

export interface Session {
  user: {
    id: number;
    userName: string;
    permissions: Permission[];
    role: UserRole;
  };
} 