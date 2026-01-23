import { auth } from '@/lib/auth';
import type { AuthUser } from '@/lib/schemas/auth.schema';
import { headers } from 'next/headers';
import { apiServerClient } from './api-client';

export const getBackendBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
};

export async function getAccessToken(): Promise<string | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const user = session?.user as AuthUser | undefined;
    return user?.accessToken ?? null;
  } catch {
    return null;
  }
}

export async function backendFetch(path: string, init: RequestInit = {}) {
  const token = await getAccessToken();
  const baseUrl = getBackendBaseUrl();

  const fetchHeaders = new Headers(init.headers);
  fetchHeaders.set('Content-Type', fetchHeaders.get('Content-Type') ?? 'application/json');
  if (token) fetchHeaders.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: fetchHeaders,
    cache: 'no-store',
  });

  return res;
}

// Helper to use ky on server-side with authentication
export async function getAuthenticatedKyClient() {
  const token = await getAccessToken();
  
  if (token) {
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
  
  return apiServerClient;
}
