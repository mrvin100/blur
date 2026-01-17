import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    userName: string;
    role?: string;
    permissions?: string[];
    accessToken?: string;
    refreshToken?: string;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: {
      id: string;
      userName: string;
      role?: string;
      permissions?: string[];
      accessToken?: string;
      refreshToken?: string;
    };
  }
}
