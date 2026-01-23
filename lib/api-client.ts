/**
 * Centralized API Client Configuration
 * Provides a configured ky instance with hooks for authentication and error handling
 */

import ky from 'ky';
import { authClient } from '@/lib/auth-client';
import type { AuthUser } from '@/lib/schemas/auth.schema';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

// Construct full API prefix URL with version
const API_PREFIX_URL = `${API_BASE_URL}/api/${API_VERSION}`;

// Create ky instance for client-side requests with authentication
export const apiClient = ky.create({
  prefixUrl: API_PREFIX_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        try {
          const session = await authClient.getSession();
          const user = session?.data?.user as AuthUser | undefined;
          const token = user?.accessToken;

          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
          }
        } catch (error) {
          console.error('Error getting session token:', error);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        // Handle 401 Unauthorized - redirect to sign-in
        if (response.status === 401 && globalThis.window !== undefined) {
          globalThis.window.location.href = '/sign-in';
        }
        return response;
      },
    ],
  },
});

// Create a separate ky instance for server-side requests (no auth hooks)
export const apiServerClient = ky.create({
  prefixUrl: API_PREFIX_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth endpoints are not versioned, so create a separate client for auth
export const authApiClient = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to create authenticated server client with token
export function createAuthenticatedServerClient(token: string) {
  return apiServerClient.extend({
    hooks: {
      beforeRequest: [
        (request) => {
          request.headers.set('Authorization', `Bearer ${token}`);
        },
      ],
    },
  });
}

export default apiClient;
