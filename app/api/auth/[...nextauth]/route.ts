import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import '@/types/nextauth.types';
import { signIn } from '@/lib/auth';
import { Permission } from '@/types/auth';
import type { User } from 'next-auth';

declare module "next-auth" {
  interface User {
    id: string;
    userName: string;
    permissions: Permission[];
  }
  
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User;
  }
}

// Validate required environment variables
if (!process.env.NEXTAUTH_URL) {
  throw new Error('NEXTAUTH_URL environment variable is not set');
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET environment variable is not set');
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('[NextAuth] Starting authorization process');
        
        if (!credentials?.username || !credentials?.password) {
          console.error('[NextAuth] Missing credentials');
          throw new Error('Please provide both username and password');
        }

        try {
          console.log('[NextAuth] Attempting to sign in user:', credentials.username);
          const response = await signIn(credentials.username, credentials.password);
          
          if (!response || !response.data) {
            console.error('[NextAuth] Invalid response format:', response);
            throw new Error('Invalid response from authentication service');
          }

          const user = response.data;

          if (!user || !user.id || !user.userName || !Array.isArray(user.permissions)) {
            console.error('[NextAuth] Invalid user data format:', user);
            throw new Error('Invalid user data format');
          }

          console.log('[NextAuth] User authenticated successfully:', {
            id: user.id,
            userName: user.userName,
            permissionsCount: user.permissions.length
          });

          return {
            id: user.id.toString(),
            userName: user.userName,
            permissions: user.permissions,
          } as User;

        } catch (error) {
          console.error('[NextAuth] Authentication error:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
          });
          
          const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
          throw new Error(errorMessage);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('[NextAuth] Updating JWT with user data');
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('[NextAuth] Creating session for user');
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST }; 