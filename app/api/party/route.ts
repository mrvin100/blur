import { NextResponse } from 'next/server';
import { Party } from "@/types/party.types";
import { backendFetch } from '@/lib/backend';

async function getTodayParty(): Promise<Party> {
  const res = await backendFetch('/api/v1/parties/today');
  if (!res.ok) throw new Error('Failed to get today party');
  const json = await res.json();
  return json.data;
}

async function getPartyById(partyId: string): Promise<Party> {
  const res = await backendFetch(`/api/v1/parties/${partyId}`);
  if (!res.ok) throw new Error('Failed to fetch party');
  const json = await res.json();
  return json.data;
}

async function fetchAllParties(): Promise<Party[]> {
  const res = await backendFetch('/api/v1/parties');
  if (!res.ok) throw new Error('Failed to fetch parties');
  const json = await res.json();
  return json.data;
}

// Route handlers
export async function POST() {
  try {
    // In the new backend: party is created automatically for the first user of the day.
    // So POST behaves as "get or create today".
    const party = await getTodayParty();
    return NextResponse.json({ data: party });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to get/create today party' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const partyId = url.searchParams.get('partyId');
    
    if (partyId) {
      const party = await getPartyById(partyId);
      return NextResponse.json({ data: party });
    } else {
      const parties = await fetchAllParties();
      return NextResponse.json({ data: parties });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch party data' },
      { status: 500 }
    );
  }
}