import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signIn } from '@/lib/auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Please provide both username and password');
        }

        try {
          const auth = await signIn(credentials.username, credentials.password);

          if (!auth?.success || !auth?.user?.id || !auth?.user?.username) {
            throw new Error('Invalid credentials');
          }

          return {
            id: auth.user.id.toString(),
            userName: auth.user.username,
            email: auth.user.email,
            role: auth.user.role,
            permissions: auth.user.permissions ?? [],
            accessToken: auth.token,
            refreshToken: auth.refreshToken,
          } as any;
        } catch (error: any) {
          console.error('NextAuth authorize error:', error);
          throw new Error(error?.response?.data?.message || 'Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user as any;
      return token;
    },
    async session({ session, token }) {
      if (token.user) session.user = token.user as any;
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};
