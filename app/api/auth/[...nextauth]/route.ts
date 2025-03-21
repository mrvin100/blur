import NextAuth from 'next-auth';
import type { AuthOptions } from 'next-auth';
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
          return null;
        }

        try {
          const response = await signIn(credentials.username, credentials.password);
          const user = response.data;

          if (!user) {
            return null;
          }

          return {
            id: user.id.toString(),
            userName: user.userName,
            permissions: user.permissions,
          } as User;

        } catch {
          return null;
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