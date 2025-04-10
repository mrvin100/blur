import { NextResponse } from 'next/server';
import axios from "axios";

// Helper functions
async function fetchRandomMap(raceId: string) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cards/random/${raceId}`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Route handlers
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const raceId = searchParams.get('raceId');

    if (!raceId) {
      return NextResponse.json(
        { error: 'Race ID is required' },
        { status: 400 }
      );
    }

    const map = await fetchRandomMap(raceId);
    return NextResponse.json({ data: map });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch random map' },
      { status: 500 }
    );
  }
}