import NextAuth from 'next-auth';
import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authService } from '@/modules/auth/services/authService';
import '@/types/nextauth.types';
import { signIn } from '@/lib/auth';

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    role: 'ADMIN' | 'USER';
    accessToken: string;
  }
  
  interface Session {
    user: User;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: 'ADMIN' | 'USER';
    accessToken?: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Missing username or password');
        }

        try {
          const response = await signIn(credentials.username, credentials.password);
          const user = response.data;

          if (!user) {
            throw new Error('Invalid credentials');
          }

          return {
            id: user.id.toString(),
            userName: user.userName,
            permissions: user.permissions,
          };
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : 'Invalid credentials');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 