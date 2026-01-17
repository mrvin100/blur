import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Party } from "@/types/party.types";
import { backendFetch } from '@/lib/backend';

async function fetchAllParties(): Promise<Party[]> {
  const res = await backendFetch('/api/v1/parties');
  if (!res.ok) throw new Error('Failed to fetch parties');
  const json = await res.json();
  return json.data;
}

async function fetchPartyById(id: string): Promise<Party> {
  const res = await backendFetch(`/api/v1/parties/${id}`);
  if (!res.ok) throw new Error('Failed to fetch party');
  const json = await res.json();
  return json.data;
}

// Export only the route handlers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partyId = searchParams.get('partyId');

    if (partyId) {
      const party = await fetchPartyById(partyId);
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
