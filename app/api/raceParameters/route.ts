import { NextResponse } from 'next/server';
import { RaceParameter } from "@/types/raceParameters.types";
import axios from "axios"

// Helper function
async function fetchAllRaceParameters(): Promise<RaceParameter[]> {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/raceParameters`);
    return response.data.data;
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