import { NextResponse } from 'next/server';
import axios from "axios";

// Helper functions
async function fetchGlobalAttribution() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cars/global-attribution`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function fetchIndividualAttribution(carIds: string[]) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/cars/individual-attribution`,
      carIds
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Route handler
export async function POST(request: Request) {
  try {
    const { type, carIds } = await request.json();

    if (type === 'global') {
      const data = await fetchGlobalAttribution();
      return NextResponse.json({ data });
    } 
    
    if (type === 'individual' && Array.isArray(carIds)) {
      const data = await fetchIndividualAttribution(carIds);
      return NextResponse.json({ data });
    }

    return NextResponse.json(
      { error: 'Invalid request parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch car attribution data' },
      { status: 500 }
    );
  }
} 