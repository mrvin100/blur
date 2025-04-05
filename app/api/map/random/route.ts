import { NextResponse } from 'next/server';
import axios from "axios";

// Helper functions
async function fetchRandomMap() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cards/random`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Route handlers
export async function GET() {
  try {
    const map = await fetchRandomMap();
    return NextResponse.json({ data: map });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch random map' },
      { status: 500 }
    );
  }
} 