import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const raceId = url.searchParams.get('raceId');

    if (!raceId) return NextResponse.json({ error: 'Race ID is required' }, { status: 400 });

    const res = await backendFetch(`/api/v1/scores/race/${raceId}`);
    const json = await res.json();
    return NextResponse.json({ data: json.data }, { status: res.status });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const res = await backendFetch('/api/v1/scores', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return NextResponse.json({ data: json.data }, { status: res.status });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const scoreId = url.searchParams.get('scoreId');

    if (!scoreId) return NextResponse.json({ error: 'Score ID is required' }, { status: 400 });

    const data = await request.json();
    const res = await backendFetch(`/api/v1/scores/${scoreId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return NextResponse.json({ data: json.data }, { status: res.status });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to update score' }, { status: 500 });
  }
}
