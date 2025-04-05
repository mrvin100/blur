import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Race } from "@/types/party.types";
import axios from "axios";

async function fetchAllRaces(): Promise<Race[]> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/races`
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function fetchRaceById(id: string): Promise<Race> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/races/get-by-id?raceId=${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function fetchRacesByPartyId(id: string): Promise<Race[]> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/races/get-by-party-id`,
      {
        params: {
          partyId: id.toString()
        }
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
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
