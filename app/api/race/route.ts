import { NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';

// This route now maps frontend actions to the new backend race endpoints.
// GET: ?raceId= or ?partyId=
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const partyId = url.searchParams.get('partyId');
    const raceId = url.searchParams.get('raceId');

    if (raceId) {
      const res = await backendFetch(`/api/v1/races/${raceId}`);
      const json = await res.json();
      return NextResponse.json({ data: json.data }, { status: res.status });
    }

    if (partyId) {
      const res = await backendFetch(`/api/v1/races/party/${partyId}`);
      const json = await res.json();
      return NextResponse.json({ data: json.data }, { status: res.status });
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch race data' }, { status: 500 });
  }
}

// POST: create race in party
export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const partyId = url.searchParams.get('partyId');
    const attributionType = url.searchParams.get('attributionType') ?? 'PER_USER';

    if (!partyId) {
      return NextResponse.json({ error: 'Party ID is required' }, { status: 400 });
    }

    const res = await backendFetch(`/api/v1/races?partyId=${partyId}&attributionType=${attributionType}`, {
      method: 'POST',
    });
    const json = await res.json();
    return NextResponse.json({ data: json.data }, { status: res.status });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create race' }, { status: 500 });
  }
}

// PUT: update participants (frontend sends selectedRacers). We'll map it to add/remove.
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const raceId = url.searchParams.get('raceId');

    if (!raceId) return NextResponse.json({ error: 'Race ID is required' }, { status: 400 });

    interface Racer {
      id: string | number;
      userName?: string;
    }
    
    interface RaceData {
      racers?: Array<{ id: string | number }>;
      participants?: Array<{ id: string | number }>;
    }
    
    interface RaceResponse {
      data?: RaceData;
    }

    const payload = await request.json() as Racer[];
    // payload is Racer[] with {id, userName}? We'll only use ids.
    const selectedIds: string[] = Array.isArray(payload) ? payload.map((r) => String(r.id)) : [];

    // Get current race to diff participants
    const currentRes = await backendFetch(`/api/v1/races/${raceId}`);
    const currentJson = await currentRes.json() as RaceResponse;
    const current = currentJson.data;

    const currentIds: string[] = (current?.racers ?? current?.participants ?? []).map((u) => String(u.id));

    const toAdd = selectedIds.filter(id => !currentIds.includes(id));
    const toRemove = currentIds.filter(id => !selectedIds.includes(id));

    for (const userId of toAdd) {
      await backendFetch(`/api/v1/races/${raceId}/participants/${userId}`, { method: 'POST' });
    }

    for (const userId of toRemove) {
      await backendFetch(`/api/v1/races/${raceId}/participants/${userId}`, { method: 'DELETE' });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to update race participants' }, { status: 500 });
  }
}
