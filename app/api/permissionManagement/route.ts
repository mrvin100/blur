import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Permission } from "@/types/auth";
import axios from "axios";

// Helper functions to interact with backend API
async function fetchAllPermissions(): Promise<Permission[]> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/permissions`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
}

async function createPermission(name: string): Promise<Permission> {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/permissions/create`,
      { name }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error creating permission:', error);
    throw error;
  }
}

async function deletePermission(permissionId: string): Promise<void> {
  try {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/permissions/delete`,
      {
        params: {
          permissionId
        }
      }
    );
  } catch (error) {
    console.error('Error deleting permission:', error);
    throw error;
  }
}

// GET: Fetch all permissions
export async function GET() {
  try {
    const permissions = await fetchAllPermissions();
    return NextResponse.json({ data: permissions });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch permissions data' },
      { status: 500 }
    );
  }
}

// POST: Create a new permission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: 'Permission name is required' },
        { status: 400 }
      );
    }
    
    const newPermission = await createPermission(name);
    return NextResponse.json({ data: newPermission });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create permission' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a permission
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const permissionId = searchParams.get('permissionId');
    
    if (!permissionId) {
      return NextResponse.json(
        { error: 'Permission ID is required' },
        { status: 400 }
      );
    }
    
    await deletePermission(permissionId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete permission' },
      { status: 500 }
    );
  }
} 