import axios from 'axios';
interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  user: {
    id: number;
    username: string;
    email?: string;
    role?: string;
    permissions?: string[];
  };
  timestamp?: string;
}

/**
 * Sign in a user with username and password
 */
export async function signIn(username: string, password: string): Promise<AuthResponse> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
    const response = await axios.post(
      `${baseUrl}/api/auth/login`,
      { userName: username, password }
    );

    return response.data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
} 