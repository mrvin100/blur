export interface Permission {
  id: number;
  name: string;
}

export interface User {
  id: number;
  userName: string;
  permissions: Permission[];
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