export {};

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