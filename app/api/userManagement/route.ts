import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { backendFetch } from '@/lib/backend';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      const res = await backendFetch(`/api/v1/users/${userId}`);
      const json = await res.json();
      return NextResponse.json({ data: json.data }, { status: res.status });
    }

    const res = await backendFetch('/api/v1/users');
    const json = await res.json();
    return NextResponse.json({ data: json.data }, { status: res.status });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // backend expects: { userName, email?, password, role }
    const res = await backendFetch('/api/v1/users', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const json = await res.json();
    return NextResponse.json({ data: json.data }, { status: res.status });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
