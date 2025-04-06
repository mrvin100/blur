import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from "axios";
import { User } from "@/types/auth";

// Helper functions to interact with backend API
async function fetchAllUsers(): Promise<User[]> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

async function fetchUserById(userId: string): Promise<User> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/get-by-id`,
      {
        params: {
          userId
        }
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
}

async function createUser(userData: { userName: string; password: string; permissionsIds: number[] }): Promise<User> {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/create`,
      userData
    );
    return response.data.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// GET: Fetch all users or a specific user by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      const user = await fetchUserById(userId);
      return NextResponse.json({ data: user });
    } else {
      const users = await fetchAllUsers();
      return NextResponse.json({ data: users });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}

// POST: Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userName, password, permissionsIds } = body;
    
    if (!userName || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    const userData = {
      userName,
      password,
      permissionsIds: permissionsIds || []
    };
    
    const newUser = await createUser(userData);
    return NextResponse.json({ data: newUser });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 