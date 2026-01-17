import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';

export async function GET() {
  try {
    const res = await backendFetch('/api/v1/users');
    const json = await res.json();
    return NextResponse.json({ data: json.data }, { status: res.status });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
