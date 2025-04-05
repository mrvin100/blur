import { NextResponse } from 'next/server';
import { Party } from "@/types/party.types";
import axios from "axios";

// Helper functions
async function createParty(): Promise<Party> {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/parties`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getPartyById(partyId: string): Promise<Party> {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/parties/get-party/${partyId}`)
    return response.data.data
  } catch (error) {
    console.error(error)
    throw error;
  }
}

async function fetchAllParties(): Promise<Party[]> {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/parties`)
    return response.data.data
  } catch (error) {
    console.error(error)
    throw error;
  }
}

// Route handlers
export async function POST() {
  try {
    const party = await createParty();
    return NextResponse.json({ data: party });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create party' },
      { status: 500 }
    );
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