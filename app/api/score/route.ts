import { NextResponse } from 'next/server';
import { Score } from "@/types/party.types"
import { AddScoreRequestData } from "@/types/score.types"
import axios from "axios"

// Helper functions
async function addScoreForUser(data: AddScoreRequestData) {
  try {
    await axios.post<Score>(`${process.env.NEXT_PUBLIC_API_URL}/scores/add`, data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateScoreForUser(data: AddScoreRequestData, scoreId: string) {
  try {
    await axios.put<Score>(`${process.env.NEXT_PUBLIC_API_URL}/scores/update?scoreId=${scoreId}`, data)
  } catch (error) {
    console.error(error)
    throw error;
  }
}

async function getScoreByRaceId(raceId: string): Promise<Score[]> {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/scores/get-by-race-id?raceId=${raceId}`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Route handlers
export async function POST(request: Request) {
  try {
    const data = await request.json() as AddScoreRequestData;
    await addScoreForUser(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to add score for user' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const raceId = url.searchParams.get('raceId');

    if (!raceId) {
      return NextResponse.json(
        { error: 'Race ID is required' },
        { status: 400 }
      );
    }

    const scores = await getScoreByRaceId(raceId);
    return NextResponse.json({ data: scores });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scores' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const scoreId = url.searchParams.get('scoreId');
    
    if (!scoreId) {
      return NextResponse.json(
        { error: 'Score ID is required' },
        { status: 400 }
      );
    }

    const data = await request.json() as AddScoreRequestData;
    await updateScoreForUser(data, scoreId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to update score' },
      { status: 500 }
    );
  }
}