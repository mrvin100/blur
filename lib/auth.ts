import { CreateUserDto, UserResponse, PermissionsResponse, CreatePermissionDto, Permission } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Validate API URL in production
if (process.env.NODE_ENV === 'production' && !API_URL) {
  throw new Error('API base URL is required in production environment');
}

// Common fetch options for all API calls
const defaultFetchOptions = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  mode: 'cors' as RequestMode,
  credentials: 'include' as RequestCredentials,
};

// Common error handler for API responses
async function handleApiResponse<T>(response: Response, errorContext: string): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[Auth] ${errorContext}:`, {
      status: response.status,
      statusText: response.statusText,
      error: errorText
    });

    switch (response.status) {
      case 401:
        throw new Error('Authentication failed: Invalid credentials');
      case 403:
        throw new Error('Authentication failed: Access denied');
      case 429:
        throw new Error('Too many requests. Please try again later.');
      case 500:
        throw new Error('Server error. Please try again later.');
      default:
        throw new Error(`${errorContext}: ${response.statusText} - ${errorText}`);
    }
  }

  return response.json();
}

export async function signIn(username: string, password: string): Promise<UserResponse> {
  console.log(`[Auth] Attempting to sign in user: ${username}`);
  console.log(`[Auth] API URL: ${API_URL}`);

  if (!API_URL) {
    throw new Error('API URL is not configured. Please check your environment variables.');
  }

  try {
    const response = await fetch(`${API_URL}/users/log-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
      body: JSON.stringify({
        userName: username,
        password: password
      }),
    });

    const userData = await handleApiResponse<UserResponse>(response, 'Failed to authenticate');
    
    console.log('[Auth] Successfully authenticated user:', userData);
    console.log('[Auth] User permissions:', 
      userData.data?.permissions?.map((p: Permission) => p.name) ?? []);

    return userData;
  } catch (error) {
    console.error('[Auth] Authentication error:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('[Auth] Network error - API might be down or CORS issues');
      throw new Error('Unable to connect to authentication service. Please try again later.');
    }
    throw error;
  }
}

export async function createUser(data: CreateUserDto): Promise<UserResponse> {
  const response = await fetch(`${API_URL}/users/create`, {
    ...defaultFetchOptions,
    method: 'POST',
    body: JSON.stringify(data),
  });

  return handleApiResponse<UserResponse>(response, 'Failed to create user');
}

export async function getUsers(): Promise<UserResponse> {
  const response = await fetch(`${API_URL}/users`, {
    ...defaultFetchOptions,
    method: 'GET',
  });

  return handleApiResponse<UserResponse>(response, 'Failed to fetch users');
}

export async function deleteUser(userId: number): Promise<UserResponse> {
  const response = await fetch(`${API_URL}/users/delete?userId=${userId}`, {
    ...defaultFetchOptions,
    method: 'DELETE',
  });

  return handleApiResponse<UserResponse>(response, 'Failed to delete user');
}

export async function getPermissions(): Promise<PermissionsResponse> {
  const response = await fetch(`${API_URL}/permissions`, {
    ...defaultFetchOptions,
    method: 'GET',
  });

  return handleApiResponse<PermissionsResponse>(response, 'Failed to fetch permissions');
}

export async function createPermission(data: CreatePermissionDto): Promise<PermissionsResponse> {
  const response = await fetch(`${API_URL}/permissions/create`, {
    ...defaultFetchOptions,
    method: 'POST',
    body: JSON.stringify(data),
  });

  return handleApiResponse<PermissionsResponse>(response, 'Failed to create permission');
}

export async function deletePermission(permissionId: number): Promise<PermissionsResponse> {
  const response = await fetch(`${API_URL}/permissions/delete?permissionId=${permissionId}`, {
    ...defaultFetchOptions,
    method: 'DELETE',
  });

  return handleApiResponse<PermissionsResponse>(response, 'Failed to delete permission');
}

// Helper function to determine if a user is an admin
export function isAdmin(permissions: string[]): boolean {
  return permissions.includes('ADMIN');
} 