import { NextResponse } from 'next/server';
import { RaceParameter } from "@/types/raceParameters.types";
import ky from "ky"

// Helper function
async function fetchAllRaceParameters(): Promise<RaceParameter[]> {
  try {
    const response = await ky.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/raceParameters`).json<{ data: RaceParameter[] }>();
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Route handler
export async function GET() {
  try {
    const parameters = await fetchAllRaceParameters();
    return NextResponse.json({ data: parameters });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch race parameters' },
      { status: 500 }
    );
  }
}