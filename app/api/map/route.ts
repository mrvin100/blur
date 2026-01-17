import { NextResponse } from 'next/server';
import axios from "axios"

// Helper functions
async function fetchAllMaps() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/cards`)
    return response.data.data;
  } catch (error) {
    console.error(error)
    throw error;
  }
}

// Route handlers
export async function GET() {
  try {
    const maps = await fetchAllMaps();
    return NextResponse.json({ data: maps });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch maps data' },
      { status: 500 }
    );
  }
}