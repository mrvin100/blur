import { NextResponse } from 'next/server';
import { Users } from "@/types/user.types";
import axios from "axios"

// Helper function
async function fetchAllUsers(): Promise<Users[]> {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
    const data = response.data.data;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Route handler
export async function GET() {
  try {
    const users = await fetchAllUsers();
    return NextResponse.json({ data: users });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}