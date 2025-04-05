import { NextResponse } from 'next/server';
import { Race, Racer } from "@/types/party.types";
import axios from "axios";

// Helper functions
async function updateRaceById(RaceUpdateRequest: Racer[], raceId: string) {
  try {
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/races/update-race?raceId=${raceId}`, 
      RaceUpdateRequest
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getRaceById(raceId: string): Promise<Race> {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/races/get-by-id?raceId=${raceId}`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getRacesByPartyId(partyId: string): Promise<Race[]> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/races/get-by-party-id`, 
      {
        params: {
          partyId: partyId
        }
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function addRace(partyId: string): Promise<Race> {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/races/create-race?partyId=${partyId}`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Route handlers
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const partyId = url.searchParams.get('partyId');
    const raceId = url.searchParams.get('raceId');
    
    if (raceId) {
      const race = await getRaceById(raceId);
      return NextResponse.json({ data: race });
    } else if (partyId) {
      const races = await getRacesByPartyId(partyId);
      return NextResponse.json({ data: races });
    } else {
      return NextResponse.json(
        { error: 'Missing parameters' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch race data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const partyId = url.searchParams.get('partyId');
    
    if (!partyId) {
      return NextResponse.json(
        { error: 'Party ID is required' },
        { status: 400 }
      );
    }
    
    const race = await addRace(partyId);
    return NextResponse.json({ data: race });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create race' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const raceId = url.searchParams.get('raceId');
    
    if (!raceId) {
      return NextResponse.json(
        { error: 'Race ID is required' },
        { status: 400 }
      );
    }
    
    const racers = await request.json() as Racer[];
    await updateRaceById(racers, raceId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to update race' },
      { status: 500 }
    );
  }
}