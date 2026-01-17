import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextauth';

export const getBackendBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
};

export async function getAccessToken(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const token = (session?.user as any)?.accessToken as string | undefined;
  return token ?? null;
}

export async function backendFetch(path: string, init: RequestInit = {}) {
  const token = await getAccessToken();
  const baseUrl = getBackendBaseUrl();

  const headers = new Headers(init.headers);
  headers.set('Content-Type', headers.get('Content-Type') ?? 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });

  return res;
}
