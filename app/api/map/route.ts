import { NextResponse } from 'next/server';
import ky from "ky"

// Helper functions
async function fetchAllMaps() {
  try {
    const response = await ky.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/cards`).json<{ data: unknown }>();
    return response.data;
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