import { CreateUserDto, UserResponse, PermissionsResponse, CreatePermissionDto } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://blur-app-d6db06830033.herokuapp.com';

export async function signIn(username: string, password: string): Promise<UserResponse> {
  const response = await fetch(`${API_URL}/api/v1/users/get-by-id?userId=${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    },
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  return response.json();
}

export async function createUser(data: CreateUserDto): Promise<UserResponse> {
  const response = await fetch(`${API_URL}/api/v1/users/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  return response.json();
}

export async function getUsers(): Promise<UserResponse> {
  const response = await fetch(`${API_URL}/api/v1/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
}

export async function deleteUser(userId: number): Promise<UserResponse> {
  const response = await fetch(`${API_URL}/api/v1/users/delete?userId=${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }

  return response.json();
}

export async function getPermissions(): Promise<PermissionsResponse> {
  const response = await fetch(`${API_URL}/api/v1/permissions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch permissions');
  }

  return response.json();
}

export async function createPermission(data: CreatePermissionDto): Promise<PermissionsResponse> {
  const response = await fetch(`${API_URL}/api/v1/permissions/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create permission');
  }

  return response.json();
}

export async function deletePermission(permissionId: number): Promise<PermissionsResponse> {
  const response = await fetch(`${API_URL}/api/v1/permissions/delete?permissionId=${permissionId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete permission');
  }

  return response.json();
}

// Helper function to determine if a user is an admin
export function isAdmin(permissions: string[]): boolean {
  return permissions.includes('ADMIN');
} 