import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Party } from "@/types/party.types";
import axios from "axios";

// Move helper functions outside of the module scope
async function fetchAllParties(): Promise<Party[]> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/parties`
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function fetchPartyById(id: number): Promise<Party> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/parties/get-by-id`,
      {
        params: {
          partyId: id.toString(),
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Export only the route handlers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partyId = searchParams.get('partyId');

    if (partyId) {
      const party = await fetchPartyById(Number(partyId));
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
