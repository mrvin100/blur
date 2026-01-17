import { NextResponse } from 'next/server';
import axios from "axios";

// Helper functions
async function fetchAllCars() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/cars`);
    return response.data.data;
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