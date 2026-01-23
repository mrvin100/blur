import { NextResponse } from 'next/server';
import ky from "ky";

// Helper functions
async function fetchAllCars() {
  try {
    const response = await ky.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/cars`).json<{ data: unknown }>();
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Route handlers
export async function GET() {
  try {
    const cars = await fetchAllCars();
    return NextResponse.json({ data: cars });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cars data' },
      { status: 500 }
    );
  }
}