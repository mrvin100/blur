import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Race } from "@/types/party.types";
import { backendFetch } from '@/lib/backend';

async function fetchAllRaces(): Promise<Race[]> {
  const res = await backendFetch('/api/v1/races');
  if (!res.ok) throw new Error('Failed to fetch races');
  const json = await res.json();
  return json.data;
}

async function fetchRaceById(id: string): Promise<Race> {
  const res = await backendFetch(`/api/v1/races/${id}`);
  if (!res.ok) throw new Error('Failed to fetch race');
  const json = await res.json();
  return json.data;
}

async function fetchRacesByPartyId(id: string): Promise<Race[]> {
  const res = await backendFetch(`/api/v1/races/party/${id}`);
  if (!res.ok) throw new Error('Failed to fetch races by party');
  const json = await res.json();
  return json.data;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const raceId = searchParams.get('raceId');
    const partyId = searchParams.get('partyId');

    if (raceId) {
      const race = await fetchRaceById(raceId);
      return NextResponse.json({ data: race });
    } else if (partyId) {
      const races = await fetchRacesByPartyId(partyId);
      return NextResponse.json({ data: races });
    } else {
      const races = await fetchAllRaces();
      return NextResponse.json({ data: races });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch race data' },
      { status: 500 }
    );
  }
}
