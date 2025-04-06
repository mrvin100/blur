import axios from 'axios';
import { Permission } from '@/types/auth';

interface AuthResponse {
  data: {
    id: string;
    userName: string;
    permissions: Permission[];
  };
}

/**
 * Sign in a user with username and password
 */
export async function signIn(username: string, password: string): Promise<AuthResponse> {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/log-in`,
      { userName: username, password }
    );
    
    return response.data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
} 